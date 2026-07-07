"use client";

import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

type PageStatusVariant = "under-construction" | "not-found" | "error";

interface PageStatusProps {
  /** Which state to show. Defaults to "under-construction". */
  variant?: PageStatusVariant;
  /** The name of the page/feature, used in the default description (e.g. "Reports", "Team Settings"). */
  page?: string;
  /** Override the heading entirely. */
  title?: string;
  /** Override the description entirely. */
  description?: string;
  /** Called when "Try again" is pressed. Only shown for the "error" variant. If omitted, reloads the page. */
  onRetry?: () => void;
}

const VARIANT_COPY: Record<
  PageStatusVariant,
  { eyebrow: string; title: string; description: (page: string) => string }
> = {
  "under-construction": {
    eyebrow: "In Progress",
    title: "This page is still being mapped",
    description: (page) =>
      `${page} isn't ready for the trail yet. We're charting the route and it'll be open again shortly.`,
  },
  "not-found": {
    eyebrow: "Off the Map",
    title: "We couldn't find that route",
    description: (page) =>
      `${page} doesn't exist, or it may have moved. Double-check the link, or head back to known ground.`,
  },
  error: {
    eyebrow: "Trail Blocked",
    title: "Something went wrong up ahead",
    description: (page) =>
      `${page} hit a snag loading. Try again, or head back and approach from a different route.`,
  },
};

/**
 * Topographic contour illustration with a peak marker.
 * Signature visual for the dashboard's empty/error/blocked states —
 * ties back to the expedition-planning subject matter without
 * reaching for a generic icon (hard hat, broken robot, etc.)
 */
function TopoIllustration() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-40 h-32 md:w-48 md:h-40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Contour rings */}
      <path
        d="M100 20 C 60 20, 30 50, 30 85 C 30 115, 60 140, 100 140 C 140 140, 170 115, 170 85 C 170 50, 140 20, 100 20 Z"
        stroke="var(--color-neutral-200)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M100 35 C 70 35, 48 58, 48 85 C 48 108, 70 125, 100 125 C 130 125, 152 108, 152 85 C 152 58, 130 35, 100 35 Z"
        stroke="var(--color-neutral-200)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M100 50 C 82 50, 68 65, 68 85 C 68 102, 82 112, 100 112 C 118 112, 132 102, 132 85 C 132 65, 118 50, 100 50 Z"
        stroke="var(--color-primary-200)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Dashed route line */}
      <path
        d="M40 130 C 65 110, 75 95, 85 80 C 92 68, 96 55, 100 40"
        stroke="var(--color-primary-400)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Peak marker */}
      <path
        d="M100 22 L 112 42 L 106 42 L 100 32 L 94 42 L 88 42 Z"
        fill="var(--color-primary-700)"
      />
      <circle cx="100" cy="22" r="3.5" fill="var(--color-primary-700)" />
    </svg>
  );
}

export default function PageStatus({
  variant = "under-construction",
  page = "This page",
  title,
  description,
  onRetry,
}: PageStatusProps) {
  const router = useRouter();
  const copy = VARIANT_COPY[variant];

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push("/dashboard");
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="card w-full max-w-lg flex flex-col items-center text-center px-8 py-12 md:px-12 md:py-14">
        <div className="mb-8 select-none">
          <TopoIllustration />
        </div>

        <span className="stat-label text-primary-700 mb-3">{copy.eyebrow}</span>

        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight mb-3">
          {title || copy.title}
        </h2>

        <p className="text-sm text-neutral-500 font-medium leading-relaxed max-w-sm mb-10">
          {description || copy.description(page)}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {variant === "error" ? (
            <>
              <button onClick={handleRetry} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                <RefreshCw size={14} />
                Try again
              </button>
              <button onClick={goBack} className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
                <ArrowLeft size={14} />
                Go back
              </button>
            </>
          ) : (
            <>
              <button onClick={goHome} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                <Home size={14} />
                Return to dashboard
              </button>
              <button onClick={goBack} className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
                <ArrowLeft size={14} />
                Go back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}