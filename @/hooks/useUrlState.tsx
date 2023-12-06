import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fetch = (param: string) => {
    const params = new URLSearchParams(searchParams)
    return params.get(param)
  }

  const update = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      router.push(pathname + '?' + params.toString())
    },
    [searchParams]
  )

  return {
    fetch,
    update
  }
}


