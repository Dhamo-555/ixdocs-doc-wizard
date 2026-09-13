import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/qr-code-generator")({
  head: () => {
    const base = toolRouteHead("qr-code-generator");
    return {
      ...base,
      meta: [...(base.meta ?? []), { name: "robots", content: "noindex, follow" }],
    };
  },
  component: () => <ToolRoutePage slug="qr-code-generator" />,
});
