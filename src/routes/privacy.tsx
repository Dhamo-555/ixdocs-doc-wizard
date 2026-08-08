import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy \u2014 IXDocs" },
      { name: "description", content: "How IXDocs handles your documents, what runs in your browser, what data is collected and how advertising and cookies are used." },
      { property: "og:title", content: "Privacy Policy \u2014 IXDocs" },
      { property: "og:description", content: "How IXDocs handles your documents, what runs in your browser, what data is collected and how advertising and cookies are used." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Privacy policy</h1>
        <p className="mt-3 text-base text-muted-foreground">This policy describes how IXDocs handles your files and your data. It reflects how the site actually works today.</p><h2 className="mt-10 text-xl font-bold">How your files are handled</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The tools currently available process files in your browser using your device's own resources. The document you select is read locally and the result is generated locally; it is not uploaded to an IXDocs server.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Some planned tools — such as Word conversion, OCR and PDF encryption — require a server-side engine. Those engines are not connected yet, and each affected tool says so on its page. When server processing is introduced, this policy will be updated to describe temporary storage and deletion timescales before the feature goes live.</p><h2 className="mt-10 text-xl font-bold">Information we collect</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">We do not require an account, and we do not ask for personal information to use a tool. Standard technical information such as your browser type, device type and pages visited may be collected through analytics to understand which tools are used.</p><h2 className="mt-10 text-xl font-bold">Cookies and local storage</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Cookies or local storage may be used for essential site function and for analytics and advertising as described below. No document content is ever stored in them.</p><h2 className="mt-10 text-xl font-bold">Advertising</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">IXDocs is funded by advertising. Ad slots are reserved in the layout and, when a network is connected, that provider may set cookies or use device identifiers subject to its own privacy policy. No advertising provider receives your documents.</p><h2 className="mt-10 text-xl font-bold">Third-party services</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Any third-party analytics or advertising provider used will be listed here once connected, along with a link to its privacy policy.</p><h2 className="mt-10 text-xl font-bold">Your choices</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">You can block cookies in your browser settings, and browser-based tools continue to work. Because files are processed locally, closing the tab removes the working copy from memory.</p><h2 className="mt-10 text-xl font-bold">Changes</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">We will update this page whenever processing changes. Material changes will be described plainly rather than buried in legal text.</p>
      </div>
    </div>
  );
}
