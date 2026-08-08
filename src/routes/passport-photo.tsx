import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/passport-photo")({
  head: () => toolRouteHead("passport-photo"),
  component: () => <ToolRoutePage slug="passport-photo" />,
});
