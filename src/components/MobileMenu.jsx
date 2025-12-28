import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { FiHome, FiCompass, FiBriefcase, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";

export default function MobileMenu({ open, setOpen }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.user);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully! 👋");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-xl">
      <div className="px-4 py-4 space-y-2">
        {/* User Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl mb-2">
          <img
            src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            className="w-12 h-12 rounded-full border-2 border-white shadow"
            alt={user?.name}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <Link to="/" onClick={() => setOpen(false)} className="mobile-item">
          <FiHome /> Home
        </Link>
        <Link to="/explore" onClick={() => setOpen(false)} className="mobile-item">
          <FiCompass /> Explore
        </Link>
        <Link to="/projects" onClick={() => setOpen(false)} className="mobile-item">
          <FiBriefcase /> Projects
        </Link>
        <Link to="/notifications" onClick={() => setOpen(false)} className="mobile-item">
          <FiBell /> Notifications
        </Link>
        <Link to={`/profile/${user?._id}`} onClick={() => setOpen(false)} className="mobile-item">
          <FiUser /> Profile
        </Link>
        <button onClick={handleLogout} className="mobile-item text-red-500">
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}