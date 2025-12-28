// import { useState } from "react";
// import API from "../api/axios";
// import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai";
// import { BsThreeDots } from "react-icons/bs";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import LikesModal from "./LikesModal";
// import CommentsModal from "./CommentsModal";
// import EditPostModal from "./EditPostModal";
// import timeAgo from "../utils/timeAgo";

// export default function PostCard({ post, refresh }) {
//   const [liking, setLiking] = useState(false);
//   const [likesModal, setLikesModal] = useState(false);
//   const [commentsModal, setCommentsModal] = useState(false);
//   const [optionsOpen, setOptionsOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);

//   const authUser = useSelector((s) => s.user.user);

//   const handleLike = async () => {
//     setLiking(true);
//     await API.put(`/posts/like/${post._id}`);
//     refresh();
//     setLiking(false);
//   };

//   const deletePost = async () => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;

//     await API.delete(`/posts/delete/${post._id}`);
//     refresh();
//     setOptionsOpen(false);
//   };

//   const isOwner = authUser?._id === post.author._id;
//   const isLiked = post.likes?.includes(authUser?._id);

//   // ✔ REAL SOCIAL SHARE BUTTON
//   const sharePost = () => {
//     const url = `${window.location.origin}/post/${post._id}`;
//     const text = post.content || "Check this post on Collab";

//     if (navigator.share) {
//       navigator
//         .share({
//           title: "Collab App Post",
//           text,
//           url,
//         })
//         .catch(() => {});
//     } else {
//       navigator.clipboard.writeText(url);
//       alert("Link copied to clipboard!");
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 max-w-2xl mx-auto relative transform transition-all duration-300 hover:shadow-xl">

//       {/* OPTIONS MENU */}
//       {isOwner && (
//         <div className="absolute top-4 right-4">
//           <button 
//             onClick={() => setOptionsOpen(!optionsOpen)}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
//           >
//             <BsThreeDots size={20} />
//           </button>

//           {optionsOpen && (
//             <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl w-36 z-40 overflow-hidden">
//               <button
//                 className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 transition-all duration-200 flex items-center gap-2"
//                 onClick={() => {
//                   setEditOpen(true);
//                   setOptionsOpen(false);
//                 }}
//               >
//                 ✏️ Edit
//               </button>

//               <button
//                 className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition-all duration-200 flex items-center gap-2"
//                 onClick={deletePost}
//               >
//                 🗑️ Delete
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* AUTHOR */}
//       <div className="flex items-center gap-3 mb-4">
//         <Link to={`/profile/${post.author._id}`} className="flex items-center gap-3 flex-1">
//           <img
//             src={post.author.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
//             className="w-12 h-12 rounded-full border-2 border-white shadow"
//           />
//           <div className="flex-1">
//             <div className="font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
//               {post.author.name}
//             </div>
//             <div className="text-xs text-gray-500">{timeAgo(post.createdAt)}</div>
//           </div>
//         </Link>
//       </div>

//       {/* CONTENT */}
//       <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

//       {/* MEDIA */}
//       {post.image && (
//         <div className="rounded-xl overflow-hidden mb-4 border border-gray-200">
//           {post.image.includes(".mp4") ? (
//             <video controls className="w-full rounded-xl">
//               <source src={post.image} type="video/mp4" />
//             </video>
//           ) : (
//             <img 
//               src={post.image}
//               className="w-full rounded-xl object-cover max-h-96"
//             />
//           )}
//         </div>
//       )}

//       {/* STATS */}
//       <div className="flex items-center justify-between text-sm text-gray-500 mb-3 px-1">
//         <span onClick={() => setLikesModal(true)} className="cursor-pointer hover:text-blue-600">
//           {post.likes?.length || 0} likes
//         </span>
//         <span onClick={() => setCommentsModal(true)} className="cursor-pointer hover:text-blue-600">
//           {post.comments?.length || 0} comments
//         </span>
//       </div>

//       {/* ACTIONS */}
//       <div className="flex items-center gap-2 border-t border-gray-100 pt-3">

