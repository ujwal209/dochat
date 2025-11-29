import { User } from "@clerk/nextjs/server";
import { ChatSession } from "../app/page";
import { LuSend, LuLoader, LuSparkles, LuMic, LuPaperclip, LuZap, LuBrain, LuShield, LuCornerDownLeft } from "react-icons/lu";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useState, useRef, useEffect } from "react";

interface InputAreaProps {
  input: string;
  setInput: (input: string) => void;
  isChatting: boolean;
  setIsChatting: (chatting: boolean) => void;
  activeChatId: string | null;
  chats: ChatSession[];
  user: any;
}

export const InputArea = ({
  input,
  setInput,
  isChatting,
  setIsChatting,
  activeChatId,
  chats,
  user
}: InputAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sample AI suggestions
  const aiSuggestions = [
    "Summarize the key points",
    "Explain in simpler terms",
    "Create a study guide",
    "What are the main arguments?",
    "Generate quiz questions"
  ];

  useEffect(() => {
    // Show random suggestions when input is empty
    if (!input.trim()) {
      // Pick 3 random suggestions efficiently
      const shuffled = [...aiSuggestions].sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeChatId || !user) return;

    const text = input;
    setInput("");
    setIsChatting(true);
    
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const currentChat = chats.find(c => c.id === activeChatId);
    
    try {
      // 1. Optimistic Update - user message
      await addDoc(collection(db, "users", user.id, "chats", activeChatId, "messages"), {
        role: "user", 
        content: text, 
        createdAt: serverTimestamp()
      });

      // 2. Update last message in chat list
      await updateDoc(doc(db, "users", user.id, "chats", activeChatId), {
        lastMessage: text.length > 50 ? text.substring(0, 50) + "..." : text,
        updatedAt: serverTimestamp()
      });

      // 3. Call API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          folderId: currentChat?.folderId || ""
        }) 
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "API Error");

      // 4. Add AI response
      await addDoc(collection(db, "users", user.id, "chats", activeChatId, "messages"), {
        role: "ai", 
        content: data.response || "Sorry, I couldn't process your request.",
        createdAt: serverTimestamp()
      });
      
    } catch (e) {
      console.error("Chat error:", e);
      await addDoc(collection(db, "users", user.id, "chats", activeChatId, "messages"), {
        role: "ai", 
        content: "Sorry, I'm having trouble responding right now. Please check your connection and try again.",
        createdAt: serverTimestamp()
      });
    } finally {
      setIsChatting(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  return (
    <div className="p-4 bg-white border-t border-slate-200 relative z-20">
      <div className="max-w-4xl mx-auto">
        
        {/* AI Suggestions (Floating above input) */}
        {suggestions.length > 0 && !isChatting && (
          <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-2 px-1">
              <LuSparkles className="text-blue-500 text-xs" />
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Suggested prompts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="
                    flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                    bg-slate-50 text-slate-600 border border-slate-200
                    hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200
                    transition-all duration-200 active:scale-95
                  "
                >
                  <LuZap size={12} className="opacity-50" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSend} className="relative group">
          {/* Main Input Container */}
          <div className={`
            relative flex items-end gap-2 p-2 bg-slate-50 border rounded-2xl transition-all duration-300
            ${isFocused 
              ? 'bg-white border-blue-400 shadow-lg shadow-blue-500/10 ring-4 ring-blue-500/5' 
              : 'border-slate-200 hover:border-slate-300'
            }
          `}>
            
            {/* Attachment Button */}
            <button
              type="button"
              className="
                p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 
                transition-all duration-200 flex-shrink-0
              "
              title="Attach files (Coming soon)"
            >
              <LuPaperclip size={20} />
            </button>

            {/* Text Area */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              className="
                flex-1 max-h-40 min-h-[44px] py-2.5 px-1 bg-transparent border-none outline-none resize-none 
                text-slate-700 placeholder:text-slate-400 text-sm sm:text-base leading-relaxed
                scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent
              "
              placeholder="Ask a question about your documents..."
              disabled={isChatting}
              rows={1}
            />

            {/* Right Actions */}
            <div className="flex items-center gap-1 pb-1">
              {/* Voice Button */}
              {input.length === 0 && (
                <button
                  type="button"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                  title="Voice input"
                >
                  <LuMic size={20} />
                </button>
              )}

              {/* Send Button */}
              <button 
                type="submit"
                disabled={!input.trim() || isChatting} 
                className={`
                  p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm
                  ${!input.trim() || isChatting
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/25 active:scale-95'
                  }
                `}
                title="Send message"
              >
                {isChatting ? (
                  <LuLoader className="animate-spin" size={18} />
                ) : (
                  <LuSend size={18} className={input.trim() ? 'translate-x-0.5' : ''} />
                )}
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex justify-between items-center px-2 mt-2">
            <div className="flex items-center gap-4">
              <button type="button" className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 hover:text-blue-500 transition-colors">
                <LuBrain size={12} />
                <span>AI Model: Gemini 1.5</span>
              </button>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                <LuShield size={12} />
                <span>Private & Secure</span>
              </div>
            </div>
            
            <div className="text-[10px] text-slate-400 font-medium">
              {input.length > 0 ? `${input.length} / 2000` : 'Press Enter to send'}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};