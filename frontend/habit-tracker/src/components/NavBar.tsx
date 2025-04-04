import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaListCheck } from "react-icons/fa6";




const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto max-w-4xl px-4">
        {" "}

        <div className="flex justify-between items-center py-3">
          <FaListCheck className="text-blue-200 size-12"/>
          <Link
            to="/"
            className="text-4xl w-full text-transparent bg-clip-text font-extrabold bg-gradient-to-r  from-sky-500/100 to-white p-2"
          >
            Habit Tracker
          </Link>

          <div className="flex items-center gap-4">
            {" "}

            {user ? (
              <>
                {" "}

                <span className="text-white  text-sm hidden sm:block">
                  {" "}

                  Hi, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {" "}
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
