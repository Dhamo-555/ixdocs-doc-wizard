import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/extract-pdf-pages")({
  head: () => toolRouteHead("extract-pdf-pages"),
  component: () => <ToolRoutePage slug="extract-pdf-pages" />,
});
