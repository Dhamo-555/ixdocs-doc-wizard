import { createFileRoute } from "@tanstack/react-router";

const CONTACT_EMAIL_PLACEHOLDER = "support@ixdocs.com"; // Internal placeholder to be replaced in production

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact IXDocs — Support and Feedback" },
      {
        name: "description",
        content:
          "Get in touch with IXDocs for support, privacy queries, feedback, or legal questions.",
      },
      { property: "og:title", content: "Contact IXDocs — Support and Feedback" },
      {
        property: "og:description",
        content:
          "Get in touch with IXDocs for support, privacy queries, feedback, or legal questions.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ixdocs.com/contact" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://ixdocs.com/ixdocs-og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://ixdocs.com/contact" }],
  }),
  component: Page,
});

function Page() {
  const isEmailConfigured = CONTACT_EMAIL_PLACEHOLDER !== "CONTACT_EMAIL_PLACEHOLDER";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const category = formData.get("category") as string;
    const message = formData.get("message") as string;

    const subject = encodeURIComponent(`IXDocs Support: ${category}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:${CONTACT_EMAIL_PLACEHOLDER}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Contact IXDocs</h1>
        <p className="mt-3 text-base text-muted-foreground">
          If you have questions, feedback, or need support with our document tools, please select
          the appropriate category below.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-foreground">General Support</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              For questions regarding how to use IXDocs tools, reporting errors, or page layout
              difficulties.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-foreground">Privacy Queries</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              For questions regarding how we process files, cookies, or to submit applicable data
              requests.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-foreground">Security Reporting</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              For responsible disclosure and reporting of potential security vulnerabilities on the
              site.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-foreground">Legal Matters</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              For inquiries regarding our Terms of Service, policies, compliance, or other legal
              details.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground">Send us a Message</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            {isEmailConfigured
              ? "Fill out the form below or email us directly."
              : "Our contact forms and mailboxes are currently being set up. Message submissions are disabled at this time."}
          </p>

          {isEmailConfigured && (
            <div className="mt-4 text-sm text-foreground">
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${CONTACT_EMAIL_PLACEHOLDER}`}
                className="text-primary hover:underline"
              >
                {CONTACT_EMAIL_PLACEHOLDER}
              </a>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                disabled={!isEmailConfigured}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={!isEmailConfigured}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-sm font-medium text-foreground">
                Category
              </label>
              <select
                id="category"
                name="category"
                disabled={!isEmailConfigured}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground disabled:opacity-60"
              >
                <option value="support">General Support</option>
                <option value="privacy">Privacy</option>
                <option value="security">Security</option>
                <option value="legal">Legal</option>
                <option value="feedback">Feedback / Suggestions</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                disabled={!isEmailConfigured}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={!isEmailConfigured}
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
