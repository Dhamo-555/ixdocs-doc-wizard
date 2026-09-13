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
  Barcode,
  Divide,
  GitCompare,
  BarChart3,
  GraduationCap,
  Landmark,
  Home,
  CreditCard,
  Tag,
  Coins,
  ReceiptText,
  TrendingUp,
  Hourglass,
  Database,
  Fuel,
  Activity,
  Flame,
} from "lucide-react";

export type CalculatorCategory =
  | "everyday"
  | "finance"
  | "math"
  | "health"
  | "datetime"
  | "conversion"
  | "productivity"
  | "security"
  | "qr-barcode"
  | "billing";

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CalculatorExample {
  title: string;
  description: string;
  steps?: string[];
}

export interface CalculatorMeta {
  id: string;
  slug: string;
  name: string;
  pageTitle?: string | undefined;
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
  example?: CalculatorExample | undefined;
  ogImage?: string | undefined;
  faqs: CalculatorFaq[];
  relatedSlugs: string[];
}

export const CATEGORY_LABELS: Record<CalculatorCategory, string> = {
  everyday: "Everyday",
  finance: "Finance",
  math: "Math",
  health: "Health & Fitness",
  datetime: "Time & Date",
  conversion: "Converters",
  productivity: "Productivity",
  security: "Security",
  "qr-barcode": "QR & Barcode",
  billing: "Billing & Invoicing",
};

