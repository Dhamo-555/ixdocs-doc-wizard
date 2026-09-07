import { CURRENCY_OPTIONS, type CurrencyOption } from "@/lib/calc-currency";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  selectedCurrency?: CurrencyOption;
  onCurrencyChange?: (currency: CurrencyOption) => void;
  value?: CurrencyOption;
  onChange?: (currency: CurrencyOption) => void;
  className?: string;
}

export function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
  value,
  onChange,
  className,
}: CurrencySelectorProps) {
  const current = value || selectedCurrency || CURRENCY_OPTIONS[0]!;
  const handleChange = onChange || onCurrencyChange || (() => {});
  return (
    <div className={cn("flex items-center gap-1.5 text-xs flex-wrap", className)}>
      <span className="text-muted-foreground font-medium">Currency:</span>
      <div className="flex flex-wrap gap-1">
        {CURRENCY_OPTIONS.map((c) => {
          const isSelected = current.code === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => handleChange(c)}
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-bold transition",
                isSelected
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-surface text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              title={c.label}
            >
              {c.symbol} <span className="text-[10px] font-normal opacity-85">{c.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
