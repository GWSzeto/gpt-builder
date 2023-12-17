import { useRef, useEffect, useCallback } from "react"
import { debounce } from "@/lib/utils";

type Func = (...args: any[]) => any;
export default function useDebounce(callback: Func) {
  const ref = useRef<Func>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(debounce((args: any) => {
    ref.current?.(args);
  }, 1000), []);

  return debouncedCallback;
};

