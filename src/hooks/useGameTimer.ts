import { useCallback, useEffect, useState } from "react";

export const useGameTimer = (
  initialDuration: number,
  isActive: boolean,
  onTimeUp: () => void
) => {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isActive || isPaused || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isActive, isPaused, onTimeUp]);

  const resetTimer = useCallback((newTime: number) => {
    setTimeRemaining(newTime);
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => setIsPaused(true), []);
  const resumeTimer = useCallback(() => setIsPaused(false), []);

  return { timeRemaining, isPaused, resetTimer, pauseTimer, resumeTimer };
};
