import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { ResumeProvider } from "@/context/ResumeContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ResumeProvider>
          {children}
          <Toaster position="top-right" />
        </ResumeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
