import React from "react";

const FilterButtons = ({ options, activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {options.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm ${
            activeFilter === key
              ? "bg-blue-500 text-white shadow-lg transform scale-105"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {React.createElement(icon, { size: 16 })}
          {label}
        </button>
      ))}
    </div>
  );
};

export default React.memo(FilterButtons);