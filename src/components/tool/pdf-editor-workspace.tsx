import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  MousePointer,
  Type,
  Image as ImageIcon,
  Pen,
  Highlighter,
  Square,
  Slash,
  Eraser,
  Trash2,
  Download,
  Bold,
  Italic,
  Copy,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  openRenderDoc,
  renderPageToCanvas,
  formatBytes,
  baseName,
  ToolError,
  type OutputFile,
} from "@/lib/pdf-engine";
import { RUNNERS } from "@/lib/tool-runners";
import { triggerPdfDownload } from "@/lib/download";
import { VerificationReminder } from "@/components/ui/verification-reminder";

export type EditorTool =
  "select" | "addText" | "removeText" | "image" | "pen" | "highlighter" | "rectangle" | "line";

export interface EditorElement {
  id: string;
  type: "text" | "whiteout" | "image" | "rectangle" | "line";
  page: number;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  text?: string;
  fontSize?: number;
  fontFamily?: "helvetica" | "times" | "courier";
  bold?: boolean;
  italic?: boolean;
  color?: string;
  bgColor?: string;
  lineWidth?: number;
  opacity?: number;
  imageData?: string;
}

export interface PageState {
  elements: EditorElement[];
  drawingsDataUrl?: string | undefined;
}

export interface PdfEditorWorkspaceProps {
  file: File;
  onReset: () => void;
}

interface Thumb {
  page: number;
  url: string;
}

const COLOR_PALETTE = [
  "#000000",
  "#ffffff",
  "#e11d48", // red
  "#2563eb", // blue
  "#16a34a", // green
  "#f59e0b", // yellow / amber
  "#9333ea", // purple
  "#4b5563", // gray
];

