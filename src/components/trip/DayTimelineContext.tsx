import { createContext, useContext } from "react";
import type { RefObject } from "react";

export interface DayTimelineContextValue {
    lineRef: RefObject<HTMLDivElement | null>;
    onHover: (type: string, el: HTMLElement) => void;
    onLeave: () => void;
}

export const DayTimelineContext = createContext<DayTimelineContextValue | null>(null);

export function useDayTimeline() {
    return useContext(DayTimelineContext);
}
