import { useState, useEffect, useCallback } from "react";

import { Habit } from "../types";
import * as api from "../services/api";
import HabitList from "../components/HabitList";
import HabitForm from "../components/HabitForm";

function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Updated Effect for Initial Data Fetch with Delay ---
  useEffect(() => {
    const isMounted = true;
    let loadingTimerId: ReturnType<typeof setTimeout> | null = null;
    console.log("[DashboardPage] Fetching habits effect running.");

    const fetchAndLoad = async () => {
      const startTime = Date.now();
      if (isMounted) setLoading(true);
      if (isMounted) setError(null);

      try {
        const fetchedHabits = await api.getHabits();
        if (isMounted) {
          setHabits(fetchedHabits);
        }
      } catch (err: unknown) {
        console.error("[DashboardPage] Error fetching habits:", err);
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to add habit.";
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          const endTime = Date.now();
          const elapsedTime = endTime - startTime;
          const remainingTime = Math.max(0, 2000 - elapsedTime);
          loadingTimerId = setTimeout(() => {
            setLoading(false);
          }, remainingTime);
        }
      }
    };

    fetchAndLoad();

    return () => {
      if (loadingTimerId) {
        clearTimeout(loadingTimerId);
      }
    };
  }, []);

  const handleAddHabit = useCallback(async (name: string) => {
    if (!name.trim()) {
      alert("Habit name cannot be empty.");
      return;
    }
    try {
      const newHabit = await api.createHabit(name);
      setHabits((prevHabits) => [newHabit, ...prevHabits]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add habit.";
      setError(errorMessage);
      console.error(err);
    }
  }, []);

  const handleDeleteHabit = useCallback(
    async (id: string) => {
      const originalHabits = [...habits];
      try {
        setHabits((prevHabits) =>
          prevHabits.filter((habit) => habit._id !== id)
        );
        await api.deleteHabit(id);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add habit.";
        setError(errorMessage);
        console.error(err);
        setHabits(originalHabits);
      }
    },
    [habits]
  );

  const handleToggleCompletion = useCallback(
    async (id: string, dateString: string) => {
      console.log("[DashboardPage] handleToggleCompletion called");
      const originalHabits = [...habits];
      try {
        const updatedHabit = await api.toggleHabitCompletion(id, dateString);
        setHabits((prevHabits) =>
          prevHabits.map((habit) => (habit._id === id ? updatedHabit : habit))
        );
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add habit.";
        setError(errorMessage);
        console.error(err);
        setHabits(originalHabits);
      }
    },
    [habits]
  );

  return (
    <>
      {" "}
      <header className="text-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-100">My Habits</h1>{" "}
      </header>
      <main>
        <HabitForm onAddHabit={handleAddHabit} />
        {loading && (
          <p className="text-center text-5xl pt-50 text-gray-500 dark:text-gray-400 my-4">
            Loading Habits...
          </p>
        )}
        {!loading && error && (
          <p
            className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4 text-center"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {" "}
            <HabitList
              habits={habits}
              onDeleteHabit={handleDeleteHabit}
              onToggleComplete={handleToggleCompletion}
            />
          </>
        )}
      </main>
    </>
  );
}
export default DashboardPage;
