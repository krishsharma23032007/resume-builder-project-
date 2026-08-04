import {
  BarChart3,
  FileText,
  FileSignature,
  LayoutTemplate,
  Settings,
  Sparkles
} from "lucide-react";

export const appNavigation = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Resumes", href: "/resumes", icon: FileText },
  { label: "Builder", href: "/resume/new", icon: Sparkles },
  { label: "Cover Letter", href: "/cover-letter", icon: FileSignature },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "Settings", href: "/settings", icon: Settings }
];
