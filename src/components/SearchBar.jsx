import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const handleSearch = async (text) => {
    setSearch(text);

    if (text.trim().length === 0) {
      setResults([]);
      setShowSearch(false);
      return;
    }

    try {
      const { data } = await API.get(`/search?q=${text}`);
      setResults(data);
      setShowSearch(true);
    } catch (err) {
      console.log(err);
      toast.error("Search failed. Please try again.");
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearch("");
    setResults([]);
    setShowSearch(false);
  };

  return (
    <div className="hidden md:block relative w-96" ref={searchRef}>
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search developers, projects, posts..."
          className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-2xl bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {showSearch && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl max-h-80 overflow-y-auto z-50 border border-gray-200/50">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FiSearch className="w-4 h-4" />
              Search Results
            </p>
          </div>

          {results.length === 0 ? (
            <div className="px-4 py-8 text-gray-500 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium text-gray-600">No results found</p>
              <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
            </div>
          ) : (
            results.map((u) => (
              <Link
                key={u._id}
                to={`/profile/${u._id}`}
                onClick={clearSearch}
                className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 border-b border-gray-100/50 last:border-b-0 group"
              >
                <img
                  src={u.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="w-12 h-12 rounded-full border-2 border-white shadow group-hover:scale-105 transition-transform duration-200"
                  alt={u.name}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {u.title || "Developer"} • {u.skills?.slice(0, 2).join(", ") || "No skills"}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}