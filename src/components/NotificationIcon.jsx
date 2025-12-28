import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";

export default function NotificationIcon() {
  // TODO: fetch notifications count
  const notificationsCount = 0;

  return (
    <Link
      to="/notifications"
      className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
    >
      <FiBell className="text-xl group-hover:scale-110 transition-transform" />
      {notificationsCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {notificationsCount > 9 ? '9+' : notificationsCount}
        </span>
      )}
    </Link>
  );
}