const RAW_CALCULATORS: CalculatorMeta[] = [
  // ── 1. Everyday ─────────────────────────────────────────────────────────────
  {
    id: "basic-calculator",
    slug: "basic-calculator",
    name: "Basic Calculator",
    shortDescription:
      "Clean, fast arithmetic calculator for everyday addition, subtraction, multiplication, and division.",
    metaDescription:
      "Free online basic calculator. Perform fast, accurate arithmetic with memory functions directly in your browser. No sign-up required.",
    category: "everyday",
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
      "This basic calculator performs everyday mathematical calculations using standard operator precedence. All operations are evaluated instantly in your browser using IEEE floating-point precision.",
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
    relatedSlugs: ["percentage-calculator", "discount-calculator", "tip-calculator"],
  },
  {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    shortDescription:
      "Quickly solve percentage problems: calculate X% of Y, what % is X of Y, percentage change, and percentage difference.",
    metaDescription:
      "Free online percentage calculator. Calculate percentage increase, decrease, fraction of a whole, and percentage differences instantly.",
    category: "everyday",
    icon: Percent,
    popular: true,
    keywords: [
      "percentage calculator",
      "percent increase",
      "percent decrease",
      "percent difference",
      "percent of",
    ],
    formula: "Percentage = (Part / Whole) × 100",
    explanation:
      "Percentages express a number as a fraction of 100 and are used everywhere from shopping discounts and exam scores to financial growth and statistical analysis. This calculator covers four common percentage problems: finding a percentage of a value, determining what percentage one number is of another, calculating percentage increase or decrease between two values, and finding the relative percentage difference between two independent numbers.",
    howItWorks: [
      "Choose your desired calculation mode (What is X% of Y, Percent Change, etc.).",
      "Enter your starting and comparison values.",
      "The result and step-by-step breakdown calculate in real-time.",
    ],
    example: {
      title: "Example: Calculating a discount",
      description:
        "A product costs ₹4,500 and is on sale at 20% off. To find the discount amount: 20% of 4,500 = (20 / 100) × 4,500 = 900. The sale price is 4,500 − 900 = ₹3,600.",
      steps: [
        'Select the "What is X% of Y?" mode.',
        "Enter 20 in the Percentage field.",
        "Enter 4500 in the Of Value field.",
        "The result shows 900 — that is your discount amount.",
      ],
    },
    faqs: [
      {
        question: "How do I calculate percentage increase?",
        answer:
          "Subtract the original value from the new value, divide by the original value, and multiply by 100. For example, going from 80 to 100 is a 25% increase: ((100 − 80) / 80) × 100 = 25%.",
      },
      {
        question: "What is the difference between percent change and percent difference?",
        answer:
          "Percent change compares a final value to an initial starting point and has a direction (increase or decrease). Percent difference compares two independent numbers against their mutual average and has no directional meaning.",
      },
      {
        question: "How do I find what percentage X is of Y?",
        answer:
          "Divide X by Y and multiply by 100. For example, 25 is what percent of 200? Answer: (25 / 200) × 100 = 12.5%.",
      },
      {
        question: "How do I calculate percentage decrease?",
        answer:
          "Use the same formula as percentage change: ((New − Old) / |Old|) × 100. When the result is negative, that is a decrease. For example, a drop from 500 to 400 is a 20% decrease.",
      },
      {
        question: "Is this calculator free and does it require an account?",
        answer:
          "Completely free, no account or registration needed. All calculations run in your browser and nothing is stored.",
      },
    ],
    relatedSlugs: ["discount-calculator", "sales-tax-calculator", "tip-calculator"],
  },
  {
    id: "discount-calculator",
    slug: "discount-calculator",
    name: "Discount Calculator",
    shortDescription:
      "Calculate sale prices, total dollars saved, stacked double discounts, and sales tax at checkout.",
    metaDescription:
      "Free discount calculator. Calculate final sale prices, money saved, stacked discounts, and after-tax totals instantly.",
    category: "everyday",
    icon: Tag,
    popular: true,
    keywords: [
      "discount calculator",
      "sale price calculator",
      "percent off calculator",
      "shopping discount",
    ],
    formula: "Final Price = Original Price × (1 - Discount / 100)",
    explanation:
      "Determine exactly how much you pay and save during retail sales. Supports secondary stacked discounts (e.g. 25% off + additional 10% coupon) and local sales tax estimation.",
    howItWorks: [
      "Enter the original sticker price.",
      "Enter the primary discount percentage.",
      "Optionally enter extra coupon discounts or local sales tax.",
      "See final cost and your exact total savings.",
    ],
    faqs: [
      {
        question: "How do stacked discounts work?",
        answer:
          "Secondary discounts are applied to the already-discounted price, not the original MSRP.",
      },
    ],
    relatedSlugs: ["percentage-calculator", "sales-tax-calculator", "tip-calculator"],
  },
  {
    id: "tip-calculator",
    slug: "tip-calculator",
    name: "Tip Calculator",
    shortDescription:
      "Calculate restaurant tips and split the bill fairly across any number of dining guests.",
    metaDescription:
      "Free tip calculator and bill splitter. Calculate custom tip percentages and divide restaurant bills equally per person.",
    category: "everyday",
    icon: Coins,
    popular: true,
    keywords: ["tip calculator", "bill splitter", "restaurant tip", "gratuity calculator"],
    formula:
      "Tip Amount = Bill Subtotal × (Tip % / 100)  |  Per Person = (Bill Subtotal + Tip) / Split Count",
    explanation:
      "The tip calculator simplifies dining etiquette and group bill payments by computing gratuity amounts and splitting totals among dining companions. You can select standard gratuity percentages (10%, 15%, 18%, 20%, or custom), view total tip cost, and split the final bill evenly with optional round-up features.",
    howItWorks: [
      "Enter the total food and drink bill.",
      "Select your tip percentage.",
      "Specify how many people are splitting the bill.",
    ],
    example: {
      title: "Example: Dinner Bill Split for 4 People",
      description:
        "Bill subtotal = ₹2,400 | Selected tip = 15% (₹360) | Total bill with tip = ₹2,760 | Divided among 4 people. Each person pays exactly ₹690.",
      steps: [
        "Subtotal: ₹2,400",
        "15% Gratuity: ₹360",
        "Total payment: ₹2,760",
        "Cost per person (4 ways): ₹690",
      ],
    },
    faqs: [
      {
        question: "What is considered standard tipping etiquette for restaurant service?",
        answer:
          "In full-service restaurants, 15% to 20% is customary for attentive service, 10% for adequate service, and 20%+ for exceptional hospitality.",
      },
      {
        question: "Should tip percentages be calculated before or after sales tax?",
        answer:
          "Standard dining etiquette recommends calculating tips on the pre-tax food and beverage subtotal rather than on government sales tax.",
      },
      {
        question: "How does the per-person bill split feature work?",
        answer:
          "The total bill (including gratuity) is divided equally by the number of people in your party, showing the exact amount each diner owes.",
      },
      {
        question: "Can I enter a custom tip percentage?",
        answer:
          "Yes. In addition to standard preset percentages, you can specify any custom gratuity percentage or fixed dollar amount.",
      },
      {
        question: "Is any dining or payment data stored when using this calculator?",
        answer:
          "No. All bill math executes locally in your browser without saving, logging, or transmitting any personal or payment data.",
      },
    ],
    relatedSlugs: ["discount-calculator", "sales-tax-calculator", "basic-calculator"],
  },
  {
    id: "sales-tax-calculator",
    slug: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    shortDescription:
      "Calculate sales tax and total purchase costs, or reverse-calculate pre-tax amounts from total receipts.",
    metaDescription:
      "Free sales tax calculator. Calculate sales tax on purchases, or reverse-calculate the net price before tax from receipt totals.",
    category: "everyday",
    icon: ReceiptText,
    keywords: ["sales tax calculator", "reverse tax calculator", "tax rate", "gross to net price"],
    formula: "Tax = Price × (Rate / 100); Net = Total / (1 + Rate / 100)",
    explanation:
      "Compute sales tax additions or reverse out VAT/GST from a final grand total to verify invoice and receipt breakdowns.",
    howItWorks: [
      "Select Forward (add tax) or Reverse (find pre-tax price) mode.",
      "Enter the price and applicable tax rate percentage.",
      "Get instant breakdown of net price, tax amount, and gross total.",
    ],
    faqs: [
      {
        question: "Can I use this for VAT or GST?",
        answer: "Yes, the arithmetic for VAT, GST, and sales tax is identical.",
      },
    ],
    relatedSlugs: ["percentage-calculator", "discount-calculator", "bill-calculator"],
  },

  // ── 2. Finance ──────────────────────────────────────────────────────────────
  {
    id: "interest-calculator",
    slug: "interest-calculator",
    name: "Interest Calculator",
    shortDescription:
      "Calculate simple and compound interest, investment returns, and annual percentage yields (APY).",
    metaDescription:
      "Free interest calculator. Compute simple and compound interest growth, total earnings, and APY over custom investment periods.",
    category: "finance",
    icon: TrendingUp,
    popular: true,
    keywords: [
      "interest calculator",
      "compound interest",
      "simple interest",
      "investment growth",
      "apy calculator",
    ],
    formula: "Compound: A = P × (1 + r/n)^(n×t); Simple: A = P × (1 + r×t)",
    explanation:
      "Calculate interest growth across daily, monthly, quarterly, or annual compounding frequencies with live APY calculations.",
    howItWorks: [
      "Enter principal amount, annual interest rate, and duration in years.",
      "Choose compound or simple interest model.",
      "Review the projected final balance and total interest earned.",
    ],
    faqs: [
      {
        question: "How does compounding frequency affect returns?",
        answer:
          "More frequent compounding (e.g. daily vs annually) yields slightly higher effective annual returns.",
      },
    ],
    relatedSlugs: ["compound-interest-calculator", "loan-calculator", "emi-calculator"],
  },
  {
    id: "compound-interest-calculator",
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    shortDescription:
      "Project long-term wealth accumulation with periodic monthly deposits and compounding returns.",
    metaDescription:
      "Free compound interest calculator with regular monthly contributions. See future portfolio value and yearly growth tables.",
    category: "finance",
    icon: Landmark,
    popular: true,
    keywords: [
      "compound interest calculator",
      "monthly contribution",
      "investment growth",
      "future value",
      "401k calculator",
    ],
    formula: "A = P × (1 + r/n)^(n×t) + PMT × [((1 + r/n)^(n×t) − 1) / (r/n)]",
    explanation:
      "Compound interest is the addition of interest to the principal sum of an investment, effectively earning 'interest on interest'. Over time, compounding creates exponential wealth growth compared to simple interest. This calculator models initial principal, recurring deposits, annual interest rates, compounding frequencies (annually, semi-annually, quarterly, monthly, or daily), and total investment horizons.",
    howItWorks: [
      "Set your starting principal and planned monthly or annual contribution.",
      "Set expected annual return rate and duration.",
      "Inspect the interactive yearly growth breakdown.",
    ],
    example: {
      title: "Example: Investing ₹1,00,000 for 10 Years",
      description:
        "Initial principal (P) = ₹1,00,000 | Annual interest rate = 8% | Compounded monthly (n = 12) | Investment tenure = 10 years (t = 10). Without any additional monthly contributions, the future value reaches approximately ₹2,21,964.",
      steps: [
        "Initial investment: ₹1,00,000",
        "Total interest accumulated: ₹1,21,964 (more than 120% of original principal)",
        "Final account balance: ₹2,21,964",
        "Higher compounding frequency (e.g. monthly vs annually) increases overall returns.",
      ],
    },
    faqs: [
      {
        question: "How does compound interest differ from simple interest?",
        answer:
          "Simple interest is calculated exclusively on the original principal balance. Compound interest is calculated on the principal plus all previously accumulated interest, accelerating account growth over time.",
      },
      {
        question: "How does compounding frequency affect my investment return?",
        answer:
          "More frequent compounding periods (such as monthly or daily versus annually) result in interest being credited sooner, which slightly increases the effective annual yield (APY) and total returns.",
      },
      {
        question: "What is the Rule of 72 in compound interest?",
        answer:
          "The Rule of 72 is a quick mental formula to estimate how many years it takes for an investment to double: divide 72 by the annual interest rate (e.g. at 8% annual return, an investment doubles in roughly 72 / 8 = 9 years).",
      },
      {
        question: "Can I calculate regular monthly or annual contributions?",
        answer:
          "Yes. The calculator includes regular additional deposits so you can model consistent savings habits alongside compounding investment growth.",
      },
      {
        question: "Is this compound interest calculator free and private?",
        answer:
          "Yes. All financial calculations run locally in your browser. No financial amounts or personal numbers are sent to external servers.",
      },
    ],
    relatedSlugs: ["interest-calculator", "loan-calculator", "mortgage-calculator"],
  },
  {
    id: "loan-calculator",
    slug: "loan-calculator",
    name: "Loan Calculator",
    shortDescription:
      "Calculate monthly loan payments, total interest cost, and annual amortization balances.",
    metaDescription:
      "Free loan calculator. Calculate monthly loan payments, total interest paid, and amortization schedules for personal or auto loans.",
    category: "finance",
    icon: CreditCard,
    popular: true,
    keywords: [
      "loan calculator",
      "monthly payment",
      "loan amortization",
      "auto loan calculator",
      "personal loan",
    ],
    formula: "Monthly Payment = [P × r × (1+r)^n] / [(1+r)^n − 1]",
    explanation:
      "The loan calculator computes monthly repayments, total interest payable, and amortization schedules for personal loans, auto loans, student financing, and business debt. By entering loan amount, annual interest rate, and repayment term, you can compare loan options and determine overall financing costs before borrowing.",
    howItWorks: [
      "Enter total loan principal, annual interest rate, and term in years or months.",
      "View monthly installment, total payment, and total interest paid.",
    ],
    example: {
      title: "Example: Personal Loan Repayment",
      description:
        "Loan amount (P) = ₹2,00,000 | Annual interest rate = 12% | Loan tenure = 2 years (24 months). Monthly installment calculates to ₹9,415, with total repayment reaching ₹2,25,953.",
      steps: [
        "Principal borrowed: ₹2,00,000",
        "Monthly payment: ₹9,415",
        "Total interest paid: ₹25,953",
        "Total amount repaid: ₹2,25,953",
      ],
    },
    faqs: [
      {
        question: "How does loan tenure affect my monthly payments and total interest?",
        answer:
          "A longer loan tenure lowers your monthly payment by spreading repayments over more installments, but significantly increases total interest costs over the life of the loan.",
      },
      {
        question: "Can this calculator be used for car loans and personal loans?",
        answer:
          "Yes. The standard fixed amortization formula applies equally to auto financing, unsecured personal loans, consumer installment loans, and debt consolidation.",
      },
      {
        question: "What is the difference between fixed and floating interest rates?",
        answer:
          "Fixed interest rates keep your monthly installment constant throughout the entire term. Floating rates fluctuate with benchmark index adjustments.",
      },
      {
        question: "How can making additional prepayments help save money?",
        answer:
          "Making prepayments directly reduces your principal loan balance, which shortens the remaining tenure and reduces subsequent interest accrual.",
      },
      {
        question: "Are my loan amounts and interest rates kept private?",
        answer:
          "Yes. All mathematical calculations run strictly in your web browser. No personal borrowing details are ever sent to remote servers.",
      },
    ],
    relatedSlugs: ["mortgage-calculator", "emi-calculator", "interest-calculator"],
  },
  {
    id: "mortgage-calculator",
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    shortDescription:
      "Estimate total monthly homeownership costs including principal, interest, property tax, insurance, and HOA fees.",
    metaDescription:
      "Free mortgage calculator. Estimate complete monthly house payments with P&I, property taxes, home insurance, and HOA dues.",
    category: "finance",
    icon: Home,
    popular: true,
    keywords: [
      "mortgage calculator",
      "home loan payment",
      "piti calculator",
      "down payment",
      "property tax",
    ],
    formula: "Monthly Payment (M) = P × [r(1+r)^n] / [(1+r)^n − 1]",
    explanation:
      "A mortgage is a specialized loan secured by real estate property. This calculator calculates monthly mortgage payments based on purchase price, down payment percentage, annual interest rate, loan term (15, 20, or 30 years), and optional property taxes and insurance. It breaks down principal versus interest allocations throughout the life of the loan.",
    howItWorks: [
      "Enter home purchase price and down payment.",
      "Enter mortgage interest rate and loan term (e.g. 30 or 15 years).",
      "Optionally add annual property tax, insurance, and monthly HOA fees.",
    ],
    example: {
      title: "Example: 30-Year Home Loan with 20% Down Payment",
      description:
        "Home purchase price = ₹50,00,000 | Down payment = 20% (₹10,00,000) | Loan principal = ₹40,00,000 | Interest rate = 7.5% per year | Term = 20 years (240 months). Monthly payment calculates to approximately ₹32,224.",
      steps: [
        "Loan principal amount: ₹40,00,000",
        "Monthly payment: ₹32,224",
        "Total payment over 20 years: ₹77,33,760",
        "Total interest cost: ₹37,33,760",
      ],
    },
    faqs: [
      {
        question: "How does a 15-year mortgage compare to a 30-year mortgage?",
        answer:
          "A 15-year mortgage has higher monthly installments but significantly lower total interest costs over the life of the loan. A 30-year mortgage lowers monthly payments but substantially increases total interest paid.",
      },
      {
        question: "How does my down payment percentage affect my loan?",
        answer:
          "A larger down payment reduces the principal loan balance, lowers your monthly installment, and decreases the total interest cost over the loan term.",
      },
      {
        question: "What factors make up a typical monthly mortgage payment?",
        answer:
          "Mortgage payments primarily consist of principal repayment and interest charges. Many homeowners also bundle property taxes and homeowners insurance into monthly escrow payments.",
      },
      {
        question: "How does loan amortization work in the early years?",
        answer:
          "During the first several years of a mortgage, the majority of each monthly payment goes toward interest. Over time, the balance shifts and a growing share repays principal.",
      },
      {
        question: "Are my property values and mortgage figures kept confidential?",
        answer:
          "Yes. All mortgage calculations execute entirely in your browser. IXDocs does not collect, record, or transmit your financial details.",
      },
    ],
    relatedSlugs: ["loan-calculator", "emi-calculator", "compound-interest-calculator"],
  },
  {
    id: "emi-calculator",
    slug: "emi-calculator",
    name: "EMI Calculator",
    shortDescription:
      "Calculate Equated Monthly Installments (EMI) for home loans, car loans, and personal loans with interest breakdowns.",
    metaDescription:
      "Free EMI calculator. Calculate equated monthly installments, total interest payable, and loan amortization schedules instantly.",
    category: "finance",
    icon: CreditCard,
    popular: true,
    keywords: [
      "emi calculator",
      "equated monthly installment",
      "home loan emi",
      "car loan emi",
      "personal loan emi",
    ],
    formula: "EMI = [P × r × (1+r)^n] / [(1+r)^n − 1]",
    explanation:
      "An EMI (Equated Monthly Installment) is a fixed payment made every month by a borrower to a lender to repay a loan. Each EMI consists of a principal component and an interest component. In the early months of a loan, a larger share of the EMI goes toward interest. As the loan matures, the principal portion increases and the interest portion decreases. The EMI formula calculates a constant installment so the loan is fully repaid by the end of the tenure.",
    howItWorks: [
      "Input loan amount (Principal).",
      "Enter annual interest rate percentage.",
      "Specify loan tenure in months or years.",
      "View exact EMI and yearly repayment schedule.",
    ],
    example: {
      title: "Example: Home loan EMI calculation",
      description:
        "Principal (P) = ₹10,00,000 | Annual rate = 8.5% | Tenure = 15 years (180 months). Monthly rate r = 8.5 / (12 × 100) = 0.007083. EMI = [10,00,000 × 0.007083 × (1.007083)^180] / [(1.007083)^180 − 1] ≈ ₹9,847 per month.",
      steps: [
        "Total amount paid over 15 years ≈ ₹17,72,460",
        "Total interest paid ≈ ₹7,72,460",
        "Principal repaid = ₹10,00,000",
        "Higher tenure lowers monthly EMI but increases total interest paid.",
      ],
    },
    faqs: [
      {
        question: "What does EMI stand for?",
        answer:
          "EMI stands for Equated Monthly Installment — a fixed payment made by a borrower to a lender at a specified date each calendar month. It covers both the principal and interest portions of the loan.",
      },
      {
        question: "What is the EMI formula?",
        answer:
          "EMI = [P × r × (1+r)^n] / [(1+r)^n − 1], where P is the principal loan amount, r is the monthly interest rate (annual rate divided by 12 and by 100), and n is the number of monthly installments.",
      },
      {
        question: "How does tenure affect EMI?",
        answer:
          "A longer tenure reduces your monthly EMI but significantly increases the total interest you pay over the life of the loan. A shorter tenure increases monthly EMI but reduces total interest paid.",
      },
      {
        question: "Does the EMI change over the loan period?",
        answer:
          "For fixed-rate loans, the EMI remains constant throughout the tenure. The composition changes — early payments go mostly toward interest, while later payments go mostly toward principal.",
      },
      {
        question: "Is this EMI calculator free and private?",
        answer:
          "Yes. All calculations run instantly in your browser. No data is stored or transmitted — your loan figures remain on your device.",
      },
    ],
    relatedSlugs: ["loan-calculator", "mortgage-calculator", "interest-calculator"],
  },

  // ── 3. Math ─────────────────────────────────────────────────────────────────
  {
    id: "fraction-calculator",
    slug: "fraction-calculator",
    name: "Fraction Calculator",
    shortDescription:
      "Add, subtract, multiply, and divide fractions and mixed numbers with step-by-step simplification.",
    metaDescription:
      "Free fraction calculator. Add, subtract, multiply, and divide proper, improper, and mixed fractions with full step-by-step solutions.",
    category: "math",
    icon: Divide,
    popular: true,
    keywords: [
      "fraction calculator",
      "add fractions",
      "multiply fractions",
      "simplify fractions",
      "mixed numbers",
    ],
    formula: "a/b ± c/d = (ad ± bc) / bd; (a/b) × (c/d) = ac / bd; (a/b) ÷ (c/d) = ad / bc",
    explanation:
      "Performs exact rational arithmetic, automatically reducing answers to lowest terms and converting improper fractions to mixed numbers.",
    howItWorks: [
      "Enter numerator and denominator for both fractions.",
      "Choose the arithmetic operation (+, −, ×, ÷).",
      "Read the simplified answer, mixed fraction, decimal value, and step-by-step solution.",
    ],
    faqs: [
      {
        question: "How do you simplify a fraction?",
        answer: "Divide both numerator and denominator by their greatest common divisor (GCD).",
      },
    ],
    relatedSlugs: ["ratio-calculator", "percentage-calculator", "basic-calculator"],
  },
  {
    id: "ratio-calculator",
    slug: "ratio-calculator",
    name: "Ratio Calculator",
    shortDescription:
      "Simplify ratios to lowest terms, calculate proportional equivalents, and solve for missing values in A:B = C:D.",
    metaDescription:
      "Free ratio calculator. Simplify ratios, scale dimensions, and solve proportions (A:B = C:D) with step-by-step math.",
    category: "math",
    icon: GitCompare,
    keywords: [
      "ratio calculator",
      "simplify ratio",
      "solve proportion",
      "aspect ratio",
      "equivalent ratio",
    ],
    formula: "A / B = C / D ⟹ A × D = B × C",
    explanation:
      "Simplifies two-term ratios using the greatest common divisor and solves any missing proportion variable using cross-multiplication.",
    howItWorks: [
      "To simplify: enter A and B to find their reduced ratio.",
      "To solve proportion: enter any three values in A:B = C:D to calculate the fourth.",
    ],
    faqs: [
      {
        question: "How do you solve a proportion?",
        answer:
          "Cross-multiply the opposite terms (A × D = B × C) and divide by the known term to isolate the unknown.",
      },
    ],
    relatedSlugs: ["fraction-calculator", "percentage-calculator", "average-calculator"],
  },
  {
    id: "average-calculator",
    slug: "average-calculator",
    name: "Average Calculator",
    shortDescription:
      "Calculate arithmetic mean, median, mode, range, and geometric mean for any set of numbers.",
    metaDescription:
      "Free online average calculator. Compute mean, median, mode, range, geometric mean, and weighted averages instantly.",
    category: "math",
    icon: BarChart3,
    popular: true,
    keywords: [
      "average calculator",
      "mean median mode",
      "find the average",
      "weighted average",
      "range calculator",
    ],
    formula: "Mean = Sum of numbers / Count of numbers",
    explanation:
      "Analyze datasets for measures of central tendency: arithmetic mean (average), median (middle value), mode (most frequent), range, and sum.",
    howItWorks: [
      "Paste or type numbers separated by commas, spaces, or new lines.",
      "View instant calculations for mean, median, mode, min, max, and sum.",
    ],
    faqs: [
      {
        question: "What is the difference between mean and median?",
        answer:
          "The mean is the arithmetic average of all values. The median is the middle number when all values are arranged in order.",
      },
    ],
    relatedSlugs: ["statistics-calculator", "gpa-calculator", "percentage-calculator"],
  },
  {
    id: "statistics-calculator",
    slug: "statistics-calculator",
    name: "Statistics Calculator",
    shortDescription:
      "Compute sample and population standard deviation, variance, quartiles, IQR, and standard error.",
    metaDescription:
      "Free statistics calculator. Compute standard deviation, variance, mean, quartiles Q1/Q3, IQR, and standard error from data.",
    category: "math",
    icon: BarChart3,
    keywords: [
      "statistics calculator",
      "standard deviation calculator",
      "variance calculator",
      "interquartile range",
      "sample std dev",
    ],
    formula: "s = √[Σ(x - x̄)² / (n - 1)]; σ = √[Σ(x - μ)² / N]",
    explanation:
      "Comprehensive descriptive statistics solver. Automatically handles both sample (n - 1) and population (N) statistical variance and standard deviation.",
    howItWorks: [
      "Enter a comma or space-separated list of numeric values.",
      "Get complete statistical summary including standard deviation, variance, quartiles, and IQR.",
    ],
    faqs: [
      {
        question: "When should I use sample vs population standard deviation?",
        answer:
          "Use sample standard deviation (s) when your data represents a sample of a larger population. Use population standard deviation (σ) when you have measured the entire population.",
      },
    ],
    relatedSlugs: ["average-calculator", "gpa-calculator", "basic-calculator"],
  },
  {
    id: "gpa-calculator",
    slug: "gpa-calculator",
    name: "GPA Calculator",
    shortDescription:
      "Calculate semester SGPA and cumulative CGPA on the standard 10-point Indian university grading scale.",
    metaDescription:
      "Free 10-point GPA & CGPA calculator. Calculate semester SGPA and cumulative CGPA with credit hours, letter grades (O, A+, A, B+, B, C, F), and percentage equivalent.",
    category: "math",
    icon: GraduationCap,
    popular: true,
    keywords: [
      "gpa calculator",
      "sgpa calculator",
      "cgpa calculator",
      "10 point scale gpa",
      "indian gpa calculator",
      "cgpa to percentage",
      "college gpa",
    ],
    formula: "GPA = Σ(Course Grade Points × Credit Hours) / Σ(Total Credit Hours)",
    explanation:
      "The GPA calculator computes semester and cumulative Grade Point Averages on the standard 4.0 collegiate and high school grading scale (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0). By weighting each course grade by its assigned academic credit hours, the calculator reflects true academic standing across coursework.",
    howItWorks: [
      "Enter subject names, select letter grades (O, A+, A, B+, B, C, F), and assign credit hours.",
      "Switch to Cumulative CGPA mode to calculate across semesters with credit weightage.",
      "View instant SGPA/CGPA, total credits, grade points, and percentage conversion.",
    ],
    example: {
      title: "Example: 4-Course Semester GPA Calculation",
      description:
        "Calculus (4 credits, Grade A = 4.0, points = 16) | Physics (4 credits, Grade B = 3.0, points = 12) | Chemistry Lab (2 credits, Grade A = 4.0, points = 8) | English (3 credits, Grade B = 3.0, points = 9). Total credits = 13, Total grade points = 45. Semester GPA = 45 / 13 ≈ 3.46.",
      steps: [
        "Total semester course credits: 13",
        "Total quality grade points: 45.0",
        "Calculated Grade Point Average: 3.46 (B+ average)",
        "Courses with higher credit weights have a larger impact on cumulative GPA.",
      ],
    },
    faqs: [
      {
        question: "How does the standard 4.0 GPA scale work?",
        answer:
          "The 4.0 scale assigns numerical points to letter grades: A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, D = 1.0, and F = 0.0.",
      },
      {
        question: "Why do credit hours matter when calculating GPA?",
        answer:
          "Credit hours determine course weight. A 4-credit lecture course influences your final GPA twice as much as a 2-credit seminar or lab course.",
      },
      {
        question: "Can I calculate both semester GPA and cumulative GPA?",
        answer:
          "Yes. You can calculate single semester performance or combine previous cumulative credit hours and grade points to find your overall standing.",
      },
      {
        question: "How can I raise my cumulative GPA in upcoming semesters?",
        answer:
          "Focusing on higher grades in classes carrying 3 or 4 credits has the strongest upward pulling effect on your overall cumulative average.",
      },
      {
        question: "Are my academic grades or student records saved online?",
        answer:
          "No. All course inputs and grade evaluations remain strictly local to your browser session and are never uploaded or stored.",
      },
    ],
    relatedSlugs: ["average-calculator", "percentage-calculator", "statistics-calculator"],
  },
  {
    id: "scientific-calculator",
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    shortDescription:
      "Advanced scientific calculator with trigonometry, logarithms, powers, roots, factorials, and degree/radian modes.",
    metaDescription:
      "Free online scientific calculator. Compute trigonometric functions, logs, powers, roots, factorials, and expressions directly in your browser.",
    category: "math",
    icon: Calculator,
    popular: true,
    keywords: [
      "scientific calculator",
      "online scientific calculator",
      "trig calculator",
      "sin cos tan",
      "log calculator",
      "math calculator",
    ],
    formula: "Standard infix notation with operator precedence (PEMDAS/BODMAS)",
    explanation:
      "Evaluates complex mathematical expressions including trigonometric, exponential, logarithmic, and power functions with client-side accuracy.",
    howItWorks: [
      "Type or click numbers, scientific functions (sin, cos, log, etc.), and operators.",
      "Toggle between DEG (degrees) and RAD (radians) for trigonometry.",
      "Use parentheses to group operations and '=' or Enter to evaluate.",
    ],
    faqs: [
      {
        question: "Does this scientific calculator run in degrees or radians?",
        answer:
          "You can toggle between Degree (DEG) and Radian (RAD) modes at any time using the mode button in the top left of the display.",
      },
      {
        question: "Does it support order of operations?",
        answer:
          "Yes, all expressions follow standard mathematical operator precedence (PEMDAS/BODMAS) with full parenthesis support.",
      },
    ],
    relatedSlugs: ["basic-calculator", "fraction-calculator", "percentage-calculator"],
  },

  // ── 4. Health ───────────────────────────────────────────────────────────────
  {
    id: "bmi-calculator",
    slug: "bmi-calculator",
    name: "BMI Calculator",
    shortDescription:
      "Calculate Body Mass Index (BMI), WHO weight category, and healthy weight range for your height.",
    metaDescription:
      "Free BMI calculator. Calculate Body Mass Index using metric or imperial units and find your healthy weight range.",
    category: "health",
    icon: Activity,
    popular: true,
    keywords: [
      "bmi calculator",
      "body mass index",
      "healthy weight calculator",
      "bmi chart",
      "weight category",
    ],
    formula:
      "BMI = weight (kg) / [height (m)]²  |  Imperial: BMI = 703 × weight (lbs) / [height (in)]²",
    explanation:
      "Body Mass Index (BMI) is an internationally recognized screening metric established by the World Health Organization (WHO) to classify body weight categories in adult men and women. BMI compares weight relative to height into four standard ranges: Underweight (BMI < 18.5), Normal Weight (BMI 18.5–24.9), Overweight (BMI 25.0–29.9), and Obese (BMI ≥ 30.0).",
    howItWorks: [
      "Select Metric (kg, cm) or Imperial (lbs, ft/in) unit mode.",
      "Enter your current weight and height.",
      "View your BMI score, category, healthy weight range, and prime index.",
    ],
    example: {
      title: "Example: Calculating BMI for an Adult",
      description:
        "Height = 175 cm (1.75 meters) | Weight = 70 kg. Calculation: BMI = 70 / (1.75 × 1.75) = 70 / 3.0625 ≈ 22.86. A BMI of 22.86 falls within the healthy Normal Weight range (18.5–24.9).",
      steps: [
        "Height: 175 cm | Weight: 70 kg",
        "Calculated BMI: 22.86",
        "Classification: Normal / Healthy weight",
        "Healthy weight range for this height: 56.7 kg – 76.3 kg",
      ],
    },
    faqs: [
      {
        question: "What are the standard WHO BMI classification categories?",
        answer:
          "Underweight: less than 18.5; Normal / Healthy weight: 18.5 to 24.9; Overweight: 25.0 to 29.9; Obese: 30.0 or higher.",
      },
      {
        question: "Does BMI differentiate between muscle mass and body fat?",
        answer:
          "No. BMI does not distinguish between weight from dense muscle versus adipose fat tissue. Athletes and bodybuilders may register as 'overweight' on BMI while maintaining low body fat.",
      },
      {
        question: "Can I use both metric (kg/cm) and imperial (lbs/inches) units?",
        answer:
          "Yes. The calculator supports instant switching between metric and imperial measurements with automatic unit conversion.",
      },
      {
        question: "What is considered a healthy BMI target for most adults?",
        answer:
          "For most healthy adults, a BMI between 18.5 and 24.9 is associated with the lowest statistical risk of cardiovascular and metabolic health conditions.",
      },
      {
        question: "Is my personal height and weight data saved or tracked?",
        answer:
          "No. All body measurements are calculated exclusively within your browser session and are never recorded, tracked, or sent to any server.",
      },
    ],
    relatedSlugs: ["calorie-calculator", "unit-converter", "basic-calculator"],
  },
  {
    id: "calorie-calculator",
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    shortDescription:
      "Estimate daily calorie requirements for weight maintenance, weight loss, and muscle gain using the Mifflin-St Jeor equation.",
    metaDescription:
      "Free daily calorie calculator. Estimate maintenance calories, BMR, and caloric targets for weight loss or muscle gain.",
    category: "health",
    icon: Flame,
    popular: true,
    keywords: [
      "calorie calculator",
      "bmr calculator",
      "tdee calculator",
      "daily calorie needs",
      "weight loss calories",
    ],
    formula:
      "BMR (Mifflin-St Jeor): 10W + 6.25H - 5A (+5 for men, -161 for women); TDEE = BMR × Activity",
    explanation:
      "Calculates Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to deliver precise daily calorie targets for mild loss, standard loss, or muscle gain.",
    howItWorks: [
      "Select biological gender and enter age, weight, and height.",
      "Choose your typical weekly physical activity level.",
      "Review your maintenance calories and recommended intake goals.",
    ],
    faqs: [
      {
        question: "How many calories are in one pound of fat?",
        answer:
          "Approximately 3,500 calories. A daily deficit of 500 calories typically leads to about 1 pound of fat loss per week.",
      },
    ],
    relatedSlugs: ["bmi-calculator", "unit-converter", "average-calculator"],
  },

  // ── 5. Time & Date ──────────────────────────────────────────────────────────
  {
    id: "date-calculator",
    slug: "date-calculator",
    name: "Date Calculator",
    shortDescription:
      "Calculate the exact number of days, weeks, months, or years between dates, or add/subtract days.",
    metaDescription:
      "Free date calculator. Measure exact calendar intervals between two dates, or add/subtract business and calendar days instantly.",
    category: "datetime",
    icon: Calendar,
    popular: true,
    keywords: [
      "date calculator",
      "days between dates",
      "add days to date",
      "calendar calculator",
      "date difference",
    ],
    formula:
      "Interval = Target Date - Start Date (accounting for leap years and calendar month variations)",
    explanation:
      "Measure calendar time between any two dates in years, months, weeks, and total days, or project future milestones by adding days.",
    howItWorks: [
      "Choose to calculate difference between dates, or add/subtract days from a base date.",
      "Select your start date and target parameters.",
    ],
    faqs: [
      {
        question: "Does this calculator account for leap years?",
        answer:
          "Yes, all Gregorian calendar leap year variations (including century rules) are evaluated accurately.",
      },
    ],
    relatedSlugs: ["age-calculator", "time-duration-calculator", "time-calculator"],
  },
  {
    id: "age-calculator",
    slug: "age-calculator",
    name: "Age Calculator",
    shortDescription:
      "Determine your exact age down to the day, hour, and minute, plus upcoming birthday countdowns.",
    metaDescription:
      "Free online age calculator. Find your exact age in years, months, weeks, days, hours, and minutes with countdown to your next birthday.",
    category: "datetime",
    icon: Cake,
    popular: true,
    keywords: [
      "age calculator",
      "how old am i",
      "chronological age",
      "birthday countdown",
      "exact age",
    ],
    formula: "Age = Target Date − Date of Birth (Exact Years, Months, Days, Hours, and Minutes)",
    explanation:
      "The age calculator determines exact chronological age between a date of birth and any reference date. It accounts for varying month lengths, Gregorian calendar leap years, and leap seconds, providing precise breakdowns in total years, months, weeks, days, hours, and minutes lived, as well as the exact countdown to your next birthday.",
    howItWorks: [
      "Select your date of birth.",
      "Optionally select a custom comparison date.",
      "See your exact age breakdown and milestone stats.",
    ],
    example: {
      title: "Example: Calculating Chronological Age",
      description:
        "Date of birth: 15 August 1995 | Reference date: 15 August 2025. The exact age is 30 years 0 months 0 days, spanning 10,958 total days lived and 263,000+ total hours lived.",
      steps: [
        "Exact chronological age: 30 years",
        "Total months lived: 360 months",
        "Total days lived: 10,958 days",
        "Next birthday: exactly 365 days away",
      ],
    },
    faqs: [
      {
        question: "How does the age calculator handle leap years?",
        answer:
          "The calculator accounts for leap years containing 366 days (including February 29), ensuring exact calendar precision regardless of birth year.",
      },
      {
        question: "Can I calculate how old I will be on a specific future date?",
        answer:
          "Yes. You can select any target date in the future to see your exact projected age for milestones, retirement eligibility, or legal qualification.",
      },
      {
        question: "How does the next birthday countdown work?",
        answer:
          "The tool compares the current calendar date against your upcoming birth month and day, calculating the remaining months, days, and hours.",
      },
      {
        question: "Can this calculator determine total days or hours lived?",
        answer:
          "Yes. In addition to standard years, months, and days, the calculator provides total cumulative days, weeks, and hours lived.",
      },
      {
        question: "Is my date of birth stored or logged anywhere?",
        answer:
          "No. Your birth date is processed only within your active browser tab and is never saved, transmitted, or logged.",
      },
    ],
    relatedSlugs: ["date-calculator", "time-duration-calculator", "timezone-converter"],
  },
  {
    id: "time-duration-calculator",
    slug: "time-duration-calculator",
    name: "Time Duration Calculator",
    shortDescription:
      "Calculate elapsed hours, minutes, and seconds between two clock times, including overnight shifts.",
    metaDescription:
      "Free time duration calculator. Calculate hours, minutes, and decimal hours between start and end times across midnight.",
    category: "datetime",
    icon: Hourglass,
    keywords: [
      "time duration calculator",
      "hours between times",
      "elapsed time",
      "work hours calculator",
      "time difference",
    ],
    formula: "Duration = End Time - Start Time (adding 24 hours if crossing midnight)",
    explanation:
      "Compute precise elapsed time between any two clock times. Handles overnight spans seamlessly and outputs hours, minutes, and decimal payroll hours.",
    howItWorks: [
      "Enter starting clock time (hours, minutes, seconds).",
      "Enter ending clock time.",
      "View elapsed time in clock format, total minutes, and decimal hours.",
    ],
    faqs: [
      {
        question: "Does it support night shifts that cross midnight?",
        answer:
          "Yes, if the end time is earlier than the start time, it automatically assumes an overnight transition.",
      },
    ],
    relatedSlugs: ["time-calculator", "date-calculator", "timezone-converter"],
  },
  {
    id: "time-calculator",
    slug: "time-calculator",
    name: "Time Calculator",
    shortDescription:
      "Add or subtract hours, minutes, and seconds to any time or sum multiple time durations.",
    metaDescription:
      "Free time calculator. Add and subtract hours, minutes, and seconds from clock times or durations with AM/PM support.",
    category: "datetime",
    icon: Clock,
    keywords: ["time calculator", "add time", "subtract hours", "time addition", "time sum"],
    formula: "New Time = Base Time ± (Hours × 3600 + Minutes × 60 + Seconds)",
    explanation:
      "Easily add or subtract hours and minutes to find future arrival times, schedule deadlines, or aggregate total project hours.",
    howItWorks: [
      "Enter your starting time.",
      "Choose whether to add or subtract.",
      "Enter the hours, minutes, and seconds to adjust.",
    ],
    faqs: [
      {
        question: "Can I use 24-hour military time?",
        answer: "Yes, both 12-hour (AM/PM) and 24-hour formats are displayed simultaneously.",
      },
    ],
    relatedSlugs: ["time-duration-calculator", "timezone-converter", "date-calculator"],
  },
  {
    id: "timezone-converter",
    slug: "timezone-converter",
    name: "Time Zone Converter",
    shortDescription:
      "Convert times seamlessly between global time zones with automatic Daylight Saving Time adjustment.",
    metaDescription:
      "Free timezone converter. Convert meeting times and timestamps across UTC, EST, PST, GMT, IST, and all world cities instantly.",
    category: "datetime",
    icon: Clock,
    popular: true,
    keywords: [
      "timezone converter",
      "world clock",
      "utc converter",
      "est to ist",
      "time difference",
    ],
    formula: "Target Local Time = UTC Time + Target Timezone Offset (including active DST)",
    explanation:
      "Convert meeting times and timestamps between global regions with full IANA database support and automatic Daylight Saving Time handling.",
    howItWorks: [
      "Select your source timezone and choose a date and time.",
      "Select the destination timezone.",
      "View the converted time, UTC offset, and time difference.",
    ],
    faqs: [
      {
        question: "Does it automatically account for Daylight Saving Time?",
        answer:
          "Yes, the browser's native internationalization engine automatically applies historical and active DST rules.",
      },
    ],
    relatedSlugs: ["time-duration-calculator", "time-calculator", "date-calculator"],
  },

  // ── 6. Converters ───────────────────────────────────────────────────────────
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
    ],
    formula:
      "Converted Value = Input × Conversion Factor (or dedicated scale formula for temperature)",
    explanation:
      "Convert measurement units seamlessly between metric and imperial systems for length, mass, temperature, speed, volume, and area.",
    howItWorks: [
      "Select a measurement category.",
      "Enter the magnitude and choose the source and target units.",
      "Read the converted value instantly with two-way conversion.",
    ],
    faqs: [
      {
        question: "How accurate are the conversions?",
        answer: "Conversions use international standards defined by the BIPM and NIST.",
      },
    ],
    relatedSlugs: ["data-storage-calculator", "fuel-cost-calculator", "basic-calculator"],
  },
  {
    id: "data-storage-calculator",
    slug: "data-storage-calculator",
    name: "Data Storage Calculator",
    shortDescription:
      "Convert between Bytes, KB, MB, GB, TB, and PB, and estimate download and transfer times.",
    metaDescription:
      "Free data storage converter and download time calculator. Convert between KB, MB, GB, TB and calculate download durations.",
    category: "conversion",
    icon: Database,
    keywords: [
      "data storage calculator",
      "gb to mb",
      "download time calculator",
      "transfer speed",
      "bytes converter",
    ],
    formula: "Bytes = Value × Base^Exponent (Base 1024 for binary KiB/GiB, 1000 for decimal KB/GB)",
    explanation:
      "Convert digital storage capacities across all standard orders of magnitude and calculate estimated download or upload times given internet connection speeds.",
    howItWorks: [
      "Enter a data size and select its unit (MB, GB, TB, etc.).",
      "Optionally enter your internet speed in Mbps to calculate download time.",
    ],
    faqs: [
      {
        question: "What is the difference between 1000 and 1024 bytes in a KB?",
        answer:
          "Operating systems (like Windows) typically use binary (1 KB = 1,024 bytes), while storage hardware manufacturers often quote decimal (1 KB = 1,000 bytes).",
      },
    ],
    relatedSlugs: ["unit-converter", "fuel-cost-calculator", "time-calculator"],
  },
  {
    id: "fuel-cost-calculator",
    slug: "fuel-cost-calculator",
    name: "Fuel Cost Calculator",
    shortDescription:
      "Calculate total trip fuel costs, fuel quantity required, and split travel expenses among passengers.",
    metaDescription:
      "Free fuel cost calculator. Calculate road trip gas costs, fuel consumption, mileage efficiency, and per-passenger splits.",
    category: "conversion",
    icon: Fuel,
    keywords: [
      "fuel cost calculator",
      "gas money calculator",
      "trip cost",
      "mileage calculator",
      "split gas cost",
    ],
    formula: "Fuel Needed = Distance / Mileage; Total Cost = Fuel Needed × Price Per Unit",
    explanation:
      "Plan road trip travel expenses by calculating exact fuel requirements based on vehicle fuel efficiency (L/100km, km/L, or MPG) and local gas prices.",
    howItWorks: [
      "Enter trip distance and your vehicle's fuel efficiency.",
      "Enter fuel price per liter or gallon.",
      "Specify number of passengers to split the cost.",
    ],
    faqs: [
      {
        question: "How do I calculate MPG or L/100km?",
        answer:
          "Divide miles driven by gallons used for MPG, or divide liters used by kilometers driven multiplied by 100 for L/100km.",
      },
    ],
    relatedSlugs: ["unit-converter", "tip-calculator", "basic-calculator"],
  },

  // ── 7. Productivity ─────────────────────────────────────────────────────────
  {
    id: "word-counter",
    slug: "word-counter",
    name: "Word Counter",
    shortDescription:
      "Detailed text analytics: word, character, sentence, paragraph counts, and estimated reading time.",
    metaDescription:
      "Free word counter and text analytics tool. Count words, characters, sentences, paragraphs, reading time, and keyword density instantly.",
    category: "productivity",
    icon: FileText,
    popular: true,
    keywords: [
      "word counter",
      "character count",
      "reading time",
      "text analyzer",
      "word count tool",
    ],
    formula: "Words = sequence of non-whitespace tokens; Reading Time ≈ Words / 200 wpm",
    explanation:
      "Fast, privacy-friendly text analysis that counts words, characters (with and without spaces), sentences, paragraphs, and reading times locally in your browser.",
    howItWorks: [
      "Paste or type your text into the editor.",
      "Real-time metrics update immediately as you type.",
    ],
    faqs: [
      {
        question: "Is my text uploaded or stored anywhere?",
        answer:
          "No. All text processing runs 100% in your browser memory. Nothing is sent to our servers.",
      },
    ],
    relatedSlugs: ["basic-calculator", "password-generator", "qr-generator"],
  },

  // ── 8. Security ─────────────────────────────────────────────────────────────
  {
    id: "password-generator",
    slug: "password-generator",
    name: "Password Generator",
    shortDescription:
      "Generate cryptographically secure passwords and passphrases with custom character sets and entropy scoring.",
    metaDescription:
      "Free password generator. Create strong, cryptographically secure passwords and passphrases with entropy analysis in your browser.",
    category: "security",
    icon: KeyRound,
    popular: true,
    keywords: [
      "password generator",
      "secure password",
      "random password",
      "password strength",
      "crypto random",
    ],
    formula: "Entropy (bits) = Length × log2(Character Pool Size)",
    explanation:
      "Generates random passwords using the browser's cryptographically secure pseudo-random number generator (crypto.getRandomValues).",
    howItWorks: [
      "Select password length (8–64 characters).",
      "Toggle uppercase, lowercase, numbers, and symbols.",
      "Click Generate and copy your password securely.",
    ],
    faqs: [
      {
        question: "Are generated passwords logged or saved?",
        answer:
          "Never. Generation uses window.crypto locally on your device. We have no servers observing your passwords.",
      },
    ],
    relatedSlugs: ["random-password-generator", "qr-generator", "word-counter"],
  },
  {
    id: "random-password-generator",
    slug: "random-password-generator",
    name: "Random Password Generator",
    shortDescription:
      "One-click high-entropy random password generator with quick presets for WiFi, PINs, and secure accounts.",
    metaDescription:
      "Free random password generator. Create instant strong passwords for accounts, WiFi, and services using cryptographic entropy.",
    category: "security",
    icon: ShieldAlert,
    keywords: [
      "random password generator",
      "pin generator",
      "wifi password",
      "strong password generator",
    ],
    formula: "Cryptographic entropy using window.crypto.getRandomValues()",
    explanation:
      "Instant, reliable password generation optimized for quick copy-paste workflows and maximum entropy.",
    howItWorks: [
      "Choose a quick preset (Simple, Strong, Ultra, or PIN).",
      "Copy your generated secret in one click.",
    ],
    faqs: [
      {
        question: "What makes a password cryptographically secure?",
        answer:
          "High entropy and unbiased random number generation via hardware-backed system RNG (Web Cryptography API).",
      },
    ],
    relatedSlugs: ["password-generator", "qr-generator", "word-counter"],
  },

  // ── 9. QR & Barcode ─────────────────────────────────────────────────────────
  {
    id: "qr-generator",
    slug: "qr-generator",
    name: "QR Code Generator",
    shortDescription:
      "Generate custom QR codes for URLs, WiFi networks, text, contacts, and email with SVG and PNG download.",
    metaDescription:
      "Free QR code generator. Create high-resolution QR codes for websites, WiFi, and vCards with instant PNG and SVG download.",
    category: "qr-barcode",
    icon: QrCode,
    popular: true,
    keywords: ["qr generator", "qr code maker", "free qr code", "download qr code", "wifi qr code"],
    formula: "ISO/IEC 18004 QR barcode standard with Reed-Solomon error correction",
    explanation:
      "Generate high-resolution QR codes completely in your browser. Supports links, plaintext, WiFi credentials, vCards, and emails.",
    howItWorks: [
      "Select content type and enter your URL or text.",
      "Customize size and error correction level.",
      "Download high-resolution PNG or vector SVG.",
    ],
    faqs: [
      {
        question: "Do these QR codes ever expire?",
        answer:
          "No. These are direct static QR codes. They encode your data directly and never expire.",
      },
    ],
    relatedSlugs: ["barcode-generator", "word-counter", "password-generator"],
  },
  {
    id: "barcode-generator",
    slug: "barcode-generator",
    name: "Barcode Generator",
    shortDescription:
      "Create standard product and retail barcodes: Code 128, EAN-13, UPC-A, EAN-8, and Code 39 with SVG and PNG export.",
    metaDescription:
      "Free online barcode generator. Create product barcodes for Code 128, EAN-13, UPC-A, and Code 39. Download SVG or PNG vector formats.",
    category: "qr-barcode",
    icon: Barcode,
    popular: true,
    keywords: [
      "barcode generator",
      "code 128 generator",
      "ean 13 barcode",
      "upc barcode maker",
      "product barcode",
    ],
    formula:
      "Standard 1D symbologies with automated checksum computation (JsBarcode client engine)",
    explanation:
      "Generate retail, inventory, and packaging barcodes in your browser. Supports Code 128, EAN-13, UPC-A, EAN-8, and Code 39 with printable label views.",
    howItWorks: [
      "Enter your barcode numbers or alphanumeric code.",
      "Select the desired barcode symbology (e.g. Code 128 or EAN-13).",
      "Download as PNG, vector SVG, or print directly to label sheets.",
    ],
    faqs: [
      {
        question: "Which barcode format should I use for retail?",
        answer:
          "Use UPC-A for products sold in the United States and Canada, or EAN-13 for international retail products worldwide.",
      },
      {
        question: "Which format is best for warehouse inventory?",
        answer:
          "Code 128 is the industry standard for internal inventory, shipping labels, and asset tracking.",
      },
    ],
    relatedSlugs: ["qr-generator", "bill-calculator", "unit-converter"],
  },

  // ── 10. Billing ─────────────────────────────────────────────────────────────
  {
    id: "bill-calculator",
    slug: "bill-calculator",
    name: "Bill Calculator",
    shortDescription:
      "Generate itemized bills and receipts with GST/tax support, camera barcode scanning, and instant PDF downloads.",
    metaDescription:
      "Free online bill calculator with camera barcode scanner and GST support. Create itemized invoices and download PDF receipts.",
    category: "billing",
    icon: Receipt,
    popular: true,
    keywords: [
      "bill calculator",
      "invoice generator",
      "receipt maker",
      "gst bill calculator",
      "barcode scanner bill",
    ],
    formula:
      "Line Item Total = Quantity × Unit Price  |  Grand Total = Σ(Items) + Tax − Discounts + Tip",
    explanation:
      "The bill calculator is an itemized receipt organizer and group expense splitter designed for shared dining, room expenses, and group travel. Unlike simple total splitting, it allows you to list individual items, quantities, and prices, assign them to specific people, apply proportional sales tax, and distribute shared appetizers or service fees transparently.",
    howItWorks: [
      "Scan product barcodes using your device camera or click 'Add Product' manually.",
      "Adjust quantities, product descriptions, and unit prices.",
      "Optionally enable GST/sales tax with standard quick-picks (5%, 12%, 18%, 28%).",
      "Click 'Generate PDF Bill' to download a clean receipt on your device.",
    ],
    example: {
      title: "Example: Itemized Lunch Bill with Shared Appetizer",
      description:
        "Person A ordered pasta (₹450), Person B ordered steak (₹800), and they shared dessert (₹300) with 5% tax. The calculator distributes the shared dessert and tax proportionally, giving exact individual owed amounts.",
      steps: [
        "Person A item subtotal: ₹450 + ₹150 (half dessert) = ₹600",
        "Person B item subtotal: ₹800 + ₹150 (half dessert) = ₹950",
        "Proportional 5% tax added: Person A ₹30, Person B ₹47.50",
        "Final owed: Person A ₹630, Person B ₹997.50",
      ],
    },
    faqs: [
      {
        question: "How does itemized bill splitting differ from even splitting?",
        answer:
          "Itemized splitting assigns specific food or retail purchases to the individuals who ordered them, preventing diners who ordered light meals from subsidizing expensive entrees.",
      },
      {
        question: "How are shared appetizers or bottles of wine divided?",
        answer:
          "You can assign shared items across all diners or specific individuals, dividing the cost equally among participating group members.",
      },
      {
        question: "How does the calculator handle tax and service charges?",
        answer:
          "Sales taxes and service fees are calculated proportionally based on each individual's subtotal share rather than split arbitrarily.",
      },
      {
        question: "Can I download or copy an itemized summary receipt?",
        answer:
          "Yes. You can generate a summary breakdown showing what each person ordered and owes to share easily in group messaging chats.",
      },
      {
        question: "Are receipt items or bill amounts saved on any server?",
        answer:
          "No. All itemized calculations remain strictly inside your browser session. Your bill details are never uploaded or retained.",
      },
    ],
    relatedSlugs: ["barcode-generator", "sales-tax-calculator", "discount-calculator"],
  },
];

