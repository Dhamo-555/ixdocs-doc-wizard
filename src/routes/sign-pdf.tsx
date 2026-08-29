import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/sign-pdf")({
  head: () => toolRouteHead("sign-pdf"),
  component: () => <ToolRoutePage slug="sign-pdf" />,
});
