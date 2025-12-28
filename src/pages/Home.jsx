// import { useEffect, useState } from "react";
// import API from "../api/axios";
// import PostCard from "../components/PostCard";
// import { Plus, Users, TrendingUp, Filter, Search, Sparkles } from "lucide-react";
// import { toast } from "react-toastify";
// import CreatePostModal from "../components/CreatePostModal";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";


// export default function Home() {
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const { data } = await API.get("/posts/all");
//       setPosts(data);
//       setFilteredPosts(data);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       toast.error("Failed to load posts");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchPosts();
//     toast.info("Refreshing feed...");
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (!query.trim()) {
//       setFilteredPosts(posts);
//       return;
//     }

//     const filtered = posts.filter(post =>
//       post.content?.toLowerCase().includes(query.toLowerCase()) ||
//       post.user?.name?.toLowerCase().includes(query.toLowerCase()) ||
//       post.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
//     );
//     setFilteredPosts(filtered);
//   };

//   const handleFilter = (filter) => {
//     setActiveFilter(filter);
    
//     switch (filter) {
//       case "trending":
//         // Sort by likes and comments count
//         const trending = [...posts].sort((a, b) => 
//           ((b.likes?.length || 0) + (b.comments?.length || 0)) - 
//           ((a.likes?.length || 0) + (a.comments?.length || 0))
//         );
//         setFilteredPosts(trending);
//         break;
//       case "recent":
//         // Sort by creation date (newest first)
//         const recent = [...posts].sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setFilteredPosts(recent);
//         break;
//       case "popular":
//         // Sort by likes count
//         const popular = [...posts].sort((a, b) => 
//           (b.likes?.length || 0) - (a.likes?.length || 0)
//         );
//         setFilteredPosts(popular);
//         break;
//       default:
//         setFilteredPosts(posts);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
//         <div className="flex justify-center items-center h-96">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-xl font-semibold text-gray-700 mb-2">Loading Community Posts</p>
//             <p className="text-gray-500">Connecting you with amazing developers...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-10">
      
//       {/* Create Post Modal */}
//       {showCreateModal && (
//         <CreatePostModal 
//           close={() => setShowCreateModal(false)} 
//           refresh={fetchPosts}
//         />
//       )}

//       {/* Header Section */}
//       <div className="max-w-4xl mx-auto px-4 mb-8">
//         <div className="text-center mb-8">
//           <div className="flex justify-center items-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//               <Sparkles className="text-white w-8 h-8" />
//             </div>
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
//             Developer Feed
//           </h1>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             Connect, share, and grow with the developer community
//           </p>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/20">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//             {/* Search Input */}
//             <div className="flex-1 w-full md:w-auto">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search posts, tags, or people..."
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   value={searchQuery}
//                   onChange={(e) => handleSearch(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Filter Buttons */}
//             <div className="flex gap-2 flex-wrap justify-center">
//               {[
//                 { key: "all", label: "All Posts", icon: Users },
//                 { key: "trending", label: "Trending", icon: TrendingUp },
//                 { key: "recent", label: "Recent", icon: Filter },
//                 { key: "popular", label: "Popular", icon: TrendingUp }
//               ].map(({ key, label, icon: Icon }) => (
//                 <button
//                   key={key}
//                   onClick={() => handleFilter(key)}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
//                     activeFilter === key
//                       ? 'bg-blue-500 text-white shadow-lg transform scale-105'
//                       : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
//                   }`}
//                 >
//                   <Icon size={16} />
//                   {label}
//                 </button>
//               ))}
//             </div>

//             {/* Create Post Button */}
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
//             >
//               <Plus size={20} />
//               Create Post
//             </button>
//           </div>
//         </div>

//         {/* Stats Bar */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm">
//             <div className="text-2xl font-bold text-blue-600 mb-1">{posts.length}</div>
//             <div className="text-gray-600 text-sm">Total Posts</div>
//           </div>
//           <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm">
//             <div className="text-2xl font-bold text-green-600 mb-1">
//               {posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0)}
//             </div>
//             <div className="text-gray-600 text-sm">Total Likes</div>
//           </div>
//           <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm">
//             <div className="text-2xl font-bold text-purple-600 mb-1">
//               {posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}
//             </div>
//             <div className="text-gray-600 text-sm">Total Comments</div>
//           </div>
//         </div>
//       </div>

//       {/* Posts List */}
//       <div className="max-w-4xl mx-auto px-4">
//         {filteredPosts.length === 0 ? (
//           <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 transform transition-all duration-300 border border-white/20">
//             <div className="text-8xl mb-6">📝</div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-3">
//               {searchQuery ? "No matching posts found" : "No posts yet"}
//             </h3>
//             <p className="text-gray-600 mb-6 max-w-md mx-auto">
//               {searchQuery 
//                 ? "Try adjusting your search terms or filters"
//                 : "Be the first to share your thoughts, projects, or questions with the community!"
//               }
//             </p>
//             {!searchQuery && (
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
//               >
//                 Create First Post
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {/* Results Info */}
//             <div className="flex justify-between items-center px-2">
//               <p className="text-gray-600 text-sm">
//                 Showing {filteredPosts.length} of {posts.length} posts
//                 {searchQuery && ` for "${searchQuery}"`}
//               </p>
//               <button
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50"
//               >
//                 <svg 
//                   className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 {refreshing ? 'Refreshing...' : 'Refresh'}
//               </button>
//             </div>

//             {/* Posts Grid */}
//             {filteredPosts.map((post) => (
//               <div 
//                 key={post._id} 
//                 className="transform transition-all duration-300 hover:scale-[1.01]"
//               >
//                 <PostCard post={post} refresh={fetchPosts} />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Floating Action Button */}
//       <button
//         onClick={() => setShowCreateModal(true)}
//         className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50"
//       >
//         <Plus size={24} />
//       </button>

//       {/* Floating Stats */}
//       {posts.length > 0 && (
//         <div className="fixed bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 transform transition-all duration-300 hover:shadow-xl border border-white/20">
//           <div className="flex items-center gap-3">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <p className="text-sm text-gray-700 font-medium">
//               {posts.length} {posts.length === 1 ? 'post' : 'posts'} live
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import PostCard from "../components/PostCard";
import { Plus, Users, TrendingUp, Filter, Search, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import CreatePostModal from "../components/CreatePostModal";

export default function Home() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // ------------------------------
  // ✔ 1. Redirect if user is NULL
  // ------------------------------
  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ------------------------------
  // ✔ 2. Fetch Posts
  // ------------------------------
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/posts/all");

      // Prevent frontend crash by ensuring post.user is not null
      const safePosts = data.map((post) => ({
        ...post,
        user: post.user || { name: "Unknown", _id: "unknown" },
      }));

      setPosts(safePosts);
      setFilteredPosts(safePosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ------------------------------
  // ✔ 3. Refresh
  // ------------------------------
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
    toast.info("Refreshing feed...");
  };

  // ------------------------------
  // ✔ 4. Search
  // ------------------------------
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(p =>
      p.content?.toLowerCase().includes(query.toLowerCase()) ||
      p.user?.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    setFilteredPosts(filtered);
  };

  // ------------------------------
  // ✔ 5. Filter
  // ------------------------------
  const handleFilter = (filter) => {
    setActiveFilter(filter);

    switch (filter) {
      case "trending":
        setFilteredPosts([...posts].sort((a, b) =>
          ((b.likes?.length || 0) + (b.comments?.length || 0)) -
          ((a.likes?.length || 0) + (a.comments?.length || 0))
        ));
        break;

      case "recent":
        setFilteredPosts([...posts].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        ));
        break;

      case "popular":
        setFilteredPosts([...posts].sort((a, b) =>
          (b.likes?.length || 0) - (a.likes?.length || 0)
        ));
        break;

      default:
        setFilteredPosts(posts);
    }
  };

  // ------------------------------
  // ✔ 6. Loading screen
  // ------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Loading Community Posts
            </p>
            <p className="text-gray-500">
              Connecting you with amazing developers...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------
  // ✔ 7. Render UI
  // ------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-10">

      {showCreateModal && (
        <CreatePostModal close={() => setShowCreateModal(false)} refresh={fetchPosts} />
      )}

      <div className="max-w-4xl mx-auto px-4 mb-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Developer Feed
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect, share, and grow with the developer community
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts, tags, or people..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              {[
                { key: "all", label: "All Posts", icon: Users },
                { key: "trending", label: "Trending", icon: TrendingUp },
                { key: "recent", label: "Recent", icon: Filter },
                { key: "popular", label: "Popular", icon: TrendingUp }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleFilter(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm ${
                    activeFilter === key
                      ? "bg-blue-500 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              <Plus size={20} />
              Create Post
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 p-4 rounded-xl text-center shadow-sm border border-white/20">
            <div className="text-2xl font-bold text-blue-600 mb-1">{posts.length}</div>
            <div className="text-gray-600 text-sm">Total Posts</div>
          </div>
          <div className="bg-white/80 p-4 rounded-xl text-center shadow-sm border border-white/20">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0)}
            </div>
            <div className="text-gray-600 text-sm">Total Likes</div>
          </div>
          <div className="bg-white/80 p-4 rounded-xl text-center shadow-sm border border-white/20">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}
            </div>
            <div className="text-gray-600 text-sm">Total Comments</div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center bg-white/80 p-12 rounded-2xl shadow-lg">
            <div className="text-8xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {searchQuery ? "No matching posts" : "No posts yet"}
            </h3>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105"
              >
                Create First Post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post?._id || Math.random()}>
                <PostCard post={post} refresh={fetchPosts} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:scale-110 flex items-center justify-center"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
