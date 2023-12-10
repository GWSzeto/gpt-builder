import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("apiKey-storage-event", callback);
  return () => {
    window.removeEventListener("apiKey-storage-event", callback);
  };
}

function getSnapshot() {
  return localStorage.getItem("openai-api-key");
}

export default function useApiKeyStorage() {
  const apiKey = useSyncExternalStore(subscribe, getSnapshot, () => undefined);

  const setApiKey = (newApiKey: string) => {
    localStorage.setItem("openai-api-key", newApiKey);
    //The event name has to match the eventListeners defined in the subscribe function
    window.dispatchEvent(new StorageEvent("apiKey-storage-event"));
  };

  return [apiKey, setApiKey] as const;
};
