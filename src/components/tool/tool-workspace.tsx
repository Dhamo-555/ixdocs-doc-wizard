import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Info,
  Loader2,
  RotateCcw,
  Trash2,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Pen,
  Highlighter as HighlighterIcon,
  Type as TypeIcon,
  Eraser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { TOOL_MAP, toolPath, type Tool, type ToolOption } from "@/lib/tools";
import { RUNNERS } from "@/lib/tool-runners";
import {
  ToolError,
  baseName,
  formatBytes,
  openRenderDoc,
  renderPageToCanvas,
  type RunResult,
} from "@/lib/pdf-engine";
import { triggerBrowserDownload, sanitizeDownloadFilename } from "@/lib/download";
import { PdfEditorWorkspace } from "@/components/tool/pdf-editor-workspace";
import { QrCodeWorkspace } from "@/components/tool/qr-code-workspace";
import { loadMonetagInPagePush, MONETAG_CONFIG } from "@/lib/monetag";

/* ------------------------------------------------------------ shared cards & ad slots */

export function AdSlot({ className }: { label?: string; className?: string }) {
  useEffect(() => {
    loadMonetagInPagePush();
  }, []);

  if (!MONETAG_CONFIG.enabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "ixdocs-ad-container w-full max-w-full overflow-hidden transition-all duration-200 empty:hidden empty:m-0 empty:p-0",
        className,
      )}
    />
  );
}

export function ToolCard({ tool, showCategory = false }: { tool: Tool; showCategory?: boolean }) {
  return (
    <Link
      to={toolPath(tool.slug)}
      className="surface-card group flex min-w-0 flex-col gap-2 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-lift)] focus-visible:-translate-y-0.5 sm:p-5"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <tool.icon className="size-5" strokeWidth={1.75} />
      </span>
      <span className="mt-1 truncate text-sm font-semibold text-foreground sm:text-[0.95rem]">
        {tool.name}
      </span>
      <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {tool.short}
      </span>
      {showCategory ? (
        <span className="mt-1 truncate text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
          {tool.category}
        </span>
      ) : null}
    </Link>
  );
}

