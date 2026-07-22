import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, Calendar, Package, UserRound, LogOut, ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/account", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/account/appointments", label: "My appointments", icon: Calendar },
  { to: "/account/orders", label: "My orders", icon: Package },
  { to: "/account/profile", label: "Profile", icon: UserRound },
];

export default function PortalLayout() {
  const { user, signOut } = useAuth();

  return (
    <div style={{ background: "#FFF9FB", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <Link to="/" style={{ color: "#8A757C" }} className="text-xs flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft size={14} /> Back to site
        </Link>

        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          <aside>
            <div style={{ background: "#FFFFFF", border: "1px solid #F2E1E7" }} className="rounded-2xl p-5 mb-4">
              <div style={{ background: "#F2C9D8" }} className="w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <UserRound size={20} color="#8A4560" />
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#3B2E36" }} className="text-sm">{user?.fullName || "Guest"}</p>
              <p style={{ color: "#8A757C" }} className="text-xs mt-0.5">Member since {user?.memberSince || "recently"}</p>
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors duration-150"
                  style={({ isActive }) =>
                    isActive
                      ? { background: "linear-gradient(90deg,#C2698A,#8A4560)", color: "#FFF9FB" }
                      : { color: "#5A4650" }
                  }
                >
                  <item.icon size={16} /> {item.label}
                </NavLink>
              ))}
              <button onClick={signOut} style={{ color: "#8A757C" }} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm mt-2">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </aside>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}