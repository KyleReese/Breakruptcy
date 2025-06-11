import React from "react";
import type { TimerBank } from "../types/timer";
import { formatTime } from "../utils/timer";

interface TimerDisplayProps {
  bank: TimerBank;
  onClick?: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  bank,
  onClick,
}) => {
  return (
    <div
      className={`
        p-8 m-4 border-4 rounded-xl text-center transition-all duration-200 ease-in-out
        ${
          bank.isActive
            ? "border-blue-500 bg-blue-50 cursor-pointer hover:bg-blue-100"
            : "border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100"
        }
        ${onClick ? "cursor-pointer" : "cursor-default"}
      `}
      onClick={onClick}
    >
      <h2
        className={`mb-4 text-2xl font-semibold ${
          bank.isActive ? "text-blue-500" : "text-gray-600"
        }`}
      >
        {bank.label}
      </h2>
      <div
        className={`text-5xl font-bold font-mono ${
          bank.isActive ? "text-blue-500" : "text-gray-600"
        }`}
      >
        {formatTime(bank.remaining)}
      </div>
    </div>
  );
};
