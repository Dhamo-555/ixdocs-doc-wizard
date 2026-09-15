import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/extract-pdf-images")({
  head: () => toolRouteHead("extract-pdf-images"),
  component: () => <ToolRoutePage slug="extract-pdf-images" />,
});
