import { createFileRoute } from "@tanstack/react-router";
import { ToolRoutePage, toolRouteHead } from "@/components/tool/tool-route-page";

export const Route = createFileRoute("/pdf-ocr")({
  head: () => toolRouteHead("pdf-ocr"),
  component: () => <ToolRoutePage slug="pdf-ocr" />,
});
