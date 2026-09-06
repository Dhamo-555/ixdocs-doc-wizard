import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Scale,
  KeyRound,
  FileText,
  QrCode,
  Clock,
  Calendar,
  Percent,
  Cake,
  ShieldAlert,
  Receipt,
} from "lucide-react";

export type CalculatorCategory =
  "math" | "conversion" | "security" | "text" | "datetime" | "finance" | "utility" | "billing";

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CalculatorMeta {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  metaDescription: string;
  category: CalculatorCategory;
  icon: LucideIcon;
  badge?: string;
  popular?: boolean;
  keywords: string[];
  formula?: string;
  explanation: string;
  howItWorks: string[];
  faqs: CalculatorFaq[];
  relatedSlugs: string[];
}

export const CATEGORY_LABELS: Record<CalculatorCategory, string> = {
  math: "Math & Arithmetic",
  conversion: "Unit & Time Converters",
  security: "Privacy & Security",
  text: "Text & Content",
  datetime: "Date & Age",
  finance: "Finance & Interest",
  utility: "Utilities & Tools",
  billing: "Billing & Invoicing",
};

export const CALCULATORS: CalculatorMeta[] = [
  {
    id: "basic-calculator",
    slug: "basic-calculator",
    name: "Basic Calculator",
    shortDescription:
      "Clean, fast arithmetic calculator for everyday addition, subtraction, multiplication, and division.",
    metaDescription:
      "Free online basic calculator. Perform fast, accurate arithmetic with memory functions directly in your browser. No sign-up required.",
    category: "math",
    icon: Calculator,
    popular: true,
    keywords: [
      "calculator",
      "math",
      "arithmetic",
      "addition",
      "subtraction",
      "multiplication",
      "division",
      "online calculator",
    ],
    formula: "Standard infix arithmetic notation (BODMAS / PEMDAS precedence)",
    explanation:
      "This basic calculator performs everyday mathematical calculations using standard operator precedence (multiplication and division before addition and subtraction). All operations are evaluated instantly in your browser using floating-point precision.",
    howItWorks: [
      "Enter numbers using your keyboard or on-screen buttons.",
      "Select an arithmetic operator (+, −, ×, ÷).",
      "Press '=' or Enter to calculate the final result.",
      "Use 'C' to clear the display or '⌫' to backspace.",
    ],
    faqs: [
      {
        question: "Does this calculator support keyboard input?",
        answer:
          "Yes, you can use your computer's number keys, numpad, operator keys (+, -, *, /), and Enter key to perform calculations seamlessly.",
      },
      {
        question: "Does it preserve calculation history?",
        answer:
          "Yes, recent calculations are displayed in your session history directly on this page.",
      },
    ],
    relatedSlugs: ["interest-calculator", "unit-converter", "bill-calculator"],
  },
  {
    id: "unit-converter",
    slug: "unit-converter",
    name: "Unit Converter",
    shortDescription:
      "Instant conversions between metric and imperial units for length, weight, temperature, and speed.",
    metaDescription:
      "Free unit converter for length, mass, temperature, speed, volume, and area. Fast, accurate, and runs completely in your browser.",
    category: "conversion",
    icon: Scale,
    popular: true,
    keywords: [
      "unit converter",
      "metric to imperial",
      "length converter",
      "weight converter",
      "temperature converter",
      "conversion tool",
    ],
    formula:
      "Converted Value = Input × Conversion Factor (or dedicated scale formula for temperature)",
    explanation:
      "Convert measurement units seamlessly between metric and imperial systems. Supports length (meters, feet, inches, miles, kilometers), mass/weight (kilograms, pounds, ounces, grams), temperature (Celsius, Fahrenheit, Kelvin), speed, volume, and area.",
    howItWorks: [
      "Select the measurement category (e.g., Length, Mass, Temperature).",
      "Choose your 'From' unit and 'To' unit from the dropdowns.",
      "Type any value in the input field to see instant two-way conversion.",
    ],
    faqs: [
      {
        question: "How accurate are the conversion rates?",
        answer:
          "Conversions use exact international standard conversion factors (such as 1 inch = 2.54 cm and 1 lb = 0.45359237 kg) with high-precision arithmetic.",
      },
      {
        question: "Can I convert temperatures like Celsius to Fahrenheit?",
        answer:
          "Yes, standard temperature scales (Celsius, Fahrenheit, Kelvin) are supported with exact conversion formulas.",
      },
    ],
    relatedSlugs: ["basic-calculator", "timezone-converter", "date-calculator"],
  },
  {
    id: "password-generator",
    slug: "password-generator",
    name: "Password Generator",
    shortDescription:
      "Generate cryptographically secure random passwords with customizable lengths and character sets.",
    metaDescription:
      "Free, cryptographically secure password generator using browser crypto.getRandomValues(). Customize length, symbols, and numbers with zero server storage.",
    category: "security",
    icon: KeyRound,
    popular: true,
    keywords: [
      "password generator",
      "secure password",
      "random password",
      "strong password generator",
      "crypto generator",
    ],
    formula: "Entropy = Length × log₂(Character Pool Size) bits",
    explanation:
      "Generates high-entropy passwords using your browser's native Web Cryptography API (crypto.getRandomValues). Your generated passwords never leave your device and are never sent over any network or stored in any database.",
    howItWorks: [
      "Choose your desired password length (8 to 64 characters).",
      "Select which character sets to include: uppercase, lowercase, numbers, and symbols.",
      "Optionally enable 'Avoid Ambiguous' to exclude look-alike characters like 0, O, 1, and l.",
      "Click 'Generate' and copy your new secure password with one click.",
    ],
    faqs: [
      {
        question: "Are generated passwords saved anywhere?",
        answer:
          "No. Passwords are created entirely in your browser's local memory and discarded immediately when you leave or refresh the page.",
      },
      {
        question: "Why is crypto.getRandomValues() better than Math.random()?",
        answer:
          "crypto.getRandomValues() accesses cryptographically secure hardware-derived entropy, making it impossible for attackers to predict generated sequences, whereas Math.random() is pseudo-random and predictable.",
      },
    ],
    relatedSlugs: ["random-password-generator", "qr-generator", "word-counter"],
  },
  {
    id: "word-counter",
    slug: "word-counter",
    name: "Word Counter",
    shortDescription:
      "Real-time count of words, characters, sentences, paragraphs, and estimated reading time.",
    metaDescription:
      "Free online word counter and text statistics tool. Count words, characters, spaces, sentences, and calculate reading and speaking time in real time.",
    category: "text",
    icon: FileText,
    popular: true,
    keywords: [
      "word counter",
      "character count",
      "text counter",
      "reading time calculator",
      "sentence counter",
      "word count tool",
    ],
    formula:
      "Reading Time = Total Words ÷ 200 words/min; Speaking Time = Total Words ÷ 130 words/min",
    explanation:
      "Analyze your writing in real time. Paste or type text to get immediate statistics on word count, character count (with and without spaces), sentence count, paragraph count, and average reading time.",
    howItWorks: [
      "Paste or type your text into the text area.",
      "Metrics update automatically with every keystroke.",
      "Review reading time, speaking time, and detailed character breakdowns.",
    ],
    faqs: [
      {
        question: "Is my text private?",
        answer:
          "Yes, 100% private. Text analysis occurs purely in your browser memory. Nothing is ever uploaded to a server.",
      },
      {
        question: "What reading speed is used for the reading time estimate?",
        answer:
          "We use the standard average adult silent reading speed of 200 words per minute and speaking speed of 130 words per minute.",
      },
    ],
    relatedSlugs: ["password-generator", "basic-calculator", "unit-converter"],
  },
  {
    id: "qr-generator",
    slug: "qr-generator",
    name: "QR Code Generator",
    shortDescription:
      "Generate clean, high-resolution QR codes for URLs, plain text, Wi-Fi networks, and contact info.",
    metaDescription:
      "Free online QR code generator. Create instant, high-quality QR codes for links, text, and contact details with customizable error correction.",
    category: "utility",
    icon: QrCode,
    popular: true,
    keywords: [
      "qr code generator",
      "create qr code",
      "free qr code",
      "barcode generator",
      "qr maker",
    ],
    formula: "ISO/IEC 18004 QR Code Matrix Encoding with Reed-Solomon Error Correction",
    explanation:
      "Create custom QR codes instantly in your browser. Generates sharp, scannable QR codes for web links, text notes, Wi-Fi credentials, or phone numbers with downloadable PNG format.",
    howItWorks: [
      "Enter your target URL or text into the input field.",
      "Select your preferred size and error correction level.",
      "The QR code renders instantly in real time.",
      "Click 'Download PNG' to save the generated QR code image.",
    ],
    faqs: [
      {
        question: "Do these QR codes ever expire?",
        answer:
          "No, they are static QR codes. The encoded data is embedded directly into the visual pattern, so they work forever without any redirection service.",
      },
      {
        question: "Can I use the generated QR codes commercially?",
        answer: "Yes, all generated QR codes are 100% free for both personal and commercial use.",
      },
    ],
    relatedSlugs: ["password-generator", "word-counter", "unit-converter"],
  },
  {
    id: "timezone-converter",
    slug: "timezone-converter",
    name: "Timezone Converter",
    shortDescription:
      "Convert dates and times across global timezones with daylight saving time awareness.",
    metaDescription:
      "Free timezone converter. Convert times between UTC, EST, PST, GMT, CET, IST, JST, and worldwide timezones instantly with automatic DST adjustments.",
    category: "datetime",
    icon: Clock,
    popular: false,
    keywords: [
      "timezone converter",
      "time zone tool",
      "utc converter",
      "est to gmt",
      "world clock converter",
      "meeting planner",
    ],
    formula:
      "Target Time = Source Time UTC + Target Timezone Offset (adjusted for daylight saving time)",
    explanation:
      "Easily compare times across cities and international time zones. Enter a date and time in one timezone to see the exact corresponding time in multiple destinations simultaneously.",
    howItWorks: [
      "Pick a date and time.",
      "Select your origin timezone (defaults to your local device timezone).",
      "Select your destination timezone to view the converted time and hour difference.",
    ],
    faqs: [
      {
        question: "Does this converter account for Daylight Saving Time (DST)?",
        answer:
          "Yes, it uses your browser's built-in Internationalization API (Intl) which includes up-to-date IANA timezone rules and DST transitions.",
      },
      {
        question: "Can I compare multiple timezones at once?",
        answer:
          "Yes, you can view major global business hubs (New York, London, Tokyo, Sydney, Dubai) alongside your selected target timezone.",
      },
    ],
    relatedSlugs: ["date-calculator", "age-calculator", "basic-calculator"],
  },
  {
    id: "date-calculator",
    slug: "date-calculator",
    name: "Date Calculator",
    shortDescription:
      "Calculate the exact duration between two dates or add/subtract days, weeks, and months from any date.",
    metaDescription:
      "Free date calculator. Calculate days between two dates, add or subtract days, weeks, or months, and find future or past dates accurately.",
    category: "datetime",
    icon: Calendar,
    popular: true,
    keywords: [
      "date calculator",
      "days between dates",
      "add days to date",
      "calendar calculator",
      "date difference calculator",
    ],
    formula: "Days Elapsed = (End Date - Start Date) in milliseconds ÷ 86,400,000",
    explanation:
      "Determine the exact number of days, weeks, months, and years between any two calendar dates, or calculate the exact future or past date by adding or subtracting a given duration.",
    howItWorks: [
      "Choose mode: 'Duration Between Dates' or 'Add / Subtract Days'.",
      "Select the start date (and end date, if calculating difference).",
      "View the breakdown in total days, weeks + days, and calendar months.",
    ],
    faqs: [
      {
        question: "Does it count leap years correctly?",
        answer:
          "Yes, leap years and variable month lengths are accurately accounted for using the standard Gregorian calendar.",
      },
      {
        question: "Can I exclude weekends or business days?",
        answer:
          "The calculator provides both total calendar days and the total number of business days (Monday through Friday) between your dates.",
      },
    ],
    relatedSlugs: ["age-calculator", "timezone-converter", "interest-calculator"],
  },
  {
    id: "interest-calculator",
    slug: "interest-calculator",
    name: "Interest Calculator",
    shortDescription:
      "Calculate simple and compound interest, total accrued balance, and yearly growth projections.",
    metaDescription:
      "Free interest calculator for simple and compound interest. Calculate savings growth, loan interest, annual compounding, and total payouts.",
    category: "finance",
    icon: Percent,
    popular: true,
    keywords: [
      "interest calculator",
      "compound interest",
      "simple interest",
      "savings calculator",
      "finance calculator",
      "investment growth",
    ],
    formula: "Compound: A = P(1 + r/n)^(nt) | Simple: I = P × r × t",
    explanation:
      "Calculate how investments grow or how much interest is owed on loans. Supports both simple interest and compound interest with customizable compounding frequencies (annually, semiannually, quarterly, monthly, daily).",
    howItWorks: [
      "Enter the initial principal amount.",
      "Enter the annual interest rate (%).",
      "Specify the time period in years or months.",
      "Select simple interest or compound frequency to view the total interest and final balance.",
    ],
    faqs: [
      {
        question: "What is the difference between simple and compound interest?",
        answer:
          "Simple interest is calculated only on the initial principal. Compound interest is calculated on the initial principal PLUS all previously accumulated interest.",
      },
      {
        question: "Can I see a yearly breakdown?",
        answer:
          "Yes, an annual growth schedule is automatically generated showing beginning balance, interest earned, and ending balance for each year.",
      },
    ],
    relatedSlugs: ["basic-calculator", "bill-calculator", "unit-converter"],
  },
  {
    id: "age-calculator",
    slug: "age-calculator",
    name: "Age Calculator",
    shortDescription:
      "Find your exact age in years, months, weeks, days, and hours, plus countdown to your next birthday.",
    metaDescription:
      "Free online age calculator. Find your exact age in years, months, days, hours, and minutes from your date of birth, plus birthday countdown.",
    category: "datetime",
    icon: Cake,
    popular: true,
    keywords: [
      "age calculator",
      "calculate age",
      "exact age in days",
      "birthday countdown",
      "how old am i",
    ],
    formula:
      "Age = Reference Date - Date of Birth (evaluated in full calendar years, remaining months, and remaining days)",
    explanation:
      "Calculate exact chronological age from a date of birth. See your age broken down into years, months, and days, along with total elapsed weeks, days, hours, and a countdown to your next birthday.",
    howItWorks: [
      "Select your Date of Birth.",
      "Optionally select a reference date (defaults to today).",
      "Instant results reveal your exact age and fun milestone statistics.",
    ],
    faqs: [
      {
        question: "Does the calculation handle leap years?",
        answer:
          "Yes, all leap days and differing days per month are precisely handled according to calendar rules.",
      },
      {
        question: "Can I calculate how old someone was on a past date?",
        answer: "Yes, simply adjust the 'Age at Date' field to any past or future date.",
      },
    ],
    relatedSlugs: ["date-calculator", "timezone-converter", "basic-calculator"],
  },
  {
    id: "random-password-generator",
    slug: "random-password-generator",
    name: "Random Password Generator",
    shortDescription:
      "Quick one-click generator for random PINs, passphrases, and high-entropy passwords.",
    metaDescription:
      "Fast, secure random password and PIN generator. Generate memorably strong passwords or numeric PINs in seconds with client-side Web Crypto.",
    category: "security",
    icon: ShieldAlert,
    popular: false,
    keywords: [
      "random password generator",
      "pin generator",
      "passphrase generator",
      "quick password",
      "secure pin",
    ],
    formula:
      "Cryptographic pseudo-random byte extraction mapped uniformly over filtered character alphabets",
    explanation:
      "Need a fast, randomized credential? Generate secure alphanumeric passwords, numeric PIN codes, or memorable hyphenated passphrases instantly with zero setup.",
    howItWorks: [
      "Choose your preset: 'Standard', 'Ultra Strong', 'PIN (Numeric)', or 'Memorable'.",
      "Adjust length if desired.",
      "Click 'Generate New' and copy directly to your clipboard.",
    ],
    faqs: [
      {
        question: "How are the random bytes sourced?",
        answer:
          "Every character is selected using window.crypto.getRandomValues(), ensuring strict cryptographic randomness without server involvement.",
      },
      {
        question: "What makes a password strong?",
        answer:
          "Length and character diversity are key. A 16-character password with mixed uppercase, lowercase, numbers, and symbols provides over 95 bits of entropy, which takes trillions of years to brute force.",
      },
    ],
    relatedSlugs: ["password-generator", "qr-generator", "word-counter"],
  },
  {
    id: "bill-calculator",
    slug: "bill-calculator",
    name: "Bill Calculator",
    shortDescription:
      "Create professional bills with GST support, scan barcodes with your camera, and download clean PDF receipts.",
    metaDescription:
      "Free online bill calculator. Create invoices with GST, scan product barcodes, and generate PDF receipts — 100% in your browser. No data uploaded.",
    category: "billing",
    icon: Receipt,
    popular: false,
    keywords: [
      "bill calculator",
      "invoice generator",
      "receipt maker",
      "GST calculator",
      "barcode scanner",
      "billing tool",
      "POS calculator",
      "retail bill",
    ],
    formula: "Subtotal = Σ(Qty × Price) | GST = Subtotal × Rate% | Total = Subtotal + GST",
    explanation:
      "Create bills and invoices with multiple products, GST calculation, and PDF generation — all in your browser. Switch to Barcode Bill mode to use your device camera to scan product barcodes.",
    howItWorks: [
      "Enter your company or shop name.",
      "Add products manually (Basic Bill) or scan barcodes with your camera (Barcode Bill).",
      "Set quantity and unit price for each item. Line totals calculate automatically.",
      "Optionally enable GST and choose a percentage.",
      "Click 'Generate PDF Bill' to download a clean, professional receipt.",
    ],
    faqs: [
      {
        question: "Does the barcode scanner upload camera footage?",
        answer:
          "No. Barcode detection uses the browser's native BarcodeDetector API and runs entirely locally on your device. Camera footage is never sent to any server.",
      },
      {
        question: "Which browsers support barcode scanning?",
        answer:
          "Chrome 83+, Edge 83+, and Samsung Internet support the BarcodeDetector API. Firefox and Safari users can still create bills manually using Basic Bill mode.",
      },
      {
        question: "Can I apply GST to my bill?",
        answer:
          "Yes. Toggle GST on and enter any percentage. Quick-pick buttons for 5%, 12%, 18%, and 28% are provided for Indian GST slabs.",
      },
    ],
    relatedSlugs: ["basic-calculator", "interest-calculator", "qr-generator"],
  },
];

export const POPULAR_CALCULATORS = CALCULATORS.filter((c) => c.popular);

export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  if (!Array.isArray(CALCULATORS)) return undefined;
  return CALCULATORS.find((c) => c.slug === slug);
}

export function getRelatedCalculators(currentSlug: string): CalculatorMeta[] {
  const current = getCalculatorBySlug(currentSlug);
  if (!current) return [];
  return current.relatedSlugs
    .map((s) => getCalculatorBySlug(s))
    .filter((c): c is CalculatorMeta => c !== undefined);
}

export function calcRouteHead(slug: string) {
  const calcMeta = getCalculatorBySlug(slug);
  if (!calcMeta) {
    return {
      meta: [{ title: "IXDocs Calculator" }],
    };
  }
  const url = `https://calc.ixdocs.com/${calcMeta.slug}`;
  return {
    meta: [
      { title: `${calcMeta.name} — Free Online Tool | IXDocs Calculator` },
      { name: "description", content: calcMeta.metaDescription },
      { property: "og:title", content: `${calcMeta.name} — IXDocs Calculator` },
      { property: "og:description", content: calcMeta.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: calcMeta.name,
          url,
          description: calcMeta.metaDescription,
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: calcMeta.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  };
}
