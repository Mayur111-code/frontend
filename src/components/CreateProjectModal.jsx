import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { AiOutlineClose, AiOutlineCamera, AiOutlineProject, AiOutlineTeam } from "react-icons/ai";

export default function CreateProjectModal({ close, refresh }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [close]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      // Validate file type
      if (!f.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (5MB max)
      if (f.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  const createProject = async () => {
    if (!title.trim() || !desc.trim()) {
      return toast.error("Title & description required");
    }
    if (!teamSize || teamSize < 1) {
      return toast.error("Please enter team size");
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", desc);
      form.append("tags", tags);
      form.append("teamSize", teamSize);
      if (file) form.append("file", file);

      await API.post("/projects/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Project created successfully!");
      refresh();
      close();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Project creation failed");
    }
    setLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4 py-4 md:py-8 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 my-auto max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg md:rounded-xl">
              <AiOutlineProject className="text-white text-lg md:text-xl" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Project
            </h2>
          </div>
          <button
            className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg md:rounded-xl transition-all duration-200"
            onClick={close}
            aria-label="Close modal"
          >
            <AiOutlineClose size={isMobile ? 20 : 24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4 md:p-6">
            {/* Image Upload - FIXED VISIBILITY */}
            <div className="flex flex-col items-center mb-4 md:mb-6">
              <label className="cursor-pointer group relative">
                <div className="relative">
                  <img
                    src={
                      preview ||
                      "https://cdn-icons-png.flaticon.com/512/4211/4211763.png"
                    }
                    className="w-28 h-28 md:w-32 md:h-32 rounded-xl md:rounded-2xl object-cover border-4 border-white shadow-lg group-hover:border-blue-200 transition-all duration-300 bg-gray-100"
                    alt="Project thumbnail"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/4211/4211763.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl md:rounded-2xl transition-all duration-300 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <AiOutlineCamera className="w-6 h-6 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1" />
                      <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                        Change Image
                      </span>
                    </div>
                  </div>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFile} 
                  accept="image/*" 
                />
              </label>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {preview ? "Click to change image" : "Click to upload project thumbnail"}
              </p>
              {preview && (
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="text-xs text-red-500 mt-1 hover:text-red-700 transition-colors"
                >
                  Remove Image
                </button>
              )}
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                Project Title
              </label>
              <input
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-sm md:text-base"
                placeholder="Enter project title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {title.length}/100 characters
                </p>
                {title.length > 80 && (
                  <p className="text-xs text-red-500">
                    {title.length > 95 ? 'Too long' : 'Getting long'}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                Description
              </label>
              <textarea
                rows={isMobile ? 3 : 4}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 resize-none text-sm md:text-base"
                placeholder="Describe your project goals, technologies, and what you're looking for in team members..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                maxLength={500}
              ></textarea>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {desc.length}/500 characters
                </p>
                {desc.length > 0 && (
                  <p className={`text-xs ${
                    desc.length > 400 ? 'text-red-500' : 
                    desc.length > 100 ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {desc.length > 400 ? 'Too long' : 
                     desc.length > 100 ? 'Good length' : 'Too short'}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                Tags
              </label>
              <input
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-sm md:text-base"
                placeholder="react, nodejs, mongodb, javascript..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas
              </p>
            </div>

            {/* Team Size */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base flex items-center gap-2">
                <AiOutlineTeam className="text-blue-500" /> 
                Team Size
              </label>
              <input
                type="number"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-sm md:text-base"
                placeholder="Enter team size (e.g., 5)"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                min="1"
                max="50"
              />
              <p className="text-xs text-gray-500 mt-1">
                How many team members are you looking for?
              </p>
            </div>

            {/* Buttons - Stack on mobile */}
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
              <button
                onClick={close}
                disabled={loading}
                className={`py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg md:rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                  isMobile ? 'w-full' : 'flex-1'
                }`}
              >
                Cancel
              </button>
              <button
                disabled={loading || !title.trim() || !desc.trim() || !teamSize}
                onClick={createProject}
                className={`py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg md:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  isMobile ? 'w-full' : 'flex-1'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                    <span className="text-sm md:text-base">Creating...</span>
                  </div>
                ) : (
                  <>
                    <AiOutlineProject size={isMobile ? 16 : 18} />
                    <span className="text-sm md:text-base">Create Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}