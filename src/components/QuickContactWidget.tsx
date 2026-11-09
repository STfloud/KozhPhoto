import React, { useState } from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import { MessageCircle, Phone, ArrowUpRight, X, MessageSquare } from 'lucide-react';

interface QuickContactWidgetProps {
  onOpenBooking: () => void;
}

export const QuickContactWidget: React.FC<QuickContactWidgetProps> = ({ onOpenBooking }) => {
  const { data } = usePhotographer();
  const { contacts } = data;
  const [isOpen, setIsOpen] = useState(false);

  const telegramUrl = contacts.telegramUsername.startsWith('http')
    ? contacts.telegramUsername
    : `https://t.me/${contacts.telegramUsername.replace('@', '')}?text=${encodeURIComponent(
        contacts.defaultMessage
      )}`;

  const whatsappUrl = `https://wa.me/${contacts.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    contacts.defaultMessage
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-3 flex flex-col gap-2.5 items-end animate-slide-up">
          {/* Telegram */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-950 border border-zinc-700 text-white hover:bg-zinc-900 shadow-xl text-xs font-semibold uppercase tracking-wider group cursor-pointer transition-all"
          >
            <span>Написать в Telegram</span>
            <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-950 border border-zinc-700 text-white hover:bg-zinc-900 shadow-xl text-xs font-semibold uppercase tracking-wider group cursor-pointer transition-all"
          >
            <span>Написать в WhatsApp</span>
            <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Call */}
          <a
            href={`tel:${contacts.phone.replace(/[^0-9+]/g, '')}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-950 border border-zinc-700 text-white hover:bg-zinc-900 shadow-xl text-xs font-semibold uppercase tracking-wider group cursor-pointer transition-all"
          >
            <span>Позвонить: {contacts.phone}</span>
            <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center">
              <Phone className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Booking */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenBooking();
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white text-black shadow-xl hover:bg-zinc-200 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <span>Забронировать дату</span>
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-4 rounded-full bg-white hover:bg-zinc-200 text-black shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center border border-zinc-300"
        aria-label="Быстрая связь"
      >
        <div className="relative z-10">
          {isOpen ? (
            <X className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <MessageSquare className="w-5 h-5 stroke-[2.5]" />
          )}
        </div>
      </button>
    </div>
  );
};
