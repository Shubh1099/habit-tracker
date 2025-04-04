// client/src/components/HabitHeatmap.tsx
import React, { useMemo } from "react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue,
  TooltipDataAttrs, // Import the missing type
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
    const today = new Date(); // Today (e.g., Apr 4th)
    const futureDate = new Date(today);
    // Extend end date slightly into the future (e.g., 7 days)
    // This helps ensure the current week/month structure looks complete.
    futureDate.setDate(today.getDate() + 7);
    return futureDate; // End date is now ~ Apr 11th
  }, []);

  const startDate = useMemo(() => {
    // Calculate start date based on the NEW end date to keep duration similar
    const date = new Date(endDate); // Start from the calculated endDate
    // Go back roughly 9 months (adjust number as desired)
    date.setMonth(date.getMonth() - 9);
    date.setDate(1); // Start from the 1st of that month
    return date;
  }, [endDate]); // Recalculate if endDate changes (it won't after initial render here)
  // --- End Modified Date Range Calculation ---

  const getTooltipDataAttrs = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ): TooltipDataAttrs => {
    if (!value || !value.date) {
      // Return attributes, but undefined content - react-tooltip should ignore this
      return {
        "data-tooltip-id": "heatmap-tooltip",
        "data-tooltip-content": undefined,
      } as TooltipDataAttrs;
    }
    // Format the date nicely for the tooltip
    const dateStr = new Date(value.date + "T00:00:00.000Z").toLocaleDateString(
      "en-US",
      { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }
    );
    // Return the full object when tooltip should be shown
    return {
      "data-tooltip-id": "heatmap-tooltip",
      "data-tooltip-content": `${dateStr}`,
    } as TooltipDataAttrs;
  };

  // Create a map of completed dates for quick lookup
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

  // Generate all dates in the range, including empty ones
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
      // value.date is the 'YYYY-MM-DD' string

      // --- Corrected Date Comparison ---
      const todayUTC = new Date(); // Get current date/time
      // Set 'todayUTC' to represent midnight UTC of the current date
      todayUTC.setUTCHours(0, 0, 0, 0);

      // 'clickedDate' is already UTC midnight because we parse 'YYYY-MM-DD' + 'T00:00:00.000Z'
      const clickedDate = new Date(value.date + "T00:00:00.000Z");

      // Optional: Log dates for verification (both should be UTC midnight)

      // Compare UTC midnight to UTC midnight
      if (clickedDate > todayUTC) {
        alert("Cannot mark future dates!");
        return;
      }
      // --- End Corrected Date Comparison ---

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
