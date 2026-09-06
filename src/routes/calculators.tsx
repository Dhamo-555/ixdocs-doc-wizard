import { createFileRoute } from "@tanstack/react-router";
import { CalcHome } from "@/components/calc/calc-home";

export const Route = createFileRoute("/calculators")({
  head: () => ({
    meta: [
      { title: "IXDocs Calculator — 31+ Free Online Calculators, Converters & Generators" },
      {
        name: "description",
        content:
          "Free online calculator platform. Instant calculations for math, finance, health, time, conversions, barcodes, and billing. 100% private and in-browser.",
      },
      {
        name: "keywords",
        content:
          "calculators, online calculator, free calculators, percentage calculator, loan calculator, bmi calculator, bill calculator, barcode generator, math tools",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "IXDocs Calculator" },
      {
        property: "og:title",
        content: "IXDocs Calculator — 31+ Free Online Calculators, Converters & Generators",
      },
      {
        property: "og:description",
        content:
          "Free online calculator platform. Instant calculations for math, finance, health, time, conversions, barcodes, and billing. 100% private and in-browser.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://calc.ixdocs.com/" },
      { property: "og:image", content: "https://calc.ixdocs.com/og-calculator.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: "IXDocs Calculator Platform" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "IXDocs Calculator — 31+ Free Online Calculators, Converters & Generators",
      },
      {
        name: "twitter:description",
        content:
          "Free online calculator platform. Instant calculations for math, finance, health, time, conversions, barcodes, and billing. 100% private and in-browser.",
      },
      { name: "twitter:image", content: "https://calc.ixdocs.com/og-calculator.png" },
    ],
    links: [{ rel: "canonical", href: "https://calc.ixdocs.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "IXDocs Calculator",
          url: "https://calc.ixdocs.com/",
          description:
            "Free, browser-based super calculator platform featuring 31 mathematical, financial, health, and productivity tools.",
          applicationCategory: "UtilityApplication",
          operatingSystem: "All",
          browserRequirements: "Requires JavaScript. Requires HTML5.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "IXDocs Calculator",
          url: "https://calc.ixdocs.com/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://calc.ixdocs.com/?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: CalcHome,
});
