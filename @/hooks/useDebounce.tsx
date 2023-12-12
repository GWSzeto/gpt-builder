import { useRef, useEffect, useMemo } from "react"
import debounce from "lodash.debounce";

type Func = (...args: any[]) => void;
export default function useDebounce(callback: Func, ...args: any[]) {
  const ref = useRef<Func>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.(args);
    };

    return debounce(func, 1000);
  }, [args]);

  return debouncedCallback;
};
