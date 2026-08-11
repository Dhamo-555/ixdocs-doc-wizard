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
import { ToolError, formatBytes, openRenderDoc, renderPageToCanvas, type RunResult } from "@/lib/pdf-engine";

/* ------------------------------------------------------------ shared cards */

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      to={toolPath(tool.slug)}
      className="surface-card group flex min-w-0 flex-col gap-2 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-lift)] focus-visible:-translate-y-0.5 sm:p-5"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <tool.icon className="size-5" strokeWidth={1.75} />
      </span>
      <span className="mt-1 truncate text-sm font-semibold text-foreground sm:text-[0.95rem]">{tool.name}</span>
      <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{tool.short}</span>
    </Link>
  );
}


export function AdSlot({ label = "Advertisement", className }: { label?: string; className?: string }) {
  return (
    <aside
      aria-label={label}
      className={cn(
        "grid min-h-24 place-items-center rounded-xl border border-dashed border-border bg-surface px-4 py-6 text-center",
        className,
      )}
    >
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label} — reserved space
      </span>
    </aside>
  );
}

export function RelatedTools({ tool }: { tool: Tool }) {
  return (
    <section aria-labelledby="related-tools" className="mt-14">
      <h2 id="related-tools" className="text-lg font-bold">
        Related tools
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Other IXDocs tools people use with {tool.name}.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tool.related.slice(0, 4).map((slug) => (
          <RelatedCard key={slug} slug={slug} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ slug }: { slug: string }) {
  const tool = TOOL_MAP[slug];
  if (!tool) return null;
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
      {!compact ? <p className="mt-1 text-sm text-muted-foreground">Nothing is uploaded to a server</p> : null}
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
    if (!file || !tool.pageMode || tool.pageMode === "none" || !file.type.includes("pdf")) {
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
  }, [files, tool.pageMode]);

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
        options,
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 20_000);
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
    <div className="surface-card p-4 sm:p-6">
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
        <div role="alert" className="mb-5 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <p className="text-sm text-foreground">{error}</p>
        </div>
      ) : null}

      {phase === "processing" ? (
        <div className="py-14 text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" aria-hidden="true" />
          <p className="mt-4 text-base font-semibold">Processing your document…</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {progressLabel || "Working locally in your browser. Keep this tab open."}
          </p>
          {progress !== null ? (
            <div className="mx-auto mt-5 max-w-sm">
              <Progress value={Math.round(progress * 100)} />
              <p className="mt-2 text-xs text-muted-foreground">{Math.round(progress * 100)}% complete</p>
            </div>
          ) : null}
        </div>
      ) : phase === "done" && result ? (
        <div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success" aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="text-lg font-bold">
                {result.outputs.length ? "Your document is ready" : "Analysis complete"}
              </h2>
              {result.message ? <p className="mt-1 text-sm text-muted-foreground">{result.message}</p> : null}
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
            <div key={section.title} className="mt-5 overflow-hidden rounded-xl border border-border">
              <h3 className="border-b border-border bg-surface px-4 py-2.5 text-sm font-semibold">{section.title}</h3>
              <dl className="divide-y divide-border">
                {section.rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-4 py-2.5">
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
            <ul className="mt-5 space-y-2">
              {result.outputs.map((output) => (
                <li
                  key={output.name}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{output.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(output.size)}</p>
                  </div>
                  <Button size="sm" className="min-h-11" onClick={() => download(output.name, output.blob)}>
                    <Download className="size-4" />
                    <span>Download</span>
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-2">
            {result.outputs.length > 1 ? (
              <Button
                className="min-h-11"
                onClick={() => result.outputs.forEach((o, i) => setTimeout(() => download(o.name, o.blob), i * 300))}
              >
                <Download className="size-4" />
                <span>Download all</span>
              </Button>
            ) : null}
            <Button variant="outline" className="min-h-11" onClick={reset}>
              <RotateCcw className="size-4" />
              <span>Process another file</span>
            </Button>
          </div>
        </div>
      ) : files.length === 0 ? (
        <UploadBox tool={tool} onFiles={addFiles} />
      ) : (
        <div className="space-y-6">
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {tool.multiple && files.length > 1 ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Move ${file.name} up`}
                        className="min-h-11 min-w-11"
                        onClick={() => moveFile(index, -1)}
                      >
                        <ArrowLeft className="size-4 rotate-90" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Move ${file.name} down`}
                        className="min-h-11 min-w-11"
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
                    className="min-h-11 min-w-11"
                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {tool.multiple ? (
            <UploadBox tool={tool} onFiles={addFiles} />
          ) : null}

          {thumbs.length && tool.pageMode === "select" ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  Select pages <span className="text-muted-foreground">({selected.length} selected)</span>
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelected(thumbs.map((t) => t.page))}>
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
                          prev.includes(thumb.page) ? prev.filter((p) => p !== thumb.page) : [...prev, thumb.page].sort((a, b) => a - b),
                        )
                      }
                      className={cn(
                        "overflow-hidden rounded-lg border-2 bg-surface p-1 transition-colors",
                        isSelected ? "border-primary" : "border-border opacity-70",
                      )}
                    >
                      <img src={thumb.url} alt={`Page ${thumb.page}`} className="w-full rounded" loading="lazy" />
                      <span className="mt-1 block text-center text-xs font-medium">{thumb.page}</span>
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
                      <img src={thumb.url} alt={`Page ${thumb.page}`} className="w-full rounded" loading="lazy" />
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

          {visibleOptions.length ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {visibleOptions.map((option) => (
                <OptionField
                  key={option.key}
                  option={option}
                  value={options[option.key] ?? option.default}
                  onChange={(v) => setOptions((prev) => ({ ...prev, [option.key]: v }))}
                />
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button size="lg" className="min-h-12 flex-1 sm:flex-none" disabled={!tool.ready} onClick={process}>
              {tool.actionLabel}
            </Button>
            <Button variant="outline" size="lg" className="min-h-12" onClick={reset}>
              Start over
            </Button>
          </div>
          {!tool.ready ? (
            <p className="text-xs text-muted-foreground">
              Processing is disabled for this tool until the engine is connected — IXDocs will not return a file that
              was not genuinely processed.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
