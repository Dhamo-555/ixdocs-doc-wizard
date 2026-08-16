import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — IXDocs" },
      {
        name: "description",
        content: "The terms of service that govern your use of the IXDocs platform and tools.",
      },
      { property: "og:title", content: "Terms of Service — IXDocs" },
      {
        property: "og:description",
        content: "The terms of service that govern your use of the IXDocs platform and tools.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ixdocs.com/terms" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://ixdocs.com/ixdocs-og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://ixdocs.com/terms" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-xs text-muted-foreground">Last Updated: August 15, 2026</p>

        <h2 className="mt-10 text-xl font-bold">1. Introduction</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Welcome to IXDocs. These Terms of Service govern your access to and use of the IXDocs
          website and its browser-based document and PDF utilities.
        </p>

        <h2 className="mt-10 text-xl font-bold">2. Acceptance of Terms</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          By accessing or using IXDocs, you acknowledge that you have read, understood, and agree to
          be bound by these Terms of Service. If you do not agree to these terms, you must not use
          the website or its tools.
        </p>

        <h2 className="mt-10 text-xl font-bold">3. Description of Service</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          IXDocs provides practical browser-based document and PDF utilities including compression,
          merging, splitting, formatting, page manipulation, and file conversions. We only support
          tools and functionality that currently exist and are active on our site.
        </p>

        <h2 className="mt-10 text-xl font-bold">4. Current Free Use</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-semibold">
          IXDocs is currently available without requiring payment for its available tools and
          functionality.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We reserve the right to modify our pricing structure, introduce optional premium features,
          or charge for certain parts of the service in the future.
        </p>

        <h2 className="mt-10 text-xl font-bold">5. Permitted Use</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You may use the service only for lawful purposes. You must have the necessary legal
          rights, licenses, and permissions to process any document or file you upload to the
          platform.
        </p>

        <h2 className="mt-10 text-xl font-bold">6. Prohibited Use</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You agree not to use the service:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-2 text-muted-foreground">
          <li>For any unlawful, abusive, fraudulent, malicious, or harmful purpose.</li>
          <li>
            To process files that contain infringing material, malware, viruses, or malicious code.
          </li>
          <li>
            To interfere with, disrupt, or attempt to disable the service's systems, security, or
            servers.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">7. User Files and Content</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You retain full ownership and intellectual property rights in and to your documents and
          files. IXDocs does not claim any ownership rights over your documents. You are solely
          responsible for obtaining all necessary permissions and rights to upload and process
          files.
        </p>

        <h2 className="mt-10 text-xl font-bold">8. Intellectual Property</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          All website code, interfaces, designs, logos, software, text, graphics, and branding are
          the intellectual property of IXDocs and are protected by applicable copyright and
          trademark laws.
        </p>

        <h2 className="mt-10 text-xl font-bold">9. Third-Party Services</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Certain tools or hosting infrastructure may rely on third-party integrations and service
          providers. You acknowledge that our service may depend on the performance and availability
          of these third-party systems.
        </p>

        <h2 className="mt-10 text-xl font-bold">10. Service Availability</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          IXDocs is provided on an "as-is" and "as-available" basis. We do not guarantee that the
          service will be uninterrupted, error-free, permanently online, or free from scheduled
          maintenance or unexpected technical failures.
        </p>

        <h2 className="mt-10 text-xl font-bold">11. Accuracy of Results</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          While we strive to provide high-quality tools, document conversion, rendering, OCR,
          compression, and extraction results may not always be 100% accurate or complete due to
          differences in file formats, embedded fonts, image qualities, and structure. You should
          verify important generated files before relying on them.
        </p>

        <h2 className="mt-10 text-xl font-bold">12. User Responsibility</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You are responsible for reviewing your processed document results for errors, omissions,
          or formatting discrepancies. You must maintain original backups of your files, as IXDocs
          does not provide permanent document storage.
        </p>

        <h2 className="mt-10 text-xl font-bold">13. Disclaimer of Warranties</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          To the maximum extent permitted by applicable law, IXDocs disclaims all warranties,
          express or implied, including but not limited to implied warranties of merchantability,
          fitness for a particular purpose, and non-infringement.
        </p>

        <h2 className="mt-10 text-xl font-bold">14. Limitation of Liability</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          To the maximum extent permitted by applicable law, IXDocs and its operators shall not be
          liable for any direct, indirect, incidental, special, consequential, or exemplary damages,
          including but not limited to damages for loss of profits, goodwill, data, or other
          intangible losses arising out of or in connection with the use or performance of the
          service.
        </p>

        <h2 className="mt-10 text-xl font-bold">15. Changes to Service and Terms</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We reserve the right to modify, suspend, or discontinue any feature or tool, and to update
          these terms at any time. Updates to the terms will be posted directly on this page.
        </p>

        <h2 className="mt-10 text-xl font-bold">16. Suspension or Termination</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We may restrict or terminate your access to the service at our sole discretion, without
          notice, if we believe your conduct violates these terms, is harmful to other users, or
          constitutes abuse or unlawful behavior.
        </p>

        <h2 className="mt-10 text-xl font-bold">17. Governing Law</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The governing law and jurisdiction of this service will be published here once formalized.
          Until then, these terms are the operational policy of IXDocs.
        </p>

        <h2 className="mt-10 text-xl font-bold">18. Contact</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          If you have questions about these Terms of Service, please reach out to us through our
          contact page.
        </p>
      </div>
    </div>
  );
}
