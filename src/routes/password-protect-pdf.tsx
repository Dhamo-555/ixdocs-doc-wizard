import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/password-protect-pdf")({
  head: () => toolRouteHead("password-protect-pdf"),
  component: () => <ToolRoutePage slug="password-protect-pdf" />,
});
