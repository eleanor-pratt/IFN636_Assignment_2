import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeProvider';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setOpen(false);
  };

  const closeMenu = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#658147] dark:bg-[#3F5A2B] text-white border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-14 flex items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-white/95 hover:text-white font-bold text-xl md:text-2xl font-['Roboto']"
          >
            Plant Nursery
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              role="switch"
              aria-checked={isDark}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="relative inline-flex h-9 w-16 items-center rounded-full
                         border border-white/30 bg-white/10 backdrop-blur
                         transition focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <span
                className="absolute inset-0 rounded-full
                           bg-gradient-to-r from-amber-200/30 via-yellow-300/30 to-yellow-400/30
                           dark:from-indigo-500/30 dark:via-violet-500/30 dark:to-fuchsia-500/30"
              />
              <span
                className={`absolute left-1 top-1 h-7 w-7 rounded-full shadow-lg
                            ring-2 transition-transform duration-300 ease-out
                            ${isDark ? "translate-x-7 bg-slate-900 ring-indigo-400/40" : "translate-x-0 bg-white ring-amber-300/60"}`}
              >
                <span className="absolute inset-0 grid place-items-center">
                  <svg
                    className={`h-4 w-4 text-amber-500 transition-all duration-300
                               ${isDark ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zM12 20a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1z" />
                  </svg>
                  <svg
                    className={`h-4 w-4 text-indigo-300 absolute transition-all duration-300
                               ${isDark ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </svg>
                </span>
              </span>
            </button>

            <button
              onClick={() => setOpen((s) => !s)}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg
                         border border-white/30 bg-white/10 hover:bg-white/20"
            >
              {open ? "✕" : "☰"}
            </button>

            <div className="hidden md:flex items-center gap-3 ml-2">
              {user ? (
                <>
                  {user.role === 1 && <Link to="/users">Users</Link>}
                  <Link to="/orders">Orders</Link>
                  <Link to="/plants">Plants</Link>
                  <Link to="/basket">Basket</Link>
                  <Link to="/profile">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="ml-1 h-9 px-4 rounded-[30px] bg-[#8CB369] text-black hover:bg-[#e8d174]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link
                    to="/register"
                    className="ml-1 h-9 px-4 py-1 rounded-[30px] bg-[#8CB369] text-black hover:bg-[#e8d174]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-3">
            <div className="mt-2 flex flex-col gap-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur p-2">
              {user ? (
                <>
                  {user.role === 1 && <Link to="/users" onClick={closeMenu}>Users</Link>}
                  <Link to="/orders" onClick={closeMenu}>Orders</Link>
                  <Link to="/plants" onClick={closeMenu}>Plants</Link>
                  <Link to="/basket" onClick={closeMenu}>Basket</Link>
                  <Link to="/profile" onClick={closeMenu}>Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="mt-1 block w-full text-left px-3 py-2 rounded-[30px] bg-[#8CB369] text-black hover:bg-[#e8d174]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}>Login</Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mt-1 block w-full text-left px-3 py-2 rounded-[30px] bg-[#8CB369] text-black hover:bg-[#e8d174]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
