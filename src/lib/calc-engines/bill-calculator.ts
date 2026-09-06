/**
 * IXDocs Bill Calculator — Shared Billing Engine
 *
 * Pure TypeScript. No React. No DOM dependencies.
 * Shared between Basic Bill mode and Barcode Bill mode.
 *
 * Designed for extensibility (see requirements Part 11):
 * - customer name, invoice number, date/time
 * - discounts, multiple tax rates
 * - product database / saved products
 */

// ─── Currency ────────────────────────────────────────────────────────────────

export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee (₹)" },
  { code: "USD", symbol: "$", label: "US Dollar ($)" },
  { code: "EUR", symbol: "€", label: "Euro (€)" },
  { code: "GBP", symbol: "£", label: "British Pound (£)" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham (د.إ)" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar (S$)" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar (A$)" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar (C$)" },
];

export const DEFAULT_CURRENCY: CurrencyOption = CURRENCY_OPTIONS[0]!;

// ─── Data Model ───────────────────────────────────────────────────────────────

/**
 * A single line item on the bill.
 * Future fields (discount, tax category, SKU) can be added here.
 */
export interface BillItem {
  /** Unique identifier — never changes after creation */
  id: string;
  /** Barcode value from scanner, or undefined for manually added items */
  barcode?: string;
  /** Display name of the product */
  productName: string;
  /** Unit quantity — minimum 1 */
  quantity: number;
  /** Price per single unit */
  unitPrice: number;
  /** Derived: quantity × unitPrice — always kept in sync */
  lineTotal: number;
}

/**
 * The complete bill state.
 * Future fields: customerName, invoiceNumber, date, discountAmount, etc.
 */
export interface Bill {
  companyName: string;
  currency: CurrencyOption;
  items: BillItem[];
  gstEnabled: boolean;
  /** GST percentage, e.g. 5, 12, 18 */
  gstPercent: number;
  /** Derived totals — recomputed by computeBillTotals() */
  subtotal: number;
  gstAmount: number;
  total: number;
}

// ─── Factories ────────────────────────────────────────────────────────────────

/** Generate a stable, unique item ID. Falls back to timestamp when crypto unavailable (SSR). */
function newItemId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

/** Create a new, blank bill item with sane defaults. */
export function createBillItem(
  partial: Partial<Omit<BillItem, "id" | "lineTotal">> = {},
): BillItem {
  const quantity = Math.max(1, Math.floor(partial.quantity ?? 1));
  const unitPrice = Math.max(0, partial.unitPrice ?? 0);
  return {
    id: newItemId(),
    ...(partial.barcode !== undefined ? { barcode: partial.barcode } : {}),
    productName: partial.productName ?? "",
    quantity,
    unitPrice,
    lineTotal: computeLineTotal(quantity, unitPrice),
  };
}

/** Create a fresh, empty bill. */
export function createEmptyBill(): Bill {
  return {
    companyName: "",
    currency: DEFAULT_CURRENCY,
    items: [],
    gstEnabled: false,
    gstPercent: 18,
    subtotal: 0,
    gstAmount: 0,
    total: 0,
  };
}

// ─── Calculations ─────────────────────────────────────────────────────────────

/** quantity × unitPrice, rounded to 2 decimal places. */
export function computeLineTotal(quantity: number, unitPrice: number): number {
  return round2(Math.max(0, quantity) * Math.max(0, unitPrice));
}

/** Recompute subtotal, GST amount, and grand total from current items. */
export function computeBillTotals(
  items: BillItem[],
  gstEnabled: boolean,
  gstPercent: number,
): Pick<Bill, "subtotal" | "gstAmount" | "total"> {
  const subtotal = round2(items.reduce((sum, item) => sum + item.lineTotal, 0));
  const gstAmount = gstEnabled ? round2((subtotal * Math.max(0, gstPercent)) / 100) : 0;
  const total = round2(subtotal + gstAmount);
  return { subtotal, gstAmount, total };
}

/** Round to 2 decimal places — avoids floating-point drift. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ─── Item Mutations (return new arrays/objects — never mutate) ─────────────────

/** Add a new blank item to the bill. */
export function addItem(
  bill: Bill,
  partial: Partial<Omit<BillItem, "id" | "lineTotal">> = {},
): Bill {
  const item = createBillItem(partial);
  const items = [...bill.items, item];
  return applyTotals({ ...bill, items });
}

/**
 * Scan a barcode: if it already exists in the bill, increment quantity.
 * Otherwise, add a new item with the barcode pre-filled (name/price still blank).
 * Returns the updated bill AND the id of the affected item.
 */
export function scanBarcode(
  bill: Bill,
  barcode: string,
): { bill: Bill; itemId: string; isNew: boolean } {
  const existing = bill.items.find((i) => i.barcode === barcode);

  if (existing) {
    const updatedItems = bill.items.map((i) =>
      i.id === existing.id
        ? {
            ...i,
            quantity: i.quantity + 1,
            lineTotal: computeLineTotal(i.quantity + 1, i.unitPrice),
          }
        : i,
    );
    return {
      bill: applyTotals({ ...bill, items: updatedItems }),
      itemId: existing.id,
      isNew: false,
    };
  }

  const item = createBillItem({ barcode });
  const items = [...bill.items, item];
  return {
    bill: applyTotals({ ...bill, items }),
    itemId: item.id,
    isNew: true,
  };
}

/** Update a specific field of a bill item. Recomputes lineTotal if qty or price changes. */
export function updateItem(
  bill: Bill,
  itemId: string,
  changes: Partial<Pick<BillItem, "productName" | "quantity" | "unitPrice" | "barcode">>,
): Bill {
  const items = bill.items.map((item) => {
    if (item.id !== itemId) return item;
    const qty =
      changes.quantity !== undefined ? Math.max(1, Math.floor(changes.quantity)) : item.quantity;
    const price = changes.unitPrice !== undefined ? Math.max(0, changes.unitPrice) : item.unitPrice;
    return {
      ...item,
      ...changes,
      quantity: qty,
      unitPrice: price,
      lineTotal: computeLineTotal(qty, price),
    };
  });
  return applyTotals({ ...bill, items });
}

/** Remove an item from the bill by id. */
export function removeItem(bill: Bill, itemId: string): Bill {
  const items = bill.items.filter((i) => i.id !== itemId);
  return applyTotals({ ...bill, items });
}

/** Recompute derived totals and return a new Bill object. */
export function applyTotals(bill: Bill): Bill {
  const totals = computeBillTotals(bill.items, bill.gstEnabled, bill.gstPercent);
  return { ...bill, ...totals };
}

// ─── Formatting ───────────────────────────────────────────────────────────────

/** Format a number as a currency string using the bill's currency. */
export function formatCurrency(amount: number, currency: CurrencyOption): string {
  return `${currency.symbol}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
