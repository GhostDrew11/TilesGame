import { useCallback, useEffect, useState } from "react";

export const useGameTimer = (
  initialTimer: number,
  isActive: boolean,
  onTimeUp: () => void
) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimer);

  //
  useEffect(() => {
    if (!isActive) return;

    if (timeRemaining <= 0) {
      setTimeRemaining(0); // ensure no more negative countdown
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isActive, onTimeUp]);

  const resetTimer = useCallback((newTime: number) => {
    setTimeRemaining(newTime);
  }, []);

  return { timeRemaining, resetTimer };
};
