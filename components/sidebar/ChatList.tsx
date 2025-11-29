import { LuMessageSquare, LuTrash2, LuClock } from "react-icons/lu";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/utils/firebase";

// Define interfaces for clarity
interface ChatSession {
  id: string;
  folderId: string;
  folderName: string;
  lastMessage: string;
  createdAt: any;
  updatedAt?: any;
}

interface ChatListProps {
  filteredChats: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  user: any; 
}

export const ChatList = ({ filteredChats, activeChatId, setActiveChatId, user }: ChatListProps) => {
  
  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !confirm("Delete this conversation permanently?")) return;
    try {
      await deleteDoc(doc(db, "users", user.id, "chats", chatId));
      if (activeChatId === chatId) setActiveChatId(null);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (filteredChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center p-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-slate-50 p-4 rounded-full mb-3 shadow-sm">
          <LuMessageSquare className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-sm font-medium text-slate-600">No chats found</p>
        <p className="text-xs text-slate-400 mt-1">Start a new conversation from your Knowledge Base.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-4">
      {filteredChats.map((chat) => (
        <div 
          key={chat.id} 
          onClick={() => setActiveChatId(chat.id)}
          className={`
            group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border
            hover:shadow-md hover:-translate-y-0.5
            ${activeChatId === chat.id 
              ? 'bg-white border-blue-500/30 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20 z-10' 
              : 'bg-white border-transparent hover:border-slate-200 hover:bg-white'
            }
          `}
        >
          {/* Active Indicator Strip */}
          {activeChatId === chat.id && (
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full" />
          )}

          <div className="flex items-start gap-3.5">
            {/* Icon Box */}
            <div className={`
              p-2.5 rounded-lg shrink-0 transition-colors duration-200
              ${activeChatId === chat.id 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
              }
            `}>
              <LuMessageSquare size={18} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <h3 className={`
                  text-sm font-semibold truncate transition-colors
                  ${activeChatId === chat.id ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}
                `}>
                  {chat.folderName}
                </h3>
                
                {/* Delete Button (Visible on Hover) */}
                <button 
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="
                    opacity-0 group-hover:opacity-100 focus:opacity-100
                    p-1.5 rounded-md text-slate-400 
                    hover:text-red-600 hover:bg-red-50 
                    transition-all duration-200
                  "
                  title="Delete conversation"
                >
                  <LuTrash2 size={14} />
                </button>
              </div>

              {/* Message Preview */}
              <p className={`
                text-xs truncate transition-colors mb-2
                ${activeChatId === chat.id ? 'text-slate-600' : 'text-slate-400 group-hover:text-slate-500'}
              `}>
                {chat.lastMessage || "No messages yet"}
              </p>

              {/* Footer / Meta info */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                  <LuClock size={10} />
                  {formatTime(chat.updatedAt || chat.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};