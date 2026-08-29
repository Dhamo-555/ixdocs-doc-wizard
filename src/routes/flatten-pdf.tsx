import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/flatten-pdf")({
  head: () => toolRouteHead("flatten-pdf"),
  component: () => <ToolRoutePage slug="flatten-pdf" />,
});
