import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/pdf-metadata-cleaner")({
  head: () => toolRouteHead("pdf-metadata-cleaner"),
  component: () => <ToolRoutePage slug="pdf-metadata-cleaner" />,
});
