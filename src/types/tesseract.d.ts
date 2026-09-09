import "tesseract.js";

declare module "tesseract.js" {
  interface Word {
    text?: string;
    bbox?: { x0: number; y0: number; x1: number; y1: number };
  }

  interface Page {
    words?: Word[];
  }
}
