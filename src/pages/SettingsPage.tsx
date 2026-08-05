import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="mt-8 grid gap-5">
        <Card>
          <h2 className="font-semibold">Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input defaultValue={user?.displayName || ""} aria-label="Name" readOnly />
            <Input defaultValue={user?.email || ""} aria-label="Email" readOnly />
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">Billing, exports, and team controls are ready for backend integration.</p>
        </Card>
      </div>
    </div>
  );
}
