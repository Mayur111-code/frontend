import React from "react";
import { FiEdit2, FiTrash2, FiPlay } from "react-icons/fi";
import API from "../api/axios";

export default function PostGridItem({ post, onOpen, isOwner, refresh }) {

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/delete/${post._id}`);
      refresh();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onOpen();
  };

  const thumb = post.image || post.video || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const isVideo = post.video || (post.image && post.image.includes(".mp4"));

  return (
    <div 
      className="relative cursor-pointer group transform transition-all duration-300 hover:scale-[1.02]"
      onClick={onOpen}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
        <img 
          src={thumb} 
          alt="post" 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-2xl"></div>
        
        {/* Video indicator */}
        {isVideo && (
          <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white p-2 rounded-full">
            <FiPlay size={16} />
          </div>
        )}
        
        {/* Overlay actions, visible on hover */}
        {isOwner && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button 
              onClick={handleEditClick} 
              className="p-2 bg-white text-blue-600 rounded-xl shadow-lg hover:bg-blue-50 hover:scale-110 transition-all duration-200"
              title="Edit post"
            >
              <FiEdit2 size={16} />
            </button>
            <button 
              onClick={handleDelete} 
              className="p-2 bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200"
              title="Delete post"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        )}
        
        {/* Like/Comment count overlay */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-3 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {post.likes?.length > 0 && (
              <span>❤️ {post.likes.length}</span>
            )}
            {post.comments?.length > 0 && (
              <span>💬 {post.comments.length}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}