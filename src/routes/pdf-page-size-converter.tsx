import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/pdf-page-size-converter")({
  head: () => toolRouteHead("pdf-page-size-converter"),
  component: () => <ToolRoutePage slug="pdf-page-size-converter" />,
});
