import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/annotate-pdf")({
  head: () => toolRouteHead("annotate-pdf"),
  component: () => <ToolRoutePage slug="annotate-pdf" />,
});
