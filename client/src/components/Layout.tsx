import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Map as MapIcon,
  History,
  Settings,
  Menu,
  X,
  ParkingSquare,
  Zap,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: MapIcon, label: "Map View", href: "/map" },
    { icon: History, label: "History", href: "/history" },
    { icon: Zap, label: "EV Stations", href: "/ev" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen w-full flex bg-background">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col px-4 py-5">

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-primary p-2.5 rounded-xl shadow-md shadow-primary/30">
              <ParkingSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              SpotLight <span className="text-primary">AI</span>
            </span>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer group relative",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-glow"
                        className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent rounded-xl"
                      />
                    )}
                    <Icon
                      className={cn(
                        "h-5 w-5 relative z-10 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                      )}
                    />
                    <span className="font-semibold relative z-10">
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* USER PROFILE */}
          <div className="mt-auto pt-5 border-t border-border">
            <div className="flex items-center gap-3 px-2">

              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                {user?.name?.[0] || "G"}
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "Not logged in"}
                </p>
              </div>

              {user && (
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-card border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <ParkingSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">
            SpotLight <span className="text-primary">AI</span>
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* MAIN CONTENT (SCROLL FIXED) */}
      <main className="flex-1 bg-background overflow-y-auto">
        <div className="min-h-full w-full px-4 py-6 pt-14 md:pt-6">
          {children}
        </div>
      </main>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
