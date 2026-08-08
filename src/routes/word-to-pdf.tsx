import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/word-to-pdf")({
  head: () => toolRouteHead("word-to-pdf"),
  component: () => <ToolRoutePage slug="word-to-pdf" />,
});
