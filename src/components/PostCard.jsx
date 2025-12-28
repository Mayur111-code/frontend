import { useState, useCallback, memo } from "react";
import API from "../api/axios";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LikesModal from "./LikesModal";
import CommentsModal from "./CommentsModal";
import EditPostModal from "./EditPostModal";
import timeAgo from "../utils/timeAgo";

const PostCard = memo(({ post, refresh }) => {
  const [liking, setLiking] = useState(false);
  const [likesModal, setLikesModal] = useState(false);
  const [commentsModal, setCommentsModal] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const authUser = useSelector((state) => state.user.user);

  // --------------------------------
  // SAFE AUTHOR FALLBACK
  // --------------------------------
  const author = post.author || {
    _id: "unknown",
    name: "Unknown User",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  };

  // --------------------------------
  // SAFE LIKE & OWNER CHECK
  // --------------------------------
  const isOwner = authUser?._id && author._id && authUser._id === author._id;
  const isLiked = post.likes?.includes(authUser?._id);

  const handleLike = useCallback(async () => {
    if (liking) return;
    setLiking(true);
    try {
      await API.put(`/posts/like/${post._id}`);
      refresh();
    } catch {
      toast.error("Failed to like post");
    } finally {
      setLiking(false);
    }
  }, [liking, post._id, refresh]);

  // --------------------------------
  // DELETE POST
  // --------------------------------
  const deletePost = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/delete/${post._id}`);
      refresh();
      setOptionsOpen(false);
    } catch {
      toast.error("Failed to delete post");
    }
  }, [post._id, refresh]);

  // --------------------------------
  // SHARE POST
  // --------------------------------
  const sharePost = useCallback(() => {
    const url = `${window.location.origin}/post/${post._id}`;
    const text = post.content || "Check this post on Collab";

    if (navigator.share) {
      navigator.share({ title: "Collab Post", text, url }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(url).then(() => {
          toast.success("Link copied to clipboard!");
        });
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast.success("Link copied to clipboard!");
      });
    }
  }, [post._id, post.content]);

  // --------------------------------
  // MODAL HANDLERS
  // --------------------------------
  const openLikesModal = useCallback(() => setLikesModal(true), []);
  const closeLikesModal = useCallback(() => setLikesModal(false), []);
  const openCommentsModal = useCallback(() => setCommentsModal(true), []);
  const closeCommentsModal = useCallback(() => setCommentsModal(false), []);
  const openEditModal = useCallback(() => {
    setEditOpen(true);
    setOptionsOpen(false);
  }, []);
  const closeEditModal = useCallback(() => setEditOpen(false), []);
  const toggleOptions = useCallback(() => setOptionsOpen(prev => !prev), []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 max-w-2xl mx-auto relative hover:shadow-xl transition-all">

      {/* OPTIONS MENU */}
      {isOwner && (
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleOptions}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            <BsThreeDots size={20} />
          </button>

          {optionsOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-2xl w-36 z-40">
              <button
                className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700"
                onClick={openEditModal}
              >
                ✏️ Edit
              </button>

              <button
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600"
                onClick={deletePost}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* AUTHOR SECTION */}
      <div className="flex items-center gap-3 mb-4">
        <Link to={`/profile/${author._id}`} className="flex items-center gap-3 flex-1">
          <img
            src={author.avatar}
            alt={`${author.name} avatar`}
            className="w-12 h-12 rounded-full border-2 border-white shadow"
          />
          <div>
            <div className="font-semibold text-gray-800 hover:text-blue-600">
              {author.name}
            </div>
            <div className="text-xs text-gray-500">{timeAgo(post.createdAt)}</div>
          </div>
        </Link>
      </div>

      {/* CONTENT */}
      <p className="text-gray-800 mb-4 leading-relaxed">
        {post.content}
      </p>

      {/* IMAGE / VIDEO */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-4">
          {post.image.includes(".mp4") ? (
            <video controls className="w-full rounded-xl">
              <source src={post.image} type="video/mp4" />
            </video>
          ) : (
            <img
              src={post.image}
              alt="Post media"
              className="w-full rounded-xl object-cover max-h-96"
              loading="lazy"
            />
          )}
        </div>
      )}

      {/* STATS */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span onClick={openLikesModal} className="cursor-pointer hover:text-blue-600">
          {post.likes?.length || 0} likes
        </span>
        <span onClick={openCommentsModal} className="cursor-pointer hover:text-blue-600">
          {post.comments?.length || 0} comments
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-2 border-t pt-3">

        {/* LIKE */}
        <button
          onClick={handleLike}
          disabled={liking}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors ${
            isLiked ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {isLiked ? <AiFillHeart className="text-xl" /> : <AiOutlineHeart className="text-xl" />}
          Like
        </button>

        {/* COMMENT */}
        <button
          onClick={openCommentsModal}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <AiOutlineComment className="text-xl" />
          Comment
        </button>

        {/* SHARE */}
        <button
          onClick={sharePost}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <AiOutlineShareAlt className="text-xl" />
          Share
        </button>

      </div>

      {/* MODALS */}
      {likesModal && (
        <LikesModal likes={post.likedUsers || []} close={closeLikesModal} />
      )}

      {commentsModal && (
        <CommentsModal post={post} refresh={refresh} close={closeCommentsModal} />
      )}

      {editOpen && (
        <EditPostModal post={post} refresh={refresh} close={closeEditModal} />
      )}
    </div>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
