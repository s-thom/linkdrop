import { useCallback, useEffect, useRef } from "react";

interface Umami {
  track: (name: string, data?: any) => void;
}

declare global {
  interface Window {
    umami: Umami | undefined;
  }
}

export interface EventData {
  name: string;
  data?: unknown;
}

export function event(data: EventData) {
  if (typeof window === "undefined" || typeof window.umami === "undefined") {
    return;
  }

  window.umami.track(data.name, data.data ?? ({} as any));
}

/**
 * Returns a stable callback reference that will fire events with whatever the latest data is
 * @param data Event data
 * @returns Memoised event callback
 */
export function useEventCallback(data: EventData) {
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  return useCallback(() => event({ ...dataRef.current }), []);
}
