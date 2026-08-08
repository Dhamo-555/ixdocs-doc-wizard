import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/document-scanner")({
  head: () => toolRouteHead("document-scanner"),
  component: () => <ToolRoutePage slug="document-scanner" />,
});
