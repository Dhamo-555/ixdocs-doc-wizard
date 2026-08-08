import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact IXDocs \u2014 Support and Feedback" },
      { name: "description", content: "Get in touch with IXDocs about a tool problem, a feature request or general feedback." },
      { property: "og:title", content: "Contact IXDocs \u2014 Support and Feedback" },
      { property: "og:description", content: "Get in touch with IXDocs about a tool problem, a feature request or general feedback." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Contact</h1>
        <p className="mt-3 text-base text-muted-foreground">Questions, bug reports and feature requests are all welcome.</p><h2 className="mt-10 text-xl font-bold">Support email</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A public support address has not been configured yet. It will be published here as soon as it is live — we would rather leave a placeholder than list an address that does not receive mail.</p><h2 className="mt-10 text-xl font-bold">What to include</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Tell us which tool you used, what you expected, what happened, and which browser and device you were on. That is usually enough to reproduce a problem.</p>
        <form className="mt-10 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" name="name" className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <textarea id="message" name="message" rows={5} className="w-full rounded-lg border border-input bg-background p-3 text-sm" />
          </div>
          <button type="submit" disabled className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60">
            Send message
          </button>
          <p className="text-xs text-muted-foreground">
            This form is not connected to a mailbox yet, so submissions are not sent anywhere. It is disabled rather
            than silently discarding your message.
          </p>
        </form>
      </div>
    </div>
  );
}
