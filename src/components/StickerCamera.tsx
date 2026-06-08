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
    const dataUrl = canvas.toDataURL("image/png");
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

  // Crop drag handlers (percentages)
  const handlePointerDown = (e: React.PointerEvent, type: "move" | "resize") => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(type);
    const rect = cropContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      crop: { ...crop },
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !cropContainerRef.current) return;
    const rect = cropContainerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.current.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.current.y) / rect.height) * 100;
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

  const handlePointerUp = () => {
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
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      }
      setCroppedImage(canvas.toDataURL("image/png"));
    };
    img.src = rawImage;
  };

  const handleConfirm = () => {
    if (croppedImage) {
      onCapture(croppedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-[#1e1b3a] rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl border border-white/10">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white">📸 Capturar figurita</h3>
            <p className="text-[11px] text-white/50">{stickerCode}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="relative bg-black">
          {error && !rawImage ? (
            <div className="aspect-[4/3] flex flex-col items-center justify-center gap-3 p-6">
              <p className="text-white/60 text-sm text-center">{error}</p>
              <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                📁 Subir imagen
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          ) : croppedImage ? (
            /* Show cropped result */
            <div className="aspect-[3/4] max-h-[50vh] flex items-center justify-center bg-gray-900 p-2">
              <img src={croppedImage} alt="Cropped sticker" className="max-w-full max-h-full object-contain rounded" />
            </div>
          ) : rawImage ? (
            /* Crop mode */
            <div
              ref={cropContainerRef}
              className="relative aspect-[4/3] max-h-[50vh] overflow-hidden touch-none"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <img src={rawImage} alt="Raw capture" className="w-full h-full object-contain" />
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
                className="absolute border-2 border-white cursor-move"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                }}
                onPointerDown={(e) => handlePointerDown(e, "move")}
              >
                {/* Corner guides */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white" />
                {/* Resize handle (bottom-right) */}
                <div
                  className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-tl-md cursor-se-resize"
                  onPointerDown={(e) => handlePointerDown(e, "resize")}
                />
              </div>
              <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/70 pointer-events-none">
                Arrastrá el recuadro para ajustar el recorte
              </p>
            </div>
          ) : (
            /* Camera preview */
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-[4/3] object-cover"
              />
              <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/60">
                Centrá la figurita y capturá
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 py-3 flex gap-2 border-t border-white/10">
          {croppedImage ? (
            <>
              <button
                onClick={() => setCroppedImage(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/15 transition-colors"
              >
                ← Ajustar recorte
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-sticker-green text-white hover:bg-sticker-green/80 transition-colors"
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
                  // Restart camera
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
                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/15 transition-colors"
              >
                🔄 Otra foto
              </button>
              <button
                onClick={applyCrop}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-white text-black hover:bg-white/90 transition-colors"
              >
                ✂️ Recortar
              </button>
            </>
          ) : (
            <>
              <label className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/15 transition-colors text-center cursor-pointer">
                📁 Galería
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
              <button
                onClick={takePhoto}
                disabled={!!error}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-40"
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
