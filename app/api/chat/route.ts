import { NextRequest, NextResponse } from "next/server";
import { StateGraph, START, END, MessagesAnnotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getVectorStore } from "@/utils/vectorStore";
import { auth } from "@clerk/nextjs/server";

// We need to pass the folderId through the graph state
// We extend the default state to include "folderId"
const GraphAnnotation = MessagesAnnotation;

const retrieveNode = async (state: typeof GraphAnnotation.State) => {
  // Hack: We passed folderId hidden in the last message's metadata or we infer it
  // For simplicity, we will assume the Client sends the folderId in the request 
  // and we store it in a global/context way, but LangGraph is stateless.
  // SOLUTION: The frontend sends the folderId.
  
  // We extract the folder ID from the System message we injected at the start (see POST below)
  const setupMessage = state.messages[0] as SystemMessage;
  const folderId = setupMessage.additional_kwargs.folderId as string;

  const store = await getVectorStore(folderId); // Search ONLY this folder
  const lastMessage = state.messages[state.messages.length - 1];
  
  const results = await store.similaritySearch(lastMessage.content as string, 3);
  const context = results.map((d) => d.pageContent).join("\n\n");
  
  return { messages: [new SystemMessage(`Context from your folder:\n${context}`)] };
};

const generateNode = async (state: typeof GraphAnnotation.State) => {
  const llm = new ChatGoogleGenerativeAI({ model: "gemini-2.0-flash", temperature: 0 });
  const messages = state.messages;
  
  // Filter out our internal setup message so the AI doesn't get confused
  const visibleMessages = messages.filter(m => !(m instanceof SystemMessage && m.content === "SETUP"));
  
  // Reorder: Context (last system msg) -> History -> Question
  const contextMsg = messages[messages.length - 1];
  const userMsg = messages[messages.length - 2];
  const history = visibleMessages.slice(0, -2);
  
  const response = await llm.invoke([contextMsg, ...history, userMsg]);
  return { messages: [response] };
};

const workflow = new StateGraph(GraphAnnotation)
  .addNode("retrieve", retrieveNode)
  .addNode("generate", generateNode)
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", END);
const appGraph = workflow.compile();

// In your /api/chat route
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { message, folderId } = await req.json();
    
    if (!message || !folderId) {
      return NextResponse.json(
        { error: "Missing message or folderId" }, 
        { status: 400 }
      );
    }

    // Your existing graph setup...
    const setupMsg = new SystemMessage({ 
      content: "SETUP", 
      additional_kwargs: { folderId } 
    });

    const result = await appGraph.invoke({
      messages: [setupMsg, new HumanMessage(message)],
    });

    const aiResponse = result.messages[result.messages.length - 1].content;
    
    // Ensure we always return a valid response
    return NextResponse.json({ 
      response: aiResponse || "No response generated" 
    });
    
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        response: "Sorry, I encountered an error processing your request." 
      }, 
      { status: 500 }
    );
  }
}