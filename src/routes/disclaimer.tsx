import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — IXDocs" },
      {
        name: "description",
        content:
          "Important disclaimers regarding document processing results, service availability, and warranties.",
      },
      { property: "og:title", content: "Disclaimer — IXDocs" },
      {
        property: "og:description",
        content:
          "Important disclaimers regarding document processing results, service availability, and warranties.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ixdocs.com/disclaimer" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://ixdocs.com/ixdocs-og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://ixdocs.com/disclaimer" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Disclaimer</h1>
        <p className="mt-2 text-xs text-muted-foreground">Last Updated: August 15, 2026</p>

        <h2 className="mt-10 text-xl font-bold">1. General Information</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          IXDocs provides document-processing utilities through a web browser. The content, tools,
          and services provided on this website are for informational and utility purposes only.
        </p>

        <h2 className="mt-10 text-xl font-bold">2. Document Processing Results</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Document processing results may vary significantly based on multiple variables, including:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-2 text-muted-foreground">
          <li>File formats, version compatibility, and structure standards.</li>
          <li>Embedded fonts, layout properties, and CSS rules.</li>
          <li>Image resolution, quality, compression levels, and metadata.</li>
          <li>Complexity of embedded elements, charts, tables, or annotations.</li>
          <li>Inherent technical limitations of client-side or server-side processing engines.</li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">3. Accuracy of Output</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We do not guarantee perfect conversion, OCR, layout extraction, rendering, compression,
          encryption, metadata stripping, or other document operations. Processed files may contain
          discrepancies, layout shifts, formatting errors, or lost elements. You should review and
          verify important documents before relying on or distributing them.
        </p>

        <h2 className="mt-10 text-xl font-bold">4. User Responsibility</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You are entirely responsible for the files you choose to upload, including confirming that
          you have all necessary legal rights and permissions to process them. You must review the
          final document output and maintain local copies/backups of your original documents. IXDocs
          is not responsible for any file loss or corruption.
        </p>

        <h2 className="mt-10 text-xl font-bold">5. Service Availability</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The service is provided on an "as-is" basis. IXDocs may experience scheduled maintenance,
          unexpected system downtime, technical errors, capacity limitations, or complete changes to
          available tools at any time. We make no commitments regarding availability or reliability.
        </p>

        <h2 className="mt-10 text-xl font-bold">6. Third-Party Services</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Some functionality may rely on third-party cloud computing, APIs, or infrastructure
          services. IXDocs is not responsible for failures, delays, or security incidents arising
          from these third-party integrations.
        </p>

        <h2 className="mt-10 text-xl font-bold">7. No Professional Advice</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          IXDocs is a technical software utility platform. We do not provide legal, financial,
          medical, tax, accounting, or other professional advice. Processing documents through our
          tools does not constitute advice, nor does it establish any client-professional
          relationship.
        </p>

        <h2 className="mt-10 text-xl font-bold">8. External Links</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This website may contain links to external sites operated independently by third parties.
          IXDocs has no control over and assumes no responsibility for the content, privacy
          policies, or terms of any external websites.
        </p>

        <h2 className="mt-10 text-xl font-bold">9. Updates</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This disclaimer may be updated or modified at any time without prior notice to reflect
          modifications to our utilities, infrastructure, or operational policies.
        </p>
      </div>
    </div>
  );
}
