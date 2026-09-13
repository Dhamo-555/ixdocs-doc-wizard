import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/pdf-to-word")({
  head: () => {
    const base = toolRouteHead("pdf-to-word");
    return {
      ...base,
      meta: [...(base.meta ?? []), { name: "robots", content: "noindex, follow" }],
    };
  },
  component: () => <ToolRoutePage slug="pdf-to-word" />,
});
