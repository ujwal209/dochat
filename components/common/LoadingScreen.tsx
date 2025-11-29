import { LuBrain, LuLoader } from "react-icons/lu";

export const LoadingScreen = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 animate-bounce-slow">
            <LuBrain className="text-white text-4xl" />
          </div>
          {/* Loading Spinner Ring */}
          <div className="absolute -inset-4 border-2 border-blue-100/50 border-t-blue-500 rounded-full animate-spin"></div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            IntelliStudy
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <LuLoader className="animate-spin text-blue-500" />
            <span>Preparing your workspace...</span>
          </div>
        </div>
      </div>
    </div>
  );
};