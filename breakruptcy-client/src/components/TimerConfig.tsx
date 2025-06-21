import React, { useState } from "react";
import type { TimerConfig, TimeInput } from "../types/timer";
import {
  millisecondsToTimeInput,
  timeInputToMilliseconds,
  validateTimeInput,
} from "../utils/timer";

interface TimerConfigProps {
  config: TimerConfig;
  onSave: (newConfig: TimerConfig) => void;
  onCancel: () => void;
}

const PRESETS = [
  {
    name: "Tim's Workday (4 Hr/4 Hr)",
    bank1: { hours: 4, minutes: 0, seconds: 0 },
    bank2: { hours: 4, minutes: 0, seconds: 0 },
  },
  {
    name: "Pomodoro (25/5)",
    bank1: { hours: 0, minutes: 25, seconds: 0 },
    bank2: { hours: 0, minutes: 5, seconds: 0 },
  },
  {
    name: "Work Block (50/10)",
    bank1: { hours: 0, minutes: 50, seconds: 0 },
    bank2: { hours: 0, minutes: 10, seconds: 0 },
  },
  {
    name: "Deep Work (90/15)",
    bank1: { hours: 1, minutes: 30, seconds: 0 },
    bank2: { hours: 0, minutes: 15, seconds: 0 },
  },
  {
    name: "Quick Sprint (15/3)",
    bank1: { hours: 0, minutes: 15, seconds: 0 },
    bank2: { hours: 0, minutes: 3, seconds: 0 },
  },
];

export const TimerConfigComponent: React.FC<TimerConfigProps> = ({
  config,
  onSave,
  onCancel,
}) => {
  const [bank1Time, setBank1Time] = useState<TimeInput>(
    millisecondsToTimeInput(config.bank1Duration)
  );
  const [bank2Time, setBank2Time] = useState<TimeInput>(
    millisecondsToTimeInput(config.bank2Duration)
  );
  const [bank1Label, setBank1Label] = useState(config.bank1Label);
  const [bank2Label, setBank2Label] = useState(config.bank2Label);
  const [errors, setErrors] = useState<{ bank1?: string; bank2?: string }>({});

  const handleTimeChange = (
    bankTime: TimeInput,
    setter: React.Dispatch<React.SetStateAction<TimeInput>>,
    field: keyof TimeInput,
    value: string
  ) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const maxValue = field === "hours" ? 99 : 59;
    const clampedValue = Math.min(numValue, maxValue);

    setter({
      ...bankTime,
      [field]: clampedValue,
    });
  };

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setBank1Time(preset.bank1);
    setBank2Time(preset.bank2);
    setErrors({});
  };

  const handleSave = () => {
    const bank1Error = validateTimeInput(bank1Time);
    const bank2Error = validateTimeInput(bank2Time);

    if (bank1Error || bank2Error) {
      setErrors({
        bank1: bank1Error || undefined,
        bank2: bank2Error || undefined,
      });
      return;
    }

    const newConfig: TimerConfig = {
      bank1Duration: timeInputToMilliseconds(bank1Time),
      bank2Duration: timeInputToMilliseconds(bank2Time),
      bank1Label: bank1Label.trim() || "Work",
      bank2Label: bank2Label.trim() || "Break",
    };

    onSave(newConfig);
  };

  const TimeInputFields: React.FC<{
    time: TimeInput;
    onChange: (field: keyof TimeInput, value: string) => void;
    error?: string;
    label: string;
  }> = ({ time, onChange, error, label }) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 min-w-0">
          <input
            type="number"
            min="0"
            max="99"
            value={time.hours}
            onChange={(e) => onChange("hours", e.target.value)}
            className="w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 text-lg font-mono"
          />
          <span className="ml-1 text-sm text-gray-500 font-medium">h</span>
        </div>
        <span className="text-gray-400 text-lg">:</span>
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 min-w-0">
          <input
            type="number"
            min="0"
            max="59"
            value={time.minutes}
            onChange={(e) => onChange("minutes", e.target.value)}
            className="w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 text-lg font-mono"
          />
          <span className="ml-1 text-sm text-gray-500 font-medium">m</span>
        </div>
        <span className="text-gray-400 text-lg">:</span>
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 min-w-0">
          <input
            type="number"
            min="0"
            max="59"
            value={time.seconds}
            onChange={(e) => onChange("seconds", e.target.value)}
            className="w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 text-lg font-mono"
          />
          <span className="ml-1 text-sm text-gray-500 font-medium">s</span>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 text-center bg-red-50 px-3 py-1 rounded">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-100/80 via-purple-50/90 to-pink-100/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl mx-4 border border-white/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl px-8 py-6">
          <h2 className="text-3xl font-bold">Configure Timer</h2>
          <p className="text-blue-100 mt-1">
            Customize your productivity sessions
          </p>
        </div>

        <div className="p-8">
          {/* Presets Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Quick Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-4 py-3 text-sm font-medium bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Bank 1 Configuration */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-blue-800 mb-3">
                    Bank 1 Label
                  </label>
                  <input
                    type="text"
                    value={bank1Label}
                    onChange={(e) => setBank1Label(e.target.value)}
                    placeholder="Work"
                    className="w-full px-4 py-3 text-lg border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                  />
                </div>
                <TimeInputFields
                  time={bank1Time}
                  onChange={(field, value) =>
                    handleTimeChange(bank1Time, setBank1Time, field, value)
                  }
                  error={errors.bank1}
                  label="Bank 1 Duration"
                />
              </div>
            </div>

            {/* Bank 2 Configuration */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-purple-800 mb-3">
                    Bank 2 Label
                  </label>
                  <input
                    type="text"
                    value={bank2Label}
                    onChange={(e) => setBank2Label(e.target.value)}
                    placeholder="Break"
                    className="w-full px-4 py-3 text-lg border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
                  />
                </div>
                <TimeInputFields
                  time={bank2Time}
                  onChange={(field, value) =>
                    handleTimeChange(bank2Time, setBank2Time, field, value)
                  }
                  error={errors.bank2}
                  label="Bank 2 Duration"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-8 py-3 text-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
