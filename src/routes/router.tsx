import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { CoverLetterPage } from "@/pages/CoverLetterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ResumeBuilderPage } from "@/pages/ResumeBuilderPage";
import { ResumeLibraryPage } from "@/pages/ResumeLibraryPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { TemplatesPage } from "@/pages/TemplatesPage";

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> }
    ]
  },
  {
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/resumes", element: <ResumeLibraryPage /> },
      { path: "/resume/new", element: <ResumeBuilderPage /> },
      { path: "/resume/:id", element: <ResumeBuilderPage /> },
      { path: "/cover-letter", element: <CoverLetterPage /> },
      { path: "/templates", element: <TemplatesPage /> },
      { path: "/settings", element: <SettingsPage /> }
    ]
  },
  { path: "*", element: <NotFoundPage /> }
]);
