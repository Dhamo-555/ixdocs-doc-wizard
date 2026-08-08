import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/reorder-pdf-pages")({
  head: () => toolRouteHead("reorder-pdf-pages"),
  component: () => <ToolRoutePage slug="reorder-pdf-pages" />,
});
