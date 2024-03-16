"use client";
import { useCallback, useState } from "react";

export type UseDebouncerProps = {
  callback: (...args: any[]) => any;
  delay?: number;
};

const DEFAULT_TIMEOUT_DURATION = 1000;

function useDebouncer({
  callback,
  delay = DEFAULT_TIMEOUT_DURATION,
}: UseDebouncerProps) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  return (...args: any[]) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    setTimer(setTimeout(() => callback(...args), delay));
  };
}

export default useDebouncer;
