import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://ixdocs.com";

interface SitemapEntry {
  path: string;
  changefreq?: string;
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/tools", changefreq: "weekly", priority: "0.8" },
          { path: "/how-it-works", changefreq: "weekly", priority: "0.8" },
          { path: "/faq", changefreq: "weekly", priority: "0.8" },
          { path: "/about", changefreq: "weekly", priority: "0.8" },
          { path: "/contact", changefreq: "weekly", priority: "0.8" },
          { path: "/privacy-policy", changefreq: "weekly", priority: "0.8" },
          { path: "/terms", changefreq: "weekly", priority: "0.8" },
          { path: "/cookie-policy", changefreq: "weekly", priority: "0.8" },
          { path: "/disclaimer", changefreq: "weekly", priority: "0.8" },
          { path: "/edit-pdf", changefreq: "weekly", priority: "0.9" },
          { path: "/jpg-to-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-to-jpg", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-to-png", changefreq: "weekly", priority: "0.8" },
          { path: "/merge-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/split-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/rotate-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/extract-pdf-pages", changefreq: "weekly", priority: "0.8" },
          { path: "/delete-pdf-pages", changefreq: "weekly", priority: "0.8" },
          { path: "/reorder-pdf-pages", changefreq: "weekly", priority: "0.8" },
          { path: "/watermark-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-page-numbering", changefreq: "weekly", priority: "0.8" },
          { path: "/compress-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/compress-pdf-to-target-size", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-health-checker", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-page-size-converter", changefreq: "weekly", priority: "0.8" },
          { path: "/print-ready-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-metadata-cleaner", changefreq: "weekly", priority: "0.8" },
          { path: "/application-pdf-optimizer", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-to-text", changefreq: "weekly", priority: "0.8" },
          { path: "/crop-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/flatten-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/sign-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/annotate-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/add-text-to-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/grayscale-pdf", changefreq: "weekly", priority: "0.8" },
          { path: "/passport-photo", changefreq: "weekly", priority: "0.8" },
          { path: "/document-scanner", changefreq: "weekly", priority: "0.8" },
          { path: "/smart-pdf-analyzer", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-ocr", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-compression", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-conversion", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-editing", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-management", changefreq: "weekly", priority: "0.8" },
          { path: "/pdf-compression-guide", changefreq: "weekly", priority: "0.8" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
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
