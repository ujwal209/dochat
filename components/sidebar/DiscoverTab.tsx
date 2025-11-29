import { LuGraduationCap, LuSparkles, LuBrain, LuArrowRight } from "react-icons/lu";

export const DiscoverTab = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-1 animate-in slide-in-from-bottom-4 duration-500 sm:grid-cols-2 lg:grid-cols-3">
      
      {/* Feature Card 1: Study Smarter */}
      <div className="group relative bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <LuGraduationCap className="text-xl" />
          </div>
          
          <h3 className="font-bold text-slate-900 text-lg mb-2">Study Smarter</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Unlock AI-powered insights. Summarize documents, ask complex questions, and learn faster.
          </p>
          
          <button className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all group-hover:shadow-sm border border-transparent group-hover:border-blue-100">
            <span>Explore</span>
            <LuArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* Feature Card 2: Quick Start */}
      <div className="group relative bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <LuSparkles className="text-xl" />
          </div>
          
          <h3 className="font-bold text-slate-900 text-lg mb-2">Quick Start</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Create your first knowledge base folder and upload PDFs to start chatting in seconds.
          </p>
          
          <button className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all group-hover:shadow-sm border border-transparent group-hover:border-purple-100">
            <span>Get Started</span>
            <LuArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* Feature Card 3: Advanced AI */}
      <div className="group relative bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <LuBrain className="text-xl" />
          </div>
          
          <h3 className="font-bold text-slate-900 text-lg mb-2">Advanced AI</h3>
          <p className="text-sm text-slate-500 mb-2 leading-relaxed">
            Powered by state-of-the-art LLMs (Gemini 1.5) for accurate, context-aware responses from your data.
          </p>
        </div>
      </div>

    </div>
  );
};