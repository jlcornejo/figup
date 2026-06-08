"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface StickerCameraProps {
  stickerCode: string;
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function StickerCamera({ stickerCode, onCapture, onClose }: StickerCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Crop state
  const [crop, setCrop] = useState<CropBox>({ x: 15, y: 10, width: 70, height: 80 });
  const [dragging, setDragging] = useState<"move" | "resize" | null>(null);
  const dragStart = useRef({ x: 0, y: 0, crop: { x: 0, y: 0, width: 0, height: 0 } });

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  // Start camera
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
        });
        streamRef.current = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch {
        setError("No se pudo acceder a la cámara. Podés subir una imagen en su lugar.");
      }
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setRawImage(dataUrl);
    setImageSize({ width: video.videoWidth, height: video.videoHeight });
    stopCamera();
  }, []);

  // Handle file upload as alternative
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
        setRawImage(ev.target?.result as string);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Crop drag handlers (percentages) - using touch and pointer events
  const getEventPos = (e: React.TouchEvent | React.PointerEvent) => {
    if ("touches" in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if ("clientX" in e) {
      return { x: e.clientX, y: e.clientY };
    }
    return { x: 0, y: 0 };
  };

  const handleDragStart = (e: React.TouchEvent | React.PointerEvent, type: "move" | "resize") => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(type);
    const pos = getEventPos(e);
    dragStart.current = {
      x: pos.x,
      y: pos.y,
      crop: { ...crop },
    };
  };

  const handleDragMove = (e: React.TouchEvent | React.PointerEvent) => {
    if (!dragging || !cropContainerRef.current) return;
    e.preventDefault();
    const rect = cropContainerRef.current.getBoundingClientRect();
    const pos = getEventPos(e);
    const deltaX = ((pos.x - dragStart.current.x) / rect.width) * 100;
    const deltaY = ((pos.y - dragStart.current.y) / rect.height) * 100;
    const prev = dragStart.current.crop;

    if (dragging === "move") {
      const newX = Math.max(0, Math.min(100 - prev.width, prev.x + deltaX));
      const newY = Math.max(0, Math.min(100 - prev.height, prev.y + deltaY));
      setCrop({ ...crop, x: newX, y: newY });
    } else if (dragging === "resize") {
      const newW = Math.max(20, Math.min(100 - prev.x, prev.width + deltaX));
      const newH = Math.max(20, Math.min(100 - prev.y, prev.height + deltaY));
      setCrop({ ...crop, width: newW, height: newH });
    }
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  // Apply crop
  const applyCrop = () => {
    if (!rawImage) return;
    const img = new Image();
    img.onload = () => {
      const sx = (crop.x / 100) * img.naturalWidth;
      const sy = (crop.y / 100) * img.naturalHeight;
      const sw = (crop.width / 100) * img.naturalWidth;
      const sh = (crop.height / 100) * img.naturalHeight;

      const canvas = document.createElement("canvas");
      // Limit output size for performance on mobile
      const maxDim = 600;
      const scale = Math.min(1, maxDim / Math.max(sw, sh));
      canvas.width = sw * scale;
      canvas.height = sh * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      }
      setCroppedImage(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = rawImage;
  };

  const handleConfirm = () => {
    if (croppedImage) {
      onCapture(croppedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#1e1b3a] rounded-2xl overflow-hidden w-full max-w-lg max-h-[95vh] flex flex-col shadow-2xl border border-white/10">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white">📸 Capturar figurita</h3>
            <p className="text-[11px] text-white/50">{stickerCode}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 text-lg leading-none">
            ✕
          </button>
        </div>

        {/* Content - scrollable on small screens */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="relative bg-black">
            {error && !rawImage ? (
              <div className="aspect-[4/3] flex flex-col items-center justify-center gap-3 p-6">
                <p className="text-white/60 text-sm text-center">{error}</p>
                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors active:scale-95">
                  📁 Subir imagen
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            ) : croppedImage ? (
              /* Show cropped result */
              <div className="flex items-center justify-center bg-gray-900 p-3" style={{ minHeight: "200px", maxHeight: "55vh" }}>
                <img src={croppedImage} alt="Cropped sticker" className="max-w-full max-h-[50vh] object-contain rounded-lg" />
              </div>
            ) : rawImage ? (
              /* Crop mode */
              <div
                ref={cropContainerRef}
                className="relative overflow-hidden select-none"
                style={{ maxHeight: "55vh" }}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                onTouchCancel={handleDragEnd}
              >
                <img
                  src={rawImage}
                  alt="Raw capture"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "55vh" }}
                  draggable={false}
                />
                {/* Darkened overlay outside crop area */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top */}
                  <div className="absolute top-0 left-0 right-0 bg-black/60" style={{ height: `${crop.y}%` }} />
                  {/* Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60" style={{ height: `${100 - crop.y - crop.height}%` }} />
                  {/* Left */}
                  <div className="absolute bg-black/60" style={{ top: `${crop.y}%`, left: 0, width: `${crop.x}%`, height: `${crop.height}%` }} />
                  {/* Right */}
                  <div className="absolute bg-black/60" style={{ top: `${crop.y}%`, right: 0, width: `${100 - crop.x - crop.width}%`, height: `${crop.height}%` }} />
                </div>
                {/* Crop box (draggable) */}
                <div
                  className="absolute border-2 border-white/90 rounded-sm"
                  style={{
                    left: `${crop.x}%`,
                    top: `${crop.y}%`,
                    width: `${crop.width}%`,
                    height: `${crop.height}%`,
                    touchAction: "none",
                  }}
                  onPointerDown={(e) => handleDragStart(e, "move")}
                  onTouchStart={(e) => handleDragStart(e, "move")}
                >
                  {/* Corner guides */}
                  <div className="absolute -top-0.5 -left-0.5 w-5 h-5 border-t-3 border-l-3 border-white rounded-tl-sm" />
                  <div className="absolute -top-0.5 -right-0.5 w-5 h-5 border-t-3 border-r-3 border-white rounded-tr-sm" />
                  <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-3 border-l-3 border-white rounded-bl-sm" />
                  {/* Resize handle (bottom-right) — larger touch target */}
                  <div
                    className="absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center"
                    style={{ touchAction: "none" }}
                    onPointerDown={(e) => handleDragStart(e, "resize")}
                    onTouchStart={(e) => handleDragStart(e, "resize")}
                  >
                    <div className="w-4 h-4 bg-white rounded-sm shadow-md" />
                  </div>
                </div>
                <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/70 pointer-events-none">
                  Arrastrá el recuadro para ajustar
                </p>
              </div>
            ) : (
              /* Camera preview */
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full object-cover"
                  style={{ maxHeight: "55vh" }}
                />
                <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/60">
                  Centrá la figurita y capturá
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions - always visible at bottom */}
        <div className="px-4 py-3 flex gap-2 border-t border-white/10 shrink-0 bg-[#1e1b3a]">
          {croppedImage ? (
            <>
              <button
                onClick={() => setCroppedImage(null)}
                className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/15 active:scale-95 transition-all"
              >
                ← Ajustar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-sticker-green text-white hover:bg-sticker-green/80 active:scale-95 transition-all"
              >
                ✓ Guardar
              </button>
            </>
          ) : rawImage ? (
            <>
              <button
                onClick={() => {
                  setRawImage(null);
                  setCrop({ x: 15, y: 10, width: 70, height: 80 });
                  navigator.mediaDevices
                    .getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } } })
                    .then((mediaStream) => {
                      streamRef.current = mediaStream;
                      setStream(mediaStream);
                      if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                      }
                    });
                }}
                className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/15 active:scale-95 transition-all"
              >
                🔄 Otra foto
              </button>
              <button
                onClick={applyCrop}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-white/90 active:scale-95 transition-all"
              >
                ✂️ Recortar
              </button>
            </>
          ) : (
            <>
              <label className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/15 active:scale-95 transition-all text-center cursor-pointer">
                📁 Galería
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
              </label>
              <button
                onClick={takePhoto}
                disabled={!!error}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-white/90 active:scale-95 transition-all disabled:opacity-40"
              >
                📷 Capturar
              </button>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
