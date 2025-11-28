// Navbar.jsx - Updated with slanted cap logo
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );
  const [userProfile, setUserProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user profile data including profile picture
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.get("http://localhost:3000/api/user/information", {
            withCredentials: true,
          });
          setUserProfile(response.data.user);
        } catch (error) {
          console.log("Failed to fetch user profile for navbar:", error);
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user]);

  // Update user when auth state changes
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
      setUserProfile(null);
    }
    // close dropdown whenever login/logout happens
    setDropdownOpen(false);
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setUserProfile(null);
    navigate("/signin");
  };

  // Profile picture component
  const ProfilePicture = ({ user, userProfile, className }) => {
    const profilePicture = userProfile?.profile?.profilePicture;
    const userName = user?.name || "User";

    if (profilePicture) {
      return (
        <img
          src={`http://localhost:3000${profilePicture}`}
          alt="Profile"
          className={`${className} object-cover`}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      );
    }

    return (
      <div
        className={`${className} bg-indigo-500 flex items-center justify-center text-white font-bold`}
      >
        {userName.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section - with slanted graduation cap touching 'A' */}
<Link to="/" className="flex items-center space-x-2 relative">
  <div className="relative flex items-center">
    {/* Graduation Cap SVG positioned to touch the 'A' */}
    <svg
      className="absolute -top-3 -left-3 w-7 h-7 text-indigo-600 transform -rotate-25"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
      <path d="M11 12.84L3.41 9.09l-.91.41L11 13.84 19.5 9.5l-.9-.41L11 12.84z" />
    </svg>

    {/* Text */}
    <span className="text-2xl font-bold text-gray-800 ml-2">AlmaConnect.</span>
  </div>
</Link>


        {/* Menu */}
        <div className="hidden md:flex space-x-8 font-medium">
          <Link to="/" className="text-gray-800 hover:text-blue-600">
            Home
          </Link>
          <Link to="/alumnidirectory" className="text-gray-800 hover:text-blue-600">
            Alumni Directory
          </Link>
          <Link to="/news&events" className="text-gray-800 hover:text-blue-600">
            News & Events
          </Link>
          <Link to="/jobs" className="text-gray-800 hover:text-blue-600">
            Job Board
          </Link>

          {/* Show only if logged in */}
          {isAuthenticated && (
            <>
              <Link to="/donationpage" className="text-gray-800 hover:text-blue-600">
                Donate
              </Link>
              <Link to="/organize-event" className="text-gray-800 hover:text-blue-600">
                Organize Event
              </Link>
              <Link to="/leaderboard" className="text-gray-800 hover:text-blue-600">
                Leaderboard
              </Link>
            </>
          )}
        </div>

        {/* Auth / Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/signup"
                className="px-4 py-2 border rounded hover:bg-blue-600 hover:text-white transition"
              >
                Sign Up
              </Link>
              <Link
                to="/signin"
                className="px-4 py-2 border rounded hover:bg-blue-600 hover:text-white transition"
              >
                Log In
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Picture Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
              >
                <div className="relative">
                  <ProfilePicture
                    user={user}
                    userProfile={userProfile}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-indigo-300 transition-colors"
                  />
                  {/* Online indicator dot */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <ProfilePicture
                        user={user}
                        userProfile={userProfile}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg
                      className="mr-3 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    View Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="mr-3 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
