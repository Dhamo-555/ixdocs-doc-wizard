import type { CurrencyOption } from "@/lib/calc-engines/bill-calculator";
import { CURRENCY_OPTIONS } from "@/lib/calc-engines/bill-calculator";

interface BillCompanyHeaderProps {
  companyName: string;
  currency: CurrencyOption;
  pdfFilename: string;
  onCompanyNameChange: (v: string) => void;
  onCurrencyChange: (c: CurrencyOption) => void;
  onPdfFilenameChange: (v: string) => void;
}

export function BillCompanyHeader({
  companyName,
  currency,
  pdfFilename,
  onCompanyNameChange,
  onCurrencyChange,
  onPdfFilenameChange,
}: BillCompanyHeaderProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Company Name */}
      <div className="sm:col-span-2">
        <label
          htmlFor="bill-company-name"
          className="mb-1.5 block text-xs font-semibold text-foreground"
        >
          Company / Shop Name
        </label>
        <input
          id="bill-company-name"
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="e.g. ABC Supermarket"
          maxLength={80}
          className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
        />
      </div>

      {/* Currency */}
      <div>
        <label
          htmlFor="bill-currency"
          className="mb-1.5 block text-xs font-semibold text-foreground"
        >
          Currency
        </label>
        <select
          id="bill-currency"
          value={currency.code}
          onChange={(e) => {
            const found = CURRENCY_OPTIONS.find((c) => c.code === e.target.value);
            if (found) onCurrencyChange(found);
          }}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
        >
          {CURRENCY_OPTIONS.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* PDF Filename */}
      <div className="sm:col-span-3">
        <label
          htmlFor="bill-pdf-filename"
          className="mb-1.5 block text-xs font-semibold text-foreground"
        >
          PDF File Name
        </label>
        <div className="flex items-center gap-2">
          <input
            id="bill-pdf-filename"
            type="text"
            value={pdfFilename}
            onChange={(e) => onPdfFilenameChange(e.target.value)}
            placeholder="e.g. ABC-Supermarket-Bill"
            maxLength={80}
            className="h-11 flex-1 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
          <span className="text-xs text-muted-foreground shrink-0">.pdf</span>
        </div>
      </div>
    </div>
  );
}
