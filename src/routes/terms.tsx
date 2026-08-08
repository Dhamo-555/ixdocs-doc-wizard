import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service \u2014 IXDocs" },
      { name: "description", content: "The terms that apply when you use IXDocs document and PDF tools." },
      { property: "og:title", content: "Terms of Service \u2014 IXDocs" },
      { property: "og:description", content: "The terms that apply when you use IXDocs document and PDF tools." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Terms of service</h1>
        <p className="mt-3 text-base text-muted-foreground">By using IXDocs you agree to these terms. They are written in plain language and are not a substitute for legal advice in your jurisdiction.</p><h2 className="mt-10 text-xl font-bold">Using the service</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">IXDocs provides free document tools on an as-available basis. You may use them for personal and commercial documents provided you have the right to process the files you upload.</p><h2 className="mt-10 text-xl font-bold">Your responsibility</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">You are responsible for the content of your documents and for keeping your own backups. Always retain the original file before processing.</p><h2 className="mt-10 text-xl font-bold">Acceptable use</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Do not use IXDocs to process unlawful material, to attempt to break the service or its limits, or to bypass access controls on documents you are not authorised to open.</p><h2 className="mt-10 text-xl font-bold">No warranty</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The tools are provided without warranty of any kind. Document processing can fail on corrupt, unusual or very large files, and results may not suit every purpose.</p><h2 className="mt-10 text-xl font-bold">Limitation of liability</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">To the maximum extent permitted by applicable law, IXDocs is not liable for loss of data, loss of profit, or indirect or consequential loss arising from use of the service.</p><h2 className="mt-10 text-xl font-bold">Availability and changes</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Tools may be added, changed or withdrawn at any time. Features described as not yet connected are exactly that, and no guarantee is given about when they will be available.</p><h2 className="mt-10 text-xl font-bold">Legal and company details</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The governing law and the legal entity operating IXDocs will be published here once formalised. Until then these terms should be read as the operator's stated policy rather than a jurisdiction-specific contract.</p>
      </div>
    </div>
  );
}