export function RelatedTools({ tool }: { tool: Tool }) {
  const activeRelated = tool.related.filter((slug) => {
    const t = TOOL_MAP[slug];
    return t && t.ready !== false;
  });

  if (!activeRelated.length) return null;

  return (
    <section aria-labelledby="related-tools" className="mt-14">
      <h2 id="related-tools" className="text-lg font-bold">
        Related tools
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Other IXDocs tools people use with {tool.name}.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {activeRelated.slice(0, 4).map((slug) => (
          <RelatedCard key={slug} slug={slug} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ slug }: { slug: string }) {
  const tool = TOOL_MAP[slug];
  if (!tool || tool.ready === false) return null;
  return <ToolCard tool={tool} />;
}

/* ----------------------------------------------------------------- upload */

function UploadBox({
  tool,
  onFiles,
  compact = false,
}: {
  tool: Tool;
  onFiles: (files: File[]) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      className={cn(
        "rounded-2xl border-2 border-dashed bg-surface px-4 text-center transition-colors sm:px-6",
        compact ? "py-6" : "py-10 sm:py-16",
        dragging ? "border-primary bg-accent" : "border-border",
      )}
    >
      <span
        className={cn(
          "mx-auto grid place-items-center rounded-2xl bg-background text-primary shadow-[var(--shadow-soft)]",
          compact ? "size-10" : "size-14",
        )}
      >
        <UploadCloud className={compact ? "size-5" : "size-7"} />
      </span>
      <p className={cn("mt-4 font-semibold", compact ? "text-sm" : "text-base sm:text-lg")}>
        {compact
          ? `Add more ${tool.multiple ? "files" : "files"}`
          : `Drag & drop your ${tool.multiple ? "files" : "file"} here`}
      </p>
      {!compact ? (
        <p className="mt-1 text-sm text-muted-foreground">Nothing is uploaded to a server</p>
      ) : null}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button
          type="button"
          size={compact ? "default" : "lg"}
          onClick={() => inputRef.current?.click()}
          className="min-h-12 w-full sm:w-auto"
        >
          <UploadCloud className="size-4" />
          <span>Select {tool.multiple ? "files" : "file"}</span>
        </Button>
        {tool.slug === "document-scanner" ? (
          <Button
            type="button"
            variant="outline"
            className="min-h-12 w-full sm:w-auto"
            onClick={() => cameraRef.current?.click()}
          >
            Use camera
          </Button>
        ) : null}
      </div>
      <p className="mx-auto mt-4 max-w-sm text-xs break-words text-muted-foreground">
        Supported: {tool.acceptLabel} · up to 100 MB · no account needed
      </p>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={tool.accept}
        multiple={tool.multiple}
        onChange={(e) => {
          onFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        className="sr-only"
        accept="image/*"
        capture="environment"
        multiple
        onChange={(e) => {
          onFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- options */

function OptionField({
  option,
  value,
  onChange,
}: {
  option: ToolOption;
  value: string | number | boolean;
  onChange: (v: string | number | boolean) => void;
}) {
  const id = `opt-${option.key}`;
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {option.label}
        {option.type === "range" || (option.type === "number" && option.suffix) ? (
          <span className="ml-1 text-muted-foreground">
            {String(value)}
            {option.suffix ?? ""}
          </span>
        ) : null}
      </Label>

      {option.type === "select" ? (
        <Select value={String(value)} onValueChange={onChange}>
          <SelectTrigger id={id} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {option.choices?.map((choice) => (
              <SelectItem key={choice.value} value={choice.value}>
                {choice.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {option.type === "range" ? (
        <Slider
          id={id}
          value={[Number(value)]}
          min={option.min ?? 0}
          max={option.max ?? 100}
          step={option.step ?? 1}
          onValueChange={([v]) => onChange(v ?? 0)}
          aria-label={option.label}
        />
      ) : null}

      {option.type === "number" ? (
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          value={String(value)}
          min={option.min}
          max={option.max}
          step={option.step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : null}

      {option.type === "text" || option.type === "password" ? (
        <Input
          id={id}
          type={option.type}
          value={String(value)}
          autoComplete={option.type === "password" ? "new-password" : "off"}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}

      {option.type === "toggle" ? (
        <div className="flex items-center gap-3">
          <Switch id={id} checked={Boolean(value)} onCheckedChange={onChange} />
          <span className="text-sm text-muted-foreground">{value ? "On" : "Off"}</span>
        </div>
      ) : null}

      {option.help ? <p className="text-xs text-muted-foreground">{option.help}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------- workspace */

type Phase = "idle" | "ready" | "processing" | "done" | "error";

interface Thumb {
  page: number;
  url: string;
}

export function ToolWorkspace({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [progressLabel, setProgressLabel] = useState<string>("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [options, setOptions] = useState<Record<string, string | number | boolean>>(() =>
    Object.fromEntries(tool.options.map((o) => [o.key, o.default])),
  );

  // Custom output names
  const [customNames, setCustomNames] = useState<Record<string, string>>({});

  // Helper to sanitize download filenames
  const sanitizeDownloadName = (input: string, originalName: string): string => {
    return sanitizeDownloadFilename(input, originalName);
  };

  // Active page index in the editor preview (1-indexed)
  const [editorPage, setEditorPage] = useState(1);

  // Sign PDF states
  const [sigX, setSigX] = useState(70); // percentage (0 - 100)
  const [sigY, setSigY] = useState(15); // percentage (0 - 100)
  const [sigScaleVal, setSigScaleVal] = useState(100); // percentage (50 - 200)
  const [typedName, setTypedName] = useState("John Doe");
  const [signatureType, setSignatureType] = useState<"draw" | "type">("type");
  const [sigColor, setSigColor] = useState("#000080");
  const [drawCanvasData, setDrawCanvasData] = useState<string | null>(null);

  // Annotate PDF states
  const [annotTool, setAnnotTool] = useState<"pen" | "highlighter" | "text">("pen");
  const [annotColor, setAnnotColor] = useState("#ff0000"); // Red default
  const [annotWidth, setAnnotWidth] = useState(6);
  const [annotationsMap, setAnnotationsMap] = useState<Record<number, string>>({}); // page -> base64 PNG data
  const [annotText, setAnnotText] = useState("Approved");

  // Crop PDF states
  const [cropLeft, setCropLeft] = useState(36); // in points
  const [cropRight, setCropRight] = useState(36);
  const [cropTop, setCropTop] = useState(36);
  const [cropBottom, setCropBottom] = useState(36);

  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const annotCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingSig = useRef(false);
  const isDrawingAnnot = useRef(false);

  // Synchronize typed signature
  useEffect(() => {
    if (tool.slug !== "sign-pdf" || signatureType !== "type") return;
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 120;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = sigColor;
      ctx.font =
        "italic 48px 'Brush Script MT', 'Great Vibes', 'Dancing Script', cursive, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedName || "Signature", canvas.width / 2, canvas.height / 2);
      setDrawCanvasData(canvas.toDataURL("image/png"));
    }
  }, [typedName, sigColor, signatureType, tool.slug]);

  // Sync drawn signature context color
  useEffect(() => {
    if (tool.slug !== "sign-pdf" || signatureType !== "draw") return;
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.strokeStyle = sigColor;
    }
  }, [sigColor, signatureType, tool.slug]);

  // Synchronize Annotate PDF drawing canvas dimensions and previous annotations
  useEffect(() => {
    if (tool.slug !== "annotate-pdf") return;
    const canvas = annotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const existing = annotationsMap[editorPage];
    if (existing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = existing;
    }
  }, [editorPage, annotationsMap, tool.slug]);

  const startSigDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    isDrawingSig.current = true;
    const rect = canvas.getBoundingClientRect();
    const touch = "touches" in e ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : "clientX" in e ? e.clientX : 0;
    const clientY = touch ? touch.clientY : "clientY" in e ? e.clientY : 0;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = sigColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const drawSig = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawingSig.current) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const touch = "touches" in e ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : "clientX" in e ? e.clientX : 0;
    const clientY = touch ? touch.clientY : "clientY" in e ? e.clientY : 0;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopSigDraw = () => {
    if (!isDrawingSig.current) return;
    isDrawingSig.current = false;
    const canvas = sigCanvasRef.current;
    if (canvas) {
      setDrawCanvasData(canvas.toDataURL("image/png"));
    }
  };

  const clearSigDraw = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setDrawCanvasData(null);
      }
    }
  };

  const startAnnotDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = annotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    isDrawingAnnot.current = true;
    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e && e.touches[0]
        ? e.touches[0].clientX - rect.left
        : "clientX" in e
          ? e.clientX - rect.left
          : 0;
    const y =
      "touches" in e && e.touches[0]
        ? e.touches[0].clientY - rect.top
        : "clientY" in e
          ? e.clientY - rect.top
          : 0;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = annotTool === "highlighter" ? "rgba(255, 235, 59, 0.45)" : annotColor;
    ctx.lineWidth = annotTool === "highlighter" ? annotWidth * 2 : annotWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const drawAnnot = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawingAnnot.current) return;
    const canvas = annotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e && e.touches[0]
        ? e.touches[0].clientX - rect.left
        : "clientX" in e
          ? e.clientX - rect.left
          : 0;
    const y =
      "touches" in e && e.touches[0]
        ? e.touches[0].clientY - rect.top
        : "clientY" in e
          ? e.clientY - rect.top
          : 0;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopAnnotDraw = () => {
    if (!isDrawingAnnot.current) return;
    isDrawingAnnot.current = false;
    saveAnnotPageData();
  };

  const saveAnnotPageData = () => {
    const canvas = annotCanvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      setAnnotationsMap((prev) => ({
        ...prev,
        [editorPage]: dataUrl,
      }));
    }
  };

  const clearAnnotPage = () => {
    const canvas = annotCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setAnnotationsMap((prev) => {
          const next = { ...prev };
          delete next[editorPage];
          return next;
        });
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (annotTool !== "text") return;
    const canvas = annotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = annotColor;
    ctx.font = `bold ${annotWidth * 2.5}px sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(annotText, x, y);
    saveAnnotPageData();
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tool.slug !== "sign-pdf") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = (1 - (e.clientY - rect.top) / rect.height) * 100;
    setSigX(Math.round(xPercent));
    setSigY(Math.round(yPercent));
  };

  const visibleOptions = useMemo(
    () =>
      tool.options.filter((o) => {
        if (!o.showIf) return true;
        const current = String(options[o.showIf.key]);
        return o.showIf.value.startsWith("!")
          ? current !== o.showIf.value.slice(1)
          : current === o.showIf.value;
      }),
    [tool.options, options],
  );

  const reset = useCallback(() => {
    setFiles([]);
    setPhase("idle");
    setError(null);
    setResult(null);
    setThumbs([]);
    setSelected([]);
    setOrder([]);
    setProgress(null);
    setCustomNames({});
  }, []);

  const addFiles = useCallback(
    (incoming: File[]) => {
      setError(null);
      const accepted: File[] = [];
      for (const file of incoming) {
        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        const isImage = file.type.startsWith("image/");
        const wantsPdf = tool.accept.includes("pdf");
        const wantsImage = tool.accept.includes("image/");
        const wantsDoc = tool.accept.includes("word");
        const ok =
          (wantsPdf && isPdf) ||
          (wantsImage && isImage) ||
          (wantsDoc && /\.docx?$/i.test(file.name));
        if (!ok) {
          setError(
            `That file type isn't supported here. ${tool.name} works with ${tool.acceptLabel} — pick a different file and try again.`,
          );
          continue;
        }
        if (file.size > 100 * 1024 * 1024) {
          setError(
            `That file is too large. IXDocs handles files up to 100 MB in the browser — try compressing or splitting it first.`,
          );
          continue;
        }

        accepted.push(file);
      }
      if (!accepted.length) return;
      setFiles((prev) => (tool.multiple ? [...prev, ...accepted] : accepted.slice(0, 1)));
      setPhase("ready");
      setResult(null);
    },
    [tool],
  );

  // Render page thumbnails for page-based PDF tools.
  useEffect(() => {
    let cancelled = false;
    const file = files[0];
    const isEditorTool =
      tool.slug === "sign-pdf" || tool.slug === "annotate-pdf" || tool.slug === "crop-pdf";
    const wantsThumbs = (tool.pageMode && tool.pageMode !== "none") || isEditorTool;
    if (!file || !wantsThumbs || !file.type.includes("pdf")) {
      setThumbs([]);
      return;
    }
    (async () => {
      try {
        const doc = await openRenderDoc(file);
        const pages: Thumb[] = [];
        const limit = Math.min(doc.numPages, 60);
        for (let i = 1; i <= limit; i++) {
          const canvas = await renderPageToCanvas(doc, i, 0.28);
          if (cancelled) return;
          pages.push({ page: i, url: canvas.toDataURL("image/jpeg", 0.6) });
          setThumbs([...pages]);
        }
        if (!cancelled) {
          setSelected(Array.from({ length: doc.numPages }, (_, i) => i + 1));
          setOrder(Array.from({ length: doc.numPages }, (_, i) => i));
        }
      } catch {
        if (!cancelled) setThumbs([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [files, tool.pageMode, tool.slug]);

  const process = async () => {
    const runner = RUNNERS[tool.slug];
    if (!runner) return;
    setPhase("processing");
    setError(null);
    setProgress(null);
    setProgressLabel("");
    try {
      const res = await runner({
        files,
        options: {
          ...options,
          // Sign PDF
          sigImage: drawCanvasData,
          sigX,
          sigY,
          sigScaleVal,
          signPageNum: editorPage,
          // Annotate PDF
          annotationsMap,
          // Crop PDF
          cropLeft,
          cropRight,
          cropTop,
          cropBottom,
        },
        selectedPages: selected,
        pageOrder: order,
        totalPages: thumbs.length,
        onProgress: (value, label) => {
          setProgress(value);
          if (label) setProgressLabel(label);
        },
      });
      setResult(res);
      setPhase("done");
    } catch (err) {
      setPhase("error");
      setError(
        err instanceof ToolError
          ? err.message
          : "Processing failed. The file may be corrupt, or your browser ran out of memory on a large document. Try a smaller file or a different browser.",
      );
    }
  };

  const download = (name: string, blob: Blob) => {
    triggerBrowserDownload({
      filename: name,
      blobOrBytes: blob,
      mimeType: blob.type,
      defaultExt: name.match(/\.[^.]+$/)?.[0] || ".pdf",
    });
  };

  const move = (index: number, delta: number) => {
    setOrder((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  };

  const moveFile = (index: number, delta: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  };

  return (
    <div className="surface-card min-w-0 p-4 sm:p-6" aria-busy={phase === "processing"}>
      {!tool.ready ? (
        <div className="mb-5 flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-warning-foreground" aria-hidden="true" />
          <p className="text-sm text-warning-foreground">{tool.notice}</p>
        </div>
      ) : tool.notice ? (
        <div className="mb-5 flex gap-3 rounded-xl border border-border bg-surface p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">{tool.notice}</p>
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mb-5 grid gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:grid-cols-[auto_minmax(0,1fr)]"
        >
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Something didn&apos;t work</p>
            <p className="mt-1 text-sm break-words text-muted-foreground">{error}</p>
            {phase === "error" ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-11"
                  onClick={() => setPhase("ready")}
                >
                  Try again
                </Button>
                <Button size="sm" variant="ghost" className="min-h-11" onClick={reset}>
                  Start over
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {phase === "processing" ? (
        <div className="py-14 text-center" role="status">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" aria-hidden="true" />
          <p className="mt-4 text-base font-semibold">Working on your document…</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {progressLabel || "Running locally in your browser. Keep this tab open."}
          </p>
          <div className="mx-auto mt-5 max-w-sm">
            <Progress value={progress !== null ? Math.round(progress * 100) : undefined} />
            <p className="mt-2 text-xs text-muted-foreground">
              {progress !== null
                ? `${Math.round(progress * 100)}% complete`
                : "This usually takes a few seconds"}
            </p>
          </div>
        </div>
      ) : phase === "done" && result ? (
        <div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success" aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="text-lg font-bold">
                {result.outputs.length ? "Your document is ready" : "Analysis complete"}
              </h2>
              {result.message ? (
                <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
              ) : null}
            </div>
          </div>

          {result.stats?.length ? (
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {result.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-surface p-3">
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd
                    className={cn(
                      "mt-1 text-sm font-semibold",
                      stat.tone === "success" && "text-success",
                      stat.tone === "warning" && "text-warning-foreground",
                    )}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {result.report?.map((section) => (
            <div
              key={section.title}
              className="mt-5 overflow-hidden rounded-xl border border-border"
            >
              <h3 className="border-b border-border bg-surface px-4 py-2.5 text-sm font-semibold">
                {section.title}
              </h3>
              <dl className="divide-y divide-border">
                {section.rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-4 py-2.5"
                  >
                    <dt className="min-w-0 truncate text-sm text-muted-foreground">{row.label}</dt>
                    <dd
                      className={cn(
                        "text-right text-sm font-medium break-words",
                        row.tone === "success" && "text-success",
                        row.tone === "warning" && "text-warning-foreground",
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          {result.outputs.length ? (
            <div className="mt-5 rounded-2xl border border-primary/30 bg-accent/40 p-3 sm:p-4">
              <h3 className="px-1 text-sm font-semibold text-accent-foreground">
                {result.outputs.length > 1
                  ? `${result.outputs.length} files ready to download`
                  : "Your file"}
              </h3>
              <ul className="mt-3 space-y-2">
                {result.outputs.map((output) => {
                  const extMatch = output.name.match(/\.[^.]+$/);
                  const ext = extMatch ? extMatch[0] : "";
                  const currentCustomVal = customNames[output.name] ?? baseName(output.name);

                  return (
                    <li
                      key={output.name}
                      className="grid gap-4 rounded-xl border border-border bg-background p-3 sm:grid-cols-[1fr_auto] sm:items-end"
                    >
                      <div className="flex flex-col gap-3 w-full min-w-0">
                        <div className="min-w-0">
                          <p
                            className="truncate text-xs text-muted-foreground mb-1"
                            title={output.name}
                          >
                            Original: {output.name} ({formatBytes(output.size)})
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 max-w-md w-full">
                          <Label
                            htmlFor={`filename-${output.name}`}
                            className="text-xs font-semibold text-foreground"
                          >
                            Download Filename
                          </Label>
                          <div className="relative flex items-center">
                            <Input
                              id={`filename-${output.name}`}
                              type="text"
                              value={currentCustomVal}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomNames((prev) => ({
                                  ...prev,
                                  [output.name]: val,
                                }));
                              }}
                              placeholder="Enter output name"
                              className="h-10 text-sm pr-12 w-full"
                            />
                            {ext ? (
                              <span className="absolute right-3 text-xs text-muted-foreground font-semibold select-none pointer-events-none">
                                {ext}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <Button
                        className="min-h-12 w-full sm:w-auto self-end"
                        onClick={() => {
                          const rawInput = customNames[output.name] ?? baseName(output.name);
                          const sanitized = sanitizeDownloadName(rawInput, output.name);
                          download(sanitized, output.blob);
                        }}
                      >
                        <Download className="size-4" />
                        <span>Download</span>
                      </Button>
                    </li>
                  );
                })}
              </ul>
              {result.outputs.length > 1 ? (
                <Button
                  className="mt-3 min-h-12 w-full sm:w-auto"
                  onClick={() =>
                    result.outputs.forEach((o, i) => {
                      const rawInput = customNames[o.name] ?? baseName(o.name);
                      const sanitized = sanitizeDownloadName(rawInput, o.name);
                      setTimeout(() => download(sanitized, o.blob), i * 300);
                    })
                  }
                >
                  <Download className="size-4" />
                  <span>Download all</span>
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="min-h-12 w-full sm:w-auto" onClick={reset}>
              <RotateCcw className="size-4" />
              <span>Process another file</span>
            </Button>
          </div>
        </div>
      ) : tool.slug === "qr-code-generator" ? (
        <QrCodeWorkspace />
      ) : files.length === 0 ? (
        <UploadBox tool={tool} onFiles={addFiles} />
      ) : tool.slug === "edit-pdf" ? (
        <PdfEditorWorkspace file={files[0]!} onReset={reset} />
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold">
              {files.length > 1 ? `${files.length} files selected` : "Selected file"}
            </h2>
            <ul className="mt-3 space-y-2">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-border p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="size-5 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center">
                    {tool.multiple && files.length > 1 ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Move ${file.name} up`}
                          className="size-11"
                          onClick={() => moveFile(index, -1)}
                        >
                          <ArrowLeft className="size-4 rotate-90" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Move ${file.name} down`}
                          className="size-11"
                          onClick={() => moveFile(index, 1)}
                        >
                          <ArrowRight className="size-4 rotate-90" />
                        </Button>
                      </>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${file.name}`}
                      className="size-11"
                      onClick={() =>
                        setFiles((prev) => {
                          const next = prev.filter((_, i) => i !== index);
                          if (!next.length) setPhase("idle");
                          return next;
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {tool.multiple ? <UploadBox tool={tool} onFiles={addFiles} compact /> : null}

          {thumbs.length && tool.pageMode === "select" ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  Select pages{" "}
                  <span className="text-muted-foreground">({selected.length} selected)</span>
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelected(thumbs.map((t) => t.page))}
                  >
                    Select all
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelected([])}>
                    Clear
                  </Button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
                {thumbs.map((thumb) => {
                  const isSelected = selected.includes(thumb.page);
                  return (
                    <button
                      key={thumb.page}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        setSelected((prev) =>
                          prev.includes(thumb.page)
                            ? prev.filter((p) => p !== thumb.page)
                            : [...prev, thumb.page].sort((a, b) => a - b),
                        )
                      }
                      className={cn(
                        "overflow-hidden rounded-lg border-2 bg-surface p-1 transition-colors",
                        isSelected ? "border-primary" : "border-border opacity-70",
                      )}
                    >
                      <img
                        src={thumb.url}
                        alt={`Page ${thumb.page}`}
                        className="w-full rounded"
                        loading="lazy"
                      />
                      <span className="mt-1 block text-center text-xs font-medium">
                        {thumb.page}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {thumbs.length && tool.pageMode === "order" ? (
            <div>
              <h3 className="text-sm font-semibold">Page order</h3>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
                {order.map((pageIndex, position) => {
                  const thumb = thumbs[pageIndex];
                  if (!thumb) return null;
                  return (
                    <div key={pageIndex} className="rounded-lg border border-border bg-surface p-1">
                      <img
                        src={thumb.url}
                        alt={`Page ${thumb.page}`}
                        className="w-full rounded"
                        loading="lazy"
                      />
                      <div className="mt-1 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9"
                          aria-label={`Move page ${thumb.page} earlier`}
                          onClick={() => move(position, -1)}
                        >
                          <ArrowLeft className="size-4" />
                        </Button>
                        <span className="text-xs font-medium">{thumb.page}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9"
                          aria-label={`Move page ${thumb.page} later`}
                          onClick={() => move(position, 1)}
                        >
                          <ArrowRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Interactive Document Editor Viewport */}
          {thumbs.length &&
          (tool.slug === "sign-pdf" || tool.slug === "annotate-pdf" || tool.slug === "crop-pdf") ? (
            <div className="rounded-2xl border border-border bg-surface/50 p-4 sm:p-6 mb-6">
              <h3 className="text-base font-semibold mb-4">Interactive Page Editor</h3>

              <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6">
                {/* Left Panel: Preview Viewport */}
                <div className="flex flex-col items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
                  {/* Page Navigation */}
                  <div className="flex items-center gap-4 mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10"
                      disabled={editorPage <= 1}
                      onClick={() => setEditorPage((prev) => Math.max(1, prev - 1))}
                    >
                      <ChevronLeft className="size-5" />
                    </Button>
                    <span className="text-sm font-medium">
                      Page {editorPage} of {thumbs.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10"
                      disabled={editorPage >= thumbs.length}
                      onClick={() => setEditorPage((prev) => Math.min(thumbs.length, prev + 1))}
                    >
                      <ChevronRight className="size-5" />
                    </Button>
                  </div>

                  {/* Canvas Viewport overlay */}
                  <div
                    onClick={handlePageClick}
                    className={cn(
                      "relative border border-border shadow-md rounded-lg overflow-hidden bg-white max-w-full select-none",
                      tool.slug === "sign-pdf" && "cursor-crosshair",
                    )}
                    style={{ width: "420px", height: "560px" }}
                  >
                    <img
                      src={thumbs[editorPage - 1]?.url}
                      alt={`Page ${editorPage}`}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />

                    {/* Sign PDF Overlay */}
                    {tool.slug === "sign-pdf" && drawCanvasData ? (
                      <div
                        className="absolute pointer-events-none border-2 border-dashed border-primary bg-primary/5 rounded"
                        style={{
                          left: `${sigX}%`,
                          bottom: `${sigY}%`,
                          width: `${120 * (sigScaleVal / 100)}px`,
                          height: `${40 * (sigScaleVal / 100)}px`,
                          transform: "translate(-50%, 50%)",
                          backgroundImage: `url(${drawCanvasData})`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          transition: "width 0.1s, height 0.1s",
                        }}
                      />
                    ) : null}

                    {/* Annotate PDF Overlay Canvas */}
                    {tool.slug === "annotate-pdf" ? (
                      <canvas
                        ref={annotCanvasRef}
                        width={420}
                        height={560}
                        onMouseDown={startAnnotDraw}
                        onMouseMove={drawAnnot}
                        onMouseUp={stopAnnotDraw}
                        onMouseLeave={stopAnnotDraw}
                        onTouchStart={startAnnotDraw}
                        onTouchMove={drawAnnot}
                        onTouchEnd={stopAnnotDraw}
                        onClick={handleCanvasClick}
                        className={cn(
                          "absolute inset-0 w-full h-full",
                          annotTool === "text" ? "cursor-text" : "cursor-crosshair",
                        )}
                      />
                    ) : null}

                    {/* Crop PDF Overlay box */}
                    {tool.slug === "crop-pdf" ? (
                      <div
                        className="absolute border-2 border-dashed border-destructive bg-destructive/5 rounded pointer-events-none"
                        style={{
                          left: `${(cropLeft / 72) * 50}px`,
                          right: `${(cropRight / 72) * 50}px`,
                          top: `${(cropTop / 72) * 50}px`,
                          bottom: `${(cropBottom / 72) * 50}px`,
                        }}
                      />
                    ) : null}
                  </div>

                  {tool.slug === "sign-pdf" ? (
                    <p className="text-xs text-muted-foreground mt-3">
                      Click anywhere on the document page to position the signature stamp.
                    </p>
                  ) : null}
                </div>

                {/* Right Panel: Tool settings */}
                <div className="flex flex-col gap-4">
                  {tool.slug === "sign-pdf" ? (
                    <>
                      <div className="flex gap-2 p-1 border border-border bg-muted/30 rounded-xl">
                        <Button
                          variant={signatureType === "type" ? "default" : "ghost"}
                          className="flex-1"
                          onClick={() => setSignatureType("type")}
                        >
                          Type Name
                        </Button>
                        <Button
                          variant={signatureType === "draw" ? "default" : "ghost"}
                          className="flex-1"
                          onClick={() => setSignatureType("draw")}
                        >
                          Draw
                        </Button>
                      </div>

                      {signatureType === "type" ? (
                        <div className="space-y-3">
                          <Label className="text-xs font-semibold">Signature Text</Label>
                          <Input
                            type="text"
                            value={typedName}
                            onChange={(e) => setTypedName(e.target.value)}
                            placeholder="Your signature name"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-semibold">Draw signature</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-destructive"
                              onClick={clearSigDraw}
                            >
                              Clear
                            </Button>
                          </div>
                          <canvas
                            ref={sigCanvasRef}
                            width={300}
                            height={100}
                            onMouseDown={startSigDraw}
                            onMouseMove={drawSig}
                            onMouseUp={stopSigDraw}
                            onMouseLeave={stopSigDraw}
                            onTouchStart={startSigDraw}
                            onTouchMove={drawSig}
                            onTouchEnd={stopSigDraw}
                            className="w-full h-[100px] border border-border bg-white rounded-lg cursor-crosshair shadow-inner"
                          />
                        </div>
                      )}

                      <div className="space-y-3">
                        <Label className="text-xs font-semibold">Ink Color</Label>
                        <Select value={sigColor} onValueChange={setSigColor}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="#000080">Navy Blue (Default)</SelectItem>
                            <SelectItem value="#000000">Black</SelectItem>
                            <SelectItem value="#0000ff">Royal Blue</SelectItem>
                            <SelectItem value="#8b0000">Dark Red</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Signature Scale</span>
                          <span>{sigScaleVal}%</span>
                        </div>
                        <Slider
                          value={[sigScaleVal]}
                          min={50}
                          max={200}
                          step={5}
                          onValueChange={(val) => setSigScaleVal(val[0] || 100)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Horizontal position (X)</span>
                          <span>{sigX}%</span>
                        </div>
                        <Slider
                          value={[sigX]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(val) => setSigX(val[0] || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Vertical position (Y)</span>
                          <span>{sigY}%</span>
                        </div>
                        <Slider
                          value={[sigY]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(val) => setSigY(val[0] || 0)}
                        />
                      </div>
                    </>
                  ) : null}

                  {tool.slug === "annotate-pdf" ? (
                    <>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={annotTool === "pen" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAnnotTool("pen")}
                        >
                          <Pen className="size-4 mr-1.5" /> Pen
                        </Button>
                        <Button
                          variant={annotTool === "highlighter" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAnnotTool("highlighter")}
                        >
                          <HighlighterIcon className="size-4 mr-1.5" /> Highlight
                        </Button>
                        <Button
                          variant={annotTool === "text" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAnnotTool("text")}
                        >
                          <TypeIcon className="size-4 mr-1.5" /> Text
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-xs font-semibold">Color</Label>
                        <div className="flex flex-wrap gap-2">
                          {["#ff0000", "#4caf50", "#2196f3", "#ffeb3b", "#ff9800", "#9c27b0"].map(
                            (c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setAnnotColor(c)}
                                className={cn(
                                  "size-8 rounded-full border border-border shadow-sm transition-transform",
                                  annotColor === c
                                    ? "scale-115 ring-2 ring-primary"
                                    : "opacity-80 hover:opacity-100",
                                )}
                                style={{ backgroundColor: c }}
                              />
                            ),
                          )}
                        </div>
                      </div>

                      {annotTool === "text" ? (
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold">Text annotation</Label>
                          <Input
                            type="text"
                            value={annotText}
                            onChange={(e) => setAnnotText(e.target.value)}
                            placeholder="Type text and click on page"
                          />
                        </div>
                      ) : null}

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Brush size / Text size</span>
                          <span>{annotWidth}px</span>
                        </div>
                        <Slider
                          value={[annotWidth]}
                          min={2}
                          max={30}
                          step={1}
                          onValueChange={(val) => setAnnotWidth(val[0] || 6)}
                        />
                      </div>

                      <Button
                        variant="outline"
                        className="mt-4 border-destructive/30 hover:border-destructive text-destructive min-h-11"
                        onClick={clearAnnotPage}
                      >
                        <Eraser className="size-4 mr-1.5" /> Clear Annotations on Page {editorPage}
                      </Button>
                    </>
                  ) : null}

                  {tool.slug === "crop-pdf" ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Trim Top</span>
                          <span>{cropTop} pt</span>
                        </div>
                        <Slider
                          value={[cropTop]}
                          min={0}
                          max={150}
                          step={6}
                          onValueChange={(val) => setCropTop(val[0] || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Trim Bottom</span>
                          <span>{cropBottom} pt</span>
                        </div>
                        <Slider
                          value={[cropBottom]}
                          min={0}
                          max={150}
                          step={6}
                          onValueChange={(val) => setCropBottom(val[0] || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Trim Left</span>
                          <span>{cropLeft} pt</span>
                        </div>
                        <Slider
                          value={[cropLeft]}
                          min={0}
                          max={150}
                          step={6}
                          onValueChange={(val) => setCropLeft(val[0] || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>Trim Right</span>
                          <span>{cropRight} pt</span>
                        </div>
                        <Slider
                          value={[cropRight]}
                          min={0}
                          max={150}
                          step={6}
                          onValueChange={(val) => setCropRight(val[0] || 0)}
                        />
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setCropTop(36);
                            setCropBottom(36);
                            setCropLeft(36);
                            setCropRight(36);
                          }}
                        >
                          0.5 inch (36pt)
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setCropTop(0);
                            setCropBottom(0);
                            setCropLeft(0);
                            setCropRight(0);
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {visibleOptions.length ? (
            <div>
              <h2 className="text-sm font-semibold">Options</h2>
              <div className="mt-3 grid gap-5 sm:grid-cols-2">
                {visibleOptions.map((option) => (
                  <OptionField
                    key={option.key}
                    option={option}
                    value={options[option.key] ?? option.default}
                    onChange={(v) => setOptions((prev) => ({ ...prev, [option.key]: v }))}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="min-h-12 w-full sm:w-auto"
              disabled={!tool.ready}
              onClick={process}
            >
              {tool.actionLabel}
            </Button>
            <Button variant="ghost" size="lg" className="min-h-12 w-full sm:w-auto" onClick={reset}>
              Start over
            </Button>
          </div>

          {!tool.ready ? (
            <p className="text-xs text-muted-foreground">
              This tool is currently unavailable. Please try one of our available tools.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
