import React, { useMemo } from "react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue,
  TooltipDataAttrs,
} from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import { Completion } from "../types";

interface HabitHeatmapProps {
  habitId: string;
  completions: Completion[];
  color: string;
  onToggleComplete: (id: string, dateString: string) => void | Promise<void>;
}

const getUTCDateString = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const HabitHeatmap: React.FC<HabitHeatmapProps> = ({
  habitId,
  completions,
  color,
  onToggleComplete,
}) => {
  const endDate = useMemo(() => {
    const today = new Date();
    const futureDate = new Date(today);

    futureDate.setDate(today.getDate() + 7);
    return futureDate;
  }, []);

  const startDate = useMemo(() => {
    const date = new Date(endDate);

    date.setMonth(date.getMonth() - 9);
    date.setDate(1);
    return date;
  }, [endDate]);

  const getTooltipDataAttrs = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ): TooltipDataAttrs => {
    if (!value || !value.date) {
      return {
        "data-tooltip-id": "heatmap-tooltip",
        "data-tooltip-content": undefined,
      } as TooltipDataAttrs;
    }

    const dateStr = new Date(value.date + "T00:00:00.000Z").toLocaleDateString(
      "en-US",
      { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }
    );

    return {
      "data-tooltip-id": "heatmap-tooltip",
      "data-tooltip-content": `${dateStr}`,
    } as TooltipDataAttrs;
  };

  const completedDatesMap = useMemo(() => {
    const map = new Map<string, boolean>();
    completions.forEach((comp) => {
      try {
        const dateObj = new Date(comp.date);
        if (!isNaN(dateObj.getTime())) {
          map.set(getUTCDateString(dateObj), true);
        }
      } catch (e) {
        console.error("Error parsing completion date:", comp.date, e);
      }
    });
    return map;
  }, [completions]);

  const heatmapValues = useMemo(() => {
    const values: ReactCalendarHeatmapValue<string>[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = getUTCDateString(currentDate);
      values.push({
        date: dateStr,
        count: completedDatesMap.has(dateStr) ? 1 : 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return values;
  }, [completedDatesMap, startDate, endDate]);

  const getClassForValue = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ): string => {
    if (!value || !value.count || value.count === 0) {
      return "color-empty";
    }
    return "color-filled";
  };

  const handleDayClick = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ) => {
    console.log("[HabitHeatmap] handleDayClick triggered. Value:", value);

    if (value && value.date) {
      const todayUTC = new Date();

      todayUTC.setUTCHours(0, 0, 0, 0);

      const clickedDate = new Date(value.date + "T00:00:00.000Z");

      if (clickedDate > todayUTC) {
        alert("Cannot mark future dates!");
        return;
      }

      onToggleComplete(habitId, value.date);
    }
  };

  return (
    <div
      className="habit-heatmap"
      style={{ "--habit-color": color } as React.CSSProperties}
    >
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={heatmapValues as ReactCalendarHeatmapValue<string>[]}
        classForValue={getClassForValue}
        onClick={handleDayClick}
        tooltipDataAttrs={getTooltipDataAttrs}
        showWeekdayLabels={true}
        weekdayLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        showMonthLabels={true}
      />
      <Tooltip id="heatmap-tooltip" place="top" />
    </div>
  );
};

export default HabitHeatmap;
