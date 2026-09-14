import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/split-pdf-by-size")({
  head: () => toolRouteHead("split-pdf-by-size"),
  component: () => <ToolRoutePage slug="split-pdf-by-size" />,
});
