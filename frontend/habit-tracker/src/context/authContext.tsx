// client/src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import {User} from "../types"


// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean; // To handle initial loading of auth state
  login: (userData: User, token: string) => void;
  logout: () => void;
  register: (userData: User, token: string) => void; // Similar to login
}

// Create the context
// Initialize with undefined or a default structure matching AuthContextType
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true

  // Check localStorage for existing auth state on initial load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser)); // Parse stored user string
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage", error);
      // Clear potentially corrupted storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    } finally {
      setIsLoading(false); // Finished loading initial auth state
    }
  }, []); // Run only once on mount

  // Login function
  const login = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("authToken", jwtToken);
    console.log("[AuthContext] User logged in:", userData);
  };

  // Register function (similar to login after successful registration)
  const register = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("authToken", jwtToken);
    console.log("[AuthContext] User registered and logged in:", userData);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    console.log("[AuthContext] User logged out");
    // Optional: Redirect here or where logout is called
    // navigate('/login'); // If using useNavigate hook from react-router-dom
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      logout,
      register,
    }),
    [user, token, isLoading]
  ); // Dependencies for memoization

  // Don't render children until initial auth check is complete
  // You could show a global spinner here instead of null
  if (isLoading) {
    return null; // Or <GlobalSpinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context easily
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
