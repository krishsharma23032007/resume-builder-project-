import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GuruBadgeLogo } from "@/components/common/GuruBadgeLogo";
import { cn } from "@/lib/utils";

const sectionLinks = [
  { label: "Features", id: "features" },
  { label: "How it works", id: "how-it-works" }
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function goToSection(sectionId: string) {
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      window.setTimeout(() => scrollToSection(sectionId), 80);
      return;
    }

    navigate(`/#${sectionId}`, { replace: false });
    scrollToSection(sectionId);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="fixed top-0 z-40 w-full border-b-2 border-brutal-ink bg-brutal-yellow">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          className="flex min-w-0 items-center gap-3 font-display text-xl font-extrabold"
          onClick={closeMenu}
          to="/"
        >
          <GuruBadgeLogo />
          <span className="truncate">ResumeGuru</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {sectionLinks.map((link) => (
            <SectionButton
              isActive={location.hash === `#${link.id}`}
              key={link.id}
              label={link.label}
              onClick={() => goToSection(link.id)}
            />
          ))}
          <a className="text-sm font-extrabold text-brutal-ink hover:underline" href="mailto:resumeguru@gmail.com">
            Contact Us
          </a>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Link to="/login">
            <Button size="sm" variant="outline">
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Start Free Trial</Button>
          </Link>
        </div>

        <Button
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          className="sm:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          size="sm"
          type="button"
          variant="outline"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </nav>

      {isMenuOpen ? (
        <div className="border-t-2 border-brutal-ink bg-brutal-yellow px-4 py-4 sm:hidden">
          <div className="grid gap-3">
            {sectionLinks.map((link) => (
              <SectionButton
                className="justify-start"
                isActive={location.hash === `#${link.id}`}
                key={link.id}
                label={link.label}
                onClick={() => goToSection(link.id)}
              />
            ))}
            <a className="text-sm font-extrabold text-brutal-ink" onClick={closeMenu} href="mailto:resumeguru@gmail.com">
              Contact Us
            </a>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link onClick={closeMenu} to="/login">
                <Button className="w-full" size="sm" variant="outline">
                  Log in
                </Button>
              </Link>
              <Link onClick={closeMenu} to="/register">
                <Button className="w-full" size="sm">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function SectionButton({
  className,
  isActive,
  label,
  onClick
}: {
  className?: string;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex text-sm font-extrabold text-brutal-ink hover:underline",
        { underline: isActive },
        className
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
