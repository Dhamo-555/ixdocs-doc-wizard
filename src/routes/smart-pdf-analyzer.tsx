import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/smart-pdf-analyzer")({
  head: () => toolRouteHead("smart-pdf-analyzer"),
  component: () => <ToolRoutePage slug="smart-pdf-analyzer" />,
});
