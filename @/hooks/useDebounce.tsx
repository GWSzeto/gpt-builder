import { useRef, useEffect, useCallback } from "react"
import { debounce } from "@/lib/utils";

type Func = (...args: any[]) => void;
export default function useDebounce(callback: Func) {
  const ref = useRef<Func>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(debounce((args: any) => {
    console.log("getting in here?")
    ref.current?.(args);
  }, 1000), []);

  return debouncedCallback;
};

