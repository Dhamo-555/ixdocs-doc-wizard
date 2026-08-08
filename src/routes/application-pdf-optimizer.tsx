import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/application-pdf-optimizer")({
  head: () => toolRouteHead("application-pdf-optimizer"),
  component: () => <ToolRoutePage slug="application-pdf-optimizer" />,
});