interface CalcExtraData {
  pageTitle: string;
  ogImage?: string;
  example: CalculatorExample;
  relatedSlugs?: string[];
}

const CALC_PAGE_EXTRAS: Record<string, CalcExtraData> = {
  "basic-calculator": {
    pageTitle: "Basic Calculator — Fast Arithmetic with History | IXDocs Calculator",
    ogImage: "https://calc.ixdocs.com/og-basic-calculator.png",
    example: {
      title: "Calculating a Multi-Step Grocery Subtotal",
      description: "Add multiple items together with sales tax: (45.50 + 12.75) × 1.08.",
      steps: [
        "Enter 45.50 + 12.75 = 58.25",
        "Multiply by 1.08 to add 8% tax",
        "Result is 62.91 with full history log saved",
      ],
    },
    relatedSlugs: ["percentage-calculator", "discount-calculator", "tip-calculator"],
  },
  "percentage-calculator": {
    pageTitle: "Percentage Calculator — Calculate Percentages Online | IXDocs",
    ogImage: "https://calc.ixdocs.com/og-percentage-calculator.png",
    example: {
      title: "Year-Over-Year Revenue Growth",
      description: "Determine the percent change from $125,000 in 2025 to $160,000 in 2026.",
      steps: [
        "Difference: $160,000 - $125,000 = $35,000",
        "Divide by initial value: 35,000 / 125,000 = 0.28",
        "Multiply by 100 = 28% increase",
      ],
    },
    relatedSlugs: ["discount-calculator", "sales-tax-calculator", "tip-calculator"],
  },
  "discount-calculator": {
    pageTitle: "Discount Calculator — Calculate Sale Price & Savings | IXDocs Calculator",
    example: {
      title: "Seasonal Clearance with Coupon Stack",
      description:
        "Calculate final checkout cost for a $120 jacket with 30% store discount plus an extra 10% coupon.",
      steps: [
        "Primary 30% off: $120 - $36 = $84",
        "Stacked 10% coupon on $84: $84 - $8.40 = $75.60",
        "Total savings: $44.40 (37% effective discount)",
      ],
    },
    relatedSlugs: ["percentage-calculator", "sales-tax-calculator", "tip-calculator"],
  },
  "tip-calculator": {
    pageTitle: "Tip Calculator — Restaurant Bill Splitter & Gratuity | IXDocs Calculator",
    example: {
      title: "Dinner Bill Split Between 4 Friends",
      description:
        "Calculate 18% gratuity on an $84.50 dinner check and split evenly across 4 guests.",
      steps: [
        "Total tip: $84.50 × 0.18 = $15.21",
        "Grand total: $84.50 + $15.21 = $99.71",
        "Each guest pays: $24.93",
      ],
    },
    relatedSlugs: ["discount-calculator", "sales-tax-calculator", "basic-calculator"],
  },
  "sales-tax-calculator": {
    pageTitle: "Sales Tax Calculator — Calculate Tax & Reverse Pre-Tax | IXDocs Calculator",
    example: {
      title: "Reverse-Calculating Net Price from Receipt",
      description:
        "Find the pre-tax price of an electronic item that cost $540 total with 8% sales tax included.",
      steps: [
        "Net Price = $540 / (1 + 0.08) = $500.00",
        "Sales Tax Portion = $540 - $500 = $40.00",
      ],
    },
    relatedSlugs: ["discount-calculator", "percentage-calculator", "bill-calculator"],
  },
  "compound-interest-calculator": {
    pageTitle: "Compound Interest Calculator — Investment Growth & Returns | IXDocs Calculator",
    example: {
      title: "Long-Term Index Fund Growth",
      description:
        "Calculate returns on a $10,000 initial investment earning 7% annually with $300 monthly contributions for 15 years.",
      steps: [
        "Principal: $10,000; Total contributions: $54,000",
        "Future Value after 15 years: ~$122,870",
        "Total interest earned: ~$58,870",
      ],
    },
    relatedSlugs: ["interest-calculator", "loan-calculator", "mortgage-calculator"],
  },
  "interest-calculator": {
    pageTitle: "Interest Calculator — Simple & Compound Interest Rates | IXDocs Calculator",
    ogImage: "https://calc.ixdocs.com/og-interest-calculator.png",
    example: {
      title: "Comparing 3-Year Certificate of Deposit (CD)",
      description:
        "Compare $5,000 deposited at 4.5% annual rate between simple interest and monthly compound interest.",
      steps: [
        "Simple Interest: $5,000 × 0.045 × 3 = $675.00",
        "Monthly Compounded: $5,000 × (1 + 0.045/12)^(36) - $5,000 = $721.46",
        "Compounding advantage: $46.46",
      ],
    },
    relatedSlugs: [
      "compound-interest-calculator",
      "loan-calculator",
      "emi-calculator",
      "mortgage-calculator",
    ],
  },
  "loan-calculator": {
    pageTitle: "Loan Calculator — Monthly Payment & Interest | IXDocs Calculator",
    example: {
      title: "Auto Loan Repayment",
      description:
        "Calculate monthly payments on a $24,000 vehicle loan financed at 6.2% APR over 5 years (60 months).",
      steps: [
        "Monthly payment: $466.25",
        "Total amount repaid: $27,975.00",
        "Total finance charge (interest): $3,975.00",
      ],
    },
    relatedSlugs: ["mortgage-calculator", "emi-calculator", "compound-interest-calculator"],
  },
  "mortgage-calculator": {
    pageTitle: "Mortgage Calculator — Monthly Payments & Amortization | IXDocs Calculator",
    example: {
      title: "30-Year Fixed Home Mortgage",
      description:
        "Calculate principal & interest for a $380,000 loan at 6.5% interest rate with 20% down payment.",
      steps: [
        "Loan balance after down payment: $304,000",
        "Monthly Principal & Interest: $1,921.49",
        "Total interest paid over 30 years: $387,736",
      ],
    },
    relatedSlugs: ["loan-calculator", "emi-calculator", "compound-interest-calculator"],
  },
  "emi-calculator": {
    pageTitle: "EMI Calculator — Calculate Monthly EMI Online | IXDocs",
    example: {
      title: "Personal Loan Installments",
      description:
        "Compute monthly installment on a 500,000 loan at 10.5% interest over a 36-month tenure.",
      steps: [
        "Monthly installment (EMI): 16,253",
        "Total payment across 36 months: 585,108",
        "Total interest payable: 85,108",
      ],
    },
    relatedSlugs: ["loan-calculator", "mortgage-calculator", "interest-calculator"],
  },
  "fraction-calculator": {
    pageTitle:
      "Fraction Calculator — Add, Subtract, Multiply & Divide Fractions | IXDocs Calculator",
    example: {
      title: "Adding Unequal Recipe Measurements",
      description: "Combine 3/4 cup flour with 2/3 cup sugar to find the total dry measurement.",
      steps: [
        "Common denominator for 4 and 3 is 12",
        "Convert: (3×3)/12 + (2×4)/12 = 9/12 + 8/12 = 17/12",
        "Mixed number: 1 5/12 cups (approx 1.4167)",
      ],
    },
    relatedSlugs: ["ratio-calculator", "average-calculator", "percentage-calculator"],
  },
  "ratio-calculator": {
    pageTitle: "Ratio Calculator — Simplify & Solve Proportions | IXDocs Calculator",
    example: {
      title: "Scaling Screen Aspect Ratios",
      description:
        "Given a 16:9 widescreen video, calculate height required for a width of 1920 pixels.",
      steps: [
        "Proportion: 16 / 9 = 1920 / X",
        "Cross-multiply: 16X = 1920 × 9 = 17,280",
        "X = 17,280 / 16 = 1080 pixels (Full HD 1080p)",
      ],
    },
    relatedSlugs: ["fraction-calculator", "percentage-calculator", "unit-converter"],
  },
  "average-calculator": {
    pageTitle: "Average Calculator — Mean, Median & Mode Calculator | IXDocs Calculator",
    example: {
      title: "Analyzing Weekly Daily Sales Figures",
      description:
        "Find the mean, median, and range for a store's week: 120, 140, 150, 140, 180, 210, 110.",
      steps: [
        "Sum = 1,050 across 7 days",
        "Mean (Average) = 1,050 / 7 = 150",
        "Sorted: 110, 120, 140, 140, 150, 180, 210; Median = 140; Mode = 140",
      ],
    },
    relatedSlugs: ["statistics-calculator", "gpa-calculator", "fraction-calculator"],
  },
  "statistics-calculator": {
    pageTitle: "Statistics Calculator — Standard Deviation, Variance & Mean | IXDocs Calculator",
    example: {
      title: "Test Score Distribution",
      description:
        "Calculate population and sample variance for student exam marks: 78, 85, 92, 64, 88.",
      steps: [
        "Mean: 81.4",
        "Sum of squared deviations: 461.2",
        "Sample Std Dev (s): √ (461.2 / 4) = 10.74",
      ],
    },
    relatedSlugs: ["average-calculator", "gpa-calculator", "percentage-calculator"],
  },
  "gpa-calculator": {
    pageTitle: "GPA & CGPA Calculator — 10-Point Grading Scale | IXDocs",
    example: {
      title: "Semester SGPA Calculation (10-Point Scale)",
      description:
        "Calculate SGPA for 5 engineering courses: Math (4 cr, O=10), DSA (4 cr, A+=9), OS (3 cr, A=8), OOP (3 cr, A+=9), and Lab (2 cr, O=10).",
      steps: [
        "Grade points: (10×4) + (9×4) + (8×3) + (9×3) + (10×2) = 40 + 36 + 24 + 27 + 20 = 147",
        "Total Credits: 4 + 4 + 3 + 3 + 2 = 16",
        "Semester SGPA: 147 / 16 = 9.19 / 10.0",
        "Approximate Marks: 9.19 × 9.5 ≈ 87.3%",
      ],
    },
    relatedSlugs: ["average-calculator", "statistics-calculator", "scientific-calculator"],
  },
  "scientific-calculator": {
    pageTitle: "Scientific Calculator — Advanced Online Calculator | IXDocs",
    example: {
      title: "Trigonometric and Logarithmic Evaluation",
      description: "Evaluate sin(30°) + log(100) with standard operator precedence.",
      steps: ["Angle Mode: DEG", "sin(30°) = 0.5", "log(100) = 2", "Result: 0.5 + 2 = 2.5"],
    },
    relatedSlugs: ["basic-calculator", "fraction-calculator", "percentage-calculator"],
  },
  "bmi-calculator": {
    pageTitle: "BMI Calculator — Calculate BMI & Healthy Weight | IXDocs Calculator",
    example: {
      title: "Adult BMI and Ideal Weight Range",
      description:
        "Assess BMI for an individual who is 5 ft 10 in (178 cm) tall weighing 165 lbs (74.8 kg).",
      steps: [
        "BMI = 74.8 / (1.78 × 1.78) = 23.6 kg/m²",
        "Category: Normal Weight (18.5 - 24.9)",
        "Healthy weight bracket for 5'10\": 129 lbs to 173 lbs",
      ],
    },
    relatedSlugs: ["calorie-calculator"],
  },
  "calorie-calculator": {
    pageTitle: "Calorie Calculator — Daily Calorie Needs & TDEE | IXDocs Calculator",
    example: {
      title: "Weight Maintenance & Calorie Deficit",
      description:
        "Calculate maintenance and fat-loss calories for a 30-year-old male, 180 cm tall, 80 kg, exercising 3 times/week.",
      steps: [
        "Basal Metabolic Rate (BMR, Mifflin-St Jeor): 1,775 kcal",
        "TDEE with moderate activity factor (1.375): ~2,440 kcal/day",
        "Mild deficit for fat loss (-500 kcal): ~1,940 kcal/day",
      ],
    },
    relatedSlugs: ["bmi-calculator", "fuel-cost-calculator"],
  },
  "time-duration-calculator": {
    pageTitle: "Time Duration Calculator — Hours & Minutes Between Times | IXDocs Calculator",
    example: {
      title: "Timesheet Work Shift Calculation",
      description:
        "Find total payable hours between clocking in at 08:45 AM and clocking out at 05:15 PM with a 45-minute lunch break.",
      steps: [
        "Gross time elapsed: 8 hours 30 minutes (510 minutes)",
        "Deduct unpaid lunch: 510 - 45 = 465 minutes",
        "Billable work time: 7 hours 45 minutes (7.75 hours)",
      ],
    },
    relatedSlugs: ["time-calculator", "date-calculator", "timezone-converter"],
  },
  "time-calculator": {
    pageTitle: "Time Calculator — Add & Subtract Time Online | IXDocs Calculator",
    example: {
      title: "Adding Video Clip Durations",
      description: "Sum the runtimes of three video segments: 01:25:30, 00:48:45, and 02:12:15.",
      steps: [
        "Seconds: 30 + 45 + 15 = 90 sec = 1 min 30 sec",
        "Minutes: 25 + 48 + 12 + 1 = 86 min = 1 hr 26 min",
        "Hours: 1 + 0 + 2 + 1 = 4 hrs; Total runtime: 4 hours 26 minutes 30 seconds",
      ],
    },
    relatedSlugs: ["time-duration-calculator", "date-calculator", "timezone-converter"],
  },
  "data-storage-calculator": {
    pageTitle: "Data Storage Calculator — Bytes, KB, MB, GB, TB Converter | IXDocs Calculator",
    example: {
      title: "Converting Hard Drive Storage Discrepancy",
      description:
        "Convert a 1 Terabyte (TB) commercial SSD to binary Gibibytes (GiB) recognized by operating systems.",
      steps: [
        "1 TB decimal = 1,000,000,000,000 bytes",
        "Divide by binary 1024³: 1,000,000,000,000 / 1,073,741,824",
        "Operating System available space: ~931.32 GiB",
      ],
    },
    relatedSlugs: ["unit-converter", "basic-calculator", "percentage-calculator"],
  },
  "fuel-cost-calculator": {
    pageTitle: "Fuel Cost Calculator — Trip Gas Cost & Mileage Calculator | IXDocs Calculator",
    example: {
      title: "Road Trip Fuel Budget",
      description:
        "Calculate estimated petrol cost for a 450-mile road trip in a vehicle averaging 28 MPG with gas at $3.60/gallon.",
      steps: [
        "Gallons required: 450 / 28 = 16.07 gallons",
        "Total cost: 16.07 × $3.60 = $57.86",
        "Cost per passenger (split between 3 friends): $19.29",
      ],
    },
    relatedSlugs: ["unit-converter", "bill-calculator", "tip-calculator"],
  },
  "age-calculator": {
    pageTitle: "Age Calculator — Exact Age, Months, Days & Next Birthday | IXDocs Calculator",
    example: {
      title: "Determining Precise Chronological Age",
      description: "Calculate exact age on September 6, 2026 for someone born on March 15, 1998.",
      steps: [
        "Years elapsed: 28 years",
        "Months elapsed: 5 months",
        "Days elapsed: 22 days",
        "Next birthday countdown: 190 days remaining",
      ],
    },
    relatedSlugs: ["date-calculator", "time-calculator", "time-duration-calculator"],
  },
  "date-calculator": {
    pageTitle: "Date Calculator — Days Between Dates & Add/Subtract Days | IXDocs Calculator",
    example: {
      title: "Project Milestone Deadline",
      description: "Add 90 calendar days to a contract signing date of October 1, 2026.",
      steps: [
        "Start Date: October 1, 2026",
        "Add 90 days across October (30 days remaining), November (30 days), and December",
        "Target Milestone Date: December 30, 2026",
      ],
    },
    relatedSlugs: ["age-calculator", "time-duration-calculator", "time-calculator"],
  },
  "unit-converter": {
    pageTitle: "Unit Converter — Length, Weight, Volume & Temperature | IXDocs Calculator",
    example: {
      title: "Baking Temperature & Weight Conversion",
      description: "Convert 375°F to Celsius and 2.5 pounds of sugar to grams.",
      steps: [
        "Temperature: (375°F - 32) × 5/9 = 190.56°C (Gas mark 5)",
        "Weight: 2.5 lbs × 453.592 = 1,133.98 grams",
      ],
    },
    relatedSlugs: ["data-storage-calculator", "fuel-cost-calculator", "ratio-calculator"],
  },
  "password-generator": {
    pageTitle: "Password Generator — Strong & Secure Password Creator | IXDocs Calculator",
    example: {
      title: "Creating a 16-Character Secure Vault Password",
      description:
        "Generate a cryptographically secure random password containing uppercase, lowercase, numbers, and symbols.",
      steps: [
        "Entropy: Uses window.crypto.getRandomValues() CSPRNG",
        "Output: 'k9#M2$pL8*vR4!qX'",
        "Includes high complexity, zero predictable patterns, no server transmission",
      ],
    },
    relatedSlugs: ["random-password-generator", "word-counter", "qr-generator"],
  },
  "random-password-generator": {
    pageTitle:
      "Random Password Generator — Customizable Passwords & Passphrases | IXDocs Calculator",
    example: {
      title: "Memorable Diceware Passphrase",
      description:
        "Generate a 4-word passphrase with custom hyphen separator for easy memorization.",
      steps: [
        "Random words: 'cobalt-falcon-orbit-timber'",
        "Estimated cracking resistance: > 60 bits of entropy",
        "Convenient for master passwords and smartphone lock codes",
      ],
    },
    relatedSlugs: ["password-generator", "word-counter", "qr-generator"],
  },
  "word-counter": {
    pageTitle: "Word Counter — Character Count, Words & Reading Time | IXDocs Calculator",
    example: {
      title: "Essay Length & Reading Speech Estimation",
      description:
        "Analyze a 1,200-word academic paper for character counts, paragraphs, and estimated spoken duration.",
      steps: [
        "Word count: 1,200 words; Character count: ~7,500 characters",
        "Silent reading time (@ 200 wpm): ~6 minutes",
        "Speaking presentation time (@ 130 wpm): ~9 minutes 15 seconds",
      ],
    },
    relatedSlugs: ["data-storage-calculator", "password-generator", "basic-calculator"],
  },
  "qr-generator": {
    pageTitle: "QR Generator — Create Custom QR Codes Online | IXDocs Calculator",
    example: {
      title: "Wi-Fi Network Quick-Connect Code",
      description:
        "Generate a high-contrast QR code encoding guest office Wi-Fi credentials for instant smartphone joining.",
      steps: [
        "Payload formatted as: WIFI:S:OfficeGuest;T:WPA;P:SecretKey123;;",
        "Live SVG preview rendered instantly",
        "Exported as 1000px high-resolution PNG for printing",
      ],
    },
    relatedSlugs: ["barcode-generator", "bill-calculator", "password-generator"],
  },
  "timezone-converter": {
    pageTitle: "Timezone Converter — World Clock & Meeting Time Planner | IXDocs Calculator",
    example: {
      title: "Scheduling an International Remote Meeting",
      description:
        "Find corresponding local times for a conference call scheduled at 10:00 AM New York (EDT, UTC-4).",
      steps: [
        "London (BST, UTC+1): 03:00 PM",
        "Berlin (CEST, UTC+2): 04:00 PM",
        "Tokyo (JST, UTC+9): 11:00 PM",
        "Sydney (AEST, UTC+10): 12:00 Midnight",
      ],
    },
    relatedSlugs: ["time-calculator", "time-duration-calculator", "date-calculator"],
  },
  "bill-calculator": {
    pageTitle:
      "Bill Calculator — POS Invoicing, Barcode Scanner & PDF Receipts | IXDocs Calculator",
    ogImage: "https://calc.ixdocs.com/og-bill-calculator.png",
    example: {
      title: "Retail Check-Out with Camera Barcode Scanning",
      description:
        "Scan three items at counter, apply 18% GST, and download an 80mm thermal receipt.",
      steps: [
        "Point camera at items: Barcodes detected and added to cart instantly",
        "Adjust quantities and verify line totals in real-time",
        "Click 'Generate PDF Bill' to immediately download receipt without leaving page",
      ],
    },
    relatedSlugs: ["barcode-generator", "sales-tax-calculator", "discount-calculator"],
  },
  "barcode-generator": {
    pageTitle: "Product Barcode Generator — Code 128, EAN-13, UPC-A Barcodes | IXDocs Calculator",
    ogImage: "https://calc.ixdocs.com/og-barcode-generator.png",
    example: {
      title: "Generating Retail Product Barcode & Label Sheet",
      description:
        "Create an EAN-13 barcode for retail inventory and print a sheet of 24 sticker labels.",
      steps: [
        "Select EAN-13 and enter 12-digit prefix: '590123412345'",
        "Engine calculates valid 13th check digit ('7')",
        "Click 'Print Label Sheet' to produce ready-to-peel warehouse stickers",
      ],
    },
    relatedSlugs: ["qr-generator", "bill-calculator", "data-storage-calculator"],
  },
};

