import React from "react";
import { FiCheck } from "react-icons/fi";

const steps = [
  { label: "Resume", path: "/upload" },
  { label: "Preferences", path: "/preferences" },
  { label: "Discover", path: "/swipe" },
  { label: "Tailor", path: "/tailor" },
  { label: "Apply", path: "/submit" },
];

export default function ProgressStepper({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-6">
      {steps.map((step, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep;

        return (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isComplete
                    ? "bg-accent-lime text-ink"
                    : isCurrent
                    ? "bg-accent-lime/20 text-accent-lime border-2 border-accent-lime"
                    : "bg-white/5 text-gray-500 border border-white/10"
                }`}
              >
                {isComplete ? <FiCheck size={14} /> : i + 1}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium ${
                  isCurrent ? "text-accent-lime" : isComplete ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-6 sm:w-12 h-px mt-[-18px] sm:mt-[-16px] ${
                  isComplete ? "bg-accent-lime" : "bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
