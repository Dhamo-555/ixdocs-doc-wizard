import type { Bill, CurrencyOption } from "@/lib/calc-engines/bill-calculator";
import { formatCurrency } from "@/lib/calc-engines/bill-calculator";

interface BillSummaryProps {
  bill: Bill;
  currency: CurrencyOption;
  onGstToggle: (enabled: boolean) => void;
  onGstPercentChange: (percent: number) => void;
}

export function BillSummary({ bill, currency, onGstToggle, onGstPercentChange }: BillSummaryProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-5">
      {/* GST Controls */}
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground select-none">
          <button
            type="button"
            role="switch"
            aria-checked={bill.gstEnabled}
            onClick={() => onGstToggle(!bill.gstEnabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600/30 ${
              bill.gstEnabled ? "bg-emerald-600" : "bg-border"
            }`}
          >
            <span
              className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
                bill.gstEnabled ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
          Apply GST
        </label>

        {bill.gstEnabled && (
          <div className="flex items-center gap-2">
            <label htmlFor="bill-gst-percent" className="text-xs text-muted-foreground">
              Rate:
            </label>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1">
              <input
                id="bill-gst-percent"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={bill.gstPercent}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v) && v >= 0 && v <= 100) onGstPercentChange(v);
                }}
                className="w-14 bg-transparent text-sm font-semibold text-foreground focus:outline-none"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>

            {/* Common GST quick-picks */}
            <div className="flex gap-1">
              {[5, 12, 18, 28].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onGstPercentChange(p)}
                  className={`rounded-md px-2 py-1 text-[0.7rem] font-semibold transition-colors ${
                    bill.gstPercent === p
                      ? "bg-emerald-600 text-white"
                      : "border border-border text-muted-foreground hover:text-foreground hover:bg-surface"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Totals table */}
      <div className="space-y-2.5">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold tabular-nums text-foreground">
            {formatCurrency(bill.subtotal, currency)}
          </span>
        </div>

        {/* GST */}
        {bill.gstEnabled && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">GST ({bill.gstPercent}%)</span>
            <span className="tabular-nums text-foreground">
              {formatCurrency(bill.gstAmount, currency)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border pt-2" />

        {/* Grand Total — emphasized */}
        <div className="flex items-center justify-between rounded-xl bg-emerald-600 px-4 py-3">
          <span className="text-sm font-bold text-white">GRAND TOTAL</span>
          <span className="text-xl font-extrabold tabular-nums text-white">
            {formatCurrency(bill.total, currency)}
          </span>
        </div>
      </div>

      {/* Item count */}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {bill.items.length === 0
          ? "No items added yet"
          : `${bill.items.length} item${bill.items.length !== 1 ? "s" : ""} · ${bill.items.reduce(
              (s, i) => s + i.quantity,
              0,
            )} units`}
      </p>
    </div>
  );
}
