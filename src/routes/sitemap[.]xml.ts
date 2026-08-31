import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://ixdocs.com";

interface SitemapEntry {
  path: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const LASTMOD = "2026-08-31";
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: LASTMOD },
          { path: "/tools", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/how-it-works", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/faq", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/about", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/contact", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/privacy-policy", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/terms", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/cookie-policy", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/disclaimer", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/jpg-to-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/pdf-to-jpg", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/pdf-to-png", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/merge-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/split-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/rotate-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/extract-pdf-pages", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/delete-pdf-pages", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/reorder-pdf-pages", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/watermark-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/pdf-page-numbering", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/compress-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/compress-pdf-to-target-size", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/pdf-health-checker", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/pdf-page-size-converter", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/print-ready-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/pdf-metadata-cleaner", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/application-pdf-optimizer", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/pdf-to-text", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/crop-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/flatten-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/sign-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/annotate-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/add-text-to-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/grayscale-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/passport-photo", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/document-scanner", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/smart-pdf-analyzer", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/pdf-ocr", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/word-to-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/pdf-to-word", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
          { path: "/password-protect-pdf", changefreq: "weekly", priority: "0.8", lastmod: LASTMOD },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
