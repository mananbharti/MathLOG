"use client";

import { useMathStore } from "@/store/use-math-store";
import { useMemo } from "react";

export function StudyHeatmap() {
  const { sessions } = useMathStore();

  const intensities = useMemo(() => {
    const arr = Array.from({ length: 56 }, () => 0);
    
    // Map dates to the last 56 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dayMap = new Map<number, number>();
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.endTime);
      sessionDate.setHours(0, 0, 0, 0);
      
      const diffTime = today.getTime() - sessionDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // If within last 56 days (index 55 is today, index 0 is 55 days ago)
      if (diffDays >= 0 && diffDays < 56) {
        const index = 55 - diffDays;
        // Cap intensity at 5 (roughly 5+ hours or multiple sessions)
        dayMap.set(index, Math.min(5, (dayMap.get(index) || 0) + session.durationMinutes / 30));
      }
    });

    // Fill the array
    dayMap.forEach((intensity, index) => {
      arr[index] = Math.ceil(intensity);
    });

    return arr;
  }, [sessions]);

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
      {intensities.map((level, index) => (
        <div
          key={index}
          className="h-4 rounded-[4px] border border-white/[0.04]"
          style={{
            background:
              level === 0
                ? "rgba(255,255,255,0.04)"
                : `rgba(${80 - level * 3}, ${145 + level * 18}, ${255 - level * 2}, ${0.16 + level * 0.16})`
          }}
        />
      ))}
    </div>
  );
}
