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
        relative p-8 m-2 rounded-3xl text-center transition-all duration-300 ease-in-out transform hover:scale-105
        ${
          bank.isActive
            ? "bg-white/90 backdrop-blur-sm border-2 border-blue-300 shadow-xl shadow-blue-100/50"
            : "bg-white/60 backdrop-blur-sm border-2 border-gray-200 shadow-lg hover:shadow-xl"
        }
        ${onClick ? "cursor-pointer" : "cursor-default"}
        min-w-[280px] min-h-[200px] flex flex-col justify-center
      `}
      onClick={onClick}
    >
      <h2
        className={`mb-6 text-2xl font-semibold ${
          bank.isActive ? "text-blue-600" : "text-gray-600"
        }`}
      >
        {bank.label}
      </h2>

      <div
        className={`text-6xl font-bold font-mono leading-none ${
          bank.isActive ? "text-gray-800" : "text-gray-500"
        }`}
      >
        {formatTime(bank.remaining)}
      </div>

      {/* Bottom accent */}
      <div
        className={`mt-6 h-1 w-16 mx-auto rounded-full ${
          bank.isActive ? "bg-blue-500" : "bg-gray-300"
        }`}
      ></div>
    </div>
  );
};
