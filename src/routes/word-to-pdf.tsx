import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/word-to-pdf")({
  head: () => {
    const base = toolRouteHead("word-to-pdf");
    return {
      ...base,
      meta: [...(base.meta ?? []), { name: "robots", content: "noindex, follow" }],
    };
  },
  component: () => <ToolRoutePage slug="word-to-pdf" />,
});
