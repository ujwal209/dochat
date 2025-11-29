import { ChatSession } from "../app/page"; // Adjust path as needed
import { LuMessageSquare, LuShare2, LuDownload, LuMoveVertical, LuUsers, LuClock, LuSparkles, LuMenu } from "react-icons/lu";
import { useState, useEffect } from "react";

interface ChatHeaderProps {
  activeChatId: string | null;
  chats: ChatSession[];
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

export const ChatHeader = ({ activeChatId, chats, isSidebarCollapsed, setIsSidebarCollapsed }: ChatHeaderProps) => {
  const currentChat = chats.find(c => c.id === activeChatId);
  const [isOnline, setIsOnline] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate online status and update time
  useEffect(() => {
    // Set initial time correctly to avoid hydration mismatch
    setCurrentTime(new Date()); 
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      // Randomly change online status for demo (remove in production)
      if (Math.random() > 0.98) setIsOnline(!isOnline);
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!currentChat) return null;

  return (
    <div className="h-16 sm:h-[72px] bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center px-4 sm:px-6 justify-between flex-shrink-0 z-40 relative shadow-sm">
      
      {/* Left Section */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <LuMenu size={22} />
        </button>

        {/* Animated Icon */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group">
            <LuMessageSquare className="text-white text-lg group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          {/* Online Status Dot */}
          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center ${
            isOnline ? 'bg-green-500' : 'bg-slate-400'
          }`}>
            {isOnline && <div className="w-full h-full rounded-full animate-ping bg-green-400 opacity-75 duration-1000"></div>}
          </div>
        </div>

        {/* Chat Info */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800 text-sm sm:text-base truncate max-w-[140px] sm:max-w-[300px]">
              {currentChat.folderName}
            </h2>
            
            {/* Pro Badge */}
            <div className="hidden sm:flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              <LuSparkles className="text-indigo-500 text-[10px]" />
              <span className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider">Pro</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Text */}
            <span className={`text-xs font-medium truncate ${isOnline ? 'text-green-600' : 'text-slate-400'}`}>
              {isOnline ? 'AI Active' : 'Connecting...'}
            </span>
            
            <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></div>
            
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <LuUsers size={12} />
              <span className="text-xs">Private Session</span>
            </div>
            
            <div className="w-1 h-1 bg-slate-300 rounded-full hidden lg:block"></div>
            
            <div className="hidden lg:flex items-center gap-1 text-slate-400">
              <LuClock size={12} />
              <span className="text-xs">{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Share Button (Desktop) */}
        <button 
          className="hidden sm:flex p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
          title="Share Chat"
        >
          <LuShare2 size={18} />
        </button>

        {/* Export Button (Desktop) */}
        <button 
          className="hidden sm:flex p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
          title="Export as PDF"
        >
          <LuDownload size={18} />
        </button>

        {/* More Menu (Mobile & Desktop Dropdown) */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`
              p-2 rounded-xl transition-all border
              ${isMenuOpen 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'
              }
            `}
          >
            <LuMoveVertical size={18} />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              {/* Click outside closer */}
              <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)}></div>
              
              <div className="absolute right-0 top-12 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Chat Options</p>
                </div>

                <button className="w-full px-4 py-2.5 text-left text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3 text-sm">
                  <LuShare2 size={16} /> Share Conversation
                </button>
                
                <button className="w-full px-4 py-2.5 text-left text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3 text-sm">
                  <LuDownload size={16} /> Export to PDF
                </button>
                
                <div className="h-px bg-slate-100 my-1 mx-3"></div>
                
                <button className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 text-sm rounded-b-lg">
                  Clear History
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};