import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null); // final image
  const [preview, setPreview] = useState(null); // preview UI

  // Load existing project
  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/projects/${id}`);

      setTitle(data.title);
      setDescription(data.description);
      setTags(data.tags.join(", "));
      setImage(data.image);
      setPreview(data.image);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setImage(f);
    setPreview(URL.createObjectURL(f));
  };

  const saveChanges = async () => {
    if (!title.trim() || !description.trim()) {
      return toast.error("Title & description required");
    }

    try {
      setSaving(true);

      let imageURL = preview;

      // If user selected a new file → Upload first
      if (image instanceof File) {
        const formData = new FormData();
        formData.append("file", image);

        const upload = await API.post("/upload/file", formData);
        imageURL = upload.data.url;
      }

      // Send update request
      await API.put(`/projects/update/${id}`, {
        title,
        description,
        tags,
        image: imageURL,
      });

      toast.success("Project updated!");
      navigate(`/projects/${id}`);

    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="pt-24 text-center">Loading...</div>;

  return (
    <div className="pt-24 max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>

      {/* BANNER UPLOAD */}
      <div className="mb-4 text-center">
        <label className="cursor-pointer">
          <img
            src={
              preview ||
              "https://cdn-icons-png.flaticon.com/512/4211/4211763.png"
            }
            alt="banner"
            className="w-full h-56 object-cover rounded-xl shadow"
          />
          <input type="file" className="hidden" onChange={handleFile} />
        </label>
        <p className="text-sm text-gray-500 mt-1">Click to change banner</p>
      </div>

      {/* TITLE */}
      <input
        className="w-full px-4 py-2 border rounded-lg mb-3"
        placeholder="Project title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* DESCRIPTION */}
      <textarea
        rows="4"
        className="w-full px-4 py-2 border rounded-lg mb-3"
        placeholder="Project description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      {/* TAGS */}
      <input
        className="w-full px-4 py-2 border rounded-lg mb-4"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          disabled={saving}
          onClick={saveChanges}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
