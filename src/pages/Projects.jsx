import { useEffect, useState } from "react";
import API from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import { AiOutlinePlus, AiOutlineProject } from "react-icons/ai";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  const loadProjects = async () => {
    try {
      const { data } = await API.get("/projects/all");
      setProjects(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading)
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading projects...</p>
        </div>
      </div>
    );

  return (
    <div className="pt-20 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-10">

      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 transform transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <AiOutlineProject className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Explore Projects
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Discover amazing projects and collaborate with others
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <AiOutlinePlus className="text-lg" />
            <span>Create Project</span>
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
            <p className="text-xs text-gray-500">Total Projects</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-gray-800">
              {projects.filter(p => p.team?.length >= p.teamSize).length}
            </p>
            <p className="text-xs text-gray-500">Full Projects</p>
          </div>
        </div>
      </div>

      {/* PROJECTS GRID */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center transform transition-all duration-300">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
            No Projects Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Be the first to create a project and start collaborating with others!
          </p>
          <button
            onClick={() => setOpenCreate(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <AiOutlinePlus className="text-lg" />
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} refresh={loadProjects} />
          ))}
        </div>
      )}

      {/* Load More Section for Future Pagination */}
      {projects.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Showing {projects.length} projects
          </p>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {openCreate && (
        <CreateProjectModal
          close={() => setOpenCreate(false)}
          refresh={loadProjects}
        />
      )}
    </div>
  );
}