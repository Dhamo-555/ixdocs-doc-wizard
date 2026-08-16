export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Clean fallback logging to local console
  console.error("[IXDocs Error Boundary]", error, {
    route: window.location.pathname,
    ...context,
  });
}
