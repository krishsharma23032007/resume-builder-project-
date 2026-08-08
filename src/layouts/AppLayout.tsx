import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FileText, BriefcaseBusiness, Sparkles, LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { appNavigation } from "@/data/navigation";
import { useAuth } from "@/context/AuthContext";
import { GuruBadgeLogo } from "@/components/common/GuruBadgeLogo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

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

            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setExpandedTool(expandedTool === "ats" ? null : "ats")}
              type="button"
            >
              <FileText size={18} />
              <span className="flex-1 text-left">ATS Analysis</span>
              {expandedTool === "ats" ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {expandedTool === "ats" && (
              <div className="ml-6 mr-2 mb-2 rounded-lg border bg-background p-2 text-xs">
                <p className="text-muted-foreground">Upload a PDF resume to analyze ATS compatibility.</p>
                <Link to="/resume/new">
                  <Button size="sm" variant="outline" className="mt-2 w-full">Go to Builder</Button>
                </Link>
              </div>
            )}

            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setExpandedTool(expandedTool === "match" ? null : "match")}
              type="button"
            >
              <BriefcaseBusiness size={18} />
              <span className="flex-1 text-left">Job Match</span>
              {expandedTool === "match" ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {expandedTool === "match" && (
              <div className="ml-6 mr-2 mb-2 rounded-lg border bg-background p-2 text-xs">
                <p className="text-muted-foreground">Compare your resume against a job description.</p>
                <Link to="/resume/new">
                  <Button size="sm" variant="outline" className="mt-2 w-full">Go to Builder</Button>
                </Link>
              </div>
            )}

            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setExpandedTool(expandedTool === "bullet" ? null : "bullet")}
              type="button"
            >
              <Sparkles size={18} />
              <span className="flex-1 text-left">Improve Bullet</span>
              {expandedTool === "bullet" ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {expandedTool === "bullet" && (
              <div className="ml-6 mr-2 mb-2 rounded-lg border bg-background p-2 text-xs">
                <p className="text-muted-foreground">Enhance your experience bullet points with AI.</p>
                <Link to="/resume/new">
                  <Button size="sm" variant="outline" className="mt-2 w-full">Go to Builder</Button>
                </Link>
              </div>
            )}
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
