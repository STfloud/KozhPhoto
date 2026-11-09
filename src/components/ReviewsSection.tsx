import React, { useState } from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import { Star, MessageSquare, Plus, Upload, X, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { data, isAdmin, addTestimonial, deleteTestimonial, showToast } = usePhotographer();
  const { testimonials = [] } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [shootType, setShootType] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [activePhotoPreview, setActivePhotoPreview] = useState<string | null>(null);

  // File upload for photos
  const handlePhotoFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length + files.length > 4) {
      showToast('Можно прикрепить максимум 4 фотографии к отзыву', 'error');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        showToast(`Файл ${file.name} слишком большой (макс. 8 МБ)`, 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotos((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPhotoByUrl = () => {
    if (!photoUrlInput.trim()) return;
    if (photos.length >= 4) {
      showToast('Максимум 4 фотографии', 'error');
      return;
    }
    setPhotos([...photos, photoUrlInput.trim()]);
    setPhotoUrlInput('');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !text.trim()) {
      showToast('Пожалуйста, укажите имя и текст отзыва', 'error');
      return;
    }

    addTestimonial({
      authorName: authorName.trim(),
      shootType: shootType.trim() || 'Индивидуальная съемка',
      text: text.trim(),
      rating,
      photos: photos.length > 0 ? photos : undefined
    });

    // Reset form
    setAuthorName('');
    setShootType('');
    setText('');
    setRating(5);
    setPhotos([]);
    setIsModalOpen(false);
  };

  return (
    <section id="reviews" className="py-24 relative bg-black text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono uppercase tracking-widest mb-3">
              <span>04 / ВПЕЧАТЛЕНИЯ</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
              Отзывы клиентов
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl font-light">
              Искренние слова людей, доверивших мне запечатлеть важные моменты своей жизни.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Оставить отзыв</span>
          </button>
        </div>

        {/* Reviews Grid */}
        {testimonials.length === 0 ? (
          <div className="text-center py-16 bg-zinc-950 rounded-2xl border border-zinc-850">
            <p className="text-zinc-400 text-base">Отзывов пока нет. Будьте первыми!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-white text-black rounded-xl text-xs font-bold uppercase"
            >
              Написать отзыв
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 flex flex-col justify-between transition-all relative group"
              >
                {/* Admin delete button */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`Удалить отзыв от «${item.authorName}»?`)) {
                        deleteTestimonial(item.id);
                      }
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Удалить отзыв (Панель автора)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div>
                  {/* Stars & Date */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-white">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {item.date}
                    </span>
                  </div>

                  {/* Review text */}
                  <p className="text-zinc-300 text-sm leading-relaxed font-light mb-6">
                    «{item.text}»
                  </p>
                </div>

                <div>
                  {/* Attached Photos */}
                  {item.photos && item.photos.length > 0 && (
                    <div className="mb-5 pt-3 border-t border-zinc-900">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                        Фото со съемки:
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {item.photos.map((photoUrl, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => setActivePhotoPreview(photoUrl)}
                            className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-500 cursor-pointer shrink-0 transition-transform hover:scale-105"
                          >
                            <img
                              src={photoUrl}
                              alt="Фото к отзыву"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Author Meta */}
                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                    <div>
                      <div className="font-editorial text-base font-bold text-white uppercase tracking-wider">
                        {item.authorName}
                      </div>
                      {item.shootType && (
                        <div className="text-xs text-zinc-400 font-mono mt-0.5">
                          {item.shootType}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Leave Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 border-b border-zinc-850 pb-4">
              <h3 className="font-editorial text-2xl font-bold uppercase tracking-wider text-white">
                Оставить отзыв
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Поделитесь вашими впечатлениями от совместной работы и прикрепите кадры
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  Ваше имя или имена <span className="text-white">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Например: Анна и Сергей"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  Формат съемки
                </label>
                <input
                  type="text"
                  value={shootType}
                  onChange={(e) => setShootType(e.target.value)}
                  placeholder="Например: Свадебная съемка / Love Story"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  Оценка
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-white text-white' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  Текст отзыва <span className="text-white">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Как прошла съемка, насколько комфортно вам было, довольны ли результатом?.."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 resize-none"
                />
              </div>

              {/* Attach Photos Section */}
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-850 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Прикрепить фотографии (до 4 шт.)</span>
                  </label>
                  <span className="text-[11px] font-mono text-zinc-500">{photos.length}/4</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-xs font-mono text-zinc-200 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Загрузить фото с устройства</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoFiles}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Or enter URL */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    placeholder="Или ссылка на фото..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoByUrl}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Добавить
                  </button>
                </div>

                {/* Previews */}
                {photos.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    {photos.map((p, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-700">
                        <img src={p} alt="Прикрепленное фото" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold hover:bg-zinc-800"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider"
                >
                  Опубликовать отзыв
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Zoom Modal */}
      {activePhotoPreview && (
        <div
          onClick={() => setActivePhotoPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in cursor-zoom-out"
        >
          <img
            src={activePhotoPreview}
            alt="Увеличенное фото"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

    </section>
  );
};
