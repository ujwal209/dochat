import { LuBrain, LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface SidebarHeaderProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

export const SidebarHeader = ({ isSidebarCollapsed, setIsSidebarCollapsed }: SidebarHeaderProps) => {
  return (
    <div className={`
      flex items-center justify-between p-4 border-b border-slate-200/60
      transition-all duration-300 ease-in-out
      ${isSidebarCollapsed ? 'flex-col py-6 gap-4' : ''}
    `}>
      
      {/* Logo & Brand - Hidden/Shown based on collapse state */}
      <div className={`
        flex items-center gap-3 overflow-hidden transition-all duration-300
        ${isSidebarCollapsed ? 'w-10 h-10 justify-center' : 'w-full'}
      `}>
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <LuBrain className="text-white text-xl" />
        </div>
        
        <div className={`
          flex flex-col transition-opacity duration-200
          ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}
        `}>
          <h1 className="font-bold text-lg text-slate-800 leading-tight tracking-tight">
            IntelliStudy
          </h1>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            AI Learning Companion
          </p>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`
          flex items-center justify-center p-1.5 rounded-lg
          text-slate-400 hover:text-blue-600 hover:bg-blue-50 
          transition-all duration-200 border border-transparent hover:border-blue-100
          ${isSidebarCollapsed ? '' : 'ml-auto'}
        `}
        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? <LuChevronRight size={18} /> : <LuChevronLeft size={18} />}
      </button>
    </div>
  );
};