import React, { useState } from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import {
  PhotoItem,
  PhotoCategory,
  ServicePackage,
  PhotographerProfile,
  ContactInfo
} from '../types/photographer';
import {
  Lock,
  Unlock,
  X,
  Plus,
  Trash2,
  Edit2,
  Image,
  FileText,
  Phone,
  DollarSign,
  Users,
  Settings,
  Upload,
  MoveUp,
  MoveDown,
  LogOut,
  Download,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Star,
  GitBranch,
  Copy,
  Check
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'photos' | 'texts' | 'contacts' | 'pricing' | 'bookings' | 'reviews' | 'settings';

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    data,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    updateAdminPin,
    updateProfile,
    updateContacts,
    updatePackage,
    addPhoto,
    updatePhoto,
    deletePhoto,
    reorderPhotos,
    updateBookingStatus,
    deleteBooking,
    deleteTestimonial,
    resetToDefaults,
    exportDataJson,
    importDataJson,
    showToast
  } = usePhotographer();

  const [activeTab, setActiveTab] = useState<AdminTab>('photos');
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Editing photo state
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoForm, setPhotoForm] = useState<Omit<PhotoItem, 'id' | 'order'>>({
    title: '',
    category: 'portrait',
    url: '',
    description: '',
    featured: false,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: '85mm f/1.4 GM',
      aperture: 'f/1.8',
      shutterSpeed: '1/250s',
      iso: '100',
      location: 'Москва',
      year: '2026'
    }
  });

  const [profileForm, setProfileForm] = useState<PhotographerProfile>(data.profile);
  const [contactsForm, setContactsForm] = useState<ContactInfo>(data.contacts);

  React.useEffect(() => {
    setProfileForm(data.profile);
    setContactsForm(data.contacts);
  }, [data]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Файл слишком большой (макс. 8 МБ)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoForm((prev) => ({ ...prev, url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setProfileForm((prev) => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title.trim() || !photoForm.url.trim()) {
      showToast('Укажите название и фотографию', 'error');
      return;
    }

    if (editingPhoto) {
      updatePhoto({
        ...photoForm,
        id: editingPhoto.id,
        order: editingPhoto.order
      });
      setEditingPhoto(null);
    } else {
      addPhoto(photoForm);
      setIsAddingPhoto(false);
    }

    setPhotoForm({
      title: '',
      category: 'portrait',
      url: '',
      description: '',
      featured: false,
      exif: {
        camera: 'Sony Alpha 7R V',
        lens: '85mm f/1.4 GM',
        location: 'Москва',
        year: '2026'
      }
    });
  };

  const handleMovePhoto = (index: number, direction: 'up' | 'down') => {
    const newPhotos = [...data.photos];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newPhotos.length) return;
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIdx];
    newPhotos[targetIdx] = temp;
    reorderPhotos(newPhotos);
  };

  // Generate TypeScript code for initialData.ts
  const generateInitialDataTs = () => {
    return `import { PhotographerSiteData } from '../types/photographer';\n\nexport const INITIAL_PHOTOGRAPHER_DATA: PhotographerSiteData = ${JSON.stringify(
      data,
      null,
      2
    )};\n`;
  };

  const handleDownloadGitFile = () => {
    const tsCode = generateInitialDataTs();
    const blob = new Blob([tsCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'initialData.ts';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Файл initialData.ts для Git скачан!', 'success');
  };

  const handleCopyGitCode = () => {
    const tsCode = generateInitialDataTs();
    navigator.clipboard.writeText(tsCode);
    setCopiedCode(true);
    showToast('Код initialData.ts скопирован в буфер!', 'info');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `photographer-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Резервная копия сохранена', 'success');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        importDataJson(text);
      };
      reader.readAsText(file);
    }
  };

  // Auth screen if not logged in
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in text-white">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="font-editorial text-2xl font-bold text-center text-white uppercase tracking-wider mb-1">
            Вход для автора
          </h3>
          <p className="text-xs text-zinc-400 text-center mb-6 font-light">
            Авторизуйтесь для управления фотографиями, текстами и отзывами
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginAdmin(pinInput);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                Пароль администратора
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Введите пароль"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Войти в панель управления
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-fade-in text-white">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-850 bg-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  Панель автора
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block font-light">
                Управление фото, биографией, прайсом, отзывами и заявками
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Выйти</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-zinc-850 bg-zinc-900/60 px-4 gap-1 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => {
              setActiveTab('photos');
              setIsAddingPhoto(false);
              setEditingPhoto(null);
            }}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'photos'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Фотографии ({data.photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('texts')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'texts'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Биография & Тексты</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Отзывы ({data.testimonials?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'contacts'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Контакты</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pricing'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Прайс-лист</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Заявки ({data.bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Настройки & Git</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB: PHOTOS */}
          {activeTab === 'photos' && (
            <div>
              {isAddingPhoto || editingPhoto ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                    <h4 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                      {editingPhoto ? 'Редактировать работу' : 'Добавить новую работу'}
                    </h4>
                    <button
                      onClick={() => {
                        setIsAddingPhoto(false);
                        setEditingPhoto(null);
                      }}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Отмена
                    </button>
                  </div>

                  <form onSubmit={handleSavePhoto} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                        Изображение (Загрузка файла или URL) <span className="text-white">*</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          required
                          value={photoForm.url}
                          onChange={(e) => setPhotoForm({ ...photoForm, url: e.target.value })}
                          placeholder="https://... или data:image/..."
                          className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-500"
                        />
                        <label className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono uppercase tracking-wider cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Файл с диска</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                      </div>

                      {photoForm.url && (
                        <div className="mt-3 w-28 h-20 rounded-xl overflow-hidden border border-zinc-700 bg-black">
                          <img src={photoForm.url} alt="Превью" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                          Название <span className="text-white">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={photoForm.title}
                          onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                          Категория
                        </label>
                        <select
                          value={photoForm.category}
                          onChange={(e) =>
                            setPhotoForm({ ...photoForm, category: e.target.value as PhotoCategory })
                          }
                          className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-500 cursor-pointer"
                        >
                          <option value="portrait">Портреты</option>
                          <option value="wedding">Свадьбы & Love Story</option>
                          <option value="fashion">Fashion & Editorial</option>
                          <option value="street">Street & Город</option>
                          <option value="landscape">Пейзажи & Travel</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                        Описание
                      </label>
                      <textarea
                        rows={2}
                        value={photoForm.description || ''}
                        onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-500 resize-none"
                      />
                    </div>

                    {/* EXIF */}
                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-800 space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                        Параметры съемки (EXIF)
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          value={photoForm.exif?.camera || ''}
                          onChange={(e) =>
                            setPhotoForm({
                              ...photoForm,
                              exif: { ...photoForm.exif, camera: e.target.value }
                            })
                          }
                          placeholder="Камера (Sony A7R V)"
                          className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          value={photoForm.exif?.lens || ''}
                          onChange={(e) =>
                            setPhotoForm({
                              ...photoForm,
                              exif: { ...photoForm.exif, lens: e.target.value }
                            })
                          }
                          placeholder="Объектив (85mm f/1.4)"
                          className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          value={photoForm.exif?.location || ''}
                          onChange={(e) =>
                            setPhotoForm({
                              ...photoForm,
                              exif: { ...photoForm.exif, location: e.target.value }
                            })
                          }
                          placeholder="Локация"
                          className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          value={photoForm.exif?.year || ''}
                          onChange={(e) =>
                            setPhotoForm({
                              ...photoForm,
                              exif: { ...photoForm.exif, year: e.target.value }
                            })
                          }
                          placeholder="Год"
                          className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={photoForm.featured || false}
                        onChange={(e) => setPhotoForm({ ...photoForm, featured: e.target.checked })}
                        className="accent-white"
                      />
                      <label htmlFor="featured" className="text-xs text-zinc-300">
                        Пометить как Featured (Избранное)
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingPhoto(false);
                          setEditingPhoto(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider"
                      >
                        {editingPhoto ? 'Сохранить' : 'Опубликовать в портфолио'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                        Работы в портфолио
                      </h4>
                      <p className="text-xs text-zinc-400 font-light">
                        Добавляйте новые кадры, меняйте порядок показа и редактируйте подписи
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingPhoto(null);
                        setIsAddingPhoto(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Добавить фото</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0">
                          <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-sm text-white truncate uppercase tracking-wide">
                              {photo.title}
                            </h5>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black text-zinc-300 border border-zinc-800">
                              {photo.category}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5 font-mono truncate">
                            {photo.exif?.camera} • {photo.exif?.location}
                          </div>
                        </div>

                        {/* Order */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMovePhoto(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMovePhoto(index, 'down')}
                            disabled={index === data.photos.length - 1}
                            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingPhoto(photo);
                              setPhotoForm({
                                title: photo.title,
                                category: photo.category,
                                url: photo.url,
                                description: photo.description || '',
                                featured: photo.featured || false,
                                exif: { ...photo.exif }
                              });
                              setIsAddingPhoto(true);
                            }}
                            className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Удалить фотографию «${photo.title}»?`)) {
                                deletePhoto(photo.id);
                              }
                            }}
                            className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: REVIEWS (TESTIMONIALS MANAGEMENT) */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="border-b border-zinc-850 pb-3">
                <h4 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                  Управление отзывами клиентов
                </h4>
                <p className="text-xs text-zinc-400 font-light">
                  Здесь отображаются все отзывы, оставленные на сайте. Вы можете удалить нежелательные или спамные отзывы.
                </p>
              </div>

              {(!data.testimonials || data.testimonials.length === 0) ? (
                <div className="py-12 text-center text-zinc-500 text-xs font-mono">
                  Отзывов пока нет.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white uppercase tracking-wider">
                            {t.authorName}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black text-zinc-300">
                            {t.shootType}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {t.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-white py-0.5">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-white text-white" />
                          ))}
                        </div>

                        <p className="text-xs text-zinc-300 font-light leading-relaxed">
                          «{t.text}»
                        </p>

                        {t.photos && t.photos.length > 0 && (
                          <div className="flex items-center gap-2 pt-2">
                            {t.photos.map((p, idx) => (
                              <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-700">
                                <img src={p} alt="Фото" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Удалить отзыв от «${t.authorName}»?`)) {
                            deleteTestimonial(t.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-zinc-750 transition-colors cursor-pointer self-start"
                        title="Удалить отзыв"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: TEXTS & BIO */}
          {activeTab === 'texts' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="border-b border-zinc-850 pb-3">
                <h4 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                  Биография и описания
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                    Имя фотографа
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                    Слоган / Специализация
                  </label>
                  <input
                    type="text"
                    value={profileForm.tagline}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              {/* Avatar & Hero Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                    Фотография портрета (URL или файл)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={profileForm.avatarUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs"
                    />
                    <label className="p-2 rounded-xl bg-zinc-800 text-white cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                    Фоновый баннер Hero (URL)
                  </label>
                  <input
                    type="text"
                    value={profileForm.heroBannerUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, heroBannerUrl: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                  Главный заголовок (Headline)
                </label>
                <input
                  type="text"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                  Краткое описание (Short Bio)
                </label>
                <textarea
                  rows={2}
                  value={profileForm.shortBio}
                  onChange={(e) => setProfileForm({ ...profileForm, shortBio: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                  Манифест / Философия
                </label>
                <textarea
                  rows={2}
                  value={profileForm.philosophy}
                  onChange={(e) => setProfileForm({ ...profileForm, philosophy: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-500 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => updateProfile(profileForm)}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider"
                >
                  Сохранить тексты
                </button>
              </div>
            </div>
          )}

          {/* TAB: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="border-b border-zinc-850 pb-3">
                <h4 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                  Контакты и мессенджеры
                </h4>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                  Telegram (@username или ссылка)
                </label>
                <input
                  type="text"
                  value={contactsForm.telegramUsername}
                  onChange={(e) => setContactsForm({ ...contactsForm, telegramUsername: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                  WhatsApp (номер с кодом)
                </label>
                <input
                  type="text"
                  value={contactsForm.whatsappPhone}
                  onChange={(e) => setContactsForm({ ...contactsForm, whatsappPhone: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                    Телефон
                  </label>
                  <input
                    type="text"
                    value={contactsForm.phone}
                    onChange={(e) => setContactsForm({ ...contactsForm, phone: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactsForm.email}
                    onChange={(e) => setContactsForm({ ...contactsForm, email: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => updateContacts(contactsForm)}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider"
                >
                  Сохранить контакты
                </button>
              </div>
            </div>
          )}

          {/* TAB: PRICING */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="border-b border-zinc-850 pb-3">
                <h4 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                  Пакеты услуг и стоимость
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.packages.map((pkg) => (
                  <div key={pkg.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <input
                      type="text"
                      value={pkg.title}
                      onChange={(e) => updatePackage({ ...pkg, title: e.target.value })}
                      className="font-bold text-sm bg-transparent border-b border-zinc-700 text-white w-full uppercase tracking-wider"
                    />

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400">Стоимость</label>
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) => updatePackage({ ...pkg, price: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400">Длительность</label>
                        <input
                          type="text"
                          value={pkg.duration}
                          onChange={(e) => updatePackage({ ...pkg, duration: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-lg px-2 py-1 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-zinc-400">Опции пакета (по строкам)</label>
                      <textarea
                        rows={3}
                        value={pkg.features.join('\n')}
                        onChange={(e) =>
                          updatePackage({
                            ...pkg,
                            features: e.target.value.split('\n').filter((f) => f.trim())
                          })
                        }
                        className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="border-b border-zinc-850 pb-3">
                <h4 className="font-editorial text-lg font-bold uppercase tracking-wider text-white">
                  Заявки клиентов
                </h4>
              </div>

              {data.bookings.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs font-mono">
                  Заявок пока нет.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white uppercase">{booking.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black text-zinc-300">
                            {booking.phoneOrMessenger}
                          </span>
                        </div>
                        {booking.message && (
                          <p className="text-xs text-zinc-400 italic mt-1 font-light">«{booking.message}»</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value as any)}
                          className="bg-black border border-zinc-800 text-zinc-200 text-xs rounded-lg px-2 py-1 font-mono"
                        >
                          <option value="new">Новая</option>
                          <option value="contacted">В работе</option>
                          <option value="completed">Завершена</option>
                        </select>

                        <button
                          onClick={() => {
                            if (confirm('Удалить эту заявку?')) deleteBooking(booking.id);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SETTINGS & GIT HOSTING */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Git Hosting Explanation & Code Export */}
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-editorial text-base font-bold uppercase tracking-wider">
                  <GitBranch className="w-4 h-4" />
                  <span>Хостинг через Git (GitHub, Vercel, Netlify)</span>
                </div>
                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  <strong>Как это работает:</strong> Когда ваш друг редактирует фото, тексты или прайс прямо в браузере, все изменения <strong>мгновенно сохраняются в локальном хранилище (localStorage)</strong> на этом устройстве.
                </p>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Чтобы изменения стали постоянными <strong>для всех новых посетителей</strong> при хостинге через Git-репозиторий, достаточно нажать кнопку ниже: она сгенерирует обновленный файл <code>initialData.ts</code>, который нужно просто заменить в проекте и сделать <code>git commit & push</code>!
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={handleDownloadGitFile}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Скачать initialData.ts для Git</span>
                  </button>

                  <button
                    onClick={handleCopyGitCode}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-mono text-xs cursor-pointer border border-zinc-700"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Скопировано!' : 'Скопировать код для Git'}</span>
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <h5 className="font-editorial text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Смена пароля администратора</span>
                </h5>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Новый пароль"
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (newPin.trim().length < 3) {
                        showToast('Минимум 3 символа', 'error');
                        return;
                      }
                      updateAdminPin(newPin);
                      setNewPin('');
                    }}
                    className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider"
                  >
                    Обновить
                  </button>
                </div>
              </div>

              {/* JSON Backup */}
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <h5 className="font-editorial text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Резервная копия (JSON)</span>
                </h5>
                <div className="flex gap-3">
                  <button
                    onClick={handleDownloadBackup}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono cursor-pointer"
                  >
                    Скачать бэкап
                  </button>
                  <label className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono cursor-pointer">
                    Восстановить из файла
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Reset to defaults */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 space-y-3">
                <h5 className="text-sm font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Сброс к заводским настройкам</span>
                </h5>
                <button
                  onClick={() => {
                    if (confirm('Сбросить все изменения к эталонным данным?')) {
                      resetToDefaults();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono uppercase tracking-wider"
                >
                  Сбросить к начальным данным
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
