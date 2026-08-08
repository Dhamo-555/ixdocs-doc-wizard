import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/jpg-to-pdf")({
  head: () => toolRouteHead("jpg-to-pdf"),
  component: () => <ToolRoutePage slug="jpg-to-pdf" />,
});
