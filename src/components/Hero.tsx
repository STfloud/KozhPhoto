import React from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import { ArrowDown, MessageCircle, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { data } = usePhotographer();
  const { profile, contacts } = data;

  const telegramUrl = contacts.telegramUsername.startsWith('http')
    ? contacts.telegramUsername
    : `https://t.me/${contacts.telegramUsername.replace('@', '')}?text=${encodeURIComponent(
        contacts.defaultMessage
      )}`;

  const whatsappUrl = `https://wa.me/${contacts.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    contacts.defaultMessage
  )}`;

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-black text-white">
      {/* Background Banner with deep black monochrome overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={profile.heroBannerUrl}
          alt="Photographer Editorial Backdrop"
          className="w-full h-full object-cover object-center filter grayscale contrast-[1.2] brightness-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center flex flex-col items-center">
        {/* Availability Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-zinc-300 text-xs sm:text-sm font-mono tracking-wider uppercase mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Открыта запись на сезон 2026 • {contacts.city}</span>
        </div>

        {/* Photographer Avatar with crisp monochrome frame */}
        <div className="relative mb-8 group">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-b from-zinc-500 to-zinc-900 shadow-2xl">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full rounded-full object-cover object-top filter grayscale contrast-115 group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Headline & Name */}
        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08] mb-4 uppercase">
          {profile.name}
        </h1>

        <p className="text-zinc-400 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase mb-6">
          {profile.tagline}
        </p>

        <p className="text-zinc-300 text-base sm:text-xl font-light max-w-2xl leading-relaxed mb-10">
          {profile.headline}
        </p>

        {/* Action Buttons (Monochrome: White, Zinc, Black) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16 w-full max-w-lg">
          <button
            onClick={onOpenBooking}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-lg"
          >
            <span>Забронировать съемку</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Telegram</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl pt-8 border-t border-zinc-800/80">
          <div className="text-center p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850">
            <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
              {profile.experienceYears}+
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 uppercase tracking-wider font-mono">
              Лет в профессии
            </div>
          </div>

          <div className="text-center p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850">
            <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
              {profile.completedShoots}+
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 uppercase tracking-wider font-mono">
              Проведенных съемок
            </div>
          </div>

          <div className="text-center p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850">
            <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
              {profile.countriesVisited}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 uppercase tracking-wider font-mono">
              Стран для съемок
            </div>
          </div>

          <div className="text-center p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850">
            <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
              {profile.awardsCount}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 uppercase tracking-wider font-mono">
              Наград и публикаций
            </div>
          </div>
        </div>

        {/* Down Indicator */}
        <a
          href="#about"
          className="mt-12 flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group cursor-pointer"
        >
          <span className="text-[10px] uppercase tracking-widest font-mono">Листать вниз</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-zinc-400 group-hover:text-white" />
        </a>
      </div>
    </section>
  );
};
