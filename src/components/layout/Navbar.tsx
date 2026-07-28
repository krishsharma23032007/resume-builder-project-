import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { GuruBadgeLogo } from "@/components/common/GuruBadgeLogo";
import { cn } from "@/lib/utils";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Templates", href: "/templates" }
];

export function Navbar() {
  return (
    <header className="fixed top-0 z-40 w-full border-b-2 border-brutal-ink bg-brutal-yellow">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3 font-display text-xl font-extrabold" to="/">
          <GuruBadgeLogo />
          ResumeGuru
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <NavLink
              className={({ isActive }) =>
                cn("text-sm font-extrabold text-brutal-ink hover:underline", {
                  "underline": isActive
                })
              }
              key={link.href}
              to={link.href}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button size="sm" variant="outline">Log in</Button>
          </Link>
          <Link className="hidden sm:block" to="/register">
            <Button size="sm">Start Free Trial</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
