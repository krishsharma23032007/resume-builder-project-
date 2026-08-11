import { useState, useEffect } from "react";
import { Save, User, Briefcase, MapPin, Phone, Linkedin, Globe, Github, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { profileService, type UserProfile } from "@/services/profileService";

export function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
    linkedin: "",
    website: "",
    github: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof UserProfile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await profileService.updateProfile({
        displayName: profile.displayName,
        phone: profile.phone,
        location: profile.location,
        title: profile.title,
        summary: profile.summary,
        linkedin: profile.linkedin,
        website: profile.website,
        github: profile.github
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="mt-2 text-muted-foreground">Manage your profile and preferences.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border-2 border-green-300 bg-green-50 p-4 text-green-700">
          <CheckCircle size={18} />
          <span>Profile saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {/* Personal Information */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Personal Information</h2>
              <p className="text-sm text-muted-foreground">Basic details for your resume header.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Display Name</label>
              <Input
                className="mt-1"
                value={profile.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                className="mt-1"
                value={profile.email}
                readOnly
                disabled
              />
              <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed here.</p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone size={14} />
                Phone Number
              </label>
              <Input
                className="mt-1"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin size={14} />
                Location
              </label>
              <Input
                className="mt-1"
                value={profile.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
        </Card>

        {/* Professional Details */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Professional Details</h2>
              <p className="text-sm text-muted-foreground">Used to pre-fill your resume content.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Professional Title</label>
              <Input
                className="mt-1"
                value={profile.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Senior Software Engineer"
              />
              <p className="mt-1 text-xs text-muted-foreground">Your target role or current job title.</p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText size={14} />
                Professional Summary
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border-2 border-brutal-ink bg-white px-3 py-3 text-sm font-medium text-brutal-ink shadow-hard placeholder:text-brutal-line focus:outline-none"
                rows={4}
                value={profile.summary}
                onChange={(e) => handleChange("summary", e.target.value)}
                placeholder="Experienced software engineer with 5+ years of expertise in building scalable web applications..."
              />
              <p className="mt-1 text-xs text-muted-foreground">A brief professional summary for your resume.</p>
            </div>
          </div>
        </Card>

        {/* Online Presence */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Online Presence</h2>
              <p className="text-sm text-muted-foreground">Links included in your resume contact section.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Linkedin size={14} />
                LinkedIn URL
              </label>
              <Input
                className="mt-1"
                value={profile.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Github size={14} />
                GitHub URL
              </label>
              <Input
                className="mt-1"
                value={profile.github}
                onChange={(e) => handleChange("github", e.target.value)}
                placeholder="https://github.com/johndoe"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe size={14} />
                Portfolio / Website
              </label>
              <Input
                className="mt-1"
                value={profile.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://johndoe.com"
              />
            </div>
          </div>
        </Card>

        {/* Account Info */}
        <Card>
          <h2 className="font-semibold">Account</h2>
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">User ID:</span> {user?.id || "N/A"}</p>
            <p><span className="font-medium text-foreground">Email:</span> {user?.email || "N/A"}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
