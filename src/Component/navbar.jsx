import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { toAssetUrl } from "../utils/assetUrl";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { t, toggleLanguage } = useLanguage();
  const navItems = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.books"), to: "/book" },
    { label: t("nav.search"), to: "/search" },
    { label: t("nav.admin"), to: "/admin" },
  ];
  const visibleNavItems = navItems.filter((item) => item.to !== "/admin" || isAdmin);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center">
          <img src={toAssetUrl("/image.jpg-removebg-preview.png")} className="w-[5.6rem] cursor-pointer" alt="Logo" />
          <span className="-ml-3 text-lg font-bold tracking-wide text-white">InkVerse</span>
        </Link>

        <div className="hidden items-center gap-10 text-sm text-slate-300 md:flex">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition duration-300 ${isActive ? "text-white" : "hover:text-white"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleLanguage}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            {t("nav.language")}
          </button>

          {user ? (
            <button
              onClick={logout}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("nav.logout")}
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-black shadow-md transition hover:opacity-90"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-all duration-300 ${
              isMenuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all duration-300 ${
              isMenuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isMenuOpen ? "max-h-72" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-3 px-6 pb-6 text-slate-300">
          <button
            onClick={toggleLanguage}
            className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {t("nav.language")}
          </button>

          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `cursor-pointer py-2 transition duration-300 ${isActive ? "text-white" : "hover:text-white"}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {user ? (
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("nav.logout")}
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-center text-sm font-semibold text-black shadow-md transition hover:opacity-90"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
