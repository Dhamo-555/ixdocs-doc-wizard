import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/rotate-pdf")({
  head: () => toolRouteHead("rotate-pdf"),
  component: () => <ToolRoutePage slug="rotate-pdf" />,
});
