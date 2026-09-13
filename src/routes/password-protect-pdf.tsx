import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/password-protect-pdf")({
  head: () => {
    const base = toolRouteHead("password-protect-pdf");
    return {
      ...base,
      meta: [...(base.meta ?? []), { name: "robots", content: "noindex, follow" }],
    };
  },
  component: () => <ToolRoutePage slug="password-protect-pdf" />,
});
