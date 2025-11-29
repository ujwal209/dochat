import { LuBookOpen, LuFolder, LuMessageSquare, LuSparkles } from "react-icons/lu";

interface EmptyStateProps {
  type: "chats" | "folders" | "welcome";
  onAction?: () => void;
}

export const EmptyState = ({ type, onAction }: EmptyStateProps) => {
  const config = {
    chats: {
      icon: LuMessageSquare,
      title: "No chats yet",
      description: "Select a Knowledge Base folder to start a new conversation.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    folders: {
      icon: LuFolder,
      title: "No Knowledge Bases",
      description: "Create a folder to start organizing and analyzing your PDFs.",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500"
    },
    welcome: {
      icon: LuSparkles,
      title: "Welcome to IntelliStudy",
      description: "Your intelligent AI study companion for documents.",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500"
    }
  };

  const { icon: Icon, title, description, iconBg, iconColor } = config[type];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full animate-in fade-in zoom-in-95 duration-500">
      
      {/* Icon Container */}
      <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-sm ring-1 ring-inset ring-black/5`}>
        <Icon className={`text-2xl ${iconColor}`} />
      </div>

      {/* Text Content */}
      <h3 className="text-base font-semibold text-slate-800 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-[240px] leading-relaxed mx-auto">
        {description}
      </p>

      {/* Optional Action Button */}
      {onAction && (
        <button 
          onClick={onAction}
          className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all"
        >
          Get Started &rarr;
        </button>
      )}
    </div>
  );
};