import { Folder, FileDoc, ChatSession } from "../app/page"; 
import { SidebarHeader } from "./SidebarHeader";
import { SearchBar } from "./SearchBar";
import { TabSwitcher } from "./TabSwitcher";
import { ChatList } from "./ChatList";
import { FolderList } from "./FolderList";
import { DiscoverTab } from "./DiscoverTab";
import { UserSection } from "./UserSection";
// Added LuMenu and LuX for mobile controls
import { LuMessageSquare, LuFolder, LuSparkles, LuMenu, LuX } from "react-icons/lu"; 

interface SidebarProps {
  activeTab: "chats" | "folders" | "discover";
  setActiveTab: (tab: "chats" | "folders" | "discover") => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  folders: Folder[];
  activeFolder: Folder | null;
  setActiveFolder: (folder: Folder | null) => void;
  folderFiles: FileDoc[];
  chats: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  uploadFile: File | null;
  setUploadFile: (file: File | null) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  filteredChats: ChatSession[];
  filteredFolders: Folder[];
  setPdfViewerUrl: (url: string | null) => void;
  user: any;
}

export const Sidebar = ({
  activeTab,
  setActiveTab,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  searchQuery,
  setSearchQuery,
  folders,
  activeFolder,
  setActiveFolder,
  folderFiles,
  chats,
  activeChatId,
  setActiveChatId,
  uploadFile,
  setUploadFile,
  isUploading,
  setIsUploading,
  fileInputRef,
  filteredChats,
  filteredFolders,
  setPdfViewerUrl,
  user
}: SidebarProps) => {
  return (
    <>
      {/* --- MOBILE: Floating Open Button --- 
          Visible only on mobile when sidebar is collapsed (hidden) 
      */}
      {isSidebarCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="md:hidden fixed top-4 left-4 z-[60] p-2.5 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-600 hover:text-blue-600 active:scale-95 transition-all"
          aria-label="Open Menu"
        >
          <LuMenu size={24} />
        </button>
      )}

      {/* --- MOBILE: Overlay Backdrop --- 
          Clicking this closes the sidebar on mobile 
      */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50
        flex flex-col flex-shrink-0
        bg-white/95 backdrop-blur-xl border-r border-slate-200
        transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
        ${isSidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-80'}
        shadow-2xl md:shadow-none
      `}>
        
        {/* Mobile Close Button (Inside Sidebar) */}
        <div className="md:hidden absolute top-4 right-4 z-50">
          <button 
            onClick={() => setIsSidebarCollapsed(true)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        {/* 1. Header (Logo & Toggle) */}
        <SidebarHeader 
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        {/* 2. Search Bar (Hidden when collapsed) */}
        {!isSidebarCollapsed && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300 delay-75">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        )}

        {/* 3. Tabs (Hidden when collapsed) */}
        {!isSidebarCollapsed && (
          <div className="px-4 animate-in fade-in slide-in-from-left-5 duration-300 delay-100">
            <TabSwitcher 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {/* 4. Main Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 custom-scrollbar">
          
          {/* Expanded View */}
          {!isSidebarCollapsed && (
            <div className="animate-in fade-in duration-300 delay-150">
              {activeTab === 'chats' && (
                <ChatList
                  filteredChats={filteredChats}
                  activeChatId={activeChatId}
                  setActiveChatId={(id) => {
                    setActiveChatId(id);
                    // On mobile, auto-close sidebar when chat is selected
                    if (window.innerWidth < 768) setIsSidebarCollapsed(true);
                  }}
                  user={user}
                />
              )}

              {activeTab === 'folders' && (
                <FolderList
                  folders={folders}
                  activeFolder={activeFolder}
                  setActiveFolder={setActiveFolder}
                  folderFiles={folderFiles}
                  uploadFile={uploadFile}
                  setUploadFile={setUploadFile}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                  fileInputRef={fileInputRef}
                  filteredFolders={filteredFolders}
                  setPdfViewerUrl={setPdfViewerUrl}
                  user={user}
                  setActiveTab={setActiveTab}
                  setActiveChatId={(id) => {
                    setActiveChatId(id);
                    if (window.innerWidth < 768) setIsSidebarCollapsed(true);
                  }}
                />
              )}

              {activeTab === 'discover' && (
                <DiscoverTab />
              )}
            </div>
          )}

          {/* Collapsed View (Icons Only - Desktop) */}
          {isSidebarCollapsed && (
            <div className="hidden md:flex flex-col items-center gap-4 mt-2 animate-in fade-in slide-in-from-left-4 duration-300">
              <NavIcon 
                icon={<LuMessageSquare size={24} />} 
                label="Chats" 
                isActive={activeTab === 'chats'}
                onClick={() => setActiveTab("chats")} 
              />
              <NavIcon 
                icon={<LuFolder size={24} />} 
                label="Folders" 
                isActive={activeTab === 'folders'}
                onClick={() => setActiveTab("folders")} 
              />
              <NavIcon 
                icon={<LuSparkles size={24} />} 
                label="Discover" 
                isActive={activeTab === 'discover'}
                onClick={() => setActiveTab("discover")} 
              />
            </div>
          )}
        </div>

        {/* 5. User Profile Footer */}
        <UserSection 
          user={user}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </aside>
    </>
  );
};

// Helper Component for Collapsed Icons
const NavIcon = ({ icon, label, onClick, isActive }: any) => (
  <button 
    onClick={onClick}
    className={`
      p-3 rounded-xl transition-all duration-200 group relative
      ${isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
      }
    `}
  >
    {icon}
    {/* Tooltip */}
    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
      {label}
    </span>
  </button>
);