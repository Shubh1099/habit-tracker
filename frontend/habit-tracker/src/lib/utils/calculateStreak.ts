// client/src/utils/calculateStreak.ts
import { Completion } from "../../types";

/**
 * Calculates the current streak for a habit based on completion dates.
 * Assumes completion dates are stored consistently (e.g., UTC midnight).
 * @param completions - Array of completion objects { date: string (ISO Format) }
 * @returns The current streak count (number).
 */
export const calculateStreak = (completions: Completion[]): number => {
  if (!completions || completions.length === 0) {
    return 0;
  }

  // 1. Create a Set of completion dates (YYYY-MM-DD strings) for fast lookups
  const completionDates = new Set<string>();
  completions.forEach((comp) => {
    try {
      // Ensure date is valid and convert to YYYY-MM-DD at UTC
      const dateObj = new Date(comp.date);
      if (!isNaN(dateObj.getTime())) {
        // Format to YYYY-MM-DD in UTC to avoid timezone shifts affecting the date part
        const year = dateObj.getUTCFullYear();
        const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed
        const day = dateObj.getUTCDate().toString().padStart(2, "0");
        completionDates.add(`${year}-${month}-${day}`);
      }
    } catch (e) {
      console.error("Error processing completion date:", comp.date, e);
    }
  });

  if (completionDates.size === 0) return 0; // No valid dates found

  // 2. Get today and yesterday's date strings (YYYY-MM-DD) in UTC
  const today = new Date();
  const todayUTCString = `${today.getUTCFullYear()}-${(today.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getUTCDate().toString().padStart(2, "0")}`;

  const yesterday = new Date(today);
  yesterday.setUTCDate(today.getUTCDate() - 1);
  const yesterdayUTCString = `${yesterday.getUTCFullYear()}-${(
    yesterday.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${yesterday.getUTCDate().toString().padStart(2, "0")}`;

  // 3. Check if today or yesterday was completed
  let currentStreak = 0;
  const currentDate = new Date(); // Start checking from today

  // Format currentDate to YYYY-MM-DD UTC for comparison
  let currentDateUTCString = `${currentDate.getUTCFullYear()}-${(
    currentDate.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate.getUTCDate().toString().padStart(2, "0")}`;

  // If today is not completed, the streak is 0 unless yesterday was the last completion
  if (!completionDates.has(todayUTCString)) {
    // If yesterday *was* completed, the potential streak starts from yesterday
    if (completionDates.has(yesterdayUTCString)) {
      currentStreak = 0; // Start counting from yesterday (which means today broke it)
      currentDate.setUTCDate(currentDate.getUTCDate() - 1); // Set checker to yesterday
      currentDateUTCString = yesterdayUTCString;
    } else {
      // Neither today nor yesterday completed, streak is 0
      return 0;
    }
  }

  // 4. Iterate backwards day by day
  while (completionDates.has(currentDateUTCString)) {
    currentStreak++;
    // Move to the previous day (UTC)
    currentDate.setUTCDate(currentDate.getUTCDate() - 1);
    // Update the comparison string for the new previous day
    currentDateUTCString = `${currentDate.getUTCFullYear()}-${(
      currentDate.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate
      .getUTCDate()
      .toString()
      .padStart(2, "0")}`;
  }

  return currentStreak;
};
