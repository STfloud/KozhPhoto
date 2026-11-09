import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PhotographerSiteData,
  PhotoItem,
  PhotographerProfile,
  ContactInfo,
  ServicePackage,
  BookingRequest,
  TestimonialItem
} from '../types/photographer';
import { INITIAL_PHOTOGRAPHER_DATA } from '../data/initialData';

const STORAGE_KEY = 'mironov_photographer_site_data_v2';
const AUTH_KEY = 'mironov_photographer_admin_auth';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface PhotographerContextType {
  data: PhotographerSiteData;
  isAdmin: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (newPin: string) => void;
  updateProfile: (profile: Partial<PhotographerProfile>) => void;
  updateContacts: (contacts: Partial<ContactInfo>) => void;
  updatePackage: (pkg: ServicePackage) => void;
  addPackage: (pkg: ServicePackage) => void;
  deletePackage: (id: string) => void;
  addPhoto: (photo: Omit<PhotoItem, 'id' | 'order'>) => void;
  updatePhoto: (photo: PhotoItem) => void;
  deletePhoto: (id: string) => void;
  reorderPhotos: (newPhotos: PhotoItem[]) => void;
  addBooking: (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
  deleteBooking: (id: string) => void;
  addTestimonial: (testimonial: Omit<TestimonialItem, 'id' | 'date'>) => void;
  deleteTestimonial: (id: string) => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const PhotographerContext = createContext<PhotographerContextType | undefined>(undefined);

export const PhotographerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PhotographerSiteData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PHOTOGRAPHER_DATA,
          ...parsed,
          profile: { ...INITIAL_PHOTOGRAPHER_DATA.profile, ...(parsed.profile || {}) },
          contacts: { ...INITIAL_PHOTOGRAPHER_DATA.contacts, ...(parsed.contacts || {}) },
          testimonials: parsed.testimonials && parsed.testimonials.length > 0
            ? parsed.testimonials
            : INITIAL_PHOTOGRAPHER_DATA.testimonials
        };
      }
    } catch (e) {
      console.error('Failed to load saved photographer data:', e);
    }
    return INITIAL_PHOTOGRAPHER_DATA;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [data]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loginAdmin = (pin: string): boolean => {
    const valid = pin.trim() === (data.adminPin || 'photo2025');
    if (valid) {
      setIsAdmin(true);
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch {}
      showToast('Вход в панель управления выполнен', 'success');
      return true;
    }
    showToast('Неверный пароль', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
    showToast('Вы вышли из режима редактирования', 'info');
  };

  const updateAdminPin = (newPin: string) => {
    setData((prev) => ({ ...prev, adminPin: newPin.trim() }));
    showToast('Пароль администратора изменен', 'success');
  };

  const updateProfile = (profileUpdate: Partial<PhotographerProfile>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate }
    }));
    showToast('Информация о фотографе сохранена', 'success');
  };

  const updateContacts = (contactsUpdate: Partial<ContactInfo>) => {
    setData((prev) => ({
      ...prev,
      contacts: { ...prev.contacts, ...contactsUpdate }
    }));
    showToast('Контакты обновлены', 'success');
  };

  const updatePackage = (pkg: ServicePackage) => {
    setData((prev) => ({
      ...prev,
      packages: prev.packages.map((p) => (p.id === pkg.id ? pkg : p))
    }));
    showToast(`Пакет «${pkg.title}» обновлен`, 'success');
  };

  const addPackage = (pkg: ServicePackage) => {
    setData((prev) => ({
      ...prev,
      packages: [...prev.packages, pkg]
    }));
    showToast(`Пакет «${pkg.title}» добавлен`, 'success');
  };

  const deletePackage = (id: string) => {
    setData((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p.id !== id)
    }));
    showToast('Пакет услуг удален', 'info');
  };

  const addPhoto = (photoInput: Omit<PhotoItem, 'id' | 'order'>) => {
    const newId = 'p-' + Date.now();
    const newPhoto: PhotoItem = {
      ...photoInput,
      id: newId,
      order: data.photos.length + 1
    };
    setData((prev) => ({
      ...prev,
      photos: [newPhoto, ...prev.photos]
    }));
    showToast('Фотография добавлена в портфолио', 'success');
  };

  const updatePhoto = (photo: PhotoItem) => {
    setData((prev) => ({
      ...prev,
      photos: prev.photos.map((p) => (p.id === photo.id ? photo : p))
    }));
    showToast('Фотография обновлена', 'success');
  };

  const deletePhoto = (id: string) => {
    setData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id)
    }));
    showToast('Фотография удалена', 'info');
  };

  const reorderPhotos = (newPhotos: PhotoItem[]) => {
    setData((prev) => ({
      ...prev,
      photos: newPhotos.map((p, idx) => ({ ...p, order: idx + 1 }))
    }));
  };

  const addBooking = (bookingInput: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: BookingRequest = {
      ...bookingInput,
      id: 'b-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'new'
    };
    setData((prev) => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings]
    }));
    showToast('Заявка на съемку отправлена!', 'success');
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status']) => {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === id ? { ...b, status } : b))
    }));
    showToast('Статус заявки изменен', 'info');
  };

  const deleteBooking = (id: string) => {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings.filter((b) => b.id !== id)
    }));
    showToast('Заявка удалена', 'info');
  };

  const addTestimonial = (input: Omit<TestimonialItem, 'id' | 'date'>) => {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    const now = new Date();
    const dateStr = `${months[now.getMonth()]} ${now.getFullYear()}`;

    const newTestimonial: TestimonialItem = {
      ...input,
      id: 't-' + Date.now(),
      date: dateStr
    };
    setData((prev) => ({
      ...prev,
      testimonials: [newTestimonial, ...(prev.testimonials || [])]
    }));
    showToast('Спасибо за ваш отзыв! Он успешно опубликован.', 'success');
  };

  const deleteTestimonial = (id: string) => {
    setData((prev) => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter((t) => t.id !== id)
    }));
    showToast('Отзыв удален', 'info');
  };

  const resetToDefaults = () => {
    setData(INITIAL_PHOTOGRAPHER_DATA);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Данные сброшены к начальным значениям', 'info');
  };

  const exportDataJson = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed && parsed.profile && parsed.photos) {
        setData(parsed);
        showToast('Данные импортированы из файла!', 'success');
        return true;
      }
      throw new Error('Invalid format');
    } catch {
      showToast('Ошибка при чтении файла', 'error');
      return false;
    }
  };

  return (
    <PhotographerContext.Provider
      value={{
        data,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        updateAdminPin,
        updateProfile,
        updateContacts,
        updatePackage,
        addPackage,
        deletePackage,
        addPhoto,
        updatePhoto,
        deletePhoto,
        reorderPhotos,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        addTestimonial,
        deleteTestimonial,
        resetToDefaults,
        exportDataJson,
        importDataJson,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </PhotographerContext.Provider>
  );
};

export const usePhotographer = () => {
  const context = useContext(PhotographerContext);
  if (!context) {
    throw new Error('usePhotographer must be used within PhotographerProvider');
  }
  return context;
};
