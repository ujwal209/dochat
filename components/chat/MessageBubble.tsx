import { Message } from "../app/page"; // Adjust import path
import { LuBot, LuUser, LuCopy, LuCheck, LuSparkles, LuMoveVertical, LuThumbsUp, LuThumbsDown } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      // Handle both Firestore timestamp (toDate) and regular JS Date objects
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return '';
    }
  };

  return (
    <div 
      className={`
        flex gap-4 w-full transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        ${isUser ? 'justify-end' : 'justify-start'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
            <LuBot className="text-blue-600 w-5 h-5" />
          </div>
        </div>
      )}

      {/* Message Content Container */}
      <div className={`relative max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] group`}>
        
        {/* Name & Time (AI only) */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-1 ml-1">
            <span className="text-xs font-semibold text-slate-700">IntelliStudy</span>
            <span className="text-[10px] text-slate-400">{formatTime(message.createdAt)}</span>
          </div>
        )}

        {/* Bubble */}
        <div className={`
          relative px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed
          ${isUser 
            ? 'bg-blue-600 text-white rounded-br-none shadow-blue-100' 
            : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-slate-100'
          }
        `}>
          {!isUser ? (
            <div className="markdown-content">
              <ReactMarkdown 
                components={{
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1 text-slate-600" {...props}/>,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 space-y-1 text-slate-600" {...props}/>,
                  h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-4 mb-2 text-slate-900 border-b border-slate-100 pb-1" {...props}/>,
                  h2: ({node, ...props}) => <h2 className="text-base font-bold mt-3 mb-2 text-slate-800" {...props}/>,
                  h3: ({node, ...props}) => <h3 className="text-sm font-bold mt-2 mb-1 text-slate-800" {...props}/>,
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props}/>,
                  code: ({node, ...props}) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono text-xs border border-slate-200" {...props}/>,
                  pre: ({node, ...props}) => <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl my-3 overflow-x-auto text-xs" {...props}/>,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-200 pl-4 py-1 my-2 text-slate-500 italic bg-blue-50/50 rounded-r-lg" {...props}/>,
                  a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" rel="noreferrer" {...props}/>
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Action Buttons (Copy/Menu) - Appears on Hover */}
        <div className={`
          absolute top-2 transition-all duration-200 flex items-center gap-1
          ${isUser ? '-left-14' : '-right-14'}
          ${isHovered || isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}
        `}>
          <button 
            onClick={handleCopy}
            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
            title="Copy message"
          >
            {isCopied ? <LuCheck size={14} /> : <LuCopy size={14} />}
          </button>

          {!isUser && (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1.5 bg-white border border-slate-200 hover:text-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 ${isMenuOpen ? 'text-slate-700 bg-slate-50' : 'text-slate-400'}`}
              >
                <LuMoveVertical size={14} />
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}/>
                  <div className="absolute left-0 bottom-full mb-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-20 animate-in fade-in zoom-in-95 origin-bottom-left">
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-green-600 rounded-lg transition-colors">
                      <LuThumbsUp size={12}/> Helpful
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-lg transition-colors">
                      <LuThumbsDown size={12}/> Not helpful
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* User Time (Right side) */}
        {isUser && (
          <div className="flex justify-end mt-1 mr-1">
            <span className="text-[10px] text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-100 border border-white ring-1 ring-slate-200 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
            <LuUser className="text-slate-400 w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
};