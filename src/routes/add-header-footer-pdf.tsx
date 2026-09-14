import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/add-header-footer-pdf")({
  head: () => toolRouteHead("add-header-footer-pdf"),
  component: () => <ToolRoutePage slug="add-header-footer-pdf" />,
});
