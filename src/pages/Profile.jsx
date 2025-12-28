import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import EditProfileModal from "../components/EditProfileModal";
import PostGridItem from "../components/PostGridItem";
import PostModal from "../components/PostModal";
import { 
  AiOutlineUser, 
  AiOutlineTeam, 
  AiOutlineFileText,
  AiOutlineMessage,
  AiOutlineSetting,
  AiOutlineShareAlt,
  AiOutlineCalendar,
  AiOutlineEnvironment
} from "react-icons/ai";
import { FiGithub, FiTwitter, FiLinkedin, FiGlobe, FiMail } from "react-icons/fi";
import { HiSparkles, HiUserGroup } from "react-icons/hi";
import { toast } from "react-toastify";

export default function Profile() {
  const { id } = useParams();
  const authUser = useSelector((s) => s.user.user);

  const [followersModal, setFollowersModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState("posts");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: u }, { data: p }] = await Promise.all([
        API.get(`/user/${id}`),
        API.get(`/posts/user/${id}`)
      ]);

      setUser(u);
      setPosts(p);
      setFollowersCount(u.followers?.length || 0);

      setIsFollowing(
        authUser
          ? (u.followers || []).some(
              (f) => f.toString() === authUser._id || f === authUser._id
            )
          : false
      );

    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Loading Profile</p>
          <p className="text-gray-500">Getting user information...</p>
        </div>
      </div>
    </div>
  );

  const handleFollow = async () => {
    try {
      const res = await API.put(`/user/follow/${id}`);
      setIsFollowing(true);
      setFollowersCount(res.data.followersCount);
      toast.success(`You're now following ${user.name}!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to follow user");
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await API.put(`/user/unfollow/${id}`);
      setIsFollowing(false);
      setFollowersCount(res.data.followersCount);
      toast.info(`You unfollowed ${user.name}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to unfollow user");
    }
  };

  const openFollowers = async () => {
    try {
      const { data } = await API.get(`/user/followers/${id}`);
      setFollowersList(data);
      setFollowersModal(true);
    } catch (error) {
      toast.error("Failed to load followers");
    }
  };

  const openFollowing = async () => {
    try {
      const { data } = await API.get(`/user/following/${id}`);
      setFollowingList(data);
      setFollowingModal(true);
    } catch (error) {
      toast.error("Failed to load following");
    }
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${user.name}'s profile on InfinaHub`,
          url: profileUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard! 📋");
    }
  };

  const getSocialIcon = (platform) => {
    const icons = {
      github: FiGithub,
      twitter: FiTwitter,
      linkedin: FiLinkedin,
      website: FiGlobe,
      email: FiMail
    };
    return icons[platform] || FiGlobe;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-10">
      
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl border border-white/20">
          
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            
            {/* Avatar Section */}
            <div className="relative group">
              <div className="relative">
                <img
                  src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="avatar"
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Online Status */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              
              {/* Name and Actions */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {user.name}
                  </h1>
                  {user.title && (
                    <p className="text-lg text-gray-600 font-medium">{user.title}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {authUser && authUser._id === user._id && (
                    <>
                      <button
                        onClick={() => setOpenEdit(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <AiOutlineSetting className="w-5 h-5" />
                        Edit Profile
                      </button>
                    </>
                  )}

                  {authUser && authUser._id !== user._id && (
                    <>
                      {isFollowing ? (
                        <button 
                          onClick={handleUnfollow} 
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <HiUserGroup className="w-5 h-5" />
                          Unfollow
                        </button>
                      ) : (
                        <button 
                          onClick={handleFollow} 
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <HiUserGroup className="w-5 h-5" />
                          Follow
                        </button>
                      )}
                      <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        <AiOutlineMessage className="w-5 h-5" />
                        Message
                      </button>
                    </>
                  )}

                  {/* Share Button */}
                  <button
                    onClick={handleShareProfile}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <AiOutlineShareAlt className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-lg mb-6 leading-relaxed max-w-3xl">
                {user.bio || "This user hasn't added a bio yet."}
              </p>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 mb-6 justify-center lg:justify-start text-sm text-gray-500">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <AiOutlineEnvironment className="w-4 h-4" />
                    {user.location}
                  </div>
                )}
                {user.joinDate && (
                  <div className="flex items-center gap-2">
                    <AiOutlineCalendar className="w-4 h-4" />
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                {user.skills?.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-medium rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
                {(!user.skills || user.skills.length === 0) && (
                  <span className="px-4 py-2 bg-gray-100 text-gray-500 font-medium rounded-xl">
                    No skills added
                  </span>
                )}
              </div>

              {/* Social Links */}
              {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                <div className="flex gap-3 mb-6 justify-center lg:justify-start">
                  {Object.entries(user.socialLinks).map(([platform, url]) => {
                    const IconComponent = getSocialIcon(platform);
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 transform hover:scale-110 shadow-sm"
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-6 text-gray-700">
                <div 
                  className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                  onClick={openFollowers}
                >
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                    <AiOutlineTeam className="text-xl text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{followersCount}</div>
                    <div className="text-sm text-gray-500 group-hover:text-blue-600">Followers</div>
                  </div>
                </div>

                <div 
                  className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
                  onClick={openFollowing}
                >
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-200">
                    <AiOutlineUser className="text-xl text-purple-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.following?.length || 0}</div>
                    <div className="text-sm text-gray-500 group-hover:text-purple-600">Following</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-50 hover:text-green-600 transition-all duration-200 group">
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-200">
                    <AiOutlineFileText className="text-xl text-green-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{posts.length}</div>
                    <div className="text-sm text-gray-500 group-hover:text-green-600">Posts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-2 mb-6 border border-white/20">
          <div className="flex gap-2">
            {[
              { id: "posts", label: "Posts", icon: AiOutlineFileText, count: posts.length },
              { id: "projects", label: "Projects", icon: HiSparkles, count: 0 },
              { id: "activity", label: "Activity", icon: AiOutlineUser, count: 0 }
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex-1 justify-center ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
                {count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === id ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {activeTab === "posts" && (
          <div>
            {posts.length === 0 ? (
              <div className="text-center bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-12 transform transition-all duration-300 border border-white/20">
                <div className="text-8xl mb-6">📝</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {authUser && authUser._id === user._id 
                    ? "Share Your First Post!" 
                    : "No Posts Yet"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {authUser && authUser._id === user._id 
                    ? "Start sharing your thoughts, projects, and experiences with the developer community."
                    : `${user.name} hasn't shared any posts yet.`}
                </p>
                {authUser && authUser._id === user._id && (
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                    Create Your First Post
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostGridItem
                    key={post._id}
                    post={post}
                    onOpen={() => setSelectedPost(post)}
                    isOwner={authUser && authUser._id === post.author._id}
                    refresh={fetchData}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other Tabs Content */}
        {activeTab !== "posts" && (
          <div className="text-center bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-12 border border-white/20">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Coming Soon!
            </h3>
            <p className="text-gray-600">
              {activeTab === "projects" 
                ? "Projects feature is under development" 
                : "Activity tracking is coming soon!"}
            </p>
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* Edit Profile Modal */}
      {openEdit && (
        <EditProfileModal
          user={user}
          close={() => { setOpenEdit(false); fetchData(); }}
        />
      )}

      {/* Post Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          close={() => setSelectedPost(null)}
          refresh={fetchData}
        />
      )}

      {/* Followers Modal */}
      {followersModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4 py-8 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Followers
              </h2>
              <button
                onClick={() => setFollowersModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                ✕
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {followersList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HiUserGroup className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No followers yet</p>
                </div>
              ) : (
                followersList.map((u) => (
                  <Link
                    to={`/profile/${u._id}`}
                    key={u._id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
                    onClick={() => setFollowersModal(false)}
                  >
                    <img
                      src={u.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      className="w-12 h-12 rounded-full border-2 border-white shadow group-hover:border-blue-200 transition-all duration-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                        {u.name}
                      </p>
                      {u.title && (
                        <p className="text-sm text-gray-500">{u.title}</p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {followingModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4 py-8 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Following
              </h2>
              <button
                onClick={() => setFollowingModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                ✕
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {followingList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HiUserGroup className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Not following anyone yet</p>
                </div>
              ) : (
                followingList.map((u) => (
                  <Link
                    to={`/profile/${u._id}`}
                    key={u._id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-all duration-200 group"
                    onClick={() => setFollowingModal(false)}
                  >
                    <img
                      src={u.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      className="w-12 h-12 rounded-full border-2 border-white shadow group-hover:border-purple-200 transition-all duration-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
                        {u.name}
                      </p>
                      {u.title && (
                        <p className="text-sm text-gray-500">{u.title}</p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}