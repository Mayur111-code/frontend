// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../redux/userSlice";
// import { useState, useEffect, useRef } from "react";
// import { FiMenu, FiX, FiSearch, FiPlus, FiBell, FiUser, FiHome, FiCompass, FiBriefcase, FiLogOut, FiTrendingUp } from "react-icons/fi";
// import { HiSparkles } from "react-icons/hi";
// import CreatePostModal from "./CreatePostModal";
// import API from "../api/axios";
// import { toast } from "react-toastify";

// export default function Navbar() {
//   const dispatch = useDispatch();
//   const user = useSelector((s) => s.user.user);

//   const [search, setSearch] = useState("");
//   const [results, setResults] = useState([]);
//   const [showSearch, setShowSearch] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [openCreate, setOpenCreate] = useState(false);
//   const [notificationsCount, setNotificationsCount] = useState(0);
//   const searchRef = useRef(null);

//   const handleLogout = () => {
//     dispatch(logout());
//     toast.success("Logged out successfully! 👋");
//   };

//   const handleSearch = async (text) => {
//     setSearch(text);

//     if (text.trim().length === 0) {
//       setResults([]);
//       setShowSearch(false);
//       return;
//     }

//     try {
//       const { data } = await API.get(`/search?q=${text}`);
//       setResults(data);
//       setShowSearch(true);
//     } catch (err) {
//       console.log(err);
//       toast.error("Search failed. Please try again.");
//     }
//   };

//   // Close search when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearch(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // // Fetch notifications count
//   // useEffect(() => {
//   //   const fetchNotifications = async () => {
//   //     try {
//   //       const { data } = await API.get("/notifications/unread-count");
//   //       setNotificationsCount(data.count || 0);
//   //     } catch (error) {
//   //       console.error("Error fetching notifications:", error);
//   //     }
//   //   };

//   //   fetchNotifications();
//   //   // Poll for new notifications every 30 seconds
//   //   const interval = setInterval(fetchNotifications, 30000);
//   //   return () => clearInterval(interval);
//   // }, []);

//   // const clearSearch = () => {
//   //   setSearch("");
//   //   setResults([]);
//   //   setShowSearch(false);
//   // };


//   // Fetch notifications count safely
// useEffect(() => {
//   if (!user) {
//     setNotificationsCount(0);
//     return;
//   }

//   const fetchNotifications = async () => {
//     try {
//       // TEMP disabled since backend route not created yet
//       // const { data } = await API.get(`/notifications/unread-count/${user._id}`);
//       // setNotificationsCount(data.count);

//       setNotificationsCount(0);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setNotificationsCount(0);
//     }
//   };

//   fetchNotifications();

//   // Poll every 30 seconds
//   const interval = setInterval(fetchNotifications, 30000);

//   return () => clearInterval(interval);
// }, [user]);

//   return (
//     <>
//       {/* Create Post Modal */}
//       {openCreate && (
//         <CreatePostModal
//           close={() => setOpenCreate(false)}
//           refresh={() => window.location.reload()}
//         />
//       )}

//       <nav className="bg-white/95 backdrop-blur-lg shadow-lg fixed top-0 left-0 w-full z-50 border-b border-gray-200/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
//           {/* Logo & Brand */}
//           <Link to="/" className="flex items-center space-x-3 group">
//             <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
//               <HiSparkles className="text-xl" />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 InfinaHub
//               </span>
//               <span className="text-xs text-gray-500 font-medium">Developer Community</span>
//             </div>
//           </Link>

//           {/* Desktop Search Bar */}
//           <div className="hidden md:block relative w-96" ref={searchRef}>
//             <div className="relative">
//               <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Search developers, projects, posts..."
//                 className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-2xl bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
//               />
//               {search && (
//                 <button
//                   onClick={clearSearch}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
//                 >
//                   <FiX className="w-4 h-4" />
//                 </button>
//               )}
//             </div>

//             {/* Search Dropdown */}
//             {showSearch && (
//               <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl max-h-80 overflow-y-auto z-50 border border-gray-200/50">
//                 <div className="p-3 border-b border-gray-100">
//                   <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                     <FiSearch className="w-4 h-4" />
//                     Search Results
//                   </p>
//                 </div>
                
