import { Link } from "react-router-dom";
import { AiOutlineClose, AiOutlineHeart } from "react-icons/ai";

export default function LikesModal({ likes, close }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3 sm:px-4 py-4 sm:py-8">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md transform transition-all duration-300 mx-auto my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AiOutlineHeart className="text-red-500 text-lg sm:text-xl" />
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Liked by
            </h2>
          </div>
          <button
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200"
            onClick={close}
          >
            <AiOutlineClose size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Likes List */}
        <div className="max-h-60 sm:max-h-72 md:max-h-80 overflow-y-auto">
          {likes.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">💔</div>
              <p className="text-gray-500 font-medium text-sm sm:text-base">No likes yet</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Be the first to like this post!</p>
            </div>
          ) : (
            <div className="p-2 sm:p-3">
              {likes.map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u._id}`}
                  onClick={close}
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
                >
                  <img
                    src={u.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow group-hover:border-blue-200 transition-all duration-200 flex-shrink-0"
                    alt={u.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-200 truncate">
                      {u.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {u.bio ? u.bio.slice(0, 25) + (u.bio.length > 25 ? '...' : '') : 'No bio'}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 ml-1 sm:ml-2"></div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <span className="text-sm text-gray-500 text-center sm:text-left">
              {likes.length} {likes.length === 1 ? 'like' : 'likes'}
            </span>
            <button
              onClick={close}
              className="px-4 py-2.5 sm:px-6 sm:py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}