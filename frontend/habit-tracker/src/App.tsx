import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Habit Tracker App</h1>
      </div>
    </>
  );
}

export default App;
