import type { SerializeFrom } from "@remix-run/node";
import type { getCountUserLinksGroupedByDay } from "~/models/link.server";

export interface GridChartProps {
  countLinksGroupedByDay: SerializeFrom<
    Awaited<ReturnType<typeof getCountUserLinksGroupedByDay>>
  >;
}

export function GridChart({ countLinksGroupedByDay }: GridChartProps) {
  console.log({ countLinksGroupedByDay });
  return null;
}
