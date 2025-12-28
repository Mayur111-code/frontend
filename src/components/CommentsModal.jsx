import { useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import timeAgo from "../utils/timeAgo";
import { AiOutlineClose, AiOutlineSend, AiOutlineDelete } from "react-icons/ai";

export default function CommentsModal({ post, close, refresh }) {
  const [comment, setComment] = useState("");
  const authUser = useSelector((s) => s.user.user);

  const submitComment = async () => {
    if (!comment.trim()) return;

    await API.put(`/posts/comment/${post._id}`, { text: comment });
    setComment("");
    refresh();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3 sm:px-4 py-4 sm:py-8">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl transform transition-all duration-300 flex flex-col h-[85vh] sm:h-[90vh] max-h-[500px] sm:max-h-[600px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Comments
          </h2>
          <button
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200"
            onClick={close}
          >
            <AiOutlineClose size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {(post.comments || []).length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">💬</div>
              <p className="text-gray-500 font-medium text-base sm:text-lg">No comments yet</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {(post.comments || []).map((c) => (
                <div key={c._id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                  
                  {/* User Avatar */}
                  <Link to={`/profile/${c.user._id}`} onClick={close} className="flex-shrink-0">
                    <img
                      src={c.user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow"
                      alt={c.user.name}
                    />
                  </Link>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <Link to={`/profile/${c.user._id}`} onClick={close} className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base hover:text-blue-600 transition-colors duration-200 truncate">
                          {c.user.name}
                        </p>
                      </Link>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs text-gray-500 hidden sm:inline">•</span>
                        <p className="text-xs text-gray-500">{timeAgo(c.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed break-words">{c.text}</p>
                  </div>

                  {/* Delete Button */}
                  {c.user._id === authUser._id && (
                    <button
                      onClick={async () => {
                        await API.delete(`/posts/comment/${post._id}/${c._id}`);
                        refresh();
                      }}
                      className="opacity-70 group-hover:opacity-100 p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0"
                      title="Delete comment"
                    >
                      <AiOutlineDelete size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Comment Section */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={comment}
                placeholder="Write a comment..."
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg sm:rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
              />
              <button
                onClick={submitComment}
                disabled={!comment.trim()}
                className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors duration-200"
              >
                <AiOutlineSend size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={close}
            className="w-full py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-medium rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}