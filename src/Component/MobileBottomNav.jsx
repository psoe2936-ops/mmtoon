import { NavLink } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Books", to: "/book" },
  { label: "Search", to: "/search" },
  { label: "Library", to: "/login" },
];

const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-white/10 bg-black/60 p-2 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-xl px-2 py-2 text-center text-xs transition ${
                isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
