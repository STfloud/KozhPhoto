import React from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import { Camera, MessageCircle, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenBooking
}) => {
  const { data } = usePhotographer();
  const { profile, contacts } = data;

  const currentYear = new Date().getFullYear();

  const telegramUrl = contacts.telegramUsername.startsWith('http')
    ? contacts.telegramUsername
    : `https://t.me/${contacts.telegramUsername.replace('@', '')}`;

  const whatsappUrl = `https://wa.me/${contacts.whatsappPhone.replace(/[^0-9]/g, '')}`;

  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-zinc-900">
          
          {/* Brand Col */}
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-white">
                <Camera className="w-4 h-4 text-zinc-300" />
              </div>
              <span className="font-editorial text-2xl font-bold uppercase tracking-wider text-white">
                {profile.name}
              </span>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
              {profile.tagline}. Авторская фотография с акцентом на свет, естественность и форму.
            </p>
          </div>

          {/* Social Links & Booking CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-500 flex items-center justify-center transition-colors"
                title="Telegram"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-500 flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`tel:${contacts.phone.replace(/[^0-9+]/g, '')}`}
                className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-500 flex items-center justify-center transition-colors"
                title="Позвонить"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${contacts.email}`}
                className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-500 flex items-center justify-center transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={onOpenBooking}
              className="px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Забронировать дату
            </button>
          </div>

        </div>

        {/* Bottom Minimal Credits with subtle hidden author access on copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-3">
          <div className="flex items-center gap-2">
            <span>© {currentYear} {profile.name}. Все права защищены.</span>
            {/* Subtle hidden trigger for photographer */}
            <button
              onClick={onOpenAdmin}
              className="text-zinc-800 hover:text-zinc-600 transition-colors p-1 cursor-pointer text-[10px]"
              title="Панель автора"
              aria-label="Вход для автора"
            >
              •
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