export function PdfEditorWorkspace({ file, onReset }: PdfEditorWorkspaceProps) {
  const [pdfDoc, setPdfDoc] = useState<Awaited<ReturnType<typeof openRenderDoc>> | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [activeTool, setActiveTool] = useState<EditorTool>("select");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Formatting state
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [currentFontSize, setCurrentFontSize] = useState<number>(14);
  const [currentFontFamily, setCurrentFontFamily] = useState<"helvetica" | "times" | "courier">(
    "helvetica",
  );
  const [currentBold, setCurrentBold] = useState<boolean>(false);
  const [currentItalic, setCurrentItalic] = useState<boolean>(false);
  const [currentLineWidth, setCurrentLineWidth] = useState<number>(3);

  // Loading state
  const [pageRendering, setPageRendering] = useState<boolean>(false);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);

  // Page state map
  const [pagesState, setPagesState] = useState<Record<number, PageState>>({});

  // History for Undo/Redo
  const [history, setHistory] = useState<Array<Record<number, PageState>>>([{}]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Dragging & Resizing Interactions
  const [draggingState, setDraggingState] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    startElX: number;
    startElY: number;
    startWidth: number;
    startHeight: number;
    isResizing: boolean;
  } | null>(null);

  // Highlight drag-to-create state
  const [highlightDrag, setHighlightDrag] = useState<{
    startX: number;
    startY: number;
    curX: number;
    curY: number;
  } | null>(null);

  // Remove Text drag-to-cover state
  const [removeTextDrag, setRemoveTextDrag] = useState<{
    startX: number;
    startY: number;
    curX: number;
    curY: number;
  } | null>(null);

  // Canvas Drawing refs
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);

  // Export State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<OutputFile | null>(null);
  const [customFilename, setCustomFilename] = useState<string>(baseName(file.name) + "_edited");

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Initial PDF Load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPageRendering(true);
      try {
        const doc = await openRenderDoc(file);
        if (cancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);

        const newThumbs: Thumb[] = [];
        const limit = Math.min(doc.numPages, 50);
        for (let i = 1; i <= limit; i++) {
          const canvas = await renderPageToCanvas(doc, i, 0.25);
          if (cancelled) return;
          newThumbs.push({
            page: i,
            url: canvas.toDataURL("image/jpeg", 0.7),
          });
        }
        setThumbs(newThumbs);

        const initMap: Record<number, PageState> = {};
        for (let i = 1; i <= doc.numPages; i++) {
          initMap[i] = { elements: [] };
        }
        setPagesState(initMap);
        setHistory([initMap]);
        setHistoryIndex(0);
      } catch (err: unknown) {
        console.error("PDF load error:", err);
      } finally {
        if (!cancelled) setPageRendering(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  // 2. Render Current Page to Background Canvas
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    (async () => {
      setPageRendering(true);
      try {
        const scale = (zoom / 100) * 1.5;
        const pageCanvas = await renderPageToCanvas(pdfDoc, currentPage, scale);
        if (cancelled) return;
        const target = bgCanvasRef.current;
        if (target) {
          target.width = pageCanvas.width;
          target.height = pageCanvas.height;
          const ctx = target.getContext("2d");
          ctx?.drawImage(pageCanvas, 0, 0);
        }
      } catch (err: unknown) {
        console.error("Page render error:", err);
      } finally {
        if (!cancelled) setPageRendering(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pdfDoc, currentPage, zoom]);

  // 3. Restore Freehand Drawings for Current Page
  const currentSavedDrawing = pagesState[currentPage]?.drawingsDataUrl;
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentSavedDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = currentSavedDrawing;
    }
  }, [currentSavedDrawing]);

  // History State Commit helper
  const commitState = useCallback(
    (newState: Record<number, PageState>, _desc?: string) => {
      setPagesState(newState);
      setDownloadSuccess(null);
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push(newState);
      if (nextHistory.length > 30) nextHistory.shift();
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    },
    [history, historyIndex],
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      const targetState = history[nextIdx];
      if (targetState) {
        setHistoryIndex(nextIdx);
        setPagesState(targetState);
        setSelectedElementId(null);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const targetState = history[nextIdx];
      if (targetState) {
        setHistoryIndex(nextIdx);
        setPagesState(targetState);
        setSelectedElementId(null);
      }
    }
  };

  // Element CRUD Operations
  const addElement = (el: Omit<EditorElement, "id" | "page">) => {
    const newId = `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const currentList = pagesState[currentPage]?.elements || [];
    const newElement: EditorElement = {
      ...el,
      id: newId,
      page: currentPage,
    };
    const newPagesState = {
      ...pagesState,
      [currentPage]: {
        ...pagesState[currentPage],
        elements: [...currentList, newElement],
      },
    };
    commitState(newPagesState, `Add ${el.type}`);
    setSelectedElementId(newId);
  };

  const updateElement = useCallback(
    (id: string, updates: Partial<EditorElement>) => {
      const currentList = pagesState[currentPage]?.elements || [];
      const newElements = currentList.map((el) => (el.id === id ? { ...el, ...updates } : el));
      const newPagesState = {
        ...pagesState,
        [currentPage]: {
          ...pagesState[currentPage],
          elements: newElements,
        },
      };
      setPagesState(newPagesState);
    },
    [currentPage, pagesState],
  );

  const deleteElement = (id: string) => {
    const currentList = pagesState[currentPage]?.elements || [];
    const newElements = currentList.filter((el) => el.id !== id);
    const newPagesState = {
      ...pagesState,
      [currentPage]: {
        ...pagesState[currentPage],
        elements: newElements,
      },
    };
    commitState(newPagesState, "Delete element");
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const duplicateElement = (id: string) => {
    const currentList = pagesState[currentPage]?.elements || [];
    const target = currentList.find((el) => el.id === id);
    if (!target) return;
    const newId = `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duplicated: EditorElement = {
      ...target,
      id: newId,
      x: Math.min(90, target.x + 3),
      y: Math.min(90, target.y + 3),
    };
    const newPagesState = {
      ...pagesState,
      [currentPage]: {
        ...pagesState[currentPage],
        elements: [...currentList, duplicated],
      },
    };
    commitState(newPagesState, "Duplicate element");
    setSelectedElementId(newId);
  };

  // DRAG & RESIZE HANDLERS (MOUSE & TOUCH SUPPORT)
  const startDragOrResize = (
    clientX: number,
    clientY: number,
    el: EditorElement,
    isResizing: boolean,
  ) => {
    if (activeTool !== "select") return;
    setSelectedElementId(el.id);
    setDraggingState({
      elementId: el.id,
      startX: clientX,
      startY: clientY,
      startElX: el.x,
      startElY: el.y,
      startWidth: el.width,
      startHeight: el.height,
      isResizing,
    });
  };

  const handleElementMouseDown = (e: React.MouseEvent, el: EditorElement) => {
    if (activeTool !== "select") return;
    if ((e.target as HTMLElement).tagName === "INPUT") {
      setSelectedElementId(el.id);
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    startDragOrResize(e.clientX, e.clientY, el, false);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, el: EditorElement) => {
    e.stopPropagation();
    e.preventDefault();
    startDragOrResize(e.clientX, e.clientY, el, true);
  };

  const handleElementTouchStart = (e: React.TouchEvent, el: EditorElement) => {
    if (activeTool !== "select") return;
    if ((e.target as HTMLElement).tagName === "INPUT") {
      setSelectedElementId(el.id);
      return;
    }
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) {
      startDragOrResize(touch.clientX, touch.clientY, el, false);
    }
  };

  const handleResizeTouchStart = (e: React.TouchEvent, el: EditorElement) => {
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) {
      startDragOrResize(touch.clientX, touch.clientY, el, true);
    }
  };

  // Unified Mouse & Touch Drag Listener to update coordinates
  useEffect(() => {
    if (!draggingState) return;

    const handleMove = (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const deltaX = clientX - draggingState.startX;
      const deltaY = clientY - draggingState.startY;

      const deltaXPct = (deltaX / rect.width) * 100;
      const deltaYPct = (deltaY / rect.height) * 100;

      if (draggingState.isResizing) {
        // Resize
        const newWidth = Math.max(
          2,
          Math.min(100 - draggingState.startElX, draggingState.startWidth + deltaXPct),
        );
        const newHeight = Math.max(
          1,
          Math.min(100 - draggingState.startElY, draggingState.startHeight + deltaYPct),
        );
        updateElement(draggingState.elementId, {
          width: Math.round(newWidth * 100) / 100,
          height: Math.round(newHeight * 100) / 100,
        });
      } else {
        // Move
        const newX = Math.max(
          0,
          Math.min(100 - draggingState.startWidth, draggingState.startElX + deltaXPct),
        );
        const newY = Math.max(
          0,
          Math.min(100 - draggingState.startHeight, draggingState.startElY + deltaYPct),
        );
        updateElement(draggingState.elementId, {
          x: Math.round(newX * 100) / 100,
          y: Math.round(newY * 100) / 100,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setDraggingState(null);
      commitState(pagesState, "Move/Resize element");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: false });
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [draggingState, pagesState, commitState, updateElement]);

  // Click on Viewport Canvas to Place Elements (Add Text, Shapes)
  const handleViewportClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeTool === "addText") {
      addElement({
        type: "text",
        x: Math.max(0, Math.min(85, clickX)),
        y: Math.max(0, Math.min(92, clickY)),
        width: 25,
        height: 5,
        text: "Type text here",
        fontSize: currentFontSize,
        fontFamily: currentFontFamily,
        bold: currentBold,
        italic: currentItalic,
        color: currentColor,
      });
      setActiveTool("select");
    } else if (activeTool === "rectangle") {
      addElement({
        type: "rectangle",
        x: Math.max(0, Math.min(75, clickX - 12)),
        y: Math.max(0, Math.min(85, clickY - 8)),
        width: 25,
        height: 16,
        color: currentColor,
        lineWidth: currentLineWidth,
      });
      setActiveTool("select");
    } else if (activeTool === "line") {
      addElement({
        type: "line",
        x: Math.max(0, Math.min(70, clickX - 15)),
        y: Math.max(0, Math.min(95, clickY)),
        width: 30,
        height: 1,
        color: currentColor,
        lineWidth: currentLineWidth,
      });
      setActiveTool("select");
    } else if (activeTool === "select") {
      if ((e.target as HTMLElement).dataset["elementId"] === undefined) {
        setSelectedElementId(null);
      }
    }
  };

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        addElement({
          type: "image",
          x: 35,
          y: 35,
          width: 30,
          height: 25,
          imageData: dataUrl,
        });
        setActiveTool("select");
      }
    };
    reader.readAsDataURL(imgFile);
    e.target.value = "";
  };

  // Freehand Pen Drawing (pen tool only)
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (activeTool !== "pen") return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const touch = "touches" in e ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : "clientX" in e ? e.clientX : 0;
    const clientY = touch ? touch.clientY : "clientY" in e ? e.clientY : 0;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    setDrawingStart({ x, y });
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentLineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool !== "pen") return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = "touches" in e ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : "clientX" in e ? e.clientX : 0;
    const clientY = touch ? touch.clientY : "clientY" in e ? e.clientY : 0;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const currentPageState = pagesState[currentPage];
    const newPagesState: Record<number, PageState> = {
      ...pagesState,
      [currentPage]: {
        elements: currentPageState?.elements ?? [],
        drawingsDataUrl: dataUrl,
      },
    };
    commitState(newPagesState, "Pen drawing");
  };

  // Container Mouse/Touch Drag Handlers (for Highlighter & Remove Text)
  const handleContainerPointerDown = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;

    if (activeTool === "highlighter") {
      setHighlightDrag({ startX: xPct, startY: yPct, curX: xPct, curY: yPct });
    } else if (activeTool === "removeText") {
      setRemoveTextDrag({ startX: xPct, startY: yPct, curX: xPct, curY: yPct });
    }
  };

  const handleContainerPointerMove = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

    if (activeTool === "highlighter" && highlightDrag) {
      setHighlightDrag((prev) => (prev ? { ...prev, curX: xPct, curY: yPct } : null));
    } else if (activeTool === "removeText" && removeTextDrag) {
      setRemoveTextDrag((prev) => (prev ? { ...prev, curX: xPct, curY: yPct } : null));
    }
  };

  const handleContainerPointerUp = () => {
    if (activeTool === "highlighter" && highlightDrag) {
      const { startX, startY, curX, curY } = highlightDrag;
      const x = Math.min(startX, curX);
      const y = Math.min(startY, curY);
      const width = Math.abs(curX - startX);
      const height = Math.abs(curY - startY);
      setHighlightDrag(null);
      if (width >= 1 && height >= 0.5) {
        addElement({
          type: "rectangle",
          x,
          y,
          width,
          height,
          color: "transparent",
          bgColor: currentColor,
          opacity: 0.35,
          lineWidth: 0,
        });
        setActiveTool("select");
      }
    } else if (activeTool === "removeText" && removeTextDrag) {
      const { startX, startY, curX, curY } = removeTextDrag;
      const x = Math.min(startX, curX);
      const y = Math.min(startY, curY);
      const width = Math.abs(curX - startX);
      const height = Math.abs(curY - startY);
      setRemoveTextDrag(null);

      if (width >= 0.5 && height >= 0.3) {
        addElement({
          type: "whiteout",
          x,
          y,
          width,
          height,
          bgColor: "#ffffff",
        });
        setActiveTool("select");
      }
    }
  };

  const clearDrawings = () => {
    const canvas = drawCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    const currentPageState = pagesState[currentPage];
    const newPagesState: Record<number, PageState> = {
      ...pagesState,
      [currentPage]: {
        elements: currentPageState?.elements ?? [],
        drawingsDataUrl: undefined,
      },
    };
    commitState(newPagesState, "Clear drawings");
  };

  // Compile & Export
  const handleExportPdf = async () => {
    if (downloadSuccess) {
      triggerPdfDownload(downloadSuccess.blob, customFilename);
      return;
    }

    setIsExporting(true);
    setExportError(null);
    try {
      const runner = RUNNERS["edit-pdf"];
      if (!runner) throw new ToolError("Edit PDF runner is not initialized.");

      const result = await runner({
        files: [file],
        options: {
          pagesState,
        },
        selectedPages: Array.from({ length: totalPages }, (_, i) => i + 1),
        pageOrder: Array.from({ length: totalPages }, (_, i) => i),
        totalPages,
        onProgress: () => {},
      });

      if (result.outputs && result.outputs.length > 0) {
        const out = result.outputs[0];
        if (out) {
          setDownloadSuccess(out);
          triggerPdfDownload(out.blob, customFilename);
        }
      }
    } catch (err: unknown) {
      console.error("Export error:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to generate edited PDF. Please try again.";
      setExportError(msg);
    } finally {
      setIsExporting(false);
    }
  };

  const currentElements = pagesState[currentPage]?.elements || [];
  const selectedElement = currentElements.find((el) => el.id === selectedElementId);

  return (
    <div className="flex flex-col gap-4 w-full min-w-0">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleImageSelected}
      />

      {/* TOP HEADER TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3 shadow-xs">
        {/* Undo/Redo & Zoom */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            disabled={historyIndex <= 0}
            onClick={handleUndo}
            title="Undo"
          >
            <Undo2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            disabled={historyIndex >= history.length - 1}
            onClick={handleRedo}
            title="Redo"
          >
            <Redo2 className="size-4" />
          </Button>

          <div className="h-5 w-px bg-border mx-1" />

          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            disabled={zoom <= 50}
            onClick={() => setZoom((z) => Math.max(50, z - 25))}
            title="Zoom Out"
          >
            <ZoomOut className="size-4" />
          </Button>
          <span className="text-xs font-semibold text-muted-foreground min-w-[3rem] text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            disabled={zoom >= 200}
            onClick={() => setZoom((z) => Math.min(200, z + 25))}
            title="Zoom In"
          >
            <ZoomIn className="size-4" />
          </Button>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              setSelectedElementId(null);
            }}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-xs font-medium text-muted-foreground">
            Page <strong className="text-foreground">{currentPage}</strong> of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={currentPage >= totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              setSelectedElementId(null);
            }}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* File & Export */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end">
            <span
              className="text-xs font-semibold text-foreground truncate max-w-[140px]"
              title={file.name}
            >
              {file.name}
            </span>
            <span className="text-[10px] text-muted-foreground">{formatBytes(file.size)}</span>
          </div>

          <Button
            variant="default"
            size="sm"
            className="min-h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold animate-fade-in"
            disabled={isExporting}
            onClick={handleExportPdf}
          >
            {isExporting ? (
              <span className="flex items-center gap-1.5">
                <RotateCcw className="size-4 animate-spin" /> Exporting...
              </span>
            ) : downloadSuccess ? (
              <span className="flex items-center gap-1.5">
                <Download className="size-4" /> Download PDF
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Download className="size-4" /> Export & Download PDF
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* SECONDARY TOOLBAR: ACTIONS & TOOLS */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-surface p-2.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant={activeTool === "select" ? "default" : "ghost"}
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium"
            onClick={() => setActiveTool("select")}
          >
            <MousePointer className="size-4" /> Select / Move
          </Button>

          <Button
            variant={activeTool === "addText" ? "default" : "ghost"}
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium"
            onClick={() => {
              setActiveTool("addText");
              setSelectedElementId(null);
            }}
          >
            <Type className="size-4" /> Add Text
          </Button>

          <Button
            variant={activeTool === "removeText" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "h-9 gap-1.5 text-xs font-medium transition-all",
              activeTool === "removeText" ? "bg-primary text-primary-foreground font-semibold" : "",
            )}
            onClick={() => {
              setActiveTool("removeText");
              setSelectedElementId(null);
            }}
          >
            <Eraser className="size-4" /> Remove Text
          </Button>

          <Button
            variant={activeTool === "image" ? "default" : "ghost"}
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium"
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageIcon className="size-4" /> Image
          </Button>

          <div className="h-5 w-px bg-border mx-1" />

          <Button
            variant={activeTool === "pen" ? "default" : "ghost"}
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium"
            onClick={() => {
              setActiveTool("pen");
              setSelectedElementId(null);
            }}
          >
            <Pen className="size-4" /> Draw
          </Button>

          <Button
            variant={activeTool === "highlighter" ? "default" : "ghost"}
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium"
            onClick={() => {
              setActiveTool("highlighter");
              setSelectedElementId(null);
            }}
          >
            <Highlighter className="size-4" /> Highlight
          </Button>

          <Button
            variant={activeTool === "rectangle" ? "default" : "ghost"}
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium"
            onClick={() => {
              setActiveTool("rectangle");
              setSelectedElementId(null);
            }}
          >
            <Square className="size-4" /> Box
          </Button>

          <Button
            variant={activeTool === "line" ? "default" : "ghost"}
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium"
            onClick={() => {
              setActiveTool("line");
              setSelectedElementId(null);
            }}
          >
            <Slash className="size-4" /> Line
          </Button>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          {COLOR_PALETTE.map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => {
                setCurrentColor(col);
                if (selectedElement) {
                  if (selectedElement.type === "text")
                    updateElement(selectedElement.id, { color: col });
                  else if (selectedElement.type === "rectangle" || selectedElement.type === "line")
                    updateElement(selectedElement.id, { color: col });
                }
              }}
              className={cn(
                "size-5.5 rounded-full border transition-all cursor-pointer",
                currentColor === col
                  ? "ring-2 ring-primary ring-offset-1 scale-110"
                  : "border-border/60 hover:scale-105",
              )}
              style={{ backgroundColor: col }}
              title={col}
            />
          ))}
        </div>
      </div>

      {/* CONTEXTUAL TOOL CONTROLS (Typography / Width / Selection) */}
      {selectedElement ||
      activeTool === "addText" ||
      activeTool === "pen" ||
      activeTool === "highlighter" ||
      activeTool === "rectangle" ||
      activeTool === "line" ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/80 bg-muted/40 p-2 px-3 text-xs animate-fade-in">
          {/* Typography Controls for Text Tool or Selected Text */}
          {activeTool === "addText" || selectedElement?.type === "text" ? (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Label className="text-xs font-semibold text-muted-foreground">Font:</Label>
                <select
                  value={selectedElement?.fontFamily || currentFontFamily}
                  onChange={(e) => {
                    const f = e.target.value as "helvetica" | "times" | "courier";
                    setCurrentFontFamily(f);
                    if (selectedElement) updateElement(selectedElement.id, { fontFamily: f });
                  }}
                  className="h-7 rounded-md border border-input bg-background px-2 text-xs font-medium"
                >
                  <option value="helvetica">Helvetica</option>
                  <option value="times">Times New Roman</option>
                  <option value="courier">Courier</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <Label className="text-xs font-semibold text-muted-foreground">Size:</Label>
                <Input
                  type="number"
                  min={8}
                  max={72}
                  value={selectedElement?.fontSize || currentFontSize}
                  onChange={(e) => {
                    const s = Number(e.target.value) || 14;
                    setCurrentFontSize(s);
                    if (selectedElement) updateElement(selectedElement.id, { fontSize: s });
                  }}
                  className="h-7 w-14 text-xs font-semibold px-1 text-center"
                />
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant={(selectedElement?.bold ?? currentBold) ? "default" : "outline"}
                  size="icon"
                  className="size-7"
                  onClick={() => {
                    const b = !(selectedElement?.bold ?? currentBold);
                    setCurrentBold(b);
                    if (selectedElement) updateElement(selectedElement.id, { bold: b });
                  }}
                >
                  <Bold className="size-3.5" />
                </Button>
                <Button
                  variant={(selectedElement?.italic ?? currentItalic) ? "default" : "outline"}
                  size="icon"
                  className="size-7"
                  onClick={() => {
                    const it = !(selectedElement?.italic ?? currentItalic);
                    setCurrentItalic(it);
                    if (selectedElement) updateElement(selectedElement.id, { italic: it });
                  }}
                >
                  <Italic className="size-3.5" />
                </Button>
              </div>
            </div>
          ) : null}

          {activeTool === "pen" ||
          activeTool === "highlighter" ||
          activeTool === "rectangle" ||
          activeTool === "line" ||
          selectedElement?.type === "rectangle" ||
          selectedElement?.type === "line" ? (
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Width:</Label>
              <Slider
                value={[selectedElement?.lineWidth || currentLineWidth]}
                min={1}
                max={20}
                step={1}
                className="w-24"
                onValueChange={(val) => {
                  const w = val[0] || 3;
                  setCurrentLineWidth(w);
                  if (selectedElement) updateElement(selectedElement.id, { lineWidth: w });
                }}
              />
              <span className="text-xs font-semibold">
                {selectedElement?.lineWidth || currentLineWidth}px
              </span>
            </div>
          ) : null}

          {selectedElement ? (
            <div className="flex items-center gap-1.5 ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => duplicateElement(selectedElement.id)}
              >
                <Copy className="size-3.5" /> Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1 border-destructive/40 text-destructive hover:bg-destructive/10"
                onClick={() => deleteElement(selectedElement.id)}
              >
                <Trash2 className="size-3.5" /> Delete
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* WORKSPACE AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-4 min-h-[600px]">
        {/* Page Thumbnails */}
        <div className="hidden lg:flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3 max-h-[780px] overflow-y-auto">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
            Page Previews
          </span>
          <div className="flex flex-col gap-2.5">
            {thumbs.map((thumb) => {
              const isActive = thumb.page === currentPage;
              return (
                <button
                  key={thumb.page}
                  type="button"
                  onClick={() => {
                    setCurrentPage(thumb.page);
                    setSelectedElementId(null);
                  }}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border-2 bg-background p-1 text-left transition-all",
                    isActive
                      ? "border-primary shadow-xs ring-2 ring-primary/20"
                      : "border-border/70 hover:border-border",
                  )}
                >
                  <img
                    src={thumb.url}
                    alt={`Page ${thumb.page}`}
                    className="w-full rounded object-contain aspect-3/4 bg-white"
                  />
                  <div className="mt-1 flex items-center justify-between px-1 text-[11px] font-medium text-muted-foreground">
                    <span>Page {thumb.page}</span>
                    {pagesState[thumb.page]?.elements?.length ? (
                      <span className="size-1.5 rounded-full bg-primary" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* EDITOR AREA */}
        <div className="flex flex-col items-center justify-start rounded-2xl border border-border bg-muted/30 p-2 sm:p-6 overflow-auto max-h-[820px] w-full min-w-0">
          <p className="mb-3 text-center text-xs text-muted-foreground max-w-xl">
            Edit PDF with basic tools directly in your browser. Add text, remove content, add
            images, draw, highlight, and add shapes. Existing PDF text is not directly rewritten or
            automatically reflowed.
          </p>

          {activeTool === "removeText" ? (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-medium text-primary animate-fade-in">
              <Eraser className="size-3.5" />
              <span>
                Click and drag over any text to remove it. Remove Text covers the selected area.
              </span>
            </div>
          ) : activeTool === "addText" ? (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-medium text-primary">
              <Type className="size-3.5" />
              <span>Click anywhere on the document to add a new text overlay.</span>
            </div>
          ) : null}

          {/* Canvas Wrapper */}
          <div
            ref={containerRef}
            onClick={handleViewportClick}
            onMouseDown={(e) => handleContainerPointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handleContainerPointerMove(e.clientX, e.clientY)}
            onMouseUp={handleContainerPointerUp}
            onMouseLeave={handleContainerPointerUp}
            onTouchStart={(e) => {
              if (e.touches[0])
                handleContainerPointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) {
                if (activeTool === "removeText" || activeTool === "highlighter") {
                  e.preventDefault();
                }
                handleContainerPointerMove(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handleContainerPointerUp}
            className={cn(
              "relative border border-border/80 shadow-lg rounded-lg overflow-hidden bg-white select-none transition-all touch-none",
              activeTool === "addText" && "cursor-text",
              activeTool === "pen" && "cursor-crosshair",
              activeTool === "highlighter" && "cursor-crosshair",
              activeTool === "removeText" && "cursor-crosshair",
              (activeTool === "rectangle" || activeTool === "line") && "cursor-crosshair",
            )}
            style={{
              width: `${(zoom / 100) * 580}px`,
              maxWidth: "100%",
            }}
          >
            {/* Layer 1: PDF Background Page */}
            <canvas ref={bgCanvasRef} className="w-full h-auto block pointer-events-none" />

            {/* Layer 2: Live Drag Selection preview in Remove Text mode */}
            {activeTool === "removeText" &&
              removeTextDrag &&
              (() => {
                const { startX, startY, curX, curY } = removeTextDrag;
                const x = Math.min(startX, curX);
                const y = Math.min(startY, curY);
                const w = Math.abs(curX - startX);
                const h = Math.abs(curY - startY);
                return (
                  <div
                    className="absolute pointer-events-none rounded-2xs border-2 border-dashed border-destructive/80 bg-destructive/15 shadow-xs"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${w}%`,
                      height: `${h}%`,
                      zIndex: 30,
                    }}
                  />
                );
              })()}

            {/* Live Highlight Drag-to-Create preview */}
            {activeTool === "highlighter" &&
              highlightDrag &&
              (() => {
                const { startX, startY, curX, curY } = highlightDrag;
                const x = Math.min(startX, curX);
                const y = Math.min(startY, curY);
                const w = Math.abs(curX - startX);
                const h = Math.abs(curY - startY);
                return (
                  <div
                    className="absolute pointer-events-none rounded-xs border border-amber-400/80"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${w}%`,
                      height: `${h}%`,
                      backgroundColor: currentColor,
                      opacity: 0.35,
                      zIndex: 15,
                    }}
                  />
                );
              })()}

            {/* Layer 3: Interactive overlay elements */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {currentElements.map((el) => {
                const isSelected = el.id === selectedElementId;
                return (
                  <div
                    key={el.id}
                    data-element-id={el.id}
                    onMouseDown={(e) => handleElementMouseDown(e, el)}
                    onTouchStart={(e) => handleElementTouchStart(e, el)}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "absolute group",
                      activeTool === "select"
                        ? "cursor-move pointer-events-auto"
                        : "pointer-events-none",
                      isSelected &&
                        "ring-2 ring-primary ring-offset-0.5 rounded-xs pointer-events-auto",
                    )}
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      zIndex: el.type === "whiteout" ? 10 : 20,
                    }}
                  >
                    {/* TEXT TYPE */}
                    {el.type === "text" ? (
                      <div
                        className="w-full h-full flex items-center px-0.5 outline-hidden select-text"
                        style={{
                          color: el.color || "#000000",
                          fontSize: `${(el.fontSize || 14) * (zoom / 100)}px`,
                          fontFamily:
                            el.fontFamily === "times"
                              ? "Times New Roman, serif"
                              : el.fontFamily === "courier"
                                ? "Courier New, monospace"
                                : "Helvetica, Arial, sans-serif",
                          fontWeight: el.bold ? "bold" : "normal",
                          fontStyle: el.italic ? "italic" : "normal",
                        }}
                      >
                        <input
                          type="text"
                          value={el.text || ""}
                          onChange={(e) => updateElement(el.id, { text: e.target.value })}
                          onFocus={() => setSelectedElementId(el.id)}
                          className="w-full h-full bg-transparent border-none outline-hidden p-0 m-0 font-inherit text-inherit pointer-events-auto"
                        />
                      </div>
                    ) : null}

                    {/* WHITEOUT / REMOVAL TYPE */}
                    {el.type === "whiteout" ? (
                      <div
                        className="w-full h-full border border-dashed border-border/80 shadow-xs"
                        style={{ backgroundColor: el.bgColor || "#ffffff" }}
                      />
                    ) : null}

                    {/* RECTANGLE TYPE */}
                    {el.type === "rectangle" ? (
                      <div
                        className="w-full h-full rounded-2xs"
                        style={{
                          border:
                            el.color && el.color !== "transparent"
                              ? `${el.lineWidth || 2}px solid ${el.color}`
                              : "none",
                          backgroundColor: el.bgColor || "transparent",
                          opacity: el.opacity ?? 1,
                        }}
                      />
                    ) : null}

                    {/* LINE TYPE */}
                    {el.type === "line" ? (
                      <div
                        className="w-full"
                        style={{
                          height: `${el.lineWidth || 2}px`,
                          backgroundColor: el.color || "#000000",
                          opacity: el.opacity ?? 1,
                        }}
                      />
                    ) : null}

                    {/* IMAGE TYPE */}
                    {el.type === "image" && el.imageData ? (
                      <img
                        src={el.imageData}
                        alt="User added overlay"
                        className="w-full h-full object-contain pointer-events-none rounded-2xs"
                      />
                    ) : null}

                    {/* RESIZE HANDLE IN SELECT MODE */}
                    {isSelected && activeTool === "select" ? (
                      <div
                        onMouseDown={(e) => handleResizeMouseDown(e, el)}
                        onTouchStart={(e) => handleResizeTouchStart(e, el)}
                        className="absolute -bottom-1.5 -right-1.5 size-3.5 bg-primary border-2 border-white rounded-full cursor-nwse-resize shadow-md"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Layer 4: Freehand Pen Drawing Canvas */}
            <canvas
              ref={drawCanvasRef}
              width={Math.floor((zoom / 100) * 580 * 1.5)}
              height={Math.floor((zoom / 100) * 580 * 1.5 * 1.414)}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className={cn(
                "absolute inset-0 w-full h-full",
                activeTool === "pen"
                  ? "pointer-events-auto cursor-crosshair z-25"
                  : "pointer-events-none z-15",
              )}
            />
          </div>

          {pageRendering ? (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
              <RotateCcw className="size-3.5 animate-spin" /> Rendering page...
            </div>
          ) : null}
        </div>
      </div>

      {/* FOOTER ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-2xl border border-border bg-surface p-3 sm:p-4 shadow-xs w-full min-w-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
            <Label
              htmlFor="filename"
              className="text-xs font-semibold text-muted-foreground shrink-0"
            >
              Filename:
            </Label>
            <Input
              id="filename"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              className="h-8 text-xs font-medium w-full min-w-0 sm:w-64"
            />
          </div>
          {pagesState[currentPage]?.drawingsDataUrl ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clearDrawings}
              className="h-8 text-xs shrink-0"
            >
              Clear Drawings
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="w-full sm:w-auto justify-center"
          >
            Choose Another File
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground font-semibold w-full sm:w-auto justify-center"
            disabled={isExporting}
            onClick={handleExportPdf}
          >
            {isExporting ? (
              <span className="flex items-center gap-1.5 justify-center">
                <RotateCcw className="size-4 animate-spin" /> Exporting...
              </span>
            ) : downloadSuccess ? (
              <span className="flex items-center gap-1.5 justify-center">
                <Download className="size-4" /> Download PDF
              </span>
            ) : (
              <span className="flex items-center gap-1.5 justify-center">
                <Download className="size-4" /> Export & Download PDF
              </span>
            )}
          </Button>
        </div>
      </div>

      {downloadSuccess ? (
        <div className="flex justify-end pt-1">
          <VerificationReminder variant="pdf" align="right" />
        </div>
      ) : null}

      {/* EXPORT ACTION STATUS */}
      {exportError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/15 p-4 text-sm text-destructive font-medium animate-shake">
          {exportError}
        </div>
      ) : null}
    </div>
  );
}
