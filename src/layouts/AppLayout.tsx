import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FileText, BriefcaseBusiness, Sparkles, LogOut } from "lucide-react";
import { appNavigation } from "@/data/navigation";
import { useAuth } from "@/context/AuthContext";
import { GuruBadgeLogo } from "@/components/common/GuruBadgeLogo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r bg-card lg:flex lg:flex-col">
        <Link
          className="flex h-16 items-center gap-3 border-b-2 border-brutal-ink px-6 font-display font-extrabold hover:bg-muted"
          to="/"
        >
          <GuruBadgeLogo size="sm" />
          ResumeGuru
        </Link>
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto" aria-label="Main navigation">
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

          {/* Resume Tools Section */}
          <div className="mt-4 pt-4 border-t">
            <p className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground">Resume Tools</p>

            <NavLink
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  { "bg-muted text-foreground": isActive }
                )
              }
              to="/ats-analysis"
            >
              <FileText size={18} />
              ATS Analysis
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  { "bg-muted text-foreground": isActive }
                )
              }
              to="/job-match"
            >
              <BriefcaseBusiness size={18} />
              Job Match
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  { "bg-muted text-foreground": isActive }
                )
              }
              to="/improve-bullet"
            >
              <Sparkles size={18} />
              Improve Bullet
            </NavLink>
          </div>
        </nav>

        {/* Logout at bottom */}
        <div className="border-t p-3">
          <Button aria-label="Log out" onClick={handleLogout} size="sm" variant="outline" className="w-full">
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
      <main className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
          <Link className="flex items-center gap-2 lg:hidden" to="/">
            <GuruBadgeLogo size="sm" />
            <span className="font-display font-extrabold">ResumeGuru</span>
          </Link>
          <div className="hidden lg:block">
            <p className="text-sm font-medium">{user?.name ?? "Guest"}</p>
            <p className="text-xs text-muted-foreground">AI resume workspace</p>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
