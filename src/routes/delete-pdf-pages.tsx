import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/delete-pdf-pages")({
  head: () => toolRouteHead("delete-pdf-pages"),
  component: () => <ToolRoutePage slug="delete-pdf-pages" />,
});
