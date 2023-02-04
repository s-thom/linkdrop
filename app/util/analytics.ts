import { useCallback, useEffect, useRef } from "react";
import { useRoutePath } from "./useRoutePath";

export function pageView(path: string) {
  console.log({ e: "pageview", path });
  if (typeof umami === "undefined") {
    return;
  }

  umami.trackView(path);
}

export interface EventData {
  url?: string;
  name: string;
  data?: unknown;
}

export function event(data: EventData) {
  if (typeof umami === "undefined") {
    return;
  }

  umami.trackEvent(data.name, data.data ?? ({} as any), data.url);
}

/**
 * Returns a stable callback reference that will fire events with whatever the latest data is
 * @param data Event data
 * @returns Memoised event callback
 */
export function useEventCallback(
  data: Omit<EventData, "url"> & Partial<Pick<EventData, "url">>
) {
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const path = useRoutePath();
  const pathRef = useRef(path);
  useEffect(() => {
    pathRef.current = path;
  });

  return useCallback(
    () => event({ url: pathRef.current, ...dataRef.current }),
    []
  );
}
