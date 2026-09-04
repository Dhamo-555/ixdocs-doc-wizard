import { createFileRoute } from "@tanstack/react-router";
import { CalcHome } from "@/components/calc/calc-home";

export const Route = createFileRoute("/calculators")({
  head: () => ({
    meta: [
      { title: "IXDocs Calculator — Free Online Calculators & Converters" },
      {
        name: "description",
        content:
          "Free online calculator platform. Fast, accurate, and secure calculators for arithmetic, unit conversions, interest, dates, age, and passwords.",
      },
      {
        property: "og:title",
        content: "IXDocs Calculator — Free Online Calculators & Converters",
      },
      {
        property: "og:description",
        content:
          "Free online calculator platform. Instant calculations run directly in your browser with 100% privacy.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://calculator.ixdocs.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://calculator.ixdocs.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "IXDocs Calculator",
          url: "https://calculator.ixdocs.com/",
          description: "Free, browser-based super calculator platform.",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "All",
        }),
      },
    ],
  }),
  component: CalcHome,
});
