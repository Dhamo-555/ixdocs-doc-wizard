import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/watermark-pdf")({
  head: () => toolRouteHead("watermark-pdf"),
  component: () => <ToolRoutePage slug="watermark-pdf" />,
});
