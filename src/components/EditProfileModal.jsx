import { useState } from "react";
import API from "../api/axios";
import { AiOutlineClose, AiOutlineCamera, AiOutlineUser, AiOutlineFileText, AiOutlineTool } from "react-icons/ai";

export default function EditProfileModal({ user, close }) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [skills, setSkills] = useState((user.skills || []).join(", "));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user.avatar || null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const save = async () => {
    try {
      setLoading(true);

      // Use multipart form to allow avatar via file
      const form = new FormData();
      form.append("name", name);
      form.append("bio", bio);
      form.append("skills", skills);
      if (file) form.append("file", file);

      await API.put("/user/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);
      close();

    } catch (err) {
      console.error(err);
      alert("Update failed");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
            onClick={close}
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <label className="cursor-pointer group relative">
              <div className="relative">
                <img
                  src={preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:border-blue-200 transition-all duration-300"
                  alt="Profile preview"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
                  <AiOutlineCamera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFile} 
              />
            </label>
            <p className="text-xs text-gray-500 mt-2 text-center">Click to change profile photo</p>
          </div>

          {/* Name Field */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <AiOutlineUser className="text-blue-500" />
              Full Name
            </label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your full name"
            />
          </div>

          {/* Bio Field */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <AiOutlineFileText className="text-purple-500" />
              Bio
            </label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 resize-none h-24"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Skills Field */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <AiOutlineTool className="text-green-500" />
              Skills
            </label>
            <input 
              value={skills} 
              onChange={(e) => setSkills(e.target.value)} 
              placeholder="JavaScript, React, Node.js, Python..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={close}
              className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
            
            <button
              onClick={save}
              disabled={loading}
              className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}