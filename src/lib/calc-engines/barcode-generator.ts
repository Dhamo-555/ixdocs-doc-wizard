/**
 * Barcode Generator Engine
 *
 * Supported formats:
 * - CODE128: Universal alphanumeric barcode
 * - EAN13: International Article Number (12 or 13 digits)
 * - EAN8: Short retail barcode (7 or 8 digits)
 * - UPC: Universal Product Code (UPC-A, 11 or 12 digits)
 * - CODE39: Industrial barcode (uppercase letters, digits, and - . $ / + % space)
 */

export interface BarcodeFormatConfig {
  id: string;
  name: string;
  jsBarcodeFormat: string;
  description: string;
  example: string;
  placeholder: string;
  validate: (val: string) => { valid: boolean; error?: string };
}

export const BARCODE_FORMAT_CONFIGS: BarcodeFormatConfig[] = [
  {
    id: "CODE128",
    name: "Code 128 (Universal)",
    jsBarcodeFormat: "CODE128",
    description:
      "High-density alphanumeric barcode. Supports all 128 ASCII characters. Great for inventory, shipping, and serial numbers.",
    example: "IXDOCS-98421",
    placeholder: "e.g. PROD-100234",
    validate: (val: string) => {
      if (!val.trim()) return { valid: false, error: "Please enter text or numbers." };
      // Check for ASCII 0-127
      // eslint-disable-next-line no-control-regex
      if (!/^[\x00-\x7F]+$/.test(val)) {
        return { valid: false, error: "Code 128 supports standard ASCII characters only." };
      }
      return { valid: true };
    },
  },
  {
    id: "EAN13",
    name: "EAN-13 (Retail Standard)",
    jsBarcodeFormat: "EAN13",
    description:
      "Standard 13-digit barcode used for retail products worldwide. Enter 12 or 13 numeric digits.",
    example: "8901030382438",
    placeholder: "e.g. 8901030382438 (12 or 13 digits)",
    validate: (val: string) => {
      const clean = val.trim();
      if (!/^\d{12,13}$/.test(clean)) {
        return { valid: false, error: "EAN-13 requires exactly 12 or 13 numeric digits." };
      }
      return { valid: true };
    },
  },
  {
    id: "UPC",
    name: "UPC-A (US/Canada Retail)",
    jsBarcodeFormat: "UPC",
    description: "Standard North American retail barcode. Enter 11 or 12 numeric digits.",
    example: "012345678905",
    placeholder: "e.g. 012345678905 (11 or 12 digits)",
    validate: (val: string) => {
      const clean = val.trim();
      if (!/^\d{11,12}$/.test(clean)) {
        return { valid: false, error: "UPC-A requires exactly 11 or 12 numeric digits." };
      }
      return { valid: true };
    },
  },
  {
    id: "EAN8",
    name: "EAN-8 (Small Package Retail)",
    jsBarcodeFormat: "EAN8",
    description: "Compact 8-digit barcode designed for small packages where EAN-13 is too wide.",
    example: "96385074",
    placeholder: "e.g. 96385074 (7 or 8 digits)",
    validate: (val: string) => {
      const clean = val.trim();
      if (!/^\d{7,8}$/.test(clean)) {
        return { valid: false, error: "EAN-8 requires exactly 7 or 8 numeric digits." };
      }
      return { valid: true };
    },
  },
  {
    id: "CODE39",
    name: "Code 39 (Logistics & Defense)",
    jsBarcodeFormat: "CODE39",
    description:
      "Widely used in automotive, defense, and healthcare. Supports uppercase letters, numbers, and - . $ / + % space.",
    example: "BATCH-429",
    placeholder: "e.g. ITEM-0123",
    validate: (val: string) => {
      const upper = val.toUpperCase().trim();
      if (!upper) return { valid: false, error: "Please enter text or numbers." };
      if (!/^[0-9A-Z\-. $/+%]+$/.test(upper)) {
        return {
          valid: false,
          error: "Code 39 only supports uppercase A-Z, 0-9, and - . $ / + % [space].",
        };
      }
      return { valid: true };
    },
  },
];

export interface BarcodeCustomization {
  format: string;
  width: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  lineColor: string;
  background: string;
}

export const DEFAULT_BARCODE_CONFIG: BarcodeCustomization = {
  format: "CODE128",
  width: 2,
  height: 90,
  displayValue: true,
  fontSize: 14,
  lineColor: "#0f172a",
  background: "#ffffff",
};
