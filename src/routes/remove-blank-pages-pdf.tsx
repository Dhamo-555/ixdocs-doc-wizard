import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/remove-blank-pages-pdf")({
  head: () => toolRouteHead("remove-blank-pages-pdf"),
  component: () => <ToolRoutePage slug="remove-blank-pages-pdf" />,
});
