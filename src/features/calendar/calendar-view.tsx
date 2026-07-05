"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMathStore } from "@/store/use-math-store";

export function CalendarView() {
  const { calendarEvents } = useMathStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <span className="text-xs text-white/35">Reviews, study blocks, and milestones</span>
      </CardHeader>
      <CardContent>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={new Date().toISOString().slice(0, 10)}
          height="auto"
          events={calendarEvents.map((event) => ({ id: event.id, title: event.title, date: event.date }))}
          headerToolbar={{ start: "title", center: "", end: "prev,next today" }}
        />
      </CardContent>
    </Card>
  );
}
