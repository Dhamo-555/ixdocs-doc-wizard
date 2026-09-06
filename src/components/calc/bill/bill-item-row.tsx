import { Trash2, Minus, Plus } from "lucide-react";
import type { BillItem, CurrencyOption } from "@/lib/calc-engines/bill-calculator";
import { formatCurrency } from "@/lib/calc-engines/bill-calculator";

interface BillItemRowProps {
  item: BillItem;
  currency: CurrencyOption;
  isHighlighted?: boolean;
  onUpdate: (
    itemId: string,
    changes: Partial<Pick<BillItem, "productName" | "quantity" | "unitPrice">>,
  ) => void;
  onRemove: (itemId: string) => void;
}

export function BillItemRow({
  item,
  currency,
  isHighlighted = false,
  onUpdate,
  onRemove,
}: BillItemRowProps) {
  return (
    <tr
      className={`group border-b border-border/60 transition-colors ${
        isHighlighted ? "bg-emerald-50/60 dark:bg-emerald-950/20" : "hover:bg-surface/50"
      }`}
    >
      {/* Product Name */}
      <td className="py-2 pl-2 pr-1 min-w-0">
        <input
          type="text"
          value={item.productName}
          onChange={(e) => onUpdate(item.id, { productName: e.target.value })}
          placeholder="Product name"
          aria-label="Product name"
          className="w-full min-w-[120px] rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
        />
        {item.barcode && (
          <span className="mt-0.5 block text-[0.65rem] text-muted-foreground font-mono truncate">
            {item.barcode}
          </span>
        )}
      </td>

      {/* Quantity controls */}
      <td className="px-1 py-2 text-center whitespace-nowrap">
        <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-background overflow-hidden">
          <button
            type="button"
            onClick={() => onUpdate(item.id, { quantity: item.quantity - 1 })}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="size-3" />
          </button>
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) onUpdate(item.id, { quantity: v });
            }}
            aria-label="Quantity"
            className="w-10 bg-transparent py-1 text-center text-xs font-semibold text-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
            aria-label="Increase quantity"
            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <Plus className="size-3" />
          </button>
        </div>
      </td>

      {/* Unit Price */}
      <td className="px-1 py-2">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground shrink-0">{currency.symbol}</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={item.unitPrice === 0 ? "" : item.unitPrice}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              onUpdate(item.id, { unitPrice: isNaN(v) ? 0 : v });
            }}
            placeholder="0.00"
            aria-label="Unit price"
            className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
          />
        </div>
      </td>

      {/* Line Total */}
      <td className="px-1 py-2 text-right">
        <span className="text-xs font-semibold text-foreground tabular-nums">
          {formatCurrency(item.lineTotal, currency)}
        </span>
      </td>

      {/* Remove */}
      <td className="py-2 pl-1 pr-2">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label="Remove item"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </td>
    </tr>
  );
}
