import React from "react";

interface StatTilesProps {
  stats: {
    dueThisWeek: number;
    overdue: number;
    nextExam?: { title: string; date: string };
    avgProgressPct: number;
  };
}

const StatTiles: React.FC<StatTilesProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-100 rounded-lg p-4 text-center">
        <div className="text-lg font-bold">{stats.dueThisWeek}</div>
        <div className="text-xs text-gray-700">Assignments due this week</div>
      </div>
      <div className="bg-red-100 rounded-lg p-4 text-center">
        <div className="text-lg font-bold">{stats.overdue}</div>
        <div className="text-xs text-gray-700">Overdue</div>
      </div>
      <div className="bg-purple-100 rounded-lg p-4 text-center">
        <div className="text-lg font-bold">{stats.nextExam ? stats.nextExam.title : "—"}</div>
        <div className="text-xs text-gray-700">Next exam</div>
        <div className="text-xs text-gray-500">{stats.nextExam ? stats.nextExam.date : ""}</div>
      </div>
      <div className="bg-green-100 rounded-lg p-4 text-center">
        <div className="text-lg font-bold">{stats.avgProgressPct.toFixed(1)}%</div>
        <div className="text-xs text-gray-700">Overall progress avg</div>
      </div>
    </div>
  );
};

export default StatTiles;
