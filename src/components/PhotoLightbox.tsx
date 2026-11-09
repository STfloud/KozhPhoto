import React, { useEffect, useCallback } from 'react';
import { PhotoItem } from '../types/photographer';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, Calendar, Aperture, Eye, ArrowUpRight } from 'lucide-react';

interface PhotoLightboxProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onBookShoot: (photoTitle: string) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  onClose,
  onNext,
  onPrev,
  onBookShoot
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (!photo) return;
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [photo, handleKeyDown]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in select-none">
      {/* Top action bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-zinc-300">
        <div className="flex items-center gap-3">
          <span className="font-editorial text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
            {photo.title}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700 uppercase tracking-widest font-mono text-[10px]">
            {photo.category}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-all cursor-pointer backdrop-blur-sm"
        aria-label="Предыдущее фото"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-all cursor-pointer backdrop-blur-sm"
        aria-label="Следующее фото"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div className="max-w-6xl max-h-[84vh] w-full h-full flex flex-col md:flex-row items-center justify-center p-4 sm:p-8 gap-6">
        <div className="relative flex-1 h-full max-h-[78vh] flex items-center justify-center overflow-hidden">
          <img
            src={photo.url}
            alt={photo.title}
            className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
          />
        </div>

        {/* Sidebar / Info Drawer */}
        <div className="w-full md:w-80 bg-zinc-950/95 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4 text-xs text-zinc-300 shadow-2xl shrink-0">
          <div>
            <h4 className="font-editorial text-xl font-bold text-white uppercase tracking-wider mb-2">
              {photo.title}
            </h4>
            {photo.description && (
              <p className="text-zinc-400 leading-relaxed font-light">{photo.description}</p>
            )}
          </div>

          <div className="h-px bg-zinc-800" />

          {/* EXIF Metadata */}
          {photo.exif && (
            <div className="space-y-2.5 font-mono text-[11px]">
              <div className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                EXIF & ПАРАМЕТРЫ СЪЕМКИ
              </div>

              {photo.exif.camera && (
                <div className="flex items-center gap-2 text-zinc-200">
                  <Camera className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>Камера: <strong className="text-white">{photo.exif.camera}</strong></span>
                </div>
              )}

              {photo.exif.lens && (
                <div className="flex items-center gap-2 text-zinc-200">
                  <Eye className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>Оптика: {photo.exif.lens}</span>
                </div>
              )}

              {(photo.exif.aperture || photo.exif.shutterSpeed || photo.exif.iso) && (
                <div className="flex items-center gap-2 text-zinc-200">
                  <Aperture className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>
                    {[photo.exif.aperture, photo.exif.shutterSpeed, photo.exif.iso ? `ISO ${photo.exif.iso}` : '']
                      .filter(Boolean)
                      .join(' • ')}
                  </span>
                </div>
              )}

              {photo.exif.location && (
                <div className="flex items-center gap-2 text-zinc-200">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>Локация: {photo.exif.location}</span>
                </div>
              )}

              {photo.exif.year && (
                <div className="flex items-center gap-2 text-zinc-200">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>Год: {photo.exif.year}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-auto pt-4">
            <button
              onClick={() => {
                onClose();
                onBookShoot(`Съемка по референсу «${photo.title}»`);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider text-xs transition-all shadow-lg cursor-pointer"
            >
              <span>Хочу такую же съемку</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