//                 {results.length === 0 ? (
//                   <div className="px-4 py-8 text-gray-500 text-center">
//                     <div className="text-4xl mb-3">🔍</div>
//                     <p className="font-medium text-gray-600">No results found</p>
//                     <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
//                   </div>
//                 ) : (
//                   results.map((u) => (
//                     <Link
//                       key={u._id}
//                       to={`/profile/${u._id}`}
//                       onClick={clearSearch}
//                       className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 border-b border-gray-100/50 last:border-b-0 group"
//                     >
//                       <img
//                         src={u.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
//                         className="w-12 h-12 rounded-full border-2 border-white shadow group-hover:scale-105 transition-transform duration-200"
//                         alt={u.name}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <p className="font-semibold text-gray-800 truncate">{u.name}</p>
//                         <p className="text-xs text-gray-500 truncate">
//                           {u.title || "Developer"} • {u.skills?.slice(0, 2).join(", ") || "No skills"}
//                         </p>
//                       </div>
//                       <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                       </div>
//                     </Link>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-2">
//             <Link 
//               to="/" 
//               className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
//             >
//               <FiHome className="w-4 h-4 group-hover:scale-110 transition-transform" />
//               Home
//             </Link>

//             <Link 
//               to="/explore" 
//               className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
//             >
//               <FiCompass className="w-4 h-4 group-hover:scale-110 transition-transform" />
//               Explore
//             </Link>

//             <Link 
//               to="/projects" 
//               className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
//             >
//               <FiBriefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
//               Projects
//             </Link>

//             <button
//               onClick={() => setOpenCreate(true)}
//               className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold ml-2"
//             >
//               <FiPlus className="w-4 h-4" />
//               Create
//             </button>

//             {/* Notifications with Badge */}
//             <Link 
//               to="/notifications" 
//               className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
//             >
//               <FiBell className="text-xl group-hover:scale-110 transition-transform" />
//               {notificationsCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
//                   {notificationsCount > 9 ? '9+' : notificationsCount}
//                 </span>
//               )}
//             </Link>

//             {/* User Profile */}
//             <Link
//               to={`/profile/${user?._id}`}
//               className="flex items-center gap-3 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
//             >
//               <img
//                 src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
//                 className="w-8 h-8 rounded-full border-2 border-white shadow group-hover:scale-110 transition-transform"
//                 alt={user?.name}
//               />
//               <span className="font-medium text-sm max-w-24 truncate hidden lg:block">
//                 {user?.name}
//               </span>
//             </Link>

//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group"
//             >
//               <FiLogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
//               <span className="hidden lg:block">Logout</span>
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
//             onClick={() => setOpen(!open)}
//           >
//             {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {open && (
//           <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-xl">
//             <div className="px-4 py-4 space-y-2">
              
//               {/* User Info */}
//               <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl mb-2">
//                 <img
//                   src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
//                   className="w-12 h-12 rounded-full border-2 border-white shadow"
//                   alt={user?.name}
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
//                   <p className="text-sm text-gray-500 truncate">{user?.email}</p>
//                 </div>
//               </div>

//               {/* Mobile Search */}
//               <div className="relative mb-3">
//                 <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   placeholder="Search developers..."
//                   className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
//                 />
//               </div>

//               {/* Mobile Menu Items */}
//               {[
//                 { to: "/", icon: FiHome, label: "Home" },
//                 { to: "/explore", icon: FiCompass, label: "Explore" },
//                 { to: "/projects", icon: FiBriefcase, label: "Projects" },
//                 { to: "/notifications", icon: FiBell, label: "Notifications", badge: notificationsCount },
//                 { to: `/profile/${user?._id}`, icon: FiUser, label: "Profile" },
//               ].map(({ to, icon: Icon, label, badge }) => (
//                 <Link
//                   key={to}
//                   to={to}
//                   className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
//                   onClick={() => setOpen(false)}
//                 >
//                   <div className="relative">
//                     <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                     {badge > 0 && (
//                       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                         {badge > 9 ? '9+' : badge}
//                       </span>
//                     )}
//                   </div>
//                   {label}
//                 </Link>
//               ))}

//               {/* Action Buttons */}
//               <div className="pt-2 border-t border-gray-200/50 space-y-2">
//                 <button
//                   onClick={() => {
//                     setOpenCreate(true);
//                     setOpen(false);
//                   }}
//                   className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold"
//                 >
//                   <FiPlus className="w-5 h-5" />
//                   Create Post
//                 </button>

//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setOpen(false);
//                   }}
//                   className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-semibold"
//                 >
//                   <FiLogOut className="w-5 h-5" />
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>
//     </>
//   );
// }



