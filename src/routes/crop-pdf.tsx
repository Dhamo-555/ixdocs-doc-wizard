import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/crop-pdf")({
  head: () => toolRouteHead("crop-pdf"),
  component: () => <ToolRoutePage slug="crop-pdf" />,
});