export const CALCULATORS: CalculatorMeta[] = RAW_CALCULATORS.map((base) => {
  const extra = CALC_PAGE_EXTRAS[base.slug];
  if (!extra) return base;
  return {
    ...base,
    pageTitle: extra.pageTitle,
    ...(extra.ogImage ? { ogImage: extra.ogImage } : {}),
    example: extra.example,
    relatedSlugs: extra.relatedSlugs || base.relatedSlugs,
  };
});

export const POPULAR_CALCULATORS = CALCULATORS.filter((c) => c.popular);

const CALCULATORS_BY_SLUG = new Map<string, CalculatorMeta>(CALCULATORS.map((c) => [c.slug, c]));

export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return CALCULATORS_BY_SLUG.get(slug);
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
      meta: [{ title: "IXDocs Calculator — Free Online Tools" }],
    };
  }
  const url = `https://calc.ixdocs.com/${calcMeta.slug}`;
  const title = calcMeta.pageTitle || `${calcMeta.name} — Free Online Tool | IXDocs Calculator`;
  const ogImage = calcMeta.ogImage || "https://calc.ixdocs.com/og-calculator.png";
  const categoryLabel = CATEGORY_LABELS[calcMeta.category] || "Calculators";

  return {
    meta: [
      { title },
      { name: "description", content: calcMeta.metaDescription },
      { name: "keywords", content: calcMeta.keywords.join(", ") },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "IXDocs Calculator" },
      { property: "og:title", content: title },
      { property: "og:description", content: calcMeta.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: `${calcMeta.name} — IXDocs Calculator` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: calcMeta.metaDescription },
      { name: "twitter:image", content: ogImage },
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
          operatingSystem: "All",
          browserRequirements: "Requires JavaScript. Requires HTML5.",
          featureList: calcMeta.howItWorks.join("; "),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Calculators",
              item: "https://calc.ixdocs.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: categoryLabel,
              item: `https://calc.ixdocs.com/#${calcMeta.category}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: calcMeta.name,
              item: url,
            },
          ],
        }),
      },
      ...(calcMeta.faqs && calcMeta.faqs.length > 0
        ? [
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
          ]
        : []),
    ],
  };
}
