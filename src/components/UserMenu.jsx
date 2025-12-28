import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserMenu() {
  const user = useSelector((s) => s.user.user);

  return (
    <div className="flex items-center gap-3 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group">
      <img
        src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
        className="w-8 h-8 rounded-full border-2 border-white shadow group-hover:scale-110 transition-transform"
        alt={user?.name}
      />
      <span className="font-medium text-sm max-w-24 truncate hidden lg:block">
        {user?.name}
      </span>
    </div>
  );
}