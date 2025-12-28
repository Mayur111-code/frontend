import { useState } from "react";
import API from "../api/axios";
import { setUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Github, Twitter, Mail, User, Camera } from "lucide-react";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    else if (name.length < 2) newErrors.name = "Name must be at least 2 characters";
    
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024;
      
      if (!validTypes.includes(f.type)) {
        toast.error("Please select a valid image (JPEG, PNG, GIF, WebP)");
        return;
      }
      
      if (f.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setFile(f);
      setPreview(URL.createObjectURL(f));
      toast.success("Profile photo added successfully! 📸");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      let avatarURL = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const upload = await API.post("/upload/file", formData);
        avatarURL = upload.data.url;
      }

      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
        avatar: avatarURL,
      });

      dispatch(setUser({ user: data.user, token: data.token }));
      
      // Success toast
      toast.success(`Welcome to Infina, ${data.user.name}! 🎉`);
      
      navigate("/");
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    }

    setLoading(false);
  };

  const removeProfilePhoto = () => {
    setFile(null);
    setPreview(null);
    toast.info("Profile photo removed");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card - Fixed Height */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 max-w-md w-full transform transition-all duration-500 hover:shadow-2xl hover:bg-white/15 relative z-10 max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header with Logo */}
        <div className="text-center mb-6 flex-shrink-0">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">I</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Join Infina
          </h2>
          <p className="text-gray-300 text-lg">Start your developer journey</p>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-6 flex-shrink-0">
          <label className="cursor-pointer group relative">
            <div className="relative">
              <img
                src={
                  preview ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-lg group-hover:border-green-400 transition-all duration-300 bg-gray-600"
                alt="Profile preview"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-300 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFile} 
            />
          </label>
          {preview && (
            <button
              onClick={removeProfilePhoto}
              className="text-red-400 text-xs mt-2 hover:text-red-300 transition-colors"
            >
              Remove photo
            </button>
          )}
          <p className="text-xs text-gray-400 mt-2 text-center">
            {preview ? "Click to change photo" : "Add profile photo (optional)"}
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Name Field */}
            <div className="group">
              <label className="block text-gray-300 font-semibold mb-2 text-sm uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-sm ${
                    errors.name 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-white/10 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  }`}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({...errors, name: ''});
                  }}
                  required
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="block text-gray-300 font-semibold mb-2 text-sm uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-sm ${
                    errors.email 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-white/10 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  }`}
                  placeholder="developer@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
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
                  className={`w-full px-4 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-sm ${
                    errors.password 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-white/10 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  }`}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: ''});
                  }}
                  required
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl relative overflow-hidden group mt-4"
            >
              <div className="relative z-10 flex items-center justify-center text-sm">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Social Register Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-gray-400 text-xs">Or sign up with</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button 
                className="flex items-center justify-center px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group text-sm"
                onClick={() => toast.info("GitHub registration coming soon!")}
              >
                <Github className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">GitHub</span>
              </button>
              <button 
                className="flex items-center justify-center px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group text-sm"
                onClick={() => toast.info("Twitter registration coming soon!")}
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
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-green-400 font-semibold hover:text-green-300 transition-colors duration-200"
            >
              Sign In
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