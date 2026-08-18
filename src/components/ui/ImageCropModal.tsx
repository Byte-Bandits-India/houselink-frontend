"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Scissors,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Check,
} from "lucide-react";
import { message } from "antd";

export interface ImageCropModalProps {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropSave: (croppedFile: File, croppedDataUrl: string) => void;
  aspectRatio?: number; // e.g. 1 for 1:1, 4/3 for property photo, 16/9 for video
  circular?: boolean; // true for circular avatar crop, false for rectangular grid crop
  imageSize?: string; // e.g. "800px * 600px"
  targetWidth?: number;
  targetHeight?: number;
  title?: string;
}

export function ImageCropModal({
  open,
  imageSrc,
  onClose,
  onCropSave,
  aspectRatio = 4 / 3,
  circular = false,
  imageSize,
  targetWidth = 800,
  targetHeight = 600,
  title = "Crop Image",
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Reset state when modal opens with new image
  useEffect(() => {
    if (open && imageSrc) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setImgLoaded(false);

      let isMounted = true;
      let createdBlobUrl: string | null = null;

      const loadImage = async () => {
        try {
          let source = imageSrc;
          // Handle remote images via CORS fetch to prevent canvas tainting
          if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
            try {
              const res = await fetch(imageSrc, { mode: "cors" });
              const b = await res.blob();
              createdBlobUrl = URL.createObjectURL(b);
              source = createdBlobUrl;
            } catch {
              // Fall back to raw source if fetch fails
            }
          }

          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = source;
          img.onload = () => {
            if (!isMounted) return;
            imgRef.current = img;
            setImgLoaded(true);
          };
          img.onerror = () => {
            const fallbackImg = new Image();
            fallbackImg.src = imageSrc;
            fallbackImg.onload = () => {
              if (!isMounted) return;
              imgRef.current = fallbackImg;
              setImgLoaded(true);
            };
          };
        } catch (e) {
          console.error("Failed to load image for cropping:", e);
        }
      };

      loadImage();

      return () => {
        isMounted = false;
        if (createdBlobUrl) URL.revokeObjectURL(createdBlobUrl);
      };
    }
  }, [open, imageSrc]);

  // Render crop preview canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Fill workspace dark background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Calculate baseScale so image covers the full length and width of the crop area
    const baseScale = Math.max(width / img.width, height / img.height);
    const scale = baseScale * zoom;

    ctx.save();
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // Draw centered image
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }, [zoom, rotation, offset, imgLoaded]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  if (!open || !imageSrc) return null;

  // Handle Drag / Pan inside Crop Modal
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Perform Final Crop on High Resolution Off-screen Canvas
  const handleApplyCrop = () => {
    try {
      const img = imgRef.current;
      const canvas = canvasRef.current;
      if (!img || !canvas) {
        message.warning("Image is still loading. Please try again.");
        return;
      }

      const viewW = canvas.width;
      const viewH = canvas.height;

      const outW = targetWidth;
      const outH = targetHeight;
      const ratio = outW / viewW;

      const baseScale = Math.max(viewW / img.width, viewH / img.height);
      const renderScale = baseScale * zoom * ratio;

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = outW;
      cropCanvas.height = outH;
      const ctx = cropCanvas.getContext("2d");

      if (!ctx) return;

      // Fill white background for transparent PNGs if needed
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);

      ctx.save();
      ctx.translate(outW / 2 + offset.x * ratio, outH / 2 + offset.y * ratio);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(renderScale, renderScale);

      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const dataUrl = cropCanvas.toDataURL("image/png");
      const arr = dataUrl.split(",");
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: "image/png" });
      const file = new File([blob], `cropped_${Date.now()}.png`, { type: "image/png" });

      onCropSave(file, dataUrl);
      onClose();
    } catch (err: any) {
      console.error("Cropping failed:", err);
      message.error(err.message || "Failed to crop image. Please try another file.");
    }
  };

  const canvasWidth = 360;
  const canvasHeight = Math.round(360 / (aspectRatio || (4 / 3)));
  const maxCanvasH = 300;
  const finalCanvasH = Math.min(canvasHeight, maxCanvasH);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-[#163d75] flex items-center gap-2">
              <Scissors size={18} className="text-[#163d75]" />
              {title}
            </h3>
            {imageSize ? (
              <p className="text-xs text-slate-500 mt-0.5">
                Target Resolution: <span className="font-semibold text-brand">{imageSize}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">
                Target Output: <span className="font-semibold text-brand">{targetWidth}x{targetHeight}px</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Crop Canvas Workspace */}
        <div className="p-5 flex flex-col items-center bg-slate-900/95 relative select-none">
          <div
            className={`relative overflow-hidden border-2 border-dashed border-white/60 cursor-grab active:cursor-grabbing shadow-inner flex items-center justify-center ${
              circular ? "rounded-full aspect-square" : "rounded-xl"
            }`}
            style={{
              width: canvasWidth,
              height: finalCanvasH,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={finalCanvasH}
              className="pointer-events-none"
            />
            {circular ? (
              <div className="absolute inset-0 rounded-full border border-white/30 pointer-events-none" />
            ) : (
              /* Rule of thirds 3x3 Grid Overlay */
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/20">
                <div className="border-r border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-b border-white/15" />
                <div className="border-r border-white/15" />
                <div className="border-r border-white/15" />
                <div />
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-300 mt-3 flex items-center gap-1">
            Drag image to adjust position • Use zoom & rotate below
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 space-y-3">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut size={15} className="text-slate-400" />
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
            />
            <ZoomIn size={15} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-600 min-w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Action Buttons: Rotate & Reset */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((r) => r - 90)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-1 font-medium shadow-xs"
              >
                <RotateCcw size={13} /> -90°
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => r + 90)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-1 font-medium shadow-xs"
              >
                <RotateCw size={13} /> +90°
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setOffset({ x: 0, y: 0 });
              }}
              className="text-slate-500 hover:text-slate-800 underline font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-5 py-2 text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:brightness-105 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Check size={14} /> Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
}
