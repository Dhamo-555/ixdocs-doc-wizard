import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const CONSENT_VERSION = "1.0.0";
const STORAGE_KEY = "ixdocs:consent";

export interface ConsentPreference {
  consentState: "accepted" | "rejected";
  version: string;
  timestamp: string;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);

  useEffect(() => {
    // Check local storage for consent on client load
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setIsVisible(true);
    } else {
      try {
        const parsed = JSON.parse(stored) as ConsentPreference;
        if (parsed.version !== CONSENT_VERSION) {
          setIsVisible(true);
        }
      } catch {
        setIsVisible(true);
      }
    }

    // Set up global listener for reopening preferences
    const handleOpenPreferences = () => {
      setIsPreferenceModalOpen(true);
    };

    window.addEventListener("open-cookie-preferences", handleOpenPreferences);
    return () => window.removeEventListener("open-cookie-preferences", handleOpenPreferences);
  }, []);

  const savePreferences = (state: "accepted" | "rejected") => {
    const preference: ConsentPreference = {
      consentState: state,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
    setIsVisible(false);
    setIsPreferenceModalOpen(false);
  };

  const handleAccept = () => {
    savePreferences("accepted");
  };

  const handleRejectOptional = () => {
    savePreferences("rejected");
  };

  if (!isVisible && !isPreferenceModalOpen) return null;

  return (
    <>
      {isVisible && (
        <div
          role="region"
          aria-label="Cookie Consent Banner"
          className="fixed bottom-0 inset-x-0 z-40 w-full bg-surface/95 border-t border-border p-5 shadow-2xl backdrop-blur-md md:bottom-6 md:left-6 md:right-6 md:max-w-4xl md:mx-auto md:rounded-2xl md:border transition-all duration-300"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-2">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-primary" />
                Privacy & Cookie Preferences
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                IXDocs uses essential technologies like the <code>sidebar:state</code> cookie to
                support core functionality. Optional technologies may be introduced in the future,
                but they are <strong>not currently active</strong>. Read our{" "}
                <Link
                  to="/privacy-policy"
                  className="text-primary hover:underline font-medium focus:outline-none focus:ring-1 focus:ring-primary rounded"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  to="/cookie-policy"
                  className="text-primary hover:underline font-medium focus:outline-none focus:ring-1 focus:ring-primary rounded"
                >
                  Cookie Policy
                </Link>{" "}
                to learn more.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 sm:justify-end md:flex-nowrap">
              <button
                onClick={() => setIsPreferenceModalOpen(true)}
                className="flex-1 sm:flex-initial inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-transparent px-4 text-xs font-semibold text-foreground cursor-pointer transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Manage Preferences
              </button>
              <button
                onClick={handleRejectOptional}
                className="flex-1 sm:flex-initial inline-flex min-h-10 items-center justify-center rounded-lg border border-transparent bg-secondary text-secondary-foreground px-4 text-xs font-semibold cursor-pointer transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                Reject Optional
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-initial inline-flex min-h-10 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground px-4 text-xs font-semibold cursor-pointer transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isPreferenceModalOpen} onOpenChange={setIsPreferenceModalOpen}>
        <DialogContent className="max-w-md w-[95vw] rounded-2xl p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Customize how technologies are used on your device. Changes are saved locally and
              respect your browser choices.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-4">
            {/* Essential Category */}
            <div className="flex flex-col gap-2 p-4 rounded-xl border border-border/60 bg-surface/40">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-foreground">
                  Essential Technologies
                </span>
                <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase">
                  Always Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                Required for core website operations, layout persistence (such as keeping your
                sidebar menu state via <code>sidebar:state</code>), and secure connection handling.
                Cannot be disabled.
              </p>
            </div>

            {/* Optional Category */}
            <div className="flex flex-col gap-2 p-4 rounded-xl border border-border/60 bg-surface/40">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-foreground">Optional Technologies</span>
                <span className="text-[10px] font-medium bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full uppercase">
                  Currently Not Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                IXDocs may introduce optional technologies such as analytics or advertising in the
                future. **No analytics or advertising provider is currently installed.**
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center border-t border-border/60 pt-4">
            <div className="flex gap-3 text-xs">
              <Link
                to="/privacy-policy"
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/cookie-policy"
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                Cookie Policy
              </Link>
            </div>
            <button
              onClick={handleAccept}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 text-xs font-semibold cursor-pointer transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Save Preferences
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
