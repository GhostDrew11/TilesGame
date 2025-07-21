import { useCallback, useEffect, useState } from "react";

export const useGameTimer = (
  initialDuration: number,
  isActive: boolean,
  onTimeUp: () => void
) => {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

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
  }, [timeRemaining, isActive, onTimeUp]);

  const resetTimer = useCallback((newTime: number) => {
    setTimeRemaining(newTime);
  }, []);

  return { timeRemaining, resetTimer };
};
