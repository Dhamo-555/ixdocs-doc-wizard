import QRCode from "qrcode";

export interface QrCodeOptions {
  text: string;
  size?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

export async function generateQrCodeDataUrl(options: QrCodeOptions): Promise<string> {
  const {
    text,
    size = 300,
    errorCorrectionLevel = "M",
    margin = 2,
    darkColor = "#000000",
    lightColor = "#ffffff",
  } = options;

  if (!text || text.trim().length === 0) {
    throw new Error("Text or URL is required for QR code generation");
  }

  return await QRCode.toDataURL(text, {
    width: size,
    errorCorrectionLevel,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
  });
}

export async function generateQrCodeSvg(options: QrCodeOptions): Promise<string> {
  const {
    text,
    size = 300,
    errorCorrectionLevel = "M",
    margin = 2,
    darkColor = "#000000",
    lightColor = "#ffffff",
  } = options;

  if (!text || text.trim().length === 0) {
    throw new Error("Text or URL is required for QR code generation");
  }

  return await QRCode.toString(text, {
    type: "svg",
    width: size,
    errorCorrectionLevel,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
  });
}
