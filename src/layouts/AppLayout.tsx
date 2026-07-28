import { NavLink, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { appNavigation } from "@/data/navigation";
import { useAuth } from "@/context/AuthContext";
import { GuruBadgeLogo } from "@/components/common/GuruBadgeLogo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="grid min-h-screen bg-muted/40 lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-3 border-b-2 border-brutal-ink px-6 font-display font-extrabold">
          <GuruBadgeLogo size="sm" />
          ResumeGuru
        </div>
        <nav className="space-y-1 p-3" aria-label="Main navigation">
          {appNavigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  { "bg-muted text-foreground": isActive }
                )
              }
              key={item.href}
              to={item.href}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
          <div>
            <p className="text-sm font-medium">{user?.name ?? "Guest"}</p>
            <p className="text-xs text-muted-foreground">AI resume workspace</p>
          </div>
          <div className="flex items-center gap-2">
            <Button aria-label="Log out" onClick={logout} size="sm" variant="outline">
              <LogOut size={16} />
            </Button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
