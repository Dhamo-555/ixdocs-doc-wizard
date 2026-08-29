import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/pdf-to-text")({
  head: () => toolRouteHead("pdf-to-text"),
  component: () => <ToolRoutePage slug="pdf-to-text" />,
});
