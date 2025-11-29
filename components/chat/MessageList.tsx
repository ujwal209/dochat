import { Message } from "../app/page"; // Adjust path if needed
import { MessageBubble } from "./MessageBubble";
import { LuSparkles, LuBot, LuMessageSquare, LuBookOpen, LuGraduationCap, LuZap, LuArrowRight } from "react-icons/lu";
import { useState, useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList = ({ messages, messagesEndRef }: MessageListProps) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Hide welcome animation after first message
  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages.length]);

  // Handle scroll events for visual feedback
  const handleScroll = () => {
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1500);
  };

  // Sample conversation starters
  const conversationStarters = [
    {
      icon: LuBookOpen,
      title: "Summarize",
      description: "Get a concise overview",
      prompt: "Can you provide a summary of the key points in this document?",
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      icon: LuGraduationCap,
      title: "Explain",
      description: "Simplify complex topics",
      prompt: "Explain the main concepts from this material in simple terms",
      color: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      icon: LuZap,
      title: "Quiz Me",
      description: "Test your knowledge",
      prompt: "Create some practice questions based on this content",
      color: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      icon: LuMessageSquare,
      title: "Discuss",
      description: "Deep dive into ideas",
      prompt: "Let's discuss the main ideas presented in this document",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    }
  ];

  const EmptyState = () => (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative animate-in fade-in zoom-in-95 duration-500">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[60vh] relative z-10">
        <div className="text-center max-w-3xl w-full">
          
          {/* Hero Icon */}
          <div className="relative mb-8 inline-block">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-500/10 flex items-center justify-center mx-auto relative z-10 border border-slate-50">
              <LuSparkles className="text-blue-500 text-3xl" />
            </div>
            {/* Orbits */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-blue-100 rounded-full animate-spin-slow"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-dashed border-slate-200 rounded-full animate-spin-reverse-slow"></div>
          </div>

          {/* Headlines */}
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            Ready to Learn?
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
            I've analyzed your documents. Pick a starter below or ask me anything to begin.
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {conversationStarters.map((starter, index) => (
              <button
                key={index}
                className="group relative flex items-center gap-4 p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-left"
                onClick={() => {
                  // In a real app, you'd hoist this up to set input
                  console.log('Selected prompt:', starter.prompt);
                }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${starter.color}`}>
                  <starter.icon className="text-xl" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm mb-0.5 group-hover:text-blue-700 transition-colors">
                    {starter.title}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    {starter.description}
                  </p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-slate-400">
                  <LuArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={`flex-1 overflow-y-auto relative transition-all duration-300 scroll-smooth ${
        isScrolling ? 'cursor-grabbing' : 'cursor-auto'
      }`}
      onScroll={handleScroll}
    >
      {/* Scroll Indicator (Optional) */}
      {isScrolling && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none animate-in fade-in zoom-in duration-200">
          <div className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1.5 rounded-full shadow-lg border border-white/10 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            Scrolling
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className="min-h-full flex flex-col">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-4">
            {messages.map((msg, i) => (
              <MessageBubble key={`${msg.createdAt?.seconds || i}-${i}`} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-px w-full" />
          </div>
        )}
      </div>
    </div>
  );
};