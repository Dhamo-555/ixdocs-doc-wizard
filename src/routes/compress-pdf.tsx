import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/compress-pdf")({
  head: () => toolRouteHead("compress-pdf"),
  component: () => <ToolRoutePage slug="compress-pdf" />,
});
