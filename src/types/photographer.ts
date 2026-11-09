export type PhotoCategory = 'portrait' | 'wedding' | 'street' | 'fashion' | 'landscape' | 'commercial';

export interface PhotoExif {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  location?: string;
  year?: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: PhotoCategory;
  url: string;
  description?: string;
  exif?: PhotoExif;
  featured?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  order: number;
}

export interface PhotographerProfile {
  name: string;
  tagline: string;
  headline: string;
  shortBio: string;
  fullBio: string[];
  avatarUrl: string;
  heroBannerUrl: string;
  experienceYears: number;
  completedShoots: number;
  countriesVisited: number;
  awardsCount: number;
  philosophy: string;
  gear?: string[];
}

export interface ContactInfo {
  telegramUsername: string; // e.g. "alexey_photo"
  whatsappPhone: string;    // e.g. "+79161234567"
  phone: string;            // e.g. "+7 (916) 123-45-67"
  email: string;            // e.g. "mironov.photo@gmail.com"
  instagram: string;        // e.g. "@mironov_visuals"
  vk: string;               // e.g. "vk.com/mironov_visuals"
  city: string;             // e.g. "Москва & Санкт-Петербург"
  defaultMessage: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  duration: string;
  photosCount: string;
  turnaroundTime: string;
  features: string[];
  popular?: boolean;
}

export interface BookingRequest {
  id: string;
  name: string;
  phoneOrMessenger: string;
  contactType: 'telegram' | 'whatsapp' | 'phone';
  packageId?: string;
  date?: string;
  message?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'completed';
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  shootType?: string;
  text: string;
  rating?: number;
  date: string;
  photos?: string[];
}

export interface PhotographerSiteData {
  profile: PhotographerProfile;
  photos: PhotoItem[];
  contacts: ContactInfo;
  packages: ServicePackage[];
  bookings: BookingRequest[];
  testimonials: TestimonialItem[];
  adminPin: string;
}
