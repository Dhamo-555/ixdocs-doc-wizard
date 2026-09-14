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
    formula: "Standard Infix Arithmetic: Expression = a op b (evaluating × and ÷ before + and −)",
    explanation:
      "Basic Calculator provides a fast, dependable online tool for everyday arithmetic, personal budgeting, quick invoice checks, and homework calculations directly in your web browser. It supports all fundamental mathematical operations including addition, subtraction, multiplication, division, percentages, and parenthetical sub-expressions. Whether you are balancing household finances, tallying receipt totals, or verifying classroom math exercises, this utility delivers responsive, instant results.\n\nThe calculator implements standard operator precedence rules (commonly known as BODMAS or PEMDAS), ensuring multiplication and division evaluate prior to addition and subtraction unless parentheses dictate otherwise. Parentheses can be nested freely, allowing you to chain multi-step commercial purchases, calculate net costs, or split itemized bills without manual memory registers. Important inputs include numeric digits, operational symbols, and grouping brackets. Limitations include focusing strictly on elementary arithmetic rather than complex algebraic solving or calculus.\n\nEvery calculation is executed locally on your computer or mobile device using modern client-side JavaScript math parsers. Your inputs, numerical values, and calculations are never transmitted over the internet or logged on any external server, guaranteeing complete privacy for personal financial totals and confidential bookkeeping. The clean, tactile user interface includes backspace correction, full clear functions, and keyboard input support for frictionless desktop and mobile operation.",
    howItWorks: [
      "Enter numbers using your keyboard or on-screen buttons.",
      "Select an arithmetic operator (+, −, ×, ÷).",
      "Press '=' or Enter to calculate the final result.",
      "Use 'C' to clear the display or '⌫' to backspace.",
    ],
    example: {
      title: "Example: Calculating a multi-item purchase with discounts",
      description:
        "You purchase 4 notebooks at $5.50 each and 2 pens at $2.25 each, then receive an overall $3.00 store discount: (4 × 5.50) + (2 × 2.25) − 3.00 = 22.00 + 4.50 − 3.00 = $23.50.",
      steps: [
        "Enter (4 * 5.50) to calculate notebook subtotal ($22.00).",
        "Add + (2 * 2.25) for the pen subtotal ($4.50).",
        "Subtract - 3.00 for the promotional store coupon.",
        "Press = to evaluate the total payable balance of $23.50.",
      ],
    },
    faqs: [
      {
        question: "Does this basic calculator follow standard order of operations?",
        answer:
          "Yes. The calculator strictly respects BODMAS/PEMDAS precedence. Multiplications and divisions are evaluated before additions and subtractions unless grouped with parentheses.",
      },
      {
        question: "Can I use parentheses for complex nested math problems?",
        answer:
          "Yes. You can open and close parentheses to control the calculation flow, and nested brackets evaluate from the innermost pair outward.",
      },
      {
        question: "How does the percentage button work in basic arithmetic?",
        answer:
          "The percentage button converts the entered value to its hundredth equivalent (e.g. 50% = 0.50), making it easy to calculate markups and discounts in line.",
      },
      {
        question: "Can I use my physical computer keyboard to enter numbers?",
        answer:
          "Yes. Number keys, standard operators (+, -, *, /), Enter for equals, and Backspace/Escape are fully mapped for rapid keyboard entry.",
      },
      {
        question: "Are my calculations recorded or sent to any remote server?",
        answer:
          "No. All arithmetic executes entirely in local browser memory. No figures, financial totals, or keystrokes are transmitted across the network.",
      },
    ],
    relatedSlugs: ["scientific-calculator", "percentage-calculator", "discount-calculator"],
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
    formula: "Final Price = Original Price × (1 − Discount1/100) × (1 − Discount2/100) + Tax",
    explanation:
      "Discount Calculator allows shoppers, retail managers, and small business owners to compute sale prices, total monetary savings, and final checkout costs in seconds directly inside your browser. Whether you are browsing seasonal clearance racks, applying promotional coupons, or evaluating stacked merchant offers, this tool removes the guesswork from retail discounts. It is particularly useful for Black Friday sales, end-of-season clearances, and promotional retail comparisons.\n\nThe calculator supports both single percentage markdowns and multi-tiered stacked discounts—such as an extra 15% off an already discounted 30% sale price. It also incorporates optional sales tax calculations so you know the exact out-of-pocket amount required at the register before standing in line. Essential inputs include the original retail price, primary discount percentage, optional secondary coupon rate, and applicable local sales tax rate. Note that this calculator evaluates percentage or flat deductions, but does not account for complex retail thresholds like 'buy-one-get-one-half-off' combinations.\n\nBecause calculation algorithms run client-side on your device, all computations update in real time with zero network latency. No shopping habits, product amounts, or financial details leave your browser. This tool helps you compare competing discounts, confirm register accuracy on store receipts, and determine whether promotional bundles offer genuine financial value.",
    howItWorks: [
      "Enter the original sticker price.",
      "Enter the primary discount percentage.",
      "Optionally enter extra coupon discounts or local sales tax.",
      "See final cost and your exact total savings.",
    ],
    example: {
      title: "Example: Calculating a winter jacket on clearance",
      description:
        "A winter jacket originally priced at $180 is discounted by 35%, plus an extra 10% coupon code is applied at checkout with 7% local sales tax. Primary discount: $180 × 0.65 = $117.00. Secondary coupon: $117.00 × 0.90 = $105.30. Sales tax: $105.30 × 1.07 = $112.67. Total savings = $74.70.",
      steps: [
        "Enter 180 in Original Price.",
        "Enter 35 in Primary Discount (%).",
        "Enter 10 in Extra Discount (%).",
        "Enter 7 in Sales Tax (%) to view the final payable total ($112.67).",
      ],
    },
    faqs: [
      {
        question: "How do stacked discounts differ from adding percentages together?",
        answer:
          "Stacked discounts apply sequentially rather than additively. A 30% discount followed by an extra 20% discount is applied to the already-reduced price, resulting in an effective 44% total discount, not 50%.",
      },
      {
        question: "Is sales tax calculated before or after the discount is applied?",
        answer:
          "In most retail jurisdictions, sales tax is calculated on the post-discounted final selling price. This calculator applies tax to the discounted net amount.",
      },
      {
        question:
          "Can I find the original price if I only know the sale price and discount percentage?",
        answer:
          "Yes. Divide the sale price by (1 − discount rate). For example, a $75 item at 25% off had an original price of $75 / 0.75 = $100.",
      },
      {
        question: "Can I calculate fixed dollar discounts instead of percentages?",
        answer:
          "Yes. You can compare flat dollar rebates against percentage markdowns to determine which promotional offer saves more money.",
      },
      {
        question: "Is my shopping or pricing information stored anywhere?",
        answer:
          "No. IXDocs operates on a private, client-side architecture. All calculations execute locally in your web browser.",
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
    formula:
      "Tax = Price × (Rate / 100); Total = Price + Tax; Net from Gross = Gross / (1 + Rate / 100)",
    explanation:
      "Sales Tax Calculator provides an accurate, instant way to compute tax amounts, total gross checkout costs, or reverse-calculate net prices from tax-inclusive totals directly in your web browser. It is designed for consumers tracking purchase budgets, freelancers preparing client invoices, and online sellers verifying tax obligations across municipal jurisdictions. Whether you need to figure out how much tax will be added at checkout or extract underlying pre-tax costs from an all-inclusive receipt, this tool simplifies everyday tax math.\n\nThe calculator features dual-mode operation: Forward Tax Mode adds state, provincial, or local sales tax percentages to a pre-tax subtotal, while Reverse Tax (VAT/GST) Mode extracts the underlying pre-tax price and embedded tax portion from a gross total receipt. Key inputs include the base monetary value, the applicable tax rate percentage, and the calculation mode. Limitations include computing single-rate flat tax percentages rather than progressive tax brackets or location-specific automated zip-code lookup.\n\nAll tax mathematical equations are computed locally inside your browser memory using exact financial decimal rounding. No invoices, receipt figures, or private transaction values are uploaded to external databases. This makes it an invaluable utility for cross-border commerce calculations, business expense reports, and consumer price comparisons.",
    howItWorks: [
      "Select Forward (add tax) or Reverse (find pre-tax price) mode.",
      "Enter the price and applicable tax rate percentage.",
      "Get instant breakdown of net price, tax amount, and gross total.",
    ],
    example: {
      title: "Example: Adding local sales tax to an electronics invoice",
      description:
        "You purchase computer equipment for $850.00 in a district with a 7.25% combined state and municipal sales tax. Sales tax = $850.00 × 0.0725 = $61.63. Total invoice payable = $850.00 + $61.63 = $911.63.",
      steps: [
        "Select 'Add Tax' mode.",
        "Enter 850 in the Amount field.",
        "Enter 7.25 in the Tax Rate (%) field.",
        "View the breakdown: $61.63 tax and $911.63 total gross cost.",
      ],
    },
    faqs: [
      {
        question: "What is the difference between sales tax and Value Added Tax (VAT)?",
        answer:
          "Sales tax is typically added at the final point of retail purchase, while VAT is assessed incrementally at each production stage and often included directly in sticker prices.",
      },
      {
        question:
          "How do I extract the pre-tax price from a total receipt that already includes tax?",
        answer:
          "Switch to 'Reverse Tax' mode and enter your receipt total. The formula divides the total by (1 + tax rate / 100) to isolate the original pre-tax amount.",
      },
      {
        question: "Does this calculator support compound or tiered municipal taxes?",
        answer:
          "Enter the combined effective tax rate (e.g., 6% state + 1.5% county = 7.5%) to calculate the total tax payable in a single pass.",
      },
      {
        question: "How does rounding affect small cents calculations?",
        answer:
          "Financial calculations round to two decimal places (standard half-up rounding), matching standard retail point-of-sale accounting practices.",
      },
      {
        question: "Are any sales figures or invoice values transmitted over the network?",
        answer:
          "No. All financial calculations occur strictly client-side on your local device without any server storage or data tracking.",
      },
    ],
    relatedSlugs: ["discount-calculator", "percentage-calculator", "tip-calculator"],
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
    formula:
      "Simple: A = P(1 + rt); Compound: A = P(1 + r/n)^(nt); Effective Annual Rate: EAR = (1 + r/n)^n − 1",
    explanation:
      "Interest Calculator empowers savers, investors, and borrowers to project asset accumulation, loan interest accrual, and investment growth under both simple and compound interest models directly in your browser. Whether you are forecasting long-term returns on an index fund, comparing high-yield savings accounts, or assessing the carrying cost of a personal loan, this tool provides clear financial projections.\n\nThe calculator supports multiple compounding intervals including annually, semi-annually, quarterly, monthly, and daily. You can contrast simple linear interest against exponential compounding to understand how reinvested earnings accelerate portfolio growth over multi-year horizons. Important inputs include principal capital, nominal interest rate, investment duration in years, and compounding frequency. A key limitation is assuming constant interest rates across the entire term, without accounting for market volatility or income tax deductions.\n\nAll financial projections compute client-side using standard compound interest algorithms. Your confidential financial figures, savings targets, and personal balances are never transmitted to external cloud systems or stored on servers. This ensures private financial modeling for retirement planning, emergency fund growth, and debt cost analysis.",
    howItWorks: [
      "Enter principal amount, annual interest rate, and duration in years.",
      "Choose compound or simple interest model.",
      "Review the projected final balance and total interest earned.",
    ],
    example: {
      title: "Example: Comparing 5-year savings growth with monthly compounding",
      description:
        "Investing $10,000 at a 6% annual interest rate compounded monthly for 5 years: A = 10,000 × (1 + 0.06/12)^(12 × 5) = 10,000 × (1.005)^60 = $13,488.50. Total interest earned = $3,488.50.",
      steps: [
        "Enter 10000 in Principal Amount.",
        "Enter 6 in Annual Interest Rate (%).",
        "Enter 5 in Time Period (Years).",
        "Select 'Monthly (12/yr)' as the Compounding Frequency to view the $13,488.50 final balance.",
      ],
    },
    faqs: [
      {
        question: "What is the primary difference between simple and compound interest?",
        answer:
          "Simple interest is paid solely on the initial principal. Compound interest pays interest on both the initial principal and previously accumulated interest, yielding exponential growth.",
      },
      {
        question: "How does compounding frequency impact total investment return?",
        answer:
          "More frequent compounding (e.g., daily or monthly vs. annually) generates slightly higher returns because accrued interest begins earning interest sooner.",
      },
      {
        question: "What is Annual Percentage Yield (APY) or Effective Annual Rate (EAR)?",
        answer:
          "APY reflects the actual annualized rate of return taking compounding frequency into account, whereas nominal rate ignores compounding effects.",
      },
      {
        question: "Does this calculator account for ongoing monthly contributions?",
        answer:
          "This tool calculates single lump-sum compound and simple interest. For recurring deposits, visit our dedicated Investment or Savings tools.",
      },
      {
        question: "Is my personal financial information kept confidential?",
        answer:
          "Yes. All computations execute locally in your web browser. IXDocs never transmits or logs your investment figures or account balances.",
      },
    ],
    relatedSlugs: ["loan-calculator", "mortgage-calculator", "investment-calculator"],
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
    formula: "a/b ± c/d = (ad ± bc)/bd; (a/b) × (c/d) = ac/bd; (a/b) ÷ (c/d) = ad/bc",
    explanation:
      "Fraction Calculator performs arithmetic operations on proper fractions, improper fractions, mixed numbers, and integers with step-by-step simplification directly in your web browser. Designed for students, educators, woodworkers, chefs adjusting recipe yields, and engineers working with imperial blueprints, this tool eliminates manual common denominator searches. It handles addition, subtraction, multiplication, and division effortlessly while presenting results in reduced terms.\n\nThe tool automatically determines the Greatest Common Divisor (GCD) and Least Common Denominator (LCD), presenting your final output as a simplified proper fraction, an equivalent mixed number, and an exact decimal representation. Key inputs include numerator and denominator values for both operands along with the chosen mathematical operator. Limitations include working with rational numbers rather than irrational constants or algebraic variable equations.\n\nAll rational fraction calculations execute client-side in browser memory without sending requests to external web servers. Your homework exercises, recipe measurements, and fabrication dimensions remain entirely private. The calculator provides immediate visual feedback, making it an indispensable educational resource for mastering fractions and checking work accuracy.",
    howItWorks: [
      "Enter numerator and denominator for both fractions.",
      "Choose the arithmetic operation (+, −, ×, ÷).",
      "Read the simplified answer, mixed fraction, decimal value, and step-by-step solution.",
    ],
    example: {
      title: "Example: Adding mixed fractions with different denominators",
      description:
        "Adding 1 3/4 + 2 2/3: Convert to improper fractions: 7/4 + 8/3. Find LCD (12): (21/12) + (32/12) = 53/12. Convert back to mixed fraction: 4 5/12 (approx. 4.4167).",
      steps: [
        "Enter 1 and 3/4 for the first fraction operand.",
        "Select the '+' addition operator.",
        "Enter 2 and 2/3 for the second fraction operand.",
        "Click Calculate to review 4 5/12, improper fraction 53/12, and decimal 4.4167.",
      ],
    },
    faqs: [
      {
        question: "How do you add fractions with different denominators?",
        answer:
          "Convert fractions to share a common denominator by finding the Least Common Denominator (LCD), adjust numerators proportionally, add numerators, and reduce to simplest form.",
      },
      {
        question: "How does the calculator simplify improper fractions into mixed numbers?",
        answer:
          "It divides the numerator by the denominator. The quotient becomes the whole integer, and the remainder becomes the new numerator over the original denominator.",
      },
      {
        question: "Can I enter whole integers or negative numbers?",
        answer:
          "Yes. Whole numbers can be entered directly (or with denominator 1), and negative signs in numerators or denominators are handled correctly.",
      },
      {
        question: "What happens when dividing one fraction by another?",
        answer:
          "The calculator multiplies the first fraction by the reciprocal (inverted value) of the second fraction: (a/b) ÷ (c/d) = (a/b) × (d/c).",
      },
      {
        question: "Are my fraction calculations saved or shared?",
        answer:
          "No. All fraction simplifications and conversions take place locally inside your browser without any network telemetry.",
      },
    ],
    relatedSlugs: ["ratio-calculator", "percentage-calculator", "scientific-calculator"],
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
    formula:
      "Ratio Equality: A : B = C : D => A × D = B × C; Simplification: A/gcd(A,B) : B/gcd(A,B)",
    explanation:
      "Ratio Calculator solves proportions, scales multi-part ratios, simplifies complex numerical proportions to lowest integer terms, and finds missing values in proportional equations directly in your web browser. It is tailored for digital photographers adjusting aspect ratios, model makers scaling engineering prototypes, chemical lab technicians mixing reagent concentrations, and culinary professionals resizing recipes.\n\nThe calculator provides two primary modes: Solving Missing Values (A : B = C : X) using cross-multiplication, and Ratio Simplification, which reduces arbitrary integer or decimal ratios to their cleanest whole-number proportion using greatest common divisor factorization. Essential inputs include the known ratio terms and the variable term to be solved or simplified. Limitations include operating on static linear proportions rather than logarithmic or non-linear scaling relationships.\n\nAll calculations process client-side on your local hardware using instant JavaScript logic. None of your proprietary chemical formulas, blueprint dimensions, or photography aspect ratios are transmitted to remote servers. This provides a private, secure workflow for technical scaling, educational geometry, and commercial design projects.",
    howItWorks: [
      "To simplify: enter A and B to find their reduced ratio.",
      "To solve proportion: enter any three values in A:B = C:D to calculate the fourth.",
    ],
    example: {
      title: "Example: Scaling a screen aspect ratio for video production",
      description:
        "You have a 16:9 widescreen video and need to calculate the corresponding height for an ultra-wide 3840-pixel display: 16 / 9 = 3840 / X => X = (9 × 3840) / 16 = 2160 pixels (4K UHD).",
      steps: [
        "Select 'Solve for X' mode.",
        "Set A = 16 and B = 9.",
        "Set C = 3840 and designate D as X.",
        "Click Calculate to solve X = 2160.",
      ],
    },
    faqs: [
      {
        question: "How do you solve a missing value in a proportional ratio?",
        answer:
          "Use cross-multiplication: in the formula A:B = C:D, the product of the extremes equals the product of the means (A × D = B × C). Divide by the known counterpart to isolate X.",
      },
      {
        question: "Can this calculator simplify ratios containing decimal values?",
        answer:
          "Yes. Decimal terms are converted to integers by scaling by powers of 10, then reduced using their Greatest Common Divisor.",
      },
      {
        question: "What is an aspect ratio in photography and video?",
        answer:
          "An aspect ratio is the proportional relationship between display width and height, such as 16:9 for modern video or 4:3 for classic displays.",
      },
      {
        question: "Can I scale a recipe up or down using this ratio tool?",
        answer:
          "Yes. Determine the base ratio of key ingredients to portion sizes, then input your target serving count to find exact scaled quantities.",
      },
      {
        question: "Does the ratio calculator track my inputs?",
        answer:
          "No. All ratio math runs entirely in browser memory. No entries, measurements, or scaling ratios leave your machine.",
      },
    ],
    relatedSlugs: ["fraction-calculator", "percentage-calculator", "unit-converter"],
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
    formula:
      "Mean = Σx / n; Median = Middle value of sorted set; Mode = Most frequent value(s); Range = Max − Min",
    explanation:
      "Average Calculator provides comprehensive central tendency analysis for numeric data sets directly in your web browser. Rather than providing only a simple arithmetic mean, this tool computes the mean, median, mode, geometric mean, range, minimum, maximum, and total sum simultaneously from any comma-, space-, or newline-delimited sequence of numbers. It serves students analyzing lab experiments, business analysts evaluating sales performance, and teachers grading tests.\n\nThe calculator distinguishes between symmetric distributions and skewed data sets. For example, while arithmetic mean can be heavily distorted by extreme outliers, median reveals the true midpoint of the distribution. Key inputs include your raw list of numerical values, entered flexibly using commas, spaces, or line breaks. Limitations include focusing on summary statistics for ungrouped discrete numbers rather than continuous probability distributions.\n\nBecause computations execute client-side in your browser, your proprietary data sets, salary surveys, grade rosters, and commercial metrics remain completely confidential. No figures are ever uploaded to cloud servers or indexed by analytics scripts. The tool instantly parses hundreds of values, formatting results cleanly for presentations and spreadsheets.",
    howItWorks: [
      "Paste or type numbers separated by commas, spaces, or new lines.",
      "View instant calculations for mean, median, mode, min, max, and sum.",
    ],
    example: {
      title: "Example: Finding central tendency of student exam grades",
      description:
        "Data set of 7 test scores: 65, 78, 84, 84, 88, 92, 98. Sum = 589. Mean = 589 / 7 = 84.14. Median (middle sorted value) = 84. Mode (most frequent) = 84. Range = 98 − 65 = 33.",
      steps: [
        "Paste or type the score sequence: 65, 78, 84, 84, 88, 92, 98 into the input box.",
        "Click Calculate.",
        "Review Mean (84.14), Median (84), Mode (84), and Range (33).",
      ],
    },
    faqs: [
      {
        question: "When should I use the median instead of the arithmetic mean?",
        answer:
          "Use median when your data set contains significant outliers or is skewed (such as real estate prices or household incomes), as extreme values distort the mean.",
      },
      {
        question: "Can a data set have more than one mode?",
        answer:
          "Yes. A data set can be bimodal (two modes) or multimodal (multiple modes) if two or more distinct values share the highest frequency.",
      },
      {
        question: "What is the geometric mean and when is it appropriate?",
        answer:
          "The geometric mean multiplies all n values and takes the nth root. It is widely used in finance to calculate compound annualized investment growth rates.",
      },
      {
        question: "How many numbers can I analyze simultaneously?",
        answer:
          "The calculator efficiently processes hundreds of numbers instantaneously in your browser without lag or server timeouts.",
      },
      {
        question: "Is my uploaded data set stored or transmitted anywhere?",
        answer:
          "No. All statistical parsing executes locally inside your web browser. No figures are logged, transmitted, or stored externally.",
      },
    ],
    relatedSlugs: ["statistics-calculator", "percentage-calculator", "basic-calculator"],
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
    formula:
      "Variance: s² = Σ(x − x̄)² / (n − 1); Std Dev: s = √s²; Pop Std Dev: σ = √[Σ(x − μ)² / N]; SEM = s / √n",
    explanation:
      "Statistics Calculator computes essential descriptive statistical dispersion metrics directly in your web browser. It calculates sample standard deviation, population standard deviation, variance, standard error of the mean (SEM), sum of squares, and quartile breakdowns for any numeric dataset. It is an indispensable tool for academic researchers validating experimental trials, quality assurance engineers monitoring manufacturing tolerances, and data analysts verifying distribution normality.\n\nThe calculator clearly differentiates between sample statistics (dividing by n − 1 using Bessel's correction to prevent sample bias) and population parameters (dividing by N). This distinction is critical for experimental science and statistical hypothesis testing. Key inputs include your raw numeric dataset and the selection of sample vs. population framing. Limitations include focusing on descriptive univariate statistics rather than multivariate regression or ANOVA.\n\nAll data parsing, sum of squares computation, and root extraction occur client-side in browser memory. Sensitive medical research numbers, laboratory measurements, and confidential production logs never leave your device. The calculator delivers instant, verified statistical figures suitable for peer review, lab reports, and industrial quality control.",
    howItWorks: [
      "Enter a comma or space-separated list of numeric values.",
      "Get complete statistical summary including standard deviation, variance, quartiles, and IQR.",
    ],
    example: {
      title: "Example: Computing sample standard deviation of production batch weights",
      description:
        "Five part weights measured in grams: 10.2, 10.5, 9.8, 10.1, 10.4. Mean = 10.2 g. Deviations squared sum to 0.30. Sample variance s² = 0.30 / (5 − 1) = 0.0750. Sample standard deviation s = √0.0750 ≈ 0.2739 g.",
      steps: [
        "Enter dataset: 10.2, 10.5, 9.8, 10.1, 10.4.",
        "Select 'Sample' mode (Bessel corrected n − 1).",
        "Click Calculate.",
        "Review sample standard deviation (0.2739 g), variance (0.0750), and mean (10.2000 g).",
      ],
    },
    faqs: [
      {
        question: "Why does sample standard deviation divide by (n − 1) instead of n?",
        answer:
          "Dividing by n − 1 (Bessel's correction) corrects downward bias when estimating population variability from a finite random sample.",
      },
      {
        question: "What does standard deviation indicate about a dataset?",
        answer:
          "Standard deviation quantifies how spread out values are from the average. In a normal distribution, approximately 68% of data falls within ±1 standard deviation of the mean.",
      },
      {
        question: "What is the difference between variance and standard deviation?",
        answer:
          "Variance measures squared dispersion in squared units, while standard deviation is the square root of variance, expressed in the original units of measurement.",
      },
      {
        question: "How does the calculator handle negative numbers or decimal values?",
        answer:
          "Negative values and high-precision floating-point numbers are fully supported and squared appropriately during variance accumulation.",
      },
      {
        question: "Are my research data points transmitted to an external server?",
        answer:
          "No. The statistical algorithms run 100% locally in your browser memory, keeping your clinical or proprietary datasets completely private.",
      },
    ],
    relatedSlugs: ["average-calculator", "scientific-calculator", "basic-calculator"],
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
    formula:
      "Trig: sin(θ), cos(θ), tan(θ); Logarithms: log₁₀(x), ln(x); Exponentials: e^x, x^y; Powers & Roots: √x, ∛x",
    explanation:
      "Scientific Calculator provides an advanced computational workspace for trigonometry, logarithms, exponential powers, factorials, and roots directly in your web browser. Engineered for engineering students, physicists, lab technicians, and high school STEM learners, it handles both elementary arithmetic and complex transcendental functions without requiring physical handheld scientific hardware.\n\nThe calculator features seamless switching between degrees and radians for trigonometric calculations, essential for geometry, physics motion problems, and calculus. It includes constants like Pi (π) and Euler's number (e), inverse trigonometry (arcsin, arccos, arctan), natural and base-10 logarithms, and power operations. Key inputs include numeric values, mathematical function keys, angle unit toggles, and memory registers. Limitations include focusing on standard scientific scalar evaluations rather than symbolic calculus derivatives or matrix algebra.\n\nEvery mathematical operation runs locally via standard client-side JavaScript Math functions. No homework problems, engineering measurements, or research calculations are sent to external web servers. The responsive design adapts cleanly to mobile touchscreens and desktop keyboards for rapid, private calculations anywhere.",
    howItWorks: [
      "Type or click numbers, scientific functions (sin, cos, log, etc.), and operators.",
      "Toggle between DEG (degrees) and RAD (radians) for trigonometry.",
      "Use parentheses to group operations and '=' or Enter to evaluate.",
    ],
    example: {
      title: "Example: Solving right-triangle hypotenuse using trigonometry",
      description:
        "Find the opposite side of a right triangle with angle θ = 30° and hypotenuse = 50 m: Opposite = Hypotenuse × sin(θ) = 50 × sin(30°) = 50 × 0.5 = 25 m.",
      steps: [
        "Ensure the angle mode is set to 'DEG' (Degrees).",
        "Enter 30 and press the 'sin' button (returns 0.5).",
        "Press '×' and enter 50.",
        "Press '=' to view the final result: 25.",
      ],
    },
    faqs: [
      {
        question: "How do I toggle between Degrees and Radians?",
        answer:
          "Use the DEG/RAD toggle button at the top of the calculator. Ensure correct mode selection before computing trigonometric functions to prevent incorrect angle results.",
      },
      {
        question: "What is the difference between log and ln?",
        answer:
          "'log' represents the common logarithm (base 10), while 'ln' represents the natural logarithm (base e ≈ 2.71828), commonly used in continuous growth and decay models.",
      },
      {
        question: "Can I calculate factorials of large numbers?",
        answer:
          "Yes. The calculator computes factorials (n!) for non-negative integers up to standard JavaScript safe float limits.",
      },
      {
        question: "Does the calculator support inverse trigonometric functions?",
        answer:
          "Yes. Toggle the inverse function mode to access asin, acos, and atan to calculate angles from known side ratios.",
      },
      {
        question: "Are my scientific formulas or calculations tracked?",
        answer:
          "No. All calculations run strictly client-side on your local device. No data is stored, tracked, or transmitted across the web.",
      },
    ],
    relatedSlugs: ["basic-calculator", "fraction-calculator", "statistics-calculator"],
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
      "Mifflin-St Jeor BMR: Men = 10W + 6.25H − 5A + 5; Women = 10W + 6.25H − 5A − 161; TDEE = BMR × Activity Factor",
    explanation:
      "Calorie Calculator estimates your daily Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) directly inside your web browser. Utilizing the clinically validated Mifflin-St Jeor equation, this tool helps fitness enthusiasts, athletes, and individuals managing health goals determine baseline caloric needs for weight maintenance, healthy fat loss, or lean muscle gain.\n\nThe tool calculates your baseline metabolism based on biological sex, age, height, and weight, then scales that figure against your typical daily physical activity level (from sedentary desk work to intense athletic training). It provides target daily caloric targets for mild weight loss (0.5 lb/week), standard weight loss (1 lb/week), and caloric surpluses for muscle building. Key inputs include gender, age, weight, height, and weekly activity multiplier. A primary limitation is that mathematical estimates cannot replace personalized clinical nutrition advice or account for thyroid metabolic disorders.\n\nAll biometric calculations are evaluated entirely client-side. Your age, body weight, height, and personal health targets remain completely private on your personal device and are never transmitted to external cloud systems or health data brokers.",
    howItWorks: [
      "Select biological gender and enter age, weight, and height.",
      "Choose your typical weekly physical activity level.",
      "Review your maintenance calories and recommended intake goals.",
    ],
    example: {
      title: "Example: Calculating maintenance and fat-loss calories for a 30-year-old male",
      description:
        "Male, age 30, weight 80 kg, height 180 cm, moderately active (exercise 3-5 days/wk). BMR = (10 × 80) + (6.25 × 180) − (5 × 30) + 5 = 1,780 kcal. TDEE = 1,780 × 1.55 = 2,759 kcal/day maintenance. Fat loss target (500 kcal deficit) = 2,259 kcal/day.",
      steps: [
        "Select Gender: Male.",
        "Enter Age: 30, Weight: 80 kg, Height: 180 cm.",
        "Select Activity Level: Moderately Active (1.55).",
        "Click Calculate to view 2,759 kcal maintenance and 2,259 kcal fat loss target.",
      ],
    },
    faqs: [
      {
        question: "What is the difference between BMR and TDEE?",
        answer:
          "BMR (Basal Metabolic Rate) is the minimum energy your body burns at complete rest for vital organ function. TDEE (Total Daily Energy Expenditure) accounts for BMR plus daily movement, work, and structured exercise.",
      },
      {
        question: "How large should my calorie deficit be for sustainable weight loss?",
        answer:
          "A moderate deficit of 300 to 500 calories per day typically yields a sustainable weight loss rate of 0.5 to 1 pound (0.25 to 0.5 kg) per week without excessive hunger or lean muscle loss.",
      },
      {
        question: "Which formula does this calorie calculator use?",
        answer:
          "It uses the Mifflin-St Jeor formula, widely recognized in clinical dietetics as one of the most accurate predictive equations for BMR.",
      },
      {
        question: "Can I enter measurements in imperial units (pounds and inches)?",
        answer:
          "Yes. The calculator includes toggles for both Metric (kg/cm) and Imperial (lbs/inches) measurement units.",
      },
      {
        question: "Is my personal weight or health data saved anywhere?",
        answer:
          "No. IXDocs has a strict privacy-first architecture. All health metrics compute locally in your browser and are never uploaded or saved.",
      },
    ],
    relatedSlugs: ["bmi-calculator", "ideal-weight-calculator", "body-fat-calculator"],
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
      "Duration: Days = EndDate − StartDate; New Date = BaseDate ± (Years, Months, Weeks, Days)",
    explanation:
      "Date Calculator provides versatile calendar computation for planning events, calculating business project timelines, legal notice deadlines, and human age verification directly in your web browser. It features dual operational modes: calculating the exact elapsed time between two calendar dates (in total days, weeks, months, and years) and projecting a future or past date by adding or subtracting calendar units.\n\nThe tool correctly handles Gregorian calendar anomalies including leap years, varying month lengths (28, 29, 30, or 31 days), and daylight saving shifts. Whether you are counting down to a milestone wedding, verifying legal statutory limitation periods, tracking visa stay durations, or planning sprint deliverables, this calculator eliminates manual calendar counting. Key inputs include starting date, target date, or the specific offset interval to add or subtract. A notable limitation is focusing on solar calendar dates without factoring localized statutory public bank holidays unless business-day filtering is applied.\n\nAll date computations execute locally on your device using JavaScript standard Date APIs. No personal schedules, anniversary dates, or corporate project deadlines are transmitted over the internet or logged on servers.",
    howItWorks: [
      "Choose to calculate difference between dates, or add/subtract days from a base date.",
      "Select your start date and target parameters.",
    ],
    example: {
      title: "Example: Calculating elapsed duration between project kickoff and product launch",
      description:
        "Project kickoff on March 15, 2026, and product launch on November 20, 2026: The duration is exactly 250 calendar days, which equals 35 weeks and 5 days (or 8 months and 5 days).",
      steps: [
        "Select 'Days Between Dates' mode.",
        "Set Start Date: March 15, 2026.",
        "Set End Date: November 20, 2026.",
        "Click Calculate to review 250 total days, 35 weeks 5 days, and month breakdown.",
      ],
    },
    faqs: [
      {
        question: "Does the date calculator account for leap years?",
        answer:
          "Yes. The calendar engine fully accounts for leap days in February across all past and future leap years in the Gregorian calendar.",
      },
      {
        question: "Can I choose whether to include the end date in the total day count?",
        answer:
          "Yes. You can toggle between excluding or including the end date depending on whether your contract counts elapsed nights or inclusive calendar days.",
      },
      {
        question: "How does the calculator handle adding months to a date like January 31?",
        answer:
          "When adding a month to January 31, standard calendar logic snaps to the final valid day of the target month (February 28 or 29) to prevent invalid month rollovers.",
      },
      {
        question: "Can I calculate business working days excluding weekends?",
        answer:
          "Yes. You can inspect total calendar days alongside working day approximations that exclude Saturday and Sunday.",
      },
      {
        question: "Are any of my calendar dates stored or tracked?",
        answer:
          "No. All date computations run locally in your web browser. No dates, notes, or schedules are transmitted to any server.",
      },
    ],
    relatedSlugs: ["time-duration-calculator", "time-calculator", "timezone-converter"],
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
    formula:
      "Duration = (EndHour × 3600 + EndMin × 60 + EndSec) − (StartHour × 3600 + StartMin × 60 + StartSec)",
    explanation:
      "Time Duration Calculator calculates the exact span of hours, minutes, and seconds between two timestamps directly in your web browser. Designed for hourly freelancers logging client billable hours, pilots tracking flight logs, athletes recording split workout times, and shift workers verifying payroll timesheets, this tool provides error-free duration breakdowns.\n\nThe calculator supports both 12-hour AM/PM and 24-hour military time formats, cleanly handling overnight shifts that wrap past midnight. It presents results in multiple synchronized units—including total hours, fractional decimal hours for billing (e.g., 7.50 hours), total minutes, and exact seconds. Key inputs include the beginning timestamp, ending timestamp, and an optional overnight wrap flag. Limitations include calculating elapsed wall-clock duration between two points in time rather than tracking live stopwatch lap splits.\n\nEvery time computation runs client-side in your browser memory. Your confidential work shifts, payroll figures, flight logs, and private daily routines are never sent to external servers or logged in cloud databases. This ensures complete privacy and rapid calculation for all your timekeeping needs.",
    howItWorks: [
      "Enter starting clock time (hours, minutes, seconds).",
      "Enter ending clock time.",
      "View elapsed time in clock format, total minutes, and decimal hours.",
    ],
    example: {
      title: "Example: Calculating an overnight nursing shift duration",
      description:
        "Shift starts at 9:30 PM (21:30) and ends at 6:15 AM (06:15) the following morning. Total elapsed time = 8 hours and 45 minutes (8.75 decimal billable hours, or 525 total minutes).",
      steps: [
        "Enter Start Time: 09:30 PM (or 21:30).",
        "Enter End Time: 06:15 AM (or 06:15).",
        "Click Calculate Duration.",
        "Review the result: 8 hours, 45 minutes (8.75 decimal hours for invoicing).",
      ],
    },
    faqs: [
      {
        question: "How does the calculator handle shifts that cross past midnight?",
        answer:
          "When end time is earlier than start time, the algorithm automatically adds 24 hours to the end time to calculate the overnight duration seamlessly.",
      },
      {
        question: "What are decimal hours and why are they used on timesheets?",
        answer:
          "Decimal hours convert minutes into a fraction of an hour (e.g., 45 minutes = 0.75 hours). Payroll systems multiply decimal hours by hourly pay rates to compute wages.",
      },
      {
        question: "Can I enter timestamps using military 24-hour format?",
        answer: "Yes. Both 12-hour AM/PM and 24-hour military time notations are fully supported.",
      },
      {
        question: "Can I deduct lunch breaks or unpaid rest periods?",
        answer:
          "Yes. Subtract your break duration from the total elapsed result to determine net billable working hours.",
      },
      {
        question: "Is my shift or timesheet data uploaded to any server?",
        answer:
          "No. All time calculations process locally on your machine. IXDocs never transmits or stores your schedule records.",
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
    formula: "T_total = Σ(Hours × 3600 + Minutes × 60 + Seconds) => Converted back to H:M:S",
    explanation:
      "Time Calculator simplifies adding, subtracting, and aggregating multiple segments of hours, minutes, and seconds directly in your web browser. It is indispensable for audio and video editors calculating total podcast runtimes, marathon runners totaling split intervals, construction contractors summing labor logs, and musicians assembling concert setlists.\n\nUnlike standard decimal calculators where adding 0.45 and 0.45 yields 0.90 instead of 1 hour and 30 minutes, this tool uses sexagesimal (base-60) arithmetic. It automatically carries over 60 seconds into a minute and 60 minutes into an hour. Key inputs include individual time segments with designated hour, minute, and second fields, alongside addition or subtraction operational controls. Limitations include working with elapsed time durations rather than geo-referenced timezone offsets.\n\nAll time calculations process instantly within your browser using client-side JavaScript. None of your media production logs, payroll timesheets, or training regimens are uploaded or logged on any external cloud server, guaranteeing fast, completely private timekeeping calculations on any device.",
    howItWorks: [
      "Enter your starting time.",
      "Choose whether to add or subtract.",
      "Enter the hours, minutes, and seconds to adjust.",
    ],
    example: {
      title: "Example: Summing video clips for a YouTube documentary",
      description:
        "Summing three video clips: Clip 1 (14 min 35 sec), Clip 2 (28 min 45 sec), and Clip 3 (19 min 50 sec). Total seconds = 875 + 1725 + 1190 = 3,790 seconds = 1 hour, 3 minutes, and 10 seconds.",
      steps: [
        "Enter 14m 35s in Time 1.",
        "Add Time 2: 28m 45s.",
        "Add Time 3: 19m 50s.",
        "Click Calculate to view the combined runtime: 01:03:10.",
      ],
    },
    faqs: [
      {
        question: "Why can't I just use a standard decimal calculator for time?",
        answer:
          "Time uses base-60 (60 seconds in a minute, 60 minutes in an hour). A decimal calculator uses base-10, so 0.30 hours would be incorrectly added as 30% of 100 instead of 30 minutes (50% of an hour).",
      },
      {
        question: "Can I subtract a break time from a total work duration?",
        answer:
          "Yes. Switch the operator to subtraction (-) to deduct pause periods, lunch hours, or commercial breaks from a master duration.",
      },
      {
        question: "Does the calculator support days if total time exceeds 24 hours?",
        answer:
          "Yes. Times exceeding 24 hours are displayed both as total accumulated hours (e.g., 52 hours) and broken down into days, hours, and minutes.",
      },
      {
        question: "Can I copy and paste time codes directly into the tool?",
        answer:
          "Yes. You can paste standard HH:MM:SS format strings into the input fields for rapid aggregation.",
      },
      {
        question: "Is my time log data private?",
        answer:
          "Yes. All computations take place 100% locally in your web browser. No timesheet data leaves your machine.",
      },
    ],
    relatedSlugs: ["time-duration-calculator", "date-calculator", "timezone-converter"],
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
    formula:
      "UTC Time = Local Time − Offset; Target Time = UTC Time + Target Offset (Adjusted for DST rules)",
    explanation:
      "Timezone Converter provides fast, reliable time conversions across global international time zones directly in your web browser. Designed for remote distributed teams scheduling video conferences, international travelers planning flight itineraries, financial traders tracking global exchange openings, and webinar hosts coordinating worldwide attendees, this tool prevents missed appointments and cross-border scheduling confusion.\n\nThe converter dynamically adjusts for Daylight Saving Time (DST) changes, standard GMT/UTC offsets, and regional half-hour or 45-minute offsets (such as India Standard Time or Australian Central Western Time). Key inputs include your origin city or timezone, the date and timestamp to convert, and one or more target destination time zones. Limitations include converting established civil time zones rather than calculating astronomical local solar time.\n\nBecause time conversions execute client-side using modern browser Intl and ECMAScript DateTimeFormat engines, conversions update instantaneously. Your meeting schedules, travel dates, and partner locations remain completely confidential and are never transmitted to third-party scheduling platforms or remote logging servers.",
    howItWorks: [
      "Select your source timezone and choose a date and time.",
      "Select the destination timezone.",
      "View the converted time, UTC offset, and time difference.",
    ],
    example: {
      title: "Example: Coordinating an international team call between New York and London",
      description:
        "Converting a 10:00 AM meeting in New York (Eastern Daylight Time, UTC−4) to London (British Summer Time, UTC+1). Difference is +5 hours: 10:00 AM EDT corresponds to 3:00 PM BST in London on the same day.",
      steps: [
        "Select Origin Timezone: America/New_York (EDT).",
        "Set Time: 10:00 AM.",
        "Select Target Timezone: Europe/London (BST).",
        "View Converted Time: 3:00 PM on the same date.",
      ],
    },
    faqs: [
      {
        question: "How does the converter handle Daylight Saving Time (DST) shifts?",
        answer:
          "The converter utilizes official IANA time zone databases embedded in modern browsers, automatically accounting for local spring forward and fall back transitions.",
      },
      {
        question: "Does this tool support non-hourly time zones like India or Nepal?",
        answer:
          "Yes. Fractional time zones such as IST (UTC+5:30), Nepal (UTC+5:45), and Newfoundland (UTC−3:30) are fully supported with accurate minute offsets.",
      },
      {
        question: "Can I convert a single time into multiple time zones at once?",
        answer:
          "Yes. You can compare several international cities side by side to find overlapping business hours across multiple continents.",
      },
      {
        question: "What does UTC stand for?",
        answer:
          "UTC stands for Coordinated Universal Time, the high-precision atomic time standard used as the universal baseline for civil time zones worldwide.",
      },
      {
        question: "Are my meeting schedules or location queries logged?",
        answer:
          "No. All timezone calculations are handled locally in your browser. No itinerary or schedule information is shared with servers.",
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
      "Converted Value = (Input × BaseFactor) / TargetFactor (with special offset for Temperature)",
    explanation:
      "Unit Converter delivers fast, accurate conversions across major engineering, scientific, and commercial measurement categories directly in your web browser. Whether you are converting lengths (meters to feet, inches to centimeters), weights (kilograms to pounds, ounces to grams), temperatures (Celsius to Fahrenheit and Kelvin), volumes, speeds, or areas, this tool eliminates manual multiplication errors.\n\nThe tool covers both the International System of Units (metric SI) and US Customary / Imperial systems. It is tailored for students solving physics problem sets, international travelers reading road signs, architects converting metric blueprints, and cooks adapting overseas recipes. Key inputs include the source magnitude, source measurement unit, and desired target unit. Limitations include focusing on standard physical unit conversions rather than dynamic currency exchange rates that fluctuate with financial markets.\n\nAll conversion factors are processed client-side using high-precision floating point math. None of your proprietary engineering dimensions, manufacturing measurements, or personal recipes are uploaded to external web servers, ensuring a private, frictionless conversion tool on mobile and desktop devices.",
    howItWorks: [
      "Select a measurement category.",
      "Enter the magnitude and choose the source and target units.",
      "Read the converted value instantly with two-way conversion.",
    ],
    example: {
      title: "Example: Converting travel luggage weight from kilograms to pounds",
      description:
        "An international airline specifies a 23 kg baggage limit. Convert to pounds: 23 kg × 2.20462 = 50.71 lbs. You know your luggage must remain under 50.7 pounds.",
      steps: [
        "Select Category: Weight & Mass.",
        "Set From Unit: Kilograms (kg).",
        "Set To Unit: Pounds (lbs).",
        "Enter 23 to view 50.7063 lbs instantly.",
      ],
    },
    faqs: [
      {
        question: "How do you convert Celsius to Fahrenheit?",
        answer:
          "Multiply the Celsius temperature by 9/5 (or 1.8) and add 32: °F = (°C × 1.8) + 32. For example, 20°C = (20 × 1.8) + 32 = 68°F.",
      },
      {
        question: "What is the difference between US and Imperial liquid measurements?",
        answer:
          "US fluid gallons (3.785 liters) and fluid ounces differ from UK Imperial gallons (4.546 liters). This converter specifies standard US and metric units clearly.",
      },
      {
        question: "Can I convert compound units like kilometers per hour to miles per hour?",
        answer:
          "Yes. Speed categories include km/h, mph, meters per second, and knots for maritime and aviation conversions.",
      },
      {
        question: "How many decimal places does the conversion provide?",
        answer:
          "The tool displays up to 6 significant decimal places for scientific precision, rounding cleanly where appropriate.",
      },
      {
        question: "Are my conversion inputs tracked or recorded?",
        answer:
          "No. Every calculation executes locally on your device in real time without any telemetry or cloud logging.",
      },
    ],
    relatedSlugs: ["data-storage-calculator", "ratio-calculator", "fuel-cost-calculator"],
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
    formula:
      "Decimal (SI): 1 GB = 1,000 MB = 10^9 bytes; Binary (IEC): 1 GiB = 1,024 MiB = 2^30 bytes",
    explanation:
      "Data Storage Calculator converts digital data capacities between binary (base-2, IEC standard) and decimal (base-10, SI standard) measurement units directly in your web browser. Designed for IT systems engineers sizing cloud storage buckets, software developers planning database partitions, PC gamers checking SSD capacities, and digital media producers estimating hard drive requirements for 4K video footage, this tool clarifies confusing storage specs.\n\nThe calculator explains why a newly purchased 1 Terabyte hard drive shows as only approximately 931 Gibibytes (GiB) when formatted in Windows. It seamlessly translates between bits, bytes, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), Terabytes (TB), Petabytes (PB), and their binary counterparts (KiB, MiB, GiB, TiB). Key inputs include the numeric data quantity, source storage unit, and target output unit. Limitations include measuring theoretical uncompressed data capacity rather than predicting variable file compression or filesystem allocation block overhead.\n\nAll conversion calculations run locally via client-side JavaScript. None of your server disk configurations, cloud backup numbers, or database file sizes are transmitted to remote servers. This ensures private, instantaneous infrastructure planning for system administrators and tech enthusiasts alike.",
    howItWorks: [
      "Enter a data size and select its unit (MB, GB, TB, etc.).",
      "Optionally enter your internet speed in Mbps to calculate download time.",
    ],
    example: {
      title: "Example: Understanding why a 1 TB hard drive appears as 931 GiB in Windows",
      description:
        "Drive manufacturers advertise 1 TB in SI units: 1,000,000,000,000 bytes. Operating systems like Windows report binary Gibibytes (GiB): 1,000,000,000,000 / (1024^3) = 931.32 GiB. The drive is fully intact; the difference is base-10 vs. base-2 measurement.",
      steps: [
        "Enter 1 in the value field.",
        "Set Source Unit: Terabyte (TB - Decimal 10^12).",
        "Set Target Unit: Gibibyte (GiB - Binary 2^30).",
        "View the result: 931.32 GiB.",
      ],
    },
    faqs: [
      {
        question: "What is the difference between a Gigabyte (GB) and a Gibibyte (GiB)?",
        answer:
          "A Gigabyte (GB) uses decimal notation (10^9 = 1,000,000,000 bytes). A Gibibyte (GiB) uses binary notation (2^30 = 1,073,741,824 bytes). Windows displays binary values labeled as 'GB'.",
      },
      {
        question: "How do bits differ from bytes in network speeds and storage?",
        answer:
          "1 Byte equals 8 bits. Internet connection speeds are typically quoted in megabits per second (Mbps), while file downloads are measured in megabytes (MB). Divide Mbps by 8 to get download speed in MB/s.",
      },
      {
        question: "How many Megabytes are in a Gigabyte?",
        answer:
          "In decimal SI units, there are 1,000 Megabytes in a Gigabyte. In binary IEC units, there are 1,024 Mebibytes in a Gibibyte.",
      },
      {
        question: "Can I estimate how many photos or songs fit on an SD card?",
        answer:
          "Yes. Divide your card's total capacity in MB by the average file size (e.g., 5 MB per MP3 song or 12 MB per RAW photo) to estimate capacity.",
      },
      {
        question: "Are my storage capacity queries recorded anywhere?",
        answer:
          "No. All conversions execute client-side in browser memory without sending any data over the internet.",
      },
    ],
    relatedSlugs: ["unit-converter", "scientific-calculator", "basic-calculator"],
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
    formula: "Fuel Needed = Distance / Efficiency; Trip Cost = Fuel Needed × Price Per Unit",
    explanation:
      "Fuel Cost Calculator estimates total gasoline or diesel expenses, required fuel volume, and per-passenger travel costs for road trips and daily commutes directly in your web browser. Designed for holiday road travelers planning cross-country vacation budgets, gig-economy rideshare drivers tracking operating expenses, and corporate employees submitting mileage reimbursement claims, this tool provides clear travel cost estimates.\n\nThe calculator supports both metric (kilometers, liters per 100 km, or km/L) and US customary / imperial units (miles, miles per gallon - MPG). You can also factor in split costs among multiple travel passengers to easily determine everyone's fair contribution for weekend road trips. Key inputs include total route distance, vehicle fuel economy rating, fuel price per gallon or liter, and number of passengers splitting the expense. Limitations include computing steady-state fuel consumption without factoring severe traffic congestion, aggressive mountain climbing, or cargo weight variations.\n\nAll trip cost calculations execute locally on your device. Your travel destinations, driving distances, and personal budget estimates remain completely private and are never shared with advertisers, navigation providers, or external servers.",
    howItWorks: [
      "Enter trip distance and your vehicle's fuel efficiency.",
      "Enter fuel price per liter or gallon.",
      "Specify number of passengers to split the cost.",
    ],
    example: {
      title: "Example: Planning a 450-mile road trip split between 3 passengers",
      description:
        "Driving 450 miles in an SUV averaging 25 MPG, with gasoline priced at $3.50 per gallon: Fuel required = 450 / 25 = 18 gallons. Total trip fuel cost = 18 × $3.50 = $63.00. Splitting equally among 3 passengers = $21.00 per person.",
      steps: [
        "Enter Distance: 450 miles.",
        "Enter Fuel Efficiency: 25 MPG.",
        "Enter Fuel Price: $3.50 per gallon.",
        "Enter Passengers: 3.",
        "Click Calculate to view $63.00 total cost ($21.00 per passenger).",
      ],
    },
    faqs: [
      {
        question: "How do I calculate my vehicle's actual fuel efficiency (MPG or L/100km)?",
        answer:
          "Fill your tank completely and record odometer mileage. Drive normally, fill up again, and note gallons/liters added. Divide distance driven by fuel added to find true MPG.",
      },
      {
        question: "How does driving speed affect highway fuel economy?",
        answer:
          "Aerodynamic drag increases exponentially at higher speeds. Driving at 75 mph typically burns 10% to 15% more fuel than cruising at 60 mph.",
      },
      {
        question: "Can I enter liters per 100 km instead of miles per gallon?",
        answer:
          "Yes. Toggle to Metric mode to enter distance in kilometers, fuel efficiency in L/100km or km/L, and fuel price per liter.",
      },
      {
        question: "Does this calculator account for toll roads or vehicle depreciation?",
        answer:
          "This tool calculates direct fuel consumption costs. For complete business mileage tax deductions, consult standard IRS or local statutory mileage allowances.",
      },
      {
        question: "Are my driving routes or travel plans stored anywhere?",
        answer:
          "No. IXDocs operates client-side with zero data tracking. Your road trip distances and costs are never saved or sent to servers.",
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
    formula:
      "Words = Count(Tokens bounded by whitespace); Reading Time = Words / 200 wpm; Speaking Time = Words / 130 wpm",
    explanation:
      "Word Counter provides real-time text analysis, character counts, reading time estimates, and sentence structure metrics directly inside your web browser. Designed for essayists adhering to academic paper guidelines, novelists tracking daily manuscript targets, social media managers drafting character-capped posts for Twitter/X and LinkedIn, and copywriters optimizing landing page headlines, this tool gives instant editorial clarity.\n\nAs you type or paste text, the tool updates word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading and speaking durations. Estimated reading time is calculated at an average speed of 200 words per minute, while public speech delivery is estimated at 130 words per minute. Key inputs include raw text pasted or typed into the editor. Limitations include counting space-delimited linguistic tokens rather than performing advanced grammatical syntax parsing or semantic plagiarism checking.\n\nCrucially, all text analysis is performed locally in your browser memory using client-side JavaScript string parsers. Your confidential book chapters, private journal entries, academic dissertations, and corporate communications are never transmitted over the internet or logged on any external server.",
    howItWorks: [
      "Paste or type your text into the editor.",
      "Real-time metrics update immediately as you type.",
    ],
    example: {
      title: "Example: Checking an executive speech length against a 5-minute time limit",
      description:
        "An executive speech draft contains 650 words: At a standard speaking pace of 130 words per minute, speaking time = 650 / 130 = 5.0 minutes. Reading silently at 200 wpm takes 3.25 minutes. Total characters with spaces = 4,120.",
      steps: [
        "Paste the speech draft into the text area.",
        "Review the statistics bar immediately: 650 words, 4,120 characters.",
        "Verify Speaking Time: 5 minutes 0 seconds.",
        "Verify Reading Time: 3 minutes 15 seconds.",
      ],
    },
    faqs: [
      {
        question: "How does the word counter handle hyphenated words or punctuation?",
        answer:
          "Hyphenated terms (such as 'state-of-the-art') are generally counted as single words, while standard punctuation marks are stripped from word tokens.",
      },
      {
        question: "What reading speed is used for reading time calculations?",
        answer:
          "Reading time is based on an average adult silent reading speed of 200 to 250 words per minute. Speaking time is estimated at a conversational pace of 130 wpm.",
      },
      {
        question: "Are there character limits for common social media platforms?",
        answer:
          "Yes. Twitter/X allows 280 characters for standard accounts, LinkedIn posts allow 3,000 characters, and Instagram captions allow 2,200 characters.",
      },
      {
        question: "Can I paste very long documents like book manuscripts?",
        answer:
          "Yes. The client-side parser easily handles tens of thousands of words in real time without browser lag.",
      },
      {
        question: "Is my pasted document or private writing saved or uploaded?",
        answer:
          "No. All text parsing runs entirely client-side on your local machine. No text is ever uploaded, cached, or transmitted across the internet.",
      },
    ],
    relatedSlugs: ["basic-calculator", "data-storage-calculator", "unit-converter"],
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
    formula: "Entropy = L × log₂(N) bits; Selection = CSPRNG(crypto.getRandomValues)",
    explanation:
      "Password Generator creates cryptographically secure, high-entropy passwords tailored to custom security requirements directly in your web browser. Utilizing your device's native Cryptographically Secure Pseudorandom Number Generator (CSPRNG via window.crypto.getRandomValues), this tool helps protect your web accounts, email services, banking portals, and server infrastructure from brute-force attacks and dictionary cracking.\n\nThe generator offers granular controls to include or exclude uppercase letters, lowercase characters, numeric digits, and special symbols. It also allows you to exclude ambiguous characters (such as 0, O, 1, l, and I) to prevent transcription mistakes when copying credentials manually onto mobile screens. Key inputs include desired password length, character set checkboxes, and ambiguous character toggles. A fundamental limitation is that generating a secure credential is only step one; safeguarding it requires a reputable password manager rather than unencrypted text files.\n\nAll entropy generation and character selection occur strictly client-side on your local machine. No generated passwords, configuration settings, or cryptographic seeds are ever sent across the network or logged on cloud servers. This ensures your newly minted master passwords and credentials remain solely in your control.",
    howItWorks: [
      "Select password length (8–64 characters).",
      "Toggle uppercase, lowercase, numbers, and symbols.",
      "Click Generate and copy your password securely.",
    ],
    example: {
      title: "Example: Generating an ultra-secure 16-character credential",
      description:
        "Generating a 16-character password using uppercase (26), lowercase (26), digits (10), and special symbols (32): Total pool size N = 94. Entropy = 16 × log₂(94) = 104.9 bits of entropy, which would take billions of years to crack by modern brute-force clusters.",
      steps: [
        "Set length slider to 16 characters.",
        "Check Uppercase, Lowercase, Numbers, and Symbols.",
        "Click Generate Password.",
        "Click the Copy button to place the credential securely on your clipboard.",
      ],
    },
    faqs: [
      {
        question: "What makes a password cryptographically secure?",
        answer:
          "A secure password combines high entropy (length of 14+ characters across diverse character pools) with true randomness generated by a CSPRNG rather than predictable pseudo-random seeds.",
      },
      {
        question: "What are ambiguous characters and why exclude them?",
        answer:
          "Ambiguous characters look virtually identical in certain screen fonts (such as capital 'O' and zero '0', or lowercase 'l' and uppercase 'I'). Excluding them prevents frustrating login errors.",
      },
      {
        question: "What is password entropy?",
        answer:
          "Entropy measures the theoretical unpredictability of a password in bits. A score above 80 bits is considered strong against modern automated offline password cracking attacks.",
      },
      {
        question: "Can anyone on the internet see the password I just generated?",
        answer:
          "No. The password is created inside your device's browser memory using native hardware entropy APIs. No data is transmitted across the internet.",
      },
      {
        question: "How should I store my generated passwords safely?",
        answer:
          "Store complex passwords in an encrypted password manager or hardware security key rather than saving them in plaintext files or sticky notes.",
      },
    ],
    relatedSlugs: ["random-password-generator", "qr-generator", "barcode-generator"],
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
    formula:
      "Security: S = Pool^Length; Entropy: H = Length × log₂(Pool Size) using Web Cryptography API",
    explanation:
      "Random Password Generator provides instant, one-click creation of strong, randomized credentials to defend your digital identity against credential stuffing, dictionary attacks, and automated brute-force attempts directly in your web browser. Designed for IT administrators provisioning temporary user logins, security professionals hardening server access, and everyday users safeguarding social media and financial accounts, this tool ensures genuine cryptographic randomness.\n\nUnlike rudimentary web scripts that rely on predictable Math.random() functions, this generator leverages the browser's hardware-backed Web Cryptography API (crypto.getRandomValues). It provides configurable length presets (from 8 to 64 characters) and custom rules to include symbols, numbers, capital letters, and avoid easily misread characters. Key inputs include password length sliders, character subset toggles, and instant re-roll buttons. Limitations include generating individual random strings rather than managing automated multi-factor authentication or account provisioning pipelines.\n\nAll random generation takes place locally inside your browser sandbox. Passwords are never sent across the internet, recorded in telemetry logs, or stored in cookies. You receive instantaneous, military-strength passwords with complete cryptographic privacy directly on your personal device.",
    howItWorks: [
      "Choose a quick preset (Simple, Strong, Ultra, or PIN).",
      "Copy your generated secret in one click.",
    ],
    example: {
      title: "Example: Generating a 20-character database root credential",
      description:
        "Generating a 20-character credential with all character sets active: Pool = 94 characters. Total possible combinations = 94^20 ≈ 2.9 × 10^39. Entropy = 131 bits, offering virtually unbreakable protection against offline dictionary attacks.",
      steps: [
        "Select Length: 20 characters.",
        "Ensure all character sets (A-Z, a-z, 0-9, Symbols) are selected.",
        "Click Generate.",
        "Copy the generated credential directly to your secure password manager.",
      ],
    },
    faqs: [
      {
        question: "How does crypto.getRandomValues differ from standard Math.random()?",
        answer:
          "Math.random() is pseudo-random and mathematically predictable, making it vulnerable to pattern analysis. crypto.getRandomValues pulls entropy from the operating system kernel, ensuring cryptographic unpredictability.",
      },
      {
        question: "How long should a strong password be in 2026?",
        answer:
          "Security experts recommend a minimum of 14 to 16 characters for general accounts, and 20 or more characters for sensitive administrative or financial accounts.",
      },
      {
        question: "Is it safe to generate passwords on a public website?",
        answer:
          "On IXDocs, yes. The generation code runs 100% locally in your client browser. Disconnecting your internet connection before generating will confirm that no server interaction occurs.",
      },
      {
        question: "Can I generate memorable passphrases instead of random characters?",
        answer:
          "This tool focuses on randomized high-entropy character strings. For multi-word passphrases, check out our related security utilities.",
      },
      {
        question: "Does IXDocs keep a copy of generated passwords?",
        answer:
          "No. IXDocs has no server-side storage, user databases, or session tracking. Once you close or refresh the page, the generated password is gone from memory.",
      },
    ],
    relatedSlugs: ["password-generator", "qr-generator", "barcode-generator"],
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
    formula:
      "QR Encoding: Data Payload => Reed-Solomon Error Correction (L: 7%, M: 15%, Q: 25%, H: 30%) => 2D Matrix Modules",
    explanation:
      "QR Generator creates custom, high-resolution Quick Response (QR) matrix barcodes directly inside your web browser. Perfect for small businesses printing contactless table menus, event organizers sharing Wi-Fi credentials, marketers linking product packaging to landing pages, and individuals sharing contact vCards, this tool generates clean, instantly scannable codes.\n\nThe generator supports multiple payload formats including URLs, plain text messages, email addresses, phone numbers, and Wi-Fi network configurations. It incorporates adjustable Reed-Solomon error correction levels (Low, Medium, Quartile, High). High error correction allows codes to remain scannable even if up to 30% of the graphic is smudged, torn, or overlaid with a central brand logo. Key inputs include payload text, error correction level, matrix size, and download format (PNG/SVG). A key limitation is that standard static QR codes embed fixed data payloads that cannot be redirected after printing without using a dynamic URL shortener.\n\nAll QR code matrix rendering takes place locally on your computer or smartphone using client-side canvas and vector rendering engines. None of your proprietary website URLs, Wi-Fi network passwords, or private contact details are sent to external tracking servers or URL-shortening redirectors. You can download crisp, production-ready vector graphics without tracking redirects.",
    howItWorks: [
      "Select content type and enter your URL or text.",
      "Customize size and error correction level.",
      "Download high-resolution PNG or vector SVG.",
    ],
    example: {
      title: "Example: Creating an offline Wi-Fi access QR code for a coffee shop",
      description:
        "Generate a formatted Wi-Fi string: WIFI:S:CoffeeLounge;T:WPA;P:FreshBeans2026;; with High (H) error correction. Customers scan the code to join the network automatically without typing the password.",
      steps: [
        "Select Wi-Fi or Text mode.",
        "Enter network credentials or website URL.",
        "Select Error Correction Level: 'High (30%)'.",
        "Download the resulting QR code as a high-resolution PNG or vector SVG.",
      ],
    },
    faqs: [
      {
        question: "Do these QR codes expire or have scan limits?",
        answer:
          "No. These are static QR codes that encode your raw text or URL directly into the matrix pattern. They never expire and have zero scan limits.",
      },
      {
        question: "What is the best error correction level to select?",
        answer:
          "Use 'Medium' (15%) for clean digital screens. Use 'High' (30%) if you plan to print on outdoor banners or place a logo in the center of the code.",
      },
      {
        question: "Can I download the QR code as a scalable vector graphic (SVG)?",
        answer:
          "Yes. SVG vector format allows unlimited scaling for large promotional print materials without any pixelation or loss of sharpness.",
      },
      {
        question: "Are my scanned links routed through a tracking redirector?",
        answer:
          "No. Unlike commercial dynamic QR services, IXDocs generates direct static codes without intermediary tracking domains or redirect hops.",
      },
      {
        question: "Is my Wi-Fi password or URL sent to your servers?",
        answer:
          "No. All QR matrix computation happens strictly in your browser using local client-side JavaScript. Nothing is uploaded or stored.",
      },
    ],
    relatedSlugs: ["barcode-generator", "password-generator", "random-password-generator"],
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
      "Code 128 / EAN-13: Start Pattern + Encoded Data Words + Modulo Checksum + Stop Pattern",
    explanation:
      "Barcode Generator produces standard, high-density linear 1D barcodes directly in your web browser. Engineered for small warehouse managers organizing inventory, retail shops generating EAN/UPC product labels, e-commerce merchants packaging shipments, and office managers tracking asset tags, this tool provides instant scannable barcode graphics.\n\nThe tool supports major global symbologies including Code 128 (high-density alphanumeric coding ideal for logistics and shipping), EAN-13 / UPC-A (standard global point-of-sale retail barcodes), and Code 39. It automatically computes required modulo checksum verification digits to guarantee that handheld laser and optical scanners read the barcode accurately. Key inputs include the raw alphanumeric or numeric data string, chosen barcode symbology, bar width scaling, and human-readable text toggles. Limitations include generating 1D linear codes with finite character density rather than high-capacity 2D matrix formats like QR codes.\n\nAll barcode rendering executes client-side using HTML5 canvas and SVG vector graphics. Your proprietary inventory SKU numbers, internal tracking serials, and retail product codes are never transmitted to external databases or stored on web servers. You can export crisp, print-ready barcodes for direct thermal or laser printing.",
    howItWorks: [
      "Enter your barcode numbers or alphanumeric code.",
      "Select the desired barcode symbology (e.g. Code 128 or EAN-13).",
      "Download as PNG, vector SVG, or print directly to label sheets.",
    ],
    example: {
      title: "Example: Generating a Code 128 shipping barcode for inventory asset tracking",
      description:
        "Encoding internal asset tag 'INV-2026-X89' using Code 128: The generator calculates start characters, encodes alphanumeric ASCII pairs, appends the modulo-103 checksum, and renders clean parallel bars with human-readable text underneath.",
      steps: [
        "Select Symbology: Code 128.",
        "Enter Value: INV-2026-X89.",
        "Ensure 'Show human-readable text' is checked.",
        "Download high-resolution image ready for thermal label printing.",
      ],
    },
    faqs: [
      {
        question: "Which barcode format should I choose for general inventory?",
        answer:
          "Code 128 is the most versatile format for internal inventory, logistics, and asset tracking because it encodes both uppercase letters, lowercase letters, and numbers compactly.",
      },
      {
        question: "Can I use these barcodes for commercial retail products in supermarkets?",
        answer:
          "Commercial retail checkout scanners require registered GS1 EAN-13 or UPC barcodes. If you own an authorized GS1 barcode number, you can generate the scannable graphic here.",
      },
      {
        question: "What is the purpose of the checksum digit?",
        answer:
          "The checksum digit is a mathematically calculated verification value that enables barcode scanners to detect read errors or damaged lines before transmitting data.",
      },
      {
        question: "What resolution should I use for printing on thermal label printers?",
        answer:
          "Download vector SVG or high-DPI PNG format to ensure clean, crisp line edges that prevent laser scanner misreads on standard 203 DPI or 300 DPI thermal label printers.",
      },
      {
        question: "Are my internal inventory SKU numbers logged or shared?",
        answer:
          "No. All barcode generation takes place locally on your computer inside your web browser. No SKU or serial numbers are ever sent over the network.",
      },
    ],
    relatedSlugs: ["qr-generator", "password-generator", "unit-converter"],
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
