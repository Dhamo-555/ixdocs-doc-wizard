import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/edit-pdf")({
  head: () => toolRouteHead("edit-pdf"),
  component: () => <ToolRoutePage slug="edit-pdf" />,
});
