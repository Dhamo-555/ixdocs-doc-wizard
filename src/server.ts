import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

import { CALCULATOR_SLUGS } from "./lib/calc-host";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function generateCalcSitemapXml(): string {
  const LASTMOD = "2026-09-06";
  const urls = [
    `  <url>\n    <loc>https://calc.ixdocs.com/</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    `  <url>\n    <loc>https://calc.ixdocs.com/calculators</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`,
    ...CALCULATOR_SLUGS.map((slug) => {
      const isPopular = [
        "basic-calculator",
        "percentage-calculator",
        "interest-calculator",
        "discount-calculator",
        "tip-calculator",
        "loan-calculator",
        "bmi-calculator",
        "bill-calculator",
        "barcode-generator",
      ].includes(slug);
      return `  <url>\n    <loc>https://calc.ixdocs.com/${slug}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${isPopular ? "0.9" : "0.8"}</priority>\n  </url>`;
    }),
  ];

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const host = request.headers.get("host") || url.hostname;
      let req = request;
      const isCalcHost =
        host.startsWith("calc.") ||
        host.startsWith("calculator.") ||
        host === "calc.ixdocs.com" ||
        host.includes("calc.ixdocs.com") ||
        url.searchParams.has("calc");

      // Dynamic sitemap for calculator platform
      if (isCalcHost && url.pathname === "/sitemap.xml") {
        return new Response(generateCalcSitemapXml(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }

      // Dynamic robots.txt for calculator platform
      if (isCalcHost && url.pathname === "/robots.txt") {
        const robots = `User-agent: *\nAllow: /\n\nSitemap: https://calc.ixdocs.com/sitemap.xml\n`;
        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }

      if (isCalcHost && url.pathname === "/") {
        const rewritten = new URL(request.url);
        rewritten.pathname = "/calculators";
        req = new Request(rewritten.toString(), request);
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(req, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
