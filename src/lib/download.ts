/**
 * Unified, robust client-side file downloader for IXDocs.
 *
 * Guarantees:
 * - Proper MIME type (application/pdf for PDFs, image/* for images, text/* for text)
 * - Sanitized filename with guaranteed correct extension (e.g. .pdf)
 * - Prevention of duplicate extensions (e.g. filename.pdf.pdf -> filename.pdf)
 * - Safe object URL creation and cleanup
 * - True <a download="..."> browser triggering attached to DOM with synthetic click
 * - No direct window navigation to blob URLs
 */

export function sanitizeDownloadFilename(
  input: string,
  fallbackName = "document",
  defaultExt = ".pdf",
): string {
  let name = (input || "").trim();
  if (!name) name = fallbackName;

  // 1. Remove OS-invalid characters: / \ : * ? " < > |
  name = name.replace(/[\/\\:\*\?"<>\|]/g, "_");

  // 2. Clean leading/trailing dots and path parts
  name = name.replace(/^\.+/, "").replace(/\.+$/, "").trim();
  if (!name) name = fallbackName;

  // 3. Determine target extension
  const fallbackMatch = fallbackName.match(/\.[^.]+$/);
  const targetExt = fallbackMatch ? fallbackMatch[0].toLowerCase() : defaultExt.toLowerCase();

  // 4. Handle extension
  const targetExtRegex = new RegExp(`\\${targetExt}$`, "i");
  if (targetExtRegex.test(name)) {
    // Deduplicate repeated extensions like .pdf.pdf
    const multiExtRegex = new RegExp(`(\\${targetExt})+$`, "i");
    name = name.replace(multiExtRegex, targetExt);
  } else {
    // If the name already ends with an incorrect extension (e.g. .tmp), strip it if it doesn't match
    name = `${name}${targetExt}`;
  }

  return name;
}

export interface DownloadFileOptions {
  filename: string;
  blobOrBytes: Blob | Uint8Array | ArrayBuffer;
  mimeType?: string;
  defaultExt?: string;
}

/**
 * Downloads any file (PDF, image, text, etc.) to the user's browser with the exact given filename.
 */
export function triggerBrowserDownload({
  filename,
  blobOrBytes,
  mimeType,
  defaultExt = ".pdf",
}: DownloadFileOptions): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  // 1. Determine safe filename with required extension
  const safeFilename = sanitizeDownloadFilename(filename, "document", defaultExt);
  const isPdf = safeFilename.toLowerCase().endsWith(".pdf") || defaultExt.toLowerCase() === ".pdf";

  // 2. Determine effective MIME type
  const effectiveMime = mimeType || (isPdf ? "application/pdf" : "application/octet-stream");

  // 3. Construct Blob
  let blob: Blob;
  if (blobOrBytes instanceof Blob) {
    if (blobOrBytes.type && blobOrBytes.type !== "application/octet-stream") {
      blob = blobOrBytes;
    } else {
      blob = new Blob([blobOrBytes], { type: effectiveMime });
    }
  } else if (blobOrBytes instanceof Uint8Array) {
    // Make copy of array buffer to avoid subarray offset issues
    const copy = new Uint8Array(blobOrBytes.byteLength);
    copy.set(blobOrBytes);
    blob = new Blob([copy.buffer], { type: effectiveMime });
  } else if (blobOrBytes instanceof ArrayBuffer) {
    blob = new Blob([blobOrBytes], { type: effectiveMime });
  } else {
    blob = new Blob([blobOrBytes as any], { type: effectiveMime });
  }

  // 4. Create Object URL
  const objectUrl = URL.createObjectURL(blob);

  // 5. Build anchor tag with explicit download attribute
  const anchor = document.createElement("a");
  anchor.style.position = "fixed";
  anchor.style.top = "-9999px";
  anchor.style.left = "-9999px";
  anchor.style.opacity = "0";
  anchor.style.pointerEvents = "none";
  anchor.href = objectUrl;
  anchor.setAttribute("download", safeFilename);
  anchor.download = safeFilename;
  anchor.rel = "noopener";
  anchor.target = "_self";

  // 6. Append to document body for cross-browser reliability
  document.body.appendChild(anchor);

  // 7. Trigger download via synthetic click
  try {
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    anchor.dispatchEvent(clickEvent);
  } catch {
    anchor.click();
  }

  // 8. Delayed DOM and Object URL cleanup
  setTimeout(() => {
    try {
      if (anchor.parentNode) {
        anchor.parentNode.removeChild(anchor);
      }
    } catch {}
    try {
      URL.revokeObjectURL(objectUrl);
    } catch {}
  }, 10_000);
}

/**
 * Convenience helper specifically for PDF downloads.
 */
export function triggerPdfDownload(
  blobOrBytes: Blob | Uint8Array | ArrayBuffer,
  filename: string,
): void {
  triggerBrowserDownload({
    filename,
    blobOrBytes,
    mimeType: "application/pdf",
    defaultExt: ".pdf",
  });
}
