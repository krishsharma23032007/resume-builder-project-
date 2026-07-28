import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";

export function MarketingLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}
