import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../api/axios";
import { toast } from "react-toastify";
import timeAgo from "../utils/timeAgo";
import { AiOutlineTeam, AiOutlineUser, AiOutlineCalendar, AiOutlineEdit, AiOutlineDelete, AiOutlineCheck, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector((s) => s.user.user);
  const authId = authUser?._id || localStorage.getItem("userId") || null;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openApply, setOpenApply] = useState(false);
  const [applyMsg, setApplyMsg] = useState("");
  const [applying, setApplying] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error("Load project error:", err);
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const deleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await API.delete(`/projects/delete/${id}`);
      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch (err) {
      console.error("Delete project error:", err);
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-6xl mb-4">🚫</div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Project not found</p>
          <button 
            onClick={() => navigate("/projects")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 w-full sm:w-auto"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const ownerId = project.owner && (project.owner._id || project.owner);
  const teamArr = project.team || [];
  const requestsArr = project.requests || [];
  const tagsArr = project.tags || [];

  const isOwner = authId && ownerId && (ownerId === authId);
  const isMember = authId && teamArr.some((m) => (m._id ? m._id === authId : m === authId));
  const hasApplied = authId && requestsArr.some((r) => {
    const ru = r.user;
    return ru && (ru._id ? ru._id === authId : ru === authId);
  });

  const handleOpenApply = () => {
    setApplyMsg("");
    setOpenApply(true);
  };

  const submitApply = async () => {
    if (!applyMsg.trim()) {
      toast.error("Please write a short message");
      return;
    }
    try {
      setApplying(true);
      await API.post(`/projects/apply/${id}`, { message: applyMsg });
      toast.success("Application sent successfully!");
      setOpenApply(false);
      await fetchProject();
    } catch (err) {
      console.error("Apply error:", err);
      toast.error(err?.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      setProcessingRequest(true);
      const { data } = await API.put(`/projects/accept/${id}/${requestId}`);
      toast.success("Request accepted successfully!");
      setProject(data.project || data);
    } catch (err) {
      console.error("Accept error:", err);
      toast.error(err?.response?.data?.message || "Failed to accept request");
    } finally {
      setProcessingRequest(false);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      setProcessingRequest(true);
      const { data } = await API.put(`/projects/reject/${id}/${requestId}`);
      toast.info("Request rejected");
      setProject(data.project || data);
    } catch (err) {
      console.error("Reject error:", err);
      toast.error(err?.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessingRequest(false);
    }
  };

  const removeUser = async (userId) => {
    if (!window.confirm("Remove this member from the project?")) return;

    try {
      await API.delete(`/projects/remove-member/${project._id}/${userId}`);
      toast.success("Member removed successfully");
      await fetchProject();
    } catch (err) {
      console.error("Remove member error:", err);
      toast.error("Failed to remove member");
    }
  };

  const formatTime = (t) => {
    try {
      return timeAgo(t);
    } catch {
      return new Date(t).toLocaleString();
    }
  };

  return (
    <div className="pt-20 px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-8">

      {/* Banner */}
      <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl mb-6 sm:mb-8">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-48 sm:h-56 md:h-64 object-cover" 
          />
        ) : (
          <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-2">🚀</div>
              <p className="text-gray-500 font-medium text-sm sm:text-base">Project Banner</p>
            </div>
          </div>
        )}
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 transform transition-all duration-300">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 break-words">
              {project.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              <div className="flex items-center gap-1 sm:gap-2">
                <AiOutlineUser className="text-blue-500 flex-shrink-0" />
                <Link 
                  to={`/profile/${ownerId}`}
                  className="hover:text-blue-600 transition-colors duration-200 font-medium truncate"
                >
                  {project.owner?.name || "User"}
                </Link>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <AiOutlineTeam className="text-purple-500 flex-shrink-0" />
                <span>{teamArr.length} team members</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <AiOutlineCalendar className="text-green-500 flex-shrink-0" />
                <span className="whitespace-nowrap">{formatTime(project.createdAt)}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {tagsArr.map?.((t, i) => (
                <span 
                  key={i} 
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl border border-blue-200 shadow-sm whitespace-nowrap"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            {!authId && (
              <div className="text-sm text-gray-500 px-3 py-2 text-center">Login to apply</div>
            )}

            {authId && isOwner && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate(`/projects/${project._id}/edit`)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base w-full sm:w-auto"
                >
                  <AiOutlineEdit className="text-lg" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={deleteProject}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base w-full sm:w-auto"
                >
                  <AiOutlineDelete className="text-lg" />
                  <span>Delete</span>
                </button>
              </div>
            )}

            {authId && !isOwner && (
              <div className="w-full sm:w-auto">
                {isMember ? (
                  <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base w-full">
                    <AiOutlineCheck className="text-lg" />
                    <span>Team Member</span>
                  </button>
                ) : hasApplied ? (
                  <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base w-full">
                    ⏳ <span>Applied</span>
                  </button>
                ) : (
                  <button
                    onClick={handleOpenApply}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base w-full"
                  >
                    <AiOutlinePlus className="text-lg" />
                    <span>Join Project</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 transform transition-all duration-300">
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
          About the Project
        </h3>
        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed break-words">
          {project.description}
        </p>
      </div>

      {/* Team Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 transform transition-all duration-300">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl">
            <AiOutlineTeam className="text-white text-xl sm:text-2xl" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Team Members
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">{teamArr.length} people working together</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {teamArr.map((m) => {
            const mid = m._id || m;
            return (
              <div 
                key={mid} 
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <Link to={`/profile/${mid}`} className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <img 
                      src={m.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow flex-shrink-0"
                      alt={m.name}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base hover:text-blue-600 transition-colors duration-200 truncate">
                        {m.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {m.skills?.slice?.(0, 2).join(", ") || "No skills listed"}
                      </p>
                    </div>
                  </Link>

                  {isOwner && (m._id !== ownerId) && (
                    <button
                      onClick={() => removeUser(mid)}
                      className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 ml-2"
                      title="Remove member"
                    >
                      <AiOutlineClose size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Owner-only: Requests Section */}
      {isOwner && requestsArr.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 transform transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg sm:rounded-xl">
              <span className="text-white text-xl sm:text-2xl">📨</span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Join Requests
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">{requestsArr.length} pending requests</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {requestsArr.map((r) => {
              const ru = r.user || {};
              const rid = r._id || r.id;
              const userId = ru._id || ru;
              return (
                <div 
                  key={rid} 
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 transform transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <Link to={`/profile/${userId}`} className="flex-shrink-0">
                        <img 
                          src={ru.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow"
                          alt={ru.name}
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                          <Link 
                            to={`/profile/${userId}`}
                            className="font-semibold text-gray-800 text-sm sm:text-base hover:text-blue-600 transition-colors duration-200 truncate"
                          >
                            {ru.name || "User"}
                          </Link>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            r.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-gray-100 text-gray-700'
                          } whitespace-nowrap`}>
                            {r.status}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-1 sm:mb-2 break-words">{r.message}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <AiOutlineCalendar className="flex-shrink-0" />
                          {formatTime(r.createdAt)}
                        </p>
                      </div>
                    </div>

                    {r.status === "pending" && (
                      <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => acceptRequest(rid)}
                          disabled={processingRequest}
                          className="p-1.5 sm:p-2 bg-green-100 text-green-600 rounded-lg sm:rounded-xl hover:bg-green-200 transition-all duration-200 transform hover:scale-110"
                          title="Accept request"
                        >
                          <AiOutlineCheck size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => rejectRequest(rid)}
                          disabled={processingRequest}
                          className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-200 transition-all duration-200 transform hover:scale-110"
                          title="Reject request"
                        >
                          <AiOutlineClose size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {openApply && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 px-3 sm:px-4 py-4 sm:py-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl w-full max-w-sm sm:max-w-lg transform transition-all duration-300 mx-3 sm:mx-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Join Project
              </h3>
              <button 
                onClick={() => setOpenApply(false)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200"
              >
                <AiOutlineClose size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                Introduce yourself and explain why you'd be a great fit for this project.
              </p>

              <textarea
                value={applyMsg}
                onChange={(e) => setApplyMsg(e.target.value)}
                rows={4}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 resize-none text-sm sm:text-base"
                placeholder="Hi, I'm interested in joining your project. I have experience in..."
              />

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={() => setOpenApply(false)}
                  className="flex-1 py-2.5 sm:py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={submitApply}
                  disabled={applying}
                  className="flex-1 py-2.5 sm:py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {applying ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send Request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}