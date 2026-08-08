import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/split-pdf")({
  head: () => toolRouteHead("split-pdf"),
  component: () => <ToolRoutePage slug="split-pdf" />,
});