import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useState, useEffect, useRef } from "react";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiPlus,
  FiBell,
  FiUser,
  FiHome,
  FiCompass,
  FiBriefcase,
  FiLogOut
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import CreatePostModal from "./CreatePostModal";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.user);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const searchRef = useRef(null);

  // ---------------------------
  // Logout
  // ---------------------------
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully! 👋");
  };

  // ---------------------------
  // Clear Search
  // ---------------------------
  const clearSearch = () => {
    setSearch("");
    setResults([]);
    setShowSearch(false);
  };

  // ---------------------------
  // Search API with SAFE DATA
  // ---------------------------
  const handleSearch = async (text) => {
    setSearch(text);

    if (text.trim() === "") {
      setResults([]);
      setShowSearch(false);
      return;
    }

    try {
      const { data } = await API.get(`/search?q=${text}`);

      // SAFELY map results
      const safe = data.map((u) => ({
        _id: u?._id || "unknown",
        name: u?.name || "Unknown User",
        avatar: u?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        title: u?.title || "Developer",
        skills: Array.isArray(u?.skills) ? u.skills : []
      }));

      setResults(safe);
      setShowSearch(true);
    } catch (err) {
      console.log(err);
      toast.error("Search failed. Please try again.");
    }
  };

  // ---------------------------
  // Click outside to close search
  // ---------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------------------
  // Notification Count (Safe)
  // ---------------------------
  useEffect(() => {
    if (!user?._id) {
      setNotificationsCount(0);
      return;
    }

    const fetch = async () => {
      try {
        setNotificationsCount(0); // TODO: enable when backend ready
      } catch {
        setNotificationsCount(0);
      }
    };

    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [user]);

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

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2.5 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform">
              <HiSparkles className="text-xl" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InfinaHub
              </span>
              <span className="block text-xs text-gray-500 font-medium">
                Developer Community
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block relative w-96" ref={searchRef}>
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search developers, projects, posts..."
                className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
              />

              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* SEARCH DROPDOWN */}
            {showSearch && (
              <div className="absolute top-16 bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl w-full border">
                {results.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No results</div>
                ) : (
                  results.map((u) => (
                    <Link
                      key={u._id}
                      to={`/profile/${u._id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition"
                      onClick={clearSearch}
                    >
                      <img
                        src={u.avatar}
                        className="w-12 h-12 rounded-full border shadow"
                      />
                      <div className="flex-1">
                        <p className="font-semibold truncate">{u.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {u.title} • {u.skills.slice(0, 2).join(", ") || "No skills"}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className="nav-btn"><FiHome /> Home</Link>
            <Link to="/explore" className="nav-btn"><FiCompass /> Explore</Link>
            <Link to="/projects" className="nav-btn"><FiBriefcase /> Projects</Link>

            <button
              onClick={() => setOpenCreate(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transition"
            >
              <FiPlus className="inline-block mr-1" /> Create
            </button>

            {/* Notifications */}
            <Link to="/notifications" className="relative p-2.5 hover:bg-blue-50 rounded-xl">
              <FiBell className="text-xl" />
              {notificationsCount > 0 && (
                <span className="badge">{notificationsCount > 9 ? "9+" : notificationsCount}</span>
              )}
            </Link>

            {/* Profile */}
            <Link to={`/profile/${user?._id || "unknown"}`} className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-xl">
              <img
                src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden lg:block">{user?.name}</span>
            </Link>

            <button onClick={handleLogout} className="nav-btn text-red-500 hover:bg-red-50">
              <FiLogOut /> Logout
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden p-2.5" onClick={() => setOpen(!open)}>
            {open ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-white shadow-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>

            <Link to="/" onClick={() => setOpen(false)} className="mobile-item"><FiHome /> Home</Link>
            <Link to="/explore" onClick={() => setOpen(false)} className="mobile-item"><FiCompass /> Explore</Link>
            <Link to="/projects" onClick={() => setOpen(false)} className="mobile-item"><FiBriefcase /> Projects</Link>
            <Link to="/notifications" onClick={() => setOpen(false)} className="mobile-item">
              <FiBell /> Notifications
            </Link>

            <Link to={`/profile/${user?._id || "unknown"}`} onClick={() => setOpen(false)} className="mobile-item">
              <FiUser /> Profile
            </Link>

            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="mobile-item text-red-600"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
