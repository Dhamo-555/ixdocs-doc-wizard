import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/compress-pdf-to-target-size")({
  head: () => toolRouteHead("compress-pdf-to-target-size"),
  component: () => <ToolRoutePage slug="compress-pdf-to-target-size" />,
});
