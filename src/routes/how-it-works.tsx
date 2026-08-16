import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How IXDocs Works \u2014 Five Simple Steps" },
      {
        name: "description",
        content:
          "Choose a tool, upload your file, configure the options, process and download. See how document processing works on IXDocs.",
      },
      { property: "og:title", content: "How IXDocs Works \u2014 Five Simple Steps" },
      {
        property: "og:description",
        content:
          "Choose a tool, upload your file, configure the options, process and download. See how document processing works on IXDocs.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ixdocs.com/how-it-works" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ixdocs.com/how-it-works" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">How it works</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Every IXDocs tool follows the same five steps, so once you learn one you know them all.
        </p>
        <h2 className="mt-10 text-xl font-bold">1. Choose a tool</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Pick a tool from the homepage, the all-tools directory or the search box in the header.
          Each tool has its own page and its own URL.
        </p>
        <h2 className="mt-10 text-xl font-bold">2. Upload your file</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Drag a file onto the upload area, or tap it to open your device's file picker. On mobile
          you can also pick photos from your gallery, and the Document Scanner can use your camera.
        </p>
        <h2 className="mt-10 text-xl font-bold">3. Configure the options</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Set the options the tool needs — page ranges, compression level, watermark text, paper
          size. Sensible defaults are pre-selected so you can usually skip this step.
        </p>
        <h2 className="mt-10 text-xl font-bold">4. Process</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Most tools run in your browser using your device's own processing power. You will see real
          progress when it can be measured, and an honest working indicator when it cannot.
        </p>
        <h2 className="mt-10 text-xl font-bold">5. Download</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Download the result, check the reported file sizes and, if you need another file
          processed, start again with one tap.
        </p>
        <h2 className="mt-10 text-xl font-bold">What happens to your files</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Tools that run in the browser read your file locally; the document is not uploaded to
          IXDocs. Where a tool needs a server-side engine, that is stated clearly on the tool page.
          See the privacy policy for full detail.
        </p>
      </div>
    </div>
  );
}
