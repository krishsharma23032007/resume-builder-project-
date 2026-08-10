import { useState } from "react";
import { Copy, Check, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ResumeData } from "@/types/resume";

type ShareableLinkProps = {
  data: ResumeData;
  className?: string;
};

export function ShareableLink({ data, className }: ShareableLinkProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateShareLink() {
    setIsGenerating(true);
    setError(null);

    try {
      // Create a shareable resume object
      const shareData = {
        personal: data.personal,
        education: data.education,
        experience: data.experience,
        projects: data.projects,
        skills: data.skills,
        certifications: data.certifications,
        achievements: data.achievements,
        responsibilities: data.responsibilities,
        languages: data.languages,
        interests: data.interests,
        sharedAt: new Date().toISOString()
      };

      // Encode the resume data as base64 for URL
      const encodedData = btoa(JSON.stringify(shareData));
      const url = `${window.location.origin}/shared?data=${encodedData}`;

      setShareUrl(url);
    } catch (err) {
      setError("Failed to generate share link. Please try again.");
      console.error("Share link generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyToClipboard() {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function openShareLink() {
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  }

  return (
    <div className={className}>
      {!shareUrl ? (
        <Button
          onClick={generateShareLink}
          disabled={isGenerating}
          size="sm"
          type="button"
          variant="outline"
        >
          <Share2 size={16} />
          {isGenerating ? "Generating..." : "Share Resume"}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              readOnly
              className="flex-1 rounded-lg border-2 border-brutal-ink bg-white px-3 py-2 text-xs font-mono text-brutal-ink shadow-hard"
              value={shareUrl}
            />
            <Button
              onClick={copyToClipboard}
              size="sm"
              type="button"
              variant={copied ? "primary" : "outline"}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              onClick={openShareLink}
              size="sm"
              type="button"
              variant="ghost"
            >
              <ExternalLink size={16} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Anyone with this link can view your resume.
          </p>
        </div>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