//         {/* LIKE */}
//         <button 
//           onClick={handleLike}
//           disabled={liking}
//           className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 ${
//             isLiked ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
//           }`}
//         >
//           {isLiked ? <AiFillHeart className="text-xl" /> : <AiOutlineHeart className="text-xl" />}
//           Like
//         </button>

//         {/* COMMENT */}
//         <button 
//           onClick={() => setCommentsModal(true)}
//           className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100"
//         >
//           <AiOutlineComment className="text-xl" />
//           Comment
//         </button>

//         {/* SHARE BUTTON */}
//         <button 
//           onClick={sharePost}
//           className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100"
//         >
//           <AiOutlineShareAlt className="text-xl" />
//           Share
//         </button>

//       </div>

//       {/* MODALS */}
//       {likesModal && (
//         <LikesModal likes={post.likedUsers || []} close={() => setLikesModal(false)} />
//       )}

//       {commentsModal && (
//         <CommentsModal post={post} refresh={refresh} close={() => setCommentsModal(false)} />
//       )}

//       {editOpen && (
//         <EditPostModal post={post} refresh={refresh} close={() => setEditOpen(false)} />
//       )}

//     </div>
//   );
// }



import { useState } from "react";
import API from "../api/axios";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LikesModal from "./LikesModal";
import CommentsModal from "./CommentsModal";
import EditPostModal from "./EditPostModal";
import timeAgo from "../utils/timeAgo";

export default function PostCard({ post, refresh }) {
  const [liking, setLiking] = useState(false);
  const [likesModal, setLikesModal] = useState(false);
  const [commentsModal, setCommentsModal] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const authUser = useSelector((s) => s.user.user);

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

  // --------------------------------
  // LIKE POST
  // --------------------------------
  const handleLike = async () => {
    setLiking(true);
    await API.put(`/posts/like/${post._id}`);
    refresh();
    setLiking(false);
  };

  // --------------------------------
  // DELETE POST
  // --------------------------------
  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await API.delete(`/posts/delete/${post._id}`);
    refresh();
    setOptionsOpen(false);
  };

  // --------------------------------
  // SHARE POST
  // --------------------------------
  const sharePost = () => {
    const url = `${window.location.origin}/post/${post._id}`;
    const text = post.content || "Check this post on Collab";

    if (navigator.share) {
      navigator.share({ title: "Collab Post", text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 max-w-2xl mx-auto relative hover:shadow-xl transition-all">

      {/* OPTIONS MENU */}
      {isOwner && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setOptionsOpen(!optionsOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            <BsThreeDots size={20} />
          </button>

          {optionsOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-2xl w-36 z-40">
              <button
                className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700"
                onClick={() => {
                  setEditOpen(true);
                  setOptionsOpen(false);
                }}
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
            <img src={post.image} className="w-full rounded-xl object-cover max-h-96" />
          )}
        </div>
      )}

      {/* STATS */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span onClick={() => setLikesModal(true)} className="cursor-pointer hover:text-blue-600">
          {post.likes?.length || 0} likes
        </span>
        <span onClick={() => setCommentsModal(true)} className="cursor-pointer hover:text-blue-600">
          {post.comments?.length || 0} comments
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-2 border-t pt-3">

        {/* LIKE */}
        <button
          onClick={handleLike}
          disabled={liking}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl ${
            isLiked ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
          }`}
        >
          {isLiked ? <AiFillHeart className="text-xl" /> : <AiOutlineHeart className="text-xl" />}
          Like
        </button>

        {/* COMMENT */}
        <button
          onClick={() => setCommentsModal(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100"
        >
          <AiOutlineComment className="text-xl" />
          Comment
        </button>

        {/* SHARE */}
        <button
          onClick={sharePost}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100"
        >
          <AiOutlineShareAlt className="text-xl" />
          Share
        </button>

      </div>

      {/* MODALS */}
      {likesModal && (
        <LikesModal likes={post.likedUsers || []} close={() => setLikesModal(false)} />
      )}

      {commentsModal && (
        <CommentsModal post={post} refresh={refresh} close={() => setCommentsModal(false)} />
      )}

      {editOpen && (
        <EditPostModal post={post} refresh={refresh} close={() => setEditOpen(false)} />
      )}
    </div>
  );
}
