import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { AiOutlineClose, AiOutlineSend, AiOutlineUserAdd } from "react-icons/ai";

export default function ApplyModal({ projectId, close, refresh }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [close]);

  const applyNow = async () => {
    if (!message.trim()) {
      return toast.error("Please write a message for the project owner");
    }

    if (message.length > 500) {
      return toast.error("Message must be less than 500 characters");
    }

    setLoading(true);

    try {
      await API.post(`/projects/apply/${projectId}`, { message });
      toast.success("Application sent successfully! 🎉");
      close();
      refresh();
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message || "Failed to send application"
      );
    }

    setLoading(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4 py-4 md:py-8 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 my-auto">
        
        {/* Header - Improved for mobile */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg md:rounded-xl">
              <AiOutlineUserAdd className="text-white text-lg md:text-xl" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Join Project
            </h2>
          </div>
          <button
            className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg md:rounded-xl transition-all duration-200"
            onClick={close}
            aria-label="Close modal"
          >
            <AiOutlineClose size={isMobile ? 20 : 24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Tip Box */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6 border border-blue-200">
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
              <span className="font-semibold text-blue-600">💡 Pro Tip:</span> {" "}
              {isMobile 
                ? "Briefly introduce yourself and your relevant skills."
                : "Introduce yourself briefly and explain how your skills can contribute to the project's success."
              }
            </p>
          </div>

          {/* Message Input */}
          <div className="mb-4 md:mb-6">
            <label className="block text-gray-700 font-semibold mb-2 md:mb-3 text-sm md:text-base">
              Your Application Message
            </label>
            <textarea
              rows={isMobile ? 4 : 5}
              maxLength={500}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 resize-none text-sm md:text-base"
              placeholder={
                isMobile 
                  ? "Hi! I'm a developer with experience in React and Node.js. I believe I can help with your project..."
                  : "Example: Hi! I'm a full-stack developer with 2+ years experience in React and Node.js. I noticed your project focuses on [specific area] and I believe I can help with [specific contribution]. Looking forward to collaborating! 😊"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {message.length}/500 characters
              </p>
              {message.length > 0 && (
                <p className={`text-xs ${
                  message.length > 400 ? 'text-red-500' : 
                  message.length > 100 ? 'text-green-500' : 'text-gray-500'
                }`}>
                  {message.length > 400 ? 'Too long' : 
                   message.length > 100 ? 'Good length' : 'Too short'}
                </p>
              )}
            </div>
          </div>

          {/* Buttons - Stack on mobile */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
            <button
              onClick={close}
              disabled={loading}
              className={`py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg md:rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                isMobile ? 'w-full' : 'flex-1'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={applyNow}
              disabled={loading || !message.trim() || message.length > 500}
              className={`py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg md:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                isMobile ? 'w-full' : 'flex-1'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                  <span className="text-sm md:text-base">Sending...</span>
                </div>
              ) : (
                <>
                  <AiOutlineSend size={isMobile ? 16 : 18} />
                  <span className="text-sm md:text-base">Send Application</span>
                </>
              )}
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-3 md:mt-4 text-center">
            <p className="text-xs text-gray-500">
              The project owner will review your application and get back to you soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}