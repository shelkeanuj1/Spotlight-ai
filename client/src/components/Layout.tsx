import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Map as MapIcon, History, Settings, Menu, X, ParkingSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: MapIcon, label: "Map View", href: "/map" },
    { icon: History, label: "History", href: "/history" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <ParkingSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">SpotLight AI</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 h-full flex flex-col">
          <div className="hidden md:flex items-center gap-2 mb-10 px-2">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <ParkingSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">SpotLight AI</span>
          </div>

          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  )}>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-glow"
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50"
                      />
                    )}
                    <Icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110 relative z-10", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                    <span className="font-semibold relative z-10">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex items-center gap-3 px-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">Premium Member</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-65px)] md:h-screen overflow-hidden bg-background/50">
        <div className="h-full w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
