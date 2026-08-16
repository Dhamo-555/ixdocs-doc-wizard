import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — IXDocs" },
      {
        name: "description",
        content:
          "How cookies and similar local storage technologies are used on the IXDocs platform.",
      },
      { property: "og:title", content: "Cookie Policy — IXDocs" },
      {
        property: "og:description",
        content:
          "How cookies and similar local storage technologies are used on the IXDocs platform.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ixdocs.com/cookie-policy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://ixdocs.com/ixdocs-og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://ixdocs.com/cookie-policy" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Cookie Policy</h1>
        <p className="mt-2 text-xs text-muted-foreground">Last Updated: August 15, 2026</p>

        <h2 className="mt-10 text-xl font-bold">1. What Are Cookies?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Cookies are small text files stored on your computer or device by your web browser when
          you visit a website. They are widely used to remember preferences, analyze website
          traffic, support security measures, and ensure basic functionality works correctly.
          Similar browser technologies, such as local storage or session storage, may also be used
          for these purposes.
        </p>

        <h2 className="mt-10 text-xl font-bold">2. Why IXDocs May Use Cookies</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          IXDocs may use cookies and local storage for purposes including:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-2 text-muted-foreground">
          <li>
            <strong>Essential Functionality:</strong> To enable core site services, save temporary
            options selected inside tools, and maintain application state.
          </li>
          <li>
            <strong>Security:</strong> To detect, investigate, and prevent malicious actions or
            automated abuse of our document utilities.
          </li>
          <li>
            <strong>Preferences:</strong> To remember your selected display settings (such as theme
            preferences or UI configurations).
          </li>
          <li>
            <strong>Analytics:</strong> To analyze traffic patterns and performance, identify error
            logs, and optimize our tools.
          </li>
          <li>
            <strong>Advertising:</strong> To display relevant third-party advertisements in the
            future or when enabled.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">3. Essential Technologies</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          These technologies are required for core website operations and preference retention.
          Currently, the only active items are:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-2 text-muted-foreground">
          <li>
            <strong>sidebar:state (Cookie):</strong> An essential cookie used to remember whether
            you have expanded or collapsed the sidebar menu navigation. This cookie prevents layout
            shifting during server-side rendering (SSR) on page load.
          </li>
          <li>
            <strong>ixdocs:consent (Local Storage):</strong> An essential browser local storage
            entry used to store your cookie and privacy choices (e.g., your selection to reject
            optional technologies). This storage does not contain uploaded document contents, PDFs,
            or unnecessary personal data, and it is not used for tracking.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          No document content, personal details, or tracking information is ever stored inside these
          preference mechanisms.
        </p>

        <h2 className="mt-10 text-xl font-bold">4. Analytics Technologies</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Analytics cookies help us understand how visitors interact with the site by gathering
          anonymous statistics on pages visited, loading times, and errors. These analytics do not
          contain personal details or document information.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground italic">
          Note: We do not install analytics scripts or tracking services in this implementation
          phase.
        </p>

        <h2 className="mt-10 text-xl font-bold">5. Advertising Technologies</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          When advertisements are enabled or integrated, ad networks may set cookies to serve
          targeted ads or track advertisement impressions.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground italic">
          Note: No third-party advertisements or ad tracking cookies are active in this
          implementation phase.
        </p>

        <h2 className="mt-10 text-xl font-bold">6. Third-Party Technologies</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Some cookies or technologies may be placed by third-party services that appear on our
          pages. We do not list specific advertising or analytics vendors in this policy until they
          are officially selected, integrated, and implemented.
        </p>

        <h2 className="mt-10 text-xl font-bold">7. User Choices and Cookie Preferences</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You can choose to block, delete, or disable cookies in your web browser settings. Please
          note that blocking essential cookies may affect the usability or layout of certain tools.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can manage your cookie preferences at any time by clicking the "Cookie Preferences"
          link in the footer of this website.
        </p>

        <h2 className="mt-10 text-xl font-bold">8. Managing Cookies in Your Browser</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Most web browsers allow you to control cookies through their preference settings. You can
          consult your browser's documentation (e.g. Chrome, Firefox, Safari, Edge) to learn how to
          manage and remove cookies.
        </p>

        <h2 className="mt-10 text-xl font-bold">9. Updates</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We may update this Cookie Policy to reflect changes in our technologies, service
          providers, or regulatory guidelines. We recommend reviewing this page periodically for
          updates.
        </p>
      </div>
    </div>
  );
}
