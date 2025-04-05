import { Completion } from "../../types";

export const calculateStreak = (completions: Completion[]): number => {
  if (!completions || completions.length === 0) {
    return 0;
  }
  const completionDates = new Set<string>();
  completions.forEach((comp) => {
    try {

      const dateObj = new Date(comp.date);
      if (!isNaN(dateObj.getTime())) {

        const year = dateObj.getUTCFullYear();
        const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = dateObj.getUTCDate().toString().padStart(2, "0");
        completionDates.add(`${year}-${month}-${day}`);
      }
    } catch (e) {
      console.error("Error processing completion date:", comp.date, e);
    }
  });

  if (completionDates.size === 0) return 0;
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

  let currentStreak = 0;
  const currentDate = new Date();

  let currentDateUTCString = `${currentDate.getUTCFullYear()}-${(
    currentDate.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate.getUTCDate().toString().padStart(2, "0")}`;

  if (!completionDates.has(todayUTCString)) {

    if (completionDates.has(yesterdayUTCString)) {
      currentStreak = 0;
      currentDate.setUTCDate(currentDate.getUTCDate() - 1);
      currentDateUTCString = yesterdayUTCString;
    } else {
   
      return 0;
    }
  }


  while (completionDates.has(currentDateUTCString)) {
    currentStreak++;

    currentDate.setUTCDate(currentDate.getUTCDate() - 1);
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
