import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/merge-pdf")({
  head: () => toolRouteHead("merge-pdf"),
  component: () => <ToolRoutePage slug="merge-pdf" />,
});
