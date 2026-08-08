import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/print-ready-pdf")({
  head: () => toolRouteHead("print-ready-pdf"),
  component: () => <ToolRoutePage slug="print-ready-pdf" />,
});
