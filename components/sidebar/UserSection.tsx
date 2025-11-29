import { UserButton } from "@clerk/nextjs";
import { LuSettings } from "react-icons/lu";

interface UserSectionProps {
  user: any;
  isSidebarCollapsed: boolean;
}

export const UserSection = ({ user, isSidebarCollapsed }: UserSectionProps) => {
  if (!user) return null;

  return (
    <div className={`
      border-t border-slate-200 bg-slate-50 p-4 transition-all duration-300 mt-auto
      ${isSidebarCollapsed ? 'items-center justify-center py-6' : ''}
    `}>
      <div className={`
        flex items-center gap-3 transition-all duration-300
        ${isSidebarCollapsed ? 'justify-center' : ''}
      `}>
        {/* Avatar Wrapper with Status Indicator */}
        <div className="relative flex-shrink-0">
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border-2 border-white shadow-sm transition-transform hover:scale-105"
              }
            }}
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
        </div>

        {/* User Info - Smoothly hides when collapsed */}
        <div className={`
          flex-1 min-w-0 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}
        `}>
          <p className="text-sm font-semibold text-slate-700 truncate leading-tight">
            {user.fullName || "Student"}
          </p>
          <p className="text-[10px] text-slate-400 truncate font-medium uppercase tracking-wide mt-0.5">
            Pro Plan
          </p>
        </div>

        {/* Settings Button */}
        {!isSidebarCollapsed && (
          <button 
            className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200"
            title="User Settings"
          >
            <LuSettings size={18} />
          </button>
        )}
      </div>
    </div>
  );
};