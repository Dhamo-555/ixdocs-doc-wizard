import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/pdf-to-word")({
  head: () => toolRouteHead("pdf-to-word"),
  component: () => <ToolRoutePage slug="pdf-to-word" />,
});
