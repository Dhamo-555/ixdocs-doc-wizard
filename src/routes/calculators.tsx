import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * /calculators on ixdocs.com permanently redirects to the calculator platform
 * canonical host: https://calc.ixdocs.com/
 *
 * The calculator platform's canonical host is calc.ixdocs.com. Keeping a
 * rendered page at ixdocs.com/calculators created a cross-origin canonical
 * ambiguity. A 301 redirect resolves this cleanly.
 */
export const Route = createFileRoute("/calculators")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: {
            Location: "https://calc.ixdocs.com/",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        }),
    },
  },
  component: () => null,
});
