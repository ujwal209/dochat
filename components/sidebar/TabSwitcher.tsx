interface TabSwitcherProps {
  activeTab: "chats" | "folders" | "discover";
  setActiveTab: (tab: "chats" | "folders" | "discover") => void;
}

export const TabSwitcher = ({ activeTab, setActiveTab }: TabSwitcherProps) => {
  const tabs = [
    { id: "chats", label: "Chats" },
    { id: "folders", label: "Knowledge" },
    { id: "discover", label: "Discover" },
  ] as const;

  return (
    <div className="px-4 pb-2">
      <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 relative isolate">
        {/* Animated Background Slider Logic could go here, but using simple conditional styling for simplicity & performance */}
        
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 z-10 relative
              ${activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5 scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};