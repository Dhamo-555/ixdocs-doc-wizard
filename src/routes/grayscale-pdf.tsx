import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/grayscale-pdf")({
  head: () => toolRouteHead("grayscale-pdf"),
  component: () => <ToolRoutePage slug="grayscale-pdf" />,
});
