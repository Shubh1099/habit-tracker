// client/src/pages/LoginPage.tsx
import React, { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Your auth context hook
import * as api from "../services/api"; // Your API service
import { User } from "../types"; // Import User type if needed for casting

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { login, user } = useAuth(); // Get login function and current user from context
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to redirect after login
  // If redirected from a protected route, 'from' will be in location state
  const from = location.state?.from?.pathname || "/"; // Default to dashboard

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Call the login API function
      const response = await api.loginUser({ email, password });

      // Prepare user data for the context (matching the User type)
      const userDataForContext: User = {
        _id: response._id,
        username: response.username,
        email: response.email,
        // Ensure all fields required by the User type are included
      };

      // Call the login function from AuthContext
      login(userDataForContext, response.token);

      // Redirect to the intended page (dashboard or where they came from)
      navigate(from, { replace: true }); // Use replace to avoid login page in history
    } catch (err: string | any) {
      // Catch errors from the API call
      console.error("Login failed:", err);
      // Display error message (try to use message from backend response)
      const message =
        err?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      {" "}
      {/* Adjust min-height based on navbar/footer */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Login to Your Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Display Error Message */}
          {error && (
            <p className="text-center text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 p-2 rounded">
              {error}
            </p>
          )}

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {/* Link to Register Page */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
