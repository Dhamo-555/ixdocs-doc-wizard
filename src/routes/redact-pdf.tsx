import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/redact-pdf")({
  head: () => toolRouteHead("redact-pdf"),
  component: () => <ToolRoutePage slug="redact-pdf" />,
});
