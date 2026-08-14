import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About IXDocs \u2014 Documents. Simplified." },
      { name: "description", content: "IXDocs is a free platform of document and PDF tools built around simplicity, speed and honesty about what each tool actually does." },
      { property: "og:title", content: "About IXDocs \u2014 Documents. Simplified." },
      { property: "og:description", content: "IXDocs is a free platform of document and PDF tools built around simplicity, speed and honesty about what each tool actually does." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ixdocs-doc-wizard.lovable.app/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ixdocs-doc-wizard.lovable.app/about" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">About IXDocs</h1>
        <p className="mt-3 text-base text-muted-foreground">IXDocs exists to make everyday document work quick and understandable.</p><h2 className="mt-10 text-xl font-bold">What we are building</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A complete set of free tools for converting, organising, editing, compressing and inspecting documents — each with a clear page, a clear result and no guesswork.</p><h2 className="mt-10 text-xl font-bold">Our principles</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Simplicity first: one job per tool, explained in plain language.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Honesty: we report the real result of processing. If a target size cannot be reached, or an engine is not connected yet, we say so instead of showing a fake success.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Speed: wherever possible processing happens on your own device, so there is no upload wait.</p><h2 className="mt-10 text-xl font-bold">How IXDocs is funded</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">IXDocs is free to use and supported by advertising. Ad space is kept away from upload, processing and download controls so it never interferes with your work. There are no subscriptions, no checkout and no account requirement.</p><h2 className="mt-10 text-xl font-bold">Company information</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Formal company and registration details are not published yet and will be added here once available. We do not list awards, partnerships, certifications or user numbers that we cannot substantiate.</p>
      </div>
    </div>
  );
}
