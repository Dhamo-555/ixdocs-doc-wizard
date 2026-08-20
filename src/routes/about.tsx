import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About IXDocs — Simple Browser-Based Document Tools" },
      {
        name: "description",
        content:
          "Learn more about IXDocs, offering simple and secure document and PDF tools directly in your browser.",
      },
      { property: "og:title", content: "About IXDocs — Simple Browser-Based Document Tools" },
      {
        property: "og:description",
        content:
          "Learn more about IXDocs, offering simple and secure document and PDF tools directly in your browser.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ixdocs.com/about" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://ixdocs.com/ixdocs-og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://ixdocs.com/about" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">About IXDocs</h1>
        <p className="mt-3 text-base text-muted-foreground font-semibold">
          Simple document tools, available directly in your browser.
        </p>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          IXDocs provides practical document and PDF tools directly through your browser. The
          available IXDocs tools are currently provided without requiring payment. We focus on
          making common document operations straightforward without forcing users to register,
          download software, or navigate complex workflows.
        </p>

        <h2 className="mt-10 text-xl font-bold">What We Provide</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We build focused utilities that solve specific document problems, including:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-2 text-muted-foreground">
          <li>
            <strong>Organizing Pages:</strong> Merging multiple documents, splitting pages, rotating
            misaligned pages, extracting specific selections, and deleting blank pages.
          </li>
          <li>
            <strong>Optimizing Files:</strong> Compressing PDFs to fit strict upload size limits,
            resizing pages, and cleaning metadata.
          </li>
          <li>
            <strong>Converting Formats:</strong> Turning JPG or PNG images into PDF documents,
            exporting PDF pages as JPG or PNG images, and converting files.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">Our Design System</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Our development is guided by key principles:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-2 text-muted-foreground">
          <li>
            <strong>Simplicity:</strong> One job per tool, explained clearly, with immediate
            outcomes.
          </li>
          <li>
            <strong>Honesty:</strong> We report genuine processing results. If a conversion fails,
            or a specific tool is unavailable, we say so immediately.
          </li>
          <li>
            <strong>Usability:</strong> Fast processing built around standard web technologies,
            ensuring documents are handled efficiently.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">Current Availability</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          IXDocs is currently available without requiring payment for its available tools. We
          reserve the right to introduce optional premium features, subscription tiers, or paid
          tools in the future as the platform grows.
        </p>

        <h2 className="mt-10 text-xl font-bold">Ready to Start?</h2>
        <div className="mt-6">
          <Link
            to="/tools"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explore all tools
          </Link>
        </div>
      </div>
    </div>
  );
}
