import { useState } from "react";
import API from "../api/axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Github, Twitter, Mail } from "lucide-react";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", { email, password });

      if (data.token) {
        dispatch(setUser({ user: data.user, token: data.token }));
        
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        
        // Success toast
        toast.success(`Welcome back, ${data.user.name}! 🎉`);
        
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Invalid credentials. Please try again.");
    }
    
    setLoading(false);
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      developer: { email: "demo@dev.com", password: "demo123" },
      designer: { email: "demo@designer.com", password: "demo123" },
      founder: { email: "demo@founder.com", password: "demo123" }
    };
    
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
    toast.info(`Demo ${role} account loaded! Click Login to continue.`);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card - Fixed Height */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 max-w-md w-full transform transition-all duration-500 hover:shadow-2xl hover:bg-white/15 relative z-10 max-h-[85vh] overflow-hidden flex flex-col">
        
        {/* Header with Logo */}
        <div className="text-center mb-8 flex-shrink-0">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">I</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-300 text-lg">Continue your developer journey</p>
        </div>

        {/* Demo Accounts Quick Access */}
        <div className="mb-6 flex-shrink-0">
          <p className="text-gray-400 text-sm text-center mb-3">Try demo accounts:</p>
          <div className="flex gap-2 justify-center">
            {[
              { role: "developer", label: "👨‍💻 Dev", color: "from-blue-500 to-cyan-500" },
              { role: "designer", label: "🎨 Designer", color: "from-pink-500 to-rose-500" },
              { role: "founder", label: "🚀 Founder", color: "from-green-500 to-emerald-500" }
            ].map(({ role, label, color }) => (
              <button
                key={role}
                onClick={() => handleDemoLogin(role)}
                className={`px-3 py-2 bg-gradient-to-r ${color} text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex-1 max-w-[100px]`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email Field */}
            <div className="group">
              <label className="block text-gray-300 font-semibold mb-2 text-sm uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm"
                  placeholder="developer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-300 font-semibold text-sm uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-xs"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded transition-all duration-200 ${
                    rememberMe 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-white/5 border-white/20'
                  }`}>
                    {rememberMe && (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-gray-300">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 text-xs"
                onClick={() => toast.info("Password reset feature coming soon!")}
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl relative overflow-hidden group mt-4"
            >
              <div className="relative z-10 flex items-center justify-center text-sm">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  "Login to Your Account"
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-gray-400 text-xs">Or continue with</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button 
                className="flex items-center justify-center px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group text-sm"
                onClick={() => toast.info("GitHub login coming soon!")}
              >
                <Github className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">GitHub</span>
              </button>
              <button 
                className="flex items-center justify-center px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group text-sm"
                onClick={() => toast.info("Twitter login coming soon!")}
              >
                <Twitter className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Twitter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="text-center mt-6 pt-4 border-t border-white/10 flex-shrink-0">
          <p className="text-gray-400 text-xs">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-blue-400 font-semibold hover:text-blue-300 transition-colors duration-200"
            >
              Join the community
            </Link>
          </p>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Custom scrollbar for form */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}