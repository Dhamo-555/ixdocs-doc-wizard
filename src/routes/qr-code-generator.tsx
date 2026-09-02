import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/qr-code-generator")({
  head: () => toolRouteHead("qr-code-generator"),
  component: () => <ToolRoutePage slug="qr-code-generator" />,
});
