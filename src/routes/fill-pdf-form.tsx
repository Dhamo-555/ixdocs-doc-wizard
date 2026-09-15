import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/fill-pdf-form")({
  head: () => toolRouteHead("fill-pdf-form"),
  component: () => <ToolRoutePage slug="fill-pdf-form" />,
});
