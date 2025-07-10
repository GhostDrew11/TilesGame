import { useCallback, useEffect, useState } from "react";

export const useGameTimer = (
  initialTimer: number,
  isActive: boolean,
  onTimeUp: () => void
) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimer);
  const [isPaused, setIsPaused] = useState(false);

  //
  useEffect(() => {
    if (!isActive || isPaused) return;

    if (timeRemaining <= 0) {
      setTimeRemaining(0); // ensure no more negative countdown
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isActive, onTimeUp, isPaused]);

  const resetTimer = useCallback((newTime: number) => {
    setTimeRemaining(newTime);
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => setIsPaused(true), []);
  const resumeTimer = useCallback(() => setIsPaused(false), []);

  return { timeRemaining, resetTimer, pauseTimer, resumeTimer, isPaused };
};
