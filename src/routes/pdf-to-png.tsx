import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/pdf-to-png")({
  head: () => toolRouteHead("pdf-to-png"),
  component: () => <ToolRoutePage slug="pdf-to-png" />,
});
