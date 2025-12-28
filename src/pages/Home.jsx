import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";import StatsCard from "../components/StatsCard";
import FilterButtons from "../components/FilterButtons";import { Plus, Users, TrendingUp, Filter, Search, Sparkles, FileText, Heart, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import CreatePostModal from "../components/CreatePostModal";

export default function Home() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

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
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/posts/all");

      // Prevent frontend crash by ensuring post.user is not null
      const safePosts = data.map((post) => ({
        ...post,
        user: post.user || { name: "Unknown", _id: "unknown" },
      }));

      setPosts(safePosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ------------------------------
  // ✔ 3. Search
  // ------------------------------
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // ------------------------------
  // ✔ 5. Filter
  // ------------------------------
  const handleFilter = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  // ------------------------------
  // ✔ 6. Filtered Posts (Memoized)
  // ------------------------------
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Apply search
    if (searchQuery.trim()) {
      filtered = posts.filter(p =>
        p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filter
    switch (activeFilter) {
      case "trending":
        filtered = [...filtered].sort((a, b) =>
          ((b.likes?.length || 0) + (b.comments?.length || 0)) -
          ((a.likes?.length || 0) + (a.comments?.length || 0))
        );
        break;
      case "recent":
        filtered = [...filtered].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "popular":
        filtered = [...filtered].sort((a, b) =>
          (b.likes?.length || 0) - (a.likes?.length || 0)
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [posts, searchQuery, activeFilter]);

  // ------------------------------
  // ✔ 7. Stats (Memoized)
  // ------------------------------
  const stats = useMemo(() => ({
    totalPosts: posts.length,
    totalLikes: posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0),
    totalComments: posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0),
  }), [posts]);

  // ------------------------------
  // ✔ 8. Filter Options (Memoized)
  // ------------------------------
  const filterOptions = useMemo(() => [
    { key: "all", label: "All Posts", icon: Users },
    { key: "trending", label: "Trending", icon: TrendingUp },
    { key: "recent", label: "Recent", icon: Filter },
    { key: "popular", label: "Popular", icon: TrendingUp }
  ], []);

  // ------------------------------
  // ✔ 9. Loading screen
  // ------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <LoadingSpinner size="h-16 w-16" className="mx-auto mb-4" />
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
  // ✔ 10. Render UI
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

            <FilterButtons
              options={filterOptions}
              activeFilter={activeFilter}
              onFilterChange={handleFilter}
            />

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
          <StatsCard
            title="Total Posts"
            value={stats.totalPosts}
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Total Likes"
            value={stats.totalLikes}
            icon={Heart}
            color="green"
          />
          <StatsCard
            title="Total Comments"
            value={stats.totalComments}
            icon={MessageCircle}
            color="purple"
          />
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
              <div key={post._id}>
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
