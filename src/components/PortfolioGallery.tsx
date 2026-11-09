import React, { useState } from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import { PhotoItem, PhotoCategory } from '../types/photographer';
import { PhotoLightbox } from './PhotoLightbox';
import { Plus, Eye } from 'lucide-react';

interface PortfolioGalleryProps {
  onOpenAdmin: () => void;
  onBookShoot: (title: string) => void;
}

const CATEGORIES: { id: PhotoCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Все работы' },
  { id: 'portrait', label: 'Портреты' },
  { id: 'wedding', label: 'Свадьбы & Love Story' },
  { id: 'fashion', label: 'Fashion & Editorial' },
  { id: 'street', label: 'Street & Город' },
  { id: 'landscape', label: 'Пейзажи & Travel' }
];

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  onOpenAdmin,
  onBookShoot
}) => {
  const { data, isAdmin } = usePhotographer();
  const [activeCategory, setActiveCategory] = useState<PhotoCategory | 'all'>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const filteredPhotos = activeCategory === 'all'
    ? data.photos
    : data.photos.filter((p) => p.category === activeCategory);

  const activePhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  const handleNext = () => {
    if (selectedPhotoIndex !== null && filteredPhotos.length > 0) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex !== null && filteredPhotos.length > 0) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  return (
    <section id="portfolio" className="py-24 relative bg-black text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono uppercase tracking-widest mb-3">
              <span>02 / ПОРТФОЛИО</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
              Галерея избранных работ
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl font-light">
              Черно-белая и цветная фотография в авторском видении. Свет, архитектура кадра и глубина эмоций.
            </p>
          </div>

          {/* Admin action button */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить фото в портфолио</span>
            </button>
          )}
        </div>

        {/* Category Filters (Clean Monochrome) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
            {CATEGORIES.map((cat) => {
              const count = cat.id === 'all'
                ? data.photos.length
                : data.photos.filter((p) => p.category === cat.id).length;

              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-zinc-200 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-zinc-850">
            <p className="text-zinc-400 text-base">В этой категории пока нет опубликованных работ.</p>
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="mt-4 px-4 py-2 bg-white text-black rounded-xl text-xs font-bold uppercase"
              >
                Добавить работу
              </button>
            )}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850 hover:border-zinc-600 transition-all duration-300 break-inside-avoid shadow-xl cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-auto">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-auto object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  {photo.featured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-black shadow-md font-mono">
                      Featured
                    </span>
                  )}
                  {photo.exif?.camera && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-zinc-300 border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {photo.exif.camera.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Quick eye icon on top right */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 rounded-full bg-black/80 text-white border border-zinc-700 shadow-lg">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-white leading-snug uppercase tracking-wider">
                    {photo.title}
                  </h3>
                  {photo.exif?.location && (
                    <p className="text-xs text-zinc-300 mt-1 font-mono">
                      📍 {photo.exif.location}
                    </p>
                  )}
                  {photo.exif && (
                    <div className="text-[11px] text-zinc-400 mt-2 font-mono flex items-center gap-2">
                      <span>{photo.exif.lens}</span>
                      {photo.exif.aperture && <span>• {photo.exif.aperture}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        <PhotoLightbox
          photo={activePhoto}
          onClose={() => setSelectedPhotoIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
          onBookShoot={onBookShoot}
        />

      </div>
    </section>
  );
};
