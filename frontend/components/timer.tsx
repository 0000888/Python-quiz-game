"use client";

import { useEffect, useRef } from "react";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isPaused: boolean;
  timeLeft: number;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
}

export function Timer({ duration, onTimeUp, isPaused, timeLeft, setTimeLeft }: TimerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, setTimeLeft]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, onTimeUp, setTimeLeft]);

  const percentage = (timeLeft / duration) * 100;
  const isLow = timeLeft <= 5;
  const isCritical = timeLeft <= 3;

  const getColor = () => {
    if (isCritical) return "text-destructive";
    if (isLow) return "text-warning";
    return "text-primary";
  };

  const getStrokeColor = () => {
    if (isCritical) return "stroke-destructive";
    if (isLow) return "stroke-warning";
    return "stroke-primary";
  };

  const getBgColor = () => {
    if (isCritical) return "bg-destructive/10";
    if (isLow) return "bg-warning/10";
    return "bg-primary/10";
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full p-1 ${getBgColor()} transition-colors duration-300`}>
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-border"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="264"
          strokeDashoffset={264 - (264 * percentage) / 100}
          className={`transition-all duration-1000 ease-linear ${getStrokeColor()}`}
        />
      </svg>
      <span className={`absolute text-lg font-bold font-mono ${getColor()} ${isCritical ? "animate-pulse" : ""}`}>
        {timeLeft}
      </span>
    </div>
  );
}
