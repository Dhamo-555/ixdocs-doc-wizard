import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/pdf-page-numbering")({
  head: () => toolRouteHead("pdf-page-numbering"),
  component: () => <ToolRoutePage slug="pdf-page-numbering" />,
});
