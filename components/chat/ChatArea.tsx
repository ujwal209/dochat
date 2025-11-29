import { User } from "@clerk/nextjs/server";
import { ChatSession } from "../app/page"; // Adjust import path as needed
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { InputArea } from "./InputArea";
import { LuBrain, LuUpload, LuSparkles, LuGraduationCap } from "react-icons/lu";

// Define Message type if not imported
export interface Message {
  role: 'user' | 'ai';
  content: string;
  createdAt?: any;
}

interface ChatAreaProps {
  activeChatId: string | null;
  chats: ChatSession[];
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  isChatting: boolean;
  setIsChatting: (chatting: boolean) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  setActiveTab: (tab: "chats" | "folders" | "discover") => void;
  user: any;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

export const ChatArea = ({
  activeChatId,
  chats,
  messages,
  input,
  setInput,
  isChatting,
  setIsChatting,
  messagesEndRef,
  setActiveTab,
  user,
  isSidebarCollapsed,
  setIsSidebarCollapsed
}: ChatAreaProps) => {
  
  // --- Empty State (Welcome Screen) ---
  if (!activeChatId) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center max-w-3xl w-full">
            
            {/* Logo Section */}
            <div className="relative mb-8 inline-block">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-blue-500/10 flex items-center justify-center mx-auto relative z-10">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-inner">
                  <LuBrain className="text-white text-4xl" />
                </div>
              </div>
              {/* Floating Sparkle */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-20 animate-bounce delay-700">
                <LuSparkles className="text-yellow-500 text-lg" />
              </div>
            </div>

            {/* Welcome Text */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">IntelliStudy</span>
            </h1>
            <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Your intelligent learning companion. Upload documents, ask complex questions, and master your subjects faster than ever.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <button 
                onClick={() => setActiveTab("folders")}
                className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                  <LuUpload size={20} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">Upload PDF</h3>
                <p className="text-xs text-slate-500">Analyze documents instantly</p>
              </button>

              <button 
                onClick={() => setActiveTab("chats")}
                className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 text-purple-600 group-hover:scale-110 transition-transform">
                  <LuSparkles size={20} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">AI Chat</h3>
                <p className="text-xs text-slate-500">Ask questions & summarize</p>
              </button>

              <button 
                onClick={() => setActiveTab("discover")}
                className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 text-emerald-600 group-hover:scale-110 transition-transform">
                  <LuGraduationCap size={20} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">Learn</h3>
                <p className="text-xs text-slate-500">Generate quizzes & notes</p>
              </button>
            </div>

          </div>
        </div>
      </main>
    );
  }

  // --- Active Chat View ---
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-white relative h-full">
      <div className="flex-1 flex flex-col h-full relative z-10">
        
        <ChatHeader 
          activeChatId={activeChatId}
          chats={chats}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        
        <MessageList 
          messages={messages}
          messagesEndRef={messagesEndRef}
        />
        
        <InputArea 
          input={input}
          setInput={setInput}
          isChatting={isChatting}
          setIsChatting={setIsChatting}
          activeChatId={activeChatId}
          chats={chats}
          user={user}
        />
      </div>
    </main>
  );
};