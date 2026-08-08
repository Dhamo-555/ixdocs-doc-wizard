import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/pdf-to-jpg")({
  head: () => toolRouteHead("pdf-to-jpg"),
  component: () => <ToolRoutePage slug="pdf-to-jpg" />,
});
