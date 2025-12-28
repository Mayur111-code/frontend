import { Link } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX, FiPlus, FiHome, FiCompass, FiBriefcase, FiLogOut } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { toast } from "react-toastify";
import CreatePostModal from "./CreatePostModal";
import SearchBar from "./SearchBar";
import NotificationIcon from "./NotificationIcon";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <>
      {openCreate && (
        <CreatePostModal
          close={() => setOpenCreate(false)}
          refresh={() => window.location.reload()}
        />
      )}

      <nav className="bg-white/95 backdrop-blur-lg shadow-lg fixed top-0 left-0 w-full z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <HiSparkles className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InfinaHub
              </span>
              <span className="text-xs text-gray-500 font-medium">Developer Community</span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <SearchBar />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
            >
              <FiHome className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Home
            </Link>

            <Link 
              to="/explore" 
              className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
            >
              <FiCompass className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Explore
            </Link>

            <Link 
              to="/projects" 
              className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
            >
              <FiBriefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Projects
            </Link>

            <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold ml-2"
            >
              <FiPlus className="w-4 h-4" />
              Create
            </button>

            <NotificationIcon />

            <UserMenu />

            <button
              onClick={() => {
                dispatch(logout());
                toast.success("Logged out successfully! 👋");
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group"
            >
              <FiLogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:block">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        <MobileMenu open={open} setOpen={setOpen} />
      </nav>
    </>
  );
}
