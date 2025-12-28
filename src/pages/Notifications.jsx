import { useEffect, useState } from "react";
import API from "../api/axios";
import timeAgo from "../utils/timeAgo";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineBell, AiOutlineCheckCircle, AiOutlineDelete } from "react-icons/ai";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const { data } = await API.get("/notifications/my");
      setList(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    }
    setLoading(false);
  };

  const markAll = async () => {
    try {
      await API.put("/notifications/read-all");
      loadNotifications();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const markOne = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      loadNotifications();
      toast.info("Notification marked as read");
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const deleteOne = async (id) => {
    try {
      await API.delete(`/notifications/delete/${id}`);
      loadNotifications();
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Delete notification error:", err);
      toast.error("Failed to delete notification");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading)
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading notifications...</p>
        </div>
      </div>
    );

  return (
    <div className="pt-20 px-3 sm:px-4 max-w-4xl mx-auto min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-8">

      {/* HEADER */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 transform transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl">
              <AiOutlineBell className="text-white text-xl sm:text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notifications
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">Stay updated with your activity</p>
            </div>
          </div>

          <button
            onClick={markAll}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto text-sm sm:text-base"
          >
            <AiOutlineCheckCircle className="text-lg" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      {/* LIST */}
      {list.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center transform transition-all duration-300">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔔</div>
          <p className="text-gray-600 text-base sm:text-lg font-medium">No notifications yet</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Your notifications will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {list.map((n) => (
            <div
              key={n._id}
              className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl flex items-start gap-3 sm:gap-4 ${
                n.isRead 
                  ? "bg-white border border-gray-200" 
                  : "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200"
              }`}
            >
              {/* Avatar */}
              <Link to={`/profile/${n.sender._id}`} className="flex-shrink-0">
                <img
                  src={n.sender.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow"
                  alt={n.sender.name}
                />
              </Link>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm sm:text-base">
                  <Link
                    to={`/profile/${n.sender._id}`}
                    className="font-semibold hover:text-blue-600 transition-colors duration-200"
                  >
                    {n.sender.name}
                  </Link>
                  {" "}
                  {n.type === "like" && "liked your post ❤️"}
                  {n.type === "comment" && "commented on your post 💬"}
                  {n.type === "follow" && "started following you 👤"}
                  {n.type === "collab_request" && "requested to join your project 🤝"}
                  {n.type === "collab_accepted" && "accepted your collaboration ✅"}
                  {n.type === "removed_from_project" && "removed you from a project ❌"}
                </p>

                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2">
                  <span>🕒</span>
                  {timeAgo(n.createdAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-3 flex-shrink-0">
                {/* Mark Read */}
                {!n.isRead && (
                  <button
                    onClick={() => markOne(n._id)}
                    className="p-1.5 sm:p-2 bg-green-100 text-green-600 rounded-lg sm:rounded-xl hover:bg-green-200 transition-all duration-200 transform hover:scale-110"
                    title="Mark as read"
                  >
                    <AiOutlineCheckCircle size={14} className="sm:w-4 sm:h-4" />
                  </button>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => deleteOne(n._id)}
                  className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-200 transition-all duration-200 transform hover:scale-110"
                  title="Delete notification"
                >
                  <AiOutlineDelete size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {list.length > 0 && (
        <div className="mt-4 sm:mt-6 text-center">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 inline-block">
            <p className="text-gray-600 text-xs sm:text-sm">
              <span className="font-semibold text-blue-600">{list.filter(n => !n.isRead).length}</span> unread •{" "}
              <span className="font-semibold text-purple-600">{list.length}</span> total
            </p>
          </div>
        </div>
      )}
    </div>
  );
}