import { TRPCError } from "@trpc/server";

type CallProps = {
  url: string;
  method?: string;
  body?: object;
  apiKey: string;
}
export const call = async ({ url, method="GET", body={}, apiKey }: CallProps) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "OpenAI-Beta": "assistants=v1",
    }

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: res.statusText,
      });
    }
  } catch (error: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
}
