import React from "react";

interface ProgressBarProps {
  valuePct: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ valuePct }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-5 flex items-center">
      <div
        className="h-5 rounded-full bg-blue-500 flex items-center justify-center"
        style={{ width: `${Math.min(100, Math.max(0, valuePct))}%` }}
        aria-valuenow={valuePct}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      >
        <span className="text-xs text-white px-2 font-semibold">
          {valuePct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
