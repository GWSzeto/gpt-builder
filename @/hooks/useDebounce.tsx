import { useRef, useEffect, useMemo } from "react"
import { debounce } from "@/lib/utils";

type Func = () => void;
export default function useDebounce(callback: Func) {
  const ref = useRef<Func>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, 1000);
  }, []);

  return debouncedCallback;
};
