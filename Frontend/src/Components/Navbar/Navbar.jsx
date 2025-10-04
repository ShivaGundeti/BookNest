import React, { useContext, useState, useEffect } from "react";
import { SunMedium, Moon, User, Menu, X } from "lucide-react";
import { Theme } from "../../Context/ThemeContext/ThemeContext";
import { authUtils } from "../../lib/api";
import { useNavigate, useLocation } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const { SwitchTheme, handleTheme } = useContext(Theme);

  const [profileOpen, setProfileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [selectNavItem, setSelectNavItem] = useState("Home");

  const userInitial = user?.Name ? user.Name.charAt(0).toUpperCase() : "U";

useEffect(() => {
  const path = location.pathname.toLowerCase();
  if (path.includes("mybooks")) setSelectNavItem("MyBooks");
  else setSelectNavItem("Home");

  setNavOpen(false);
  setProfileOpen(false);
}, [location.pathname]);


  const handleProfileClick = () => setProfileOpen((prev) => !prev);
  const toggleNavMenu = () => setNavOpen((prev) => !prev);

  const handleLogout = () => {
    authUtils.clearAuth();
    navigate("/auth/login");
  };

  const itemToPath = {
    Home: "/",
    MyBooks: "/Mybooks",
   
  };

  const handleNavItemClick = (item) => {
    const path = itemToPath[item] || "/";
    // update visual state immediately for snappy feedback
    setSelectNavItem(item);
    setNavOpen(false);
    navigate(path);
  };

  return (
    <nav
      className={`w-full shadow-md px-5 py-3 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${
        SwitchTheme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Logo */}
      <div
        className="font-bold text-xl sm:text-2xl cursor-pointer select-none"
        onClick={() => handleNavItemClick("Home")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") handleNavItemClick("Home"); }}
      >
        📚 BookNest
      </div>

      {/* Desktop Nav Items */}
      <div className="hidden md:flex gap-6 font-medium items-center">
        {["Home", "MyBooks"].map((item) => {
          const isActive = selectNavItem === item;
          return (
            <button
              key={item}
              onClick={() => handleNavItemClick(item)}
              className={`px-3 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                isActive
                  ? "bg-blue-500 text-white"
                  : SwitchTheme === "dark"
                  ? "hover:bg-gray-800 text-gray-200"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 relative">
        {/* Theme Toggle */}
        <button
          onClick={handleTheme}
          className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            SwitchTheme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200 text-gray-900"
          }`}
          aria-label="Toggle theme"
        >
          {SwitchTheme === "dark" ? (
            <SunMedium className="text-white" size={20} />
          ) : (
            <Moon className="text-gray-800" size={20} />
          )}
        </button>

        {/* Profile (Desktop & Tablet) */}
        <div className="relative hidden sm:block">
          <button
            onClick={handleProfileClick}
            className={`flex items-center gap-2 p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              SwitchTheme === "dark" ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-gray-900"
            }`}
            aria-haspopup="true"
            aria-expanded={profileOpen}
          >
            <User size={20} />
            <span>{user?.Name || "Guest"}</span>
          </button>

          {profileOpen && (
            <div
              className={`absolute right-0 mt-2 w-44 shadow-lg rounded-md overflow-hidden z-50 ${
                SwitchTheme === "dark" ? "bg-gray-900 border border-gray-700 text-gray-100" : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
            
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 transition-colors ${
                  SwitchTheme === "dark" ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-gray-900"
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleNavMenu}
          className={`md:hidden p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            SwitchTheme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200"
          }`}
          aria-label="Open menu"
          aria-expanded={navOpen}
        >
          {navOpen ? (
            <X size={22} className={SwitchTheme === "dark" ? "text-gray-200" : "text-gray-700"} />
          ) : (
            <Menu size={22} className={SwitchTheme === "dark" ? "text-gray-200" : "text-gray-700"} />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {navOpen && (
        <div
          className={`absolute top-full left-0 w-full flex flex-col md:hidden transition-all duration-300 ease-in-out shadow-md ${
            SwitchTheme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
          }`}
        >
          {["Home", "MyBooks"].map((item) => {
            const isActive = selectNavItem === item;
            return (
              <button
                key={item}
                onClick={() => handleNavItemClick(item)}
                className={`px-6 py-3 text-left font-medium transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : SwitchTheme === "dark"
                    ? "hover:bg-gray-800 text-gray-200"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                {item}
              </button>
            );
          })}

          {/* Profile in mobile dropdown */}
          <div
            className={`flex items-center justify-between px-6 py-3 border-t ${
              SwitchTheme === "dark" ? "border-gray-700" : "border-gray-200 text-gray-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold ${
                  SwitchTheme === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-900"
                }`}
              >
                {userInitial}
              </div>
              <div>
                <div className="font-medium">{user?.Name || "Guest"}</div>
                <div className="text-xs text-gray-500">{user?.Email}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="text-sm text-red-500 font-medium hover:underline">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
