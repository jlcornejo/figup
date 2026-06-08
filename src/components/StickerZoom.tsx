"use client";

interface StickerZoomProps {
  code: string;
  image: string;
  onClose: () => void;
  onRetake: () => void;
  onDelete: () => void;
}

export function StickerZoom({ code, image, onClose, onRetake, onDelete }: StickerZoomProps) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full bg-[#1e1b3a] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
          <h3 className="text-sm font-bold text-white">{code}</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none">
            ✕
          </button>
        </div>

        {/* Image */}
        <div className="p-3 bg-black flex items-center justify-center min-h-[300px] max-h-[60vh]">
          <img
            src={image}
            alt={code}
            className="max-w-full max-h-[55vh] object-contain rounded-lg"
          />
        </div>

        {/* Actions */}
        <div className="px-4 py-3 flex gap-2 border-t border-white/10">
          <button
            onClick={onDelete}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
          >
            🗑️ Eliminar
          </button>
          <button
            onClick={onRetake}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/15 transition-colors"
          >
            📷 Retomar
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-xs font-bold bg-white/10 text-white hover:bg-white/15 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
