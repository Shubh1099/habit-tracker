// client/src/App.tsx
import { useState, useEffect, useCallback } from "react";
import { Habit } from "./types";
import * as api from "./services/api";
import HabitList from "./components/HabitList";
import HabitForm from "./components/HabitForm";
import { PiListChecks } from "react-icons/pi";

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // --- Effect to apply theme class and save preference ---

  // --- Updated Effect for Initial Data Fetch with Delay ---
  useEffect(() => {
    let isMounted = true; // Flag to check if component is still mounted
    let loadingTimerId: NodeJS.Timeout | null = null; // To store timeout ID for cleanup

    const fetchAndLoad = async () => {
      const startTime = Date.now(); // Record start time
      // Ensure loading is true at the start of the fetch attempt
      // (safe even if initial state is true)
      if (isMounted) setLoading(true);
      if (isMounted) setError(null);

      try {
        const fetchedHabits = await api.getHabits();
        console.log(
          "[App] Fetched habits received from API:",
          JSON.stringify(fetchedHabits, null, 2)
        );
        if (isMounted) {
          setHabits(fetchedHabits); // Update habits if mounted
        }
      } catch (err) {
        console.error("[App] Error fetching habits:", err);
        if (isMounted) {
          setError("Failed to fetch habits. Is the backend server running?");
        }
      } finally {
        if (isMounted) {
          const endTime = Date.now();
          const elapsedTime = endTime - startTime;
          // Calculate how much *more* time we need to wait to reach 2000ms total
          const remainingTime = Math.max(0, 2000 - elapsedTime);
          console.log(
            `[App] Data fetch took ${elapsedTime}ms. Waiting additional ${remainingTime}ms.`
          );

          // Set a timeout to turn off loading only after the remaining time
          loadingTimerId = setTimeout(() => {
            // No need to check isMounted here, React handles state updates fine
            // after unmount, but check is harmless if preferred.
            setLoading(false);
            console.log(
              "[App] Minimum loading time elapsed. Setting loading=false."
            );
          }, remainingTime);
        }
      }
    };

    fetchAndLoad();

    // --- Cleanup Function ---
    // This runs if the component unmounts BEFORE the fetch/timer finishes
    return () => {
      isMounted = false; // Set flag
      if (loadingTimerId) {
        clearTimeout(loadingTimerId); // Clear the timer if it's still pending
        console.log("[App] Cleared loading timeout on unmount.");
      }
    };
  }, []); // Empty dependency array still ensures this runs only once on mount

  const handleAddHabit = useCallback(async (name: string) => {
    if (!name.trim()) {
      alert("Habit name cannot be empty.");
      return;
    }
    try {
      const newHabit = await api.createHabit(name);
      setHabits((prevHabits) => [newHabit, ...prevHabits]);
    } catch (err) {
      setError("Failed to add habit.");
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
      } catch (err) {
        setError("Failed to delete habit.");
        console.error(err);
        setHabits(originalHabits);
      }
    },
    [habits]
  );

  const handleToggleCompletion = useCallback(
    async (id: string, dateString: string) => {
      console.log(
        `[App] handleToggleCompletion called for habitId: ${id}, dateString: ${dateString}`
      ); // <-- Log 3: Check if handler is reached

      const originalHabits = [...habits]; // Keep for rollback

      // Note: Removed the optimistic update temporarily to simplify debugging
      // If the API call works, we can add it back later.

      try {
        console.log(
          `[App] Calling API: toggleHabitCompletion(${id}, ${dateString})`
        ); // <-- Log 4: Check before API call
        const updatedHabit = await api.toggleHabitCompletion(id, dateString);
        console.log("[App] API call successful. Response:", updatedHabit); // <-- Log 5: Check API response

        // Update state with response from API
        setHabits((prevHabits) =>
          prevHabits.map((habit) => (habit._id === id ? updatedHabit : habit))
        );
        console.log("[App] State updated with fetched habit."); // <-- Log 6: Check after state update
      } catch (err) {
        setError("Failed to update habit completion.");
        console.error("[App] Error in handleToggleCompletion:", err); // <-- Log 7: Check for errors
        setHabits(originalHabits); // Rollback UI on error
      }
    },
    [habits]
  ); // Dependency array

  // --- Render Logic with Tailwind CSS ---
  return (
    // or apply to body via index.css / useEffect
    <div className="container mx-auto max-w-4xl mt-8 px-4 font-sans">
      {/* Changed: Apply Tailwind dark mode classes */}
      <header className="flex justify-center items-center  text-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700 relative">
        {" "}
        {/* <img
          src={PiListChecks}
          alt="logo"
          className="size-15 pr-1.5 "
        /> */}
        <PiListChecks className="size-15 pr-3 text-blue-400" />
        {/* Added relative positioning */}
        <h1 className="text-5xl font-serif font-bold text-gray-800 dark:text-gray-100 text-shadow-white text-shadow-xs">
          Habit Tracker
        </h1>
      </header>
      <main>
        {/* Pass theme prop if needed, or rely on dark: variants */}
        <HabitForm onAddHabit={handleAddHabit} />

        {/* Changed: Apply Tailwind dark mode classes */}
        {loading && (
          <p className="text-center pt-60 text-4xl text-gray-400 my-4">
            Loading habits...
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
            {/* Use Fragment to group Form and List */}
            <HabitList
              habits={habits}
              onDeleteHabit={handleDeleteHabit}
              onToggleComplete={handleToggleCompletion}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
