import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/add-text-to-pdf")({
  head: () => toolRouteHead("add-text-to-pdf"),
  component: () => <ToolRoutePage slug="add-text-to-pdf" />,
});
