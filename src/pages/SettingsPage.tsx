import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="mt-8 grid gap-5">
        <Card>
          <h2 className="font-semibold">Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input defaultValue="Avery Morgan" aria-label="Name" />
            <Input defaultValue="avery@resumeguru.in" aria-label="Email" />
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
