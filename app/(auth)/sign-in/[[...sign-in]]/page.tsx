import { SignIn } from "@clerk/nextjs";
import { LuSparkles, LuBrain } from "react-icons/lu";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 lg:bg-white font-sans overflow-x-hidden">
      
      {/* --- Left Panel: Branding (Hidden on Mobile, Visible on Desktop) --- */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 flex-col justify-between p-12 overflow-hidden text-white h-screen sticky top-0">
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LuBrain className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold tracking-tight">IntelliStudy</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Master your studies with <span className="text-blue-400">AI power</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Upload your documents, ask complex questions, and get instant, accurate summaries. Your personal AI tutor is ready.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-slate-200">Unlimited PDF Uploads</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-200">Context-aware AI Chat</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-200">Organized Knowledge Bases</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-slate-500">
          © 2024 IntelliStudy. All rights reserved.
        </div>
      </div>

      {/* --- Right Panel: Login Form (Responsive) --- */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 relative min-h-screen">
        
        {/* Mobile-only Background Decor */}
        <div className="absolute inset-0 overflow-hidden lg:hidden pointer-events-none">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
            <LuBrain size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">IntelliStudy</h1>
        </div>

        <div className="w-full max-w-sm sm:max-w-md relative z-10 animate-in zoom-in-95 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm sm:text-base">Sign in to continue to your dashboard</p>
          </div>

          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white border border-slate-200 shadow-xl shadow-slate-200/20 rounded-3xl w-full p-6 sm:p-8",
                headerTitle: "hidden", 
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all rounded-xl py-2.5 sm:py-3 text-sm font-medium h-auto",
                socialButtonsBlockButtonText: "font-semibold",
                socialButtonsBlockButtonArrow: "hidden",
                dividerLine: "bg-slate-200",
                dividerText: "text-slate-400 bg-white px-2 font-medium text-xs uppercase tracking-wider",
                formFieldLabel: "text-slate-700 font-medium text-sm mb-1.5",
                formFieldInput: "bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all py-2.5",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-200 rounded-xl py-3 text-sm font-bold normal-case",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold hover:underline",
                identityPreviewText: "text-slate-600 font-medium",
                identityPreviewEditButton: "text-blue-600 hover:text-blue-700 font-medium",
                formFieldAction: "text-blue-600 hover:text-blue-700 font-medium"
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton"
              }
            }}
          />
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}