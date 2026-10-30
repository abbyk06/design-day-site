import { useEffect, useState } from "react";

export type DayType = 1 | 2;

/**
 * Tiny shared store for the day the visitor is currently viewing.
 *
 * GeneralSchedule writes to it when a day card is clicked, and
 * PresentationSchedules reads it to pick its default day filter. It lives at
 * module level, so no provider or parent component is needed.
 */
let currentDay: DayType = 1;
const listeners = new Set<(day: DayType) => void>();

export function setSelectedDay(day: DayType) {
  if (day === currentDay) return;
  currentDay = day;
  listeners.forEach((listener) => listener(day));
}

export function useSelectedDay(): [DayType, (day: DayType) => void] {
  const [day, setDay] = useState<DayType>(currentDay);

  useEffect(() => {
    listeners.add(setDay);
    // Catch any change that happened between first render and subscribing.
    setDay(currentDay);
    return () => {
      listeners.delete(setDay);
    };
  }, []);

  return [day, setSelectedDay];
}
