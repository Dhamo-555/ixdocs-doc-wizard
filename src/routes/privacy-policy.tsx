import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — IXDocs" },
      {
        name: "description",
        content:
          "How IXDocs handles your data, document processing, cookies, and technical information.",
      },
      { property: "og:title", content: "Privacy Policy — IXDocs" },
      {
        property: "og:description",
        content:
          "How IXDocs handles your data, document processing, cookies, and technical information.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ixdocs.com/privacy-policy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://ixdocs.com/ixdocs-og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://ixdocs.com/privacy-policy" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-12">
      <div className="prose-ixdocs mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-xs text-muted-foreground">Last Updated: August 15, 2026</p>

        <p className="mt-6 text-base text-muted-foreground">
          This Privacy Policy explains how IXDocs handles information when you access our website
          and use our browser-based document and PDF tools.
        </p>

        <h2 className="mt-10 text-xl font-bold">1. Introduction</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          IXDocs provides practical browser-based document and PDF utilities. We are committed to
          transparency regarding how we handle technical data, usage metrics, and files processed
          through our platform.
        </p>

        <h2 className="mt-10 text-xl font-bold">2. Information We May Collect</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          When you use our service, we may collect the following categories of information:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-2 text-muted-foreground">
          <li>
            <strong>Information voluntarily provided:</strong> If you contact us or submit feedback,
            we collect the details you provide, such as your name, email address, and message
            content.
          </li>
          <li>
            <strong>Technical information:</strong> We may collect browser type, version, language,
            operating system, and device identifiers to ensure compatibility and diagnose technical
            problems.
          </li>
          <li>
            <strong>IP Address and Connection Data:</strong> The IXDocs application itself does not
            collect or log your IP address. However, as the website is delivered and secured through
            our infrastructure partners (including Cloudflare), connection data such as your IP
            address, browser type, and request timestamps may be necessarily processed at the
            network level to deliver the website, prevent malicious abuse, and mitigate DDoS
            attacks.
          </li>
          <li>
            <strong>Usage Information:</strong> We track basic interaction details, such as the
            specific tools used, click actions, and loading speeds to understand service
            performance.
          </li>
          <li>
            <strong>Cookies and Local Storage:</strong> Standard browser technologies may be used to
            store preferences, maintain session state, and support essential functionality.
          </li>
          <li>
            <strong>Files processed:</strong> Files you choose to upload for document processing
            where required by the specific tool's workflow.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">3. How We Use Information</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We use the information we collect to:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-2 text-muted-foreground">
          <li>Provide and run the requested document-processing tools.</li>
          <li>Maintain, monitor, and improve our services.</li>
          <li>Prevent abuse, fraud, spam, or security threats.</li>
          <li>Diagnose and fix technical errors.</li>
          <li>Respond to support queries and user requests.</li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">4. Document and File Processing</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Depending on the tool selected, files you upload may be processed directly in your local
          browser using client-side scripts, or transmitted to secure third-party server
          infrastructure when required to execute advanced operations (such as certain document
          conversions or optical character recognition). Files are processed solely to execute the
          requested action and return the result to you.
        </p>

        <h2 className="mt-10 text-xl font-bold">5. Data Retention</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Data retention depends on the workflow required for each specific tool. For browser-based
          processing, files remain in your local system memory and are cleared when the tab is
          closed. For workflows requiring server-side assistance, files are stored temporarily on
          secure infrastructure for the duration of the processing task and are deleted when the
          task completes or after a brief system cleanup interval.
        </p>

        <h2 className="mt-10 text-xl font-bold">6. Cookies and Similar Technologies</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          IXDocs uses essential technologies to support core website operations and remember your
          preferences. Specifically, we use a first-party browser local storage entry (
          <code>localStorage</code>) named <code>ixdocs:consent</code> to store your cookie and
          privacy choices. This storage does not contain uploaded document contents, PDFs, or
          unnecessary personal data, and it is not used for tracking purposes.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          In addition, we use an essential cookie (<code>sidebar:state</code>) to maintain your
          sidebar navigation preferences. You can manage your choices at any time by clicking the
          "Cookie Preferences" link in the footer of the page.
        </p>

        <h2 className="mt-10 text-xl font-bold">7. Analytics</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We may use third-party analytics services to evaluate traffic patterns, performance
          metrics, and application errors. These analytics help us understand how users interact
          with our features and allow us to make functional improvements.
        </p>

        <h2 className="mt-10 text-xl font-bold">8. Advertising</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We may display third-party advertisements in the future or when enabled. These ad networks
          may collect technical identifiers or set cookies to deliver relevant advertising. No
          document files or contents are ever shared with advertising providers.
        </p>

        <h2 className="mt-10 text-xl font-bold">9. Third-Party Services</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          IXDocs relies on the following third-party infrastructure and service providers:
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-2 text-muted-foreground">
          <li>
            <strong>Cloudflare:</strong> We use Cloudflare as our Content Delivery Network (CDN) and
            security proxy to optimize load times, cache assets, and protect against security
            threats (such as DDoS attacks). Cloudflare processes connection data (including IP
            addresses) at the network level on our behalf for these operational purposes.
          </li>
          <li>
            <strong>Google Fonts:</strong> We load typography assets dynamically from Google Fonts.
            When your browser requests these fonts, it makes a direct connection to Google's
            servers. Google receives standard browser request headers (such as your IP address and
            browser user-agent) to serve the correct font files, subject to Google's own privacy
            policy.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">10. Security</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We implement industry-standard administrative, physical, and technical measures to protect
          your documents and data from unauthorized access or alteration. However, please be aware
          that no security measure or transmission method over the internet is completely
          infallible.
        </p>

        <h2 className="mt-10 text-xl font-bold">11. User Rights and Privacy Requests</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Depending on your jurisdiction, you may have rights to access, delete, or restrict the
          processing of your data. You can submit privacy requests or questions concerning this
          policy through our contact channels.
        </p>

        <h2 className="mt-10 text-xl font-bold">12. Children's Privacy</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          IXDocs is intended for general audiences. We do not knowingly collect personal information
          from children without appropriate parental consent or where prohibited by law.
        </p>

        <h2 className="mt-10 text-xl font-bold">13. Changes to this Policy</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We may modify this policy at any time to reflect changes in our tools, technology updates,
          or legal compliance. Updates will be posted on this page with the revised date.
        </p>

        <h2 className="mt-10 text-xl font-bold">14. Contact</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          If you have questions about this policy, please reach out to us through our contact page.
        </p>
      </div>
    </div>
  );
}
