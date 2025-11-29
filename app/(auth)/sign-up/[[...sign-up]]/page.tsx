import { SignUp } from "@clerk/nextjs";
import { LuSparkles, LuRocket, LuBrain, LuShieldCheck } from "react-icons/lu";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-white font-sans">
      
      {/* --- Left Panel: Branding (Desktop Only) --- */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 flex-col justify-between p-12 overflow-hidden text-white">
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
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
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Start your <span className="text-cyan-400">learning journey</span> today.
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Join thousands of students using AI to master their subjects. Upload documents, generate quizzes, and learn faster.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <LuRocket size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Instant Setup</h3>
                <p className="text-sm text-slate-400 mt-1">Create your account and upload your first PDF in seconds.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                <LuShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Secure & Private</h3>
                <p className="text-sm text-slate-400 mt-1">Your data is encrypted and private to your account.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-slate-500">
          © 2024 IntelliStudy. Join the future of learning.
        </div>
      </div>

      {/* --- Right Panel: Sign Up Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-slate-50 relative overflow-y-auto">
        
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8 flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <LuBrain size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">IntelliStudy</h1>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create an account</h2>
            <p className="text-slate-500">Get started with your free account</p>
          </div>

          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl w-full p-8",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all rounded-xl py-3 text-sm font-medium h-auto",
                socialButtonsBlockButtonText: "font-semibold",
                dividerLine: "bg-slate-200",
                dividerText: "text-slate-400 bg-white px-2 font-medium text-xs uppercase tracking-wider",
                formFieldLabel: "text-slate-700 font-medium text-sm mb-1.5",
                formFieldInput: "bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all py-2.5",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-200 rounded-xl py-3 text-sm font-bold normal-case",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold hover:underline",
                identityPreviewText: "text-slate-600 font-medium",
                identityPreviewEditButton: "text-blue-600 hover:text-blue-700 font-medium",
                formFieldAction: "text-blue-600 hover:text-blue-700 font-medium",
                alert: "bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-sm",
                navbar: "hidden"
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton"
              }
            }}
          />
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}