import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ApplyModal from "./ApplyModal";
import { AiOutlineTeam, AiOutlineUser, AiOutlinePlus } from "react-icons/ai";

export default function ProjectCard({ project, refresh }) {
  const [openApply, setOpenApply] = useState(false);

  // Logged in user
  const authUser = JSON.parse(localStorage.getItem("user"));
  const authId = authUser?._id;

  // Checks
  const isOwner = authId === project.owner?._id;
  const isMember = project.team?.some((u) => u._id === authId);
  const isApplied = project.requests?.some((r) => r.user?._id === authId);
  const isFull = project.team?.length >= project.teamSize;

  const handleApplyClick = () => {
    if (isFull) {
      return toast.error("This project is already full!");
    }
    setOpenApply(true);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 w-full h-full flex flex-col">

      {/* PROJECT BANNER */}
      <Link to={`/projects/${project._id}`} className="block relative flex-shrink-0">
        {project.image ? (
          <img
            src={project.image}
            alt="project banner"
            className={`w-full h-40 sm:h-48 object-cover transition-transform duration-300 ${
              isFull ? "opacity-60 grayscale-10" : "hover:scale-105"
            }`}
          />
        ) : (
          <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">🚀</div>
              <p className="text-gray-500 font-medium text-xs sm:text-sm">Project Banner</p>
            </div>
          </div>
        )}

        {/* PROJECT FULL BADGE */}
        {isFull && (
          <span className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full shadow-lg whitespace-nowrap">
            FULL
          </span>
        )}
      </Link>

      {/* CONTENT */}
      <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3 flex-shrink-0">
          <Link to={`/projects/${project._id}`} className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300 line-clamp-2 break-words">
              {project.title}
            </h2>
          </Link>

          {/* Team Count */}
          <div className="flex items-center gap-1 text-gray-500 text-sm sm:text-base whitespace-nowrap flex-shrink-0">
            <AiOutlineTeam className="text-purple-500 flex-shrink-0" />
            <span className="font-medium">
              {project.team?.length || 0}/{project.teamSize || "?"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 mb-3 sm:mb-4 min-h-0">
          <p className="text-gray-600 leading-relaxed line-clamp-2 text-sm sm:text-base break-words">
            {project.description}
          </p>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 flex-shrink-0">
          <AiOutlineUser className="text-blue-500 flex-shrink-0" />
          <span>by</span>
          <Link
            to={`/profile/${project.owner?._id}`}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 truncate"
          >
            {project.owner?.name || "User"}
          </Link>
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 flex-shrink-0">
          {project.tags?.slice(0, 3).map((t, i) => (
            <span
              key={i}
              className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200 shadow-sm whitespace-nowrap flex-shrink-0"
            >
              #{t}
            </span>
          ))}
          {project.tags?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full flex-shrink-0">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* STATUS + APPLY BUTTON AREA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100 flex-shrink-0">

          {/* Status Badges */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {isOwner && (
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-sm whitespace-nowrap">
                Owner
              </span>
            )}

            {!isOwner && isMember && (
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-green-600 text-white text-xs font-semibold rounded-full shadow-sm whitespace-nowrap">
                Member
              </span>
            )}

            {!isOwner && !isMember && isApplied && (
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-yellow-500 text-white text-xs font-semibold rounded-full shadow-sm whitespace-nowrap">
                Applied
              </span>
            )}

            {isFull && (
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-600 text-white text-xs font-semibold rounded-full shadow-sm whitespace-nowrap">
                Full
              </span>
            )}
          </div>

          {/* APPLY BUTTON */}
          {!isOwner && !isMember && !isApplied && !isFull && (
            <button
              onClick={handleApplyClick}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap mt-2 sm:mt-0"
            >
              <AiOutlinePlus size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>Apply</span>
            </button>
          )}
        </div>
      </div>

      {/* APPLY MODAL */}
      {openApply && (
        <ApplyModal
          projectId={project._id}
          close={() => setOpenApply(false)}
          refresh={refresh}
        />
      )}
    </div>
  );
}