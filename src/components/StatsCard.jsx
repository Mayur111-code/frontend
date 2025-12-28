import React from "react";

const StatsCard = ({ title, value, color }) => {
  return (
    <div className={`bg-white/80 p-4 rounded-xl text-center shadow-sm border border-white/20`}>
      <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
      <div className="text-gray-600 text-sm">{title}</div>
    </div>
  );
};

export default React.memo(StatsCard);