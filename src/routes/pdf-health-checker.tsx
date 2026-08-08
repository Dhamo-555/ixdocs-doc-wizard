import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/pdf-health-checker")({
  head: () => toolRouteHead("pdf-health-checker"),
  component: () => <ToolRoutePage slug="pdf-health-checker" />,
});
