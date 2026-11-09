import React, { useState, useEffect } from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import { Camera, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onOpenBooking
}) => {
  const { data } = usePhotographer();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Биография', href: '#about', num: '01' },
    { label: 'Портфолио', href: '#portfolio', num: '02' },
    { label: 'Стоимость', href: '#pricing', num: '03' },
    { label: 'Отзывы', href: '#reviews', num: '04' },
    { label: 'Контакты', href: '#contacts', num: '05' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-zinc-850 py-4 shadow-xl'
            : 'bg-gradient-to-b from-black/95 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between">
            {/* Minimalist Logo / Photographer Brand */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-100 group-hover:border-zinc-500 transition-colors">
                <Camera className="w-4 h-4 text-zinc-300" />
              </div>
              <div>
                <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors uppercase">
                  {data.profile.name}
                </span>
                <span className="block text-[9px] tracking-[0.25em] text-zinc-500 uppercase font-medium">
                  Photography
                </span>
              </div>
            </a>

            {/* Right side controls: Booking CTA + Clean Hamburger Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-all cursor-pointer shadow-md"
              >
                <span>Записаться</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* Hamburger Button (Unified for all screens) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-all cursor-pointer"
                aria-label="Открыть меню навигации"
              >
                <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline">
                  {menuOpen ? 'Закрыть' : 'Меню'}
                </span>
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Minimalist Hamburger Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-12 animate-fade-in">
          {/* Top Bar of Drawer */}
          <div className="flex items-center justify-between border-b border-zinc-850 pb-6">
            <div className="flex items-center gap-2">
              <span className="font-editorial text-2xl font-bold uppercase tracking-wider text-white">
                {data.profile.name}
              </span>
            </div>

            <button
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
              aria-label="Закрыть меню"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="my-auto py-8 flex flex-col gap-6 max-w-xl">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-baseline gap-4 text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-zinc-400 hover:text-white transition-all py-1"
              >
                <span className="text-xs sm:text-sm font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  {link.num}
                </span>
                <span className="uppercase tracking-wide">{link.label}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 text-lg sm:text-2xl">
                  →
                </span>
              </a>
            ))}
          </nav>

          {/* Bottom Info in Drawer with subtle hidden admin access */}
          <div className="border-t border-zinc-850 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs text-zinc-400">
            <div className="space-y-1 font-mono text-[11px]">
              <div>{data.contacts.city}</div>
              <div>{data.contacts.phone}</div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenBooking();
                }}
                className="px-6 py-3 rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Забронировать дату
              </button>

              {/* Discreet admin link that blends seamlessly with the interface */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-zinc-700 hover:text-zinc-500 font-mono text-[11px] transition-colors p-2 cursor-pointer"
                title="Панель"
                aria-label="Панель"
              >
                #
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
