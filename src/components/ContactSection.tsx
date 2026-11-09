import React, { useState } from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import {
  MessageCircle,
  Phone,
  Mail,
  Copy,
  Check,
  Calendar,
  MapPin,
  Instagram,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactSectionProps {
  preselectedPackageId?: string;
  prefilledNote?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  preselectedPackageId,
  prefilledNote
}) => {
  const { data, addBooking, showToast } = usePhotographer();
  const { contacts, packages } = data;

  const [name, setName] = useState('');
  const [contactHandle, setContactHandle] = useState('');
  const [contactType, setContactType] = useState<'telegram' | 'whatsapp' | 'phone'>('telegram');
  const [selectedPkg, setSelectedPkg] = useState<string>(preselectedPackageId || packages[0]?.id || '');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState(prefilledNote || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  React.useEffect(() => {
    if (preselectedPackageId) {
      setSelectedPkg(preselectedPackageId);
    }
  }, [preselectedPackageId]);

  React.useEffect(() => {
    if (prefilledNote) {
      setMessage((prev) => (prev ? `${prev} • ${prefilledNote}` : prefilledNote));
    }
  }, [prefilledNote]);

  const telegramUrl = contacts.telegramUsername.startsWith('http')
    ? contacts.telegramUsername
    : `https://t.me/${contacts.telegramUsername.replace('@', '')}?text=${encodeURIComponent(
        contacts.defaultMessage
      )}`;

  const whatsappUrl = `https://wa.me/${contacts.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    contacts.defaultMessage
  )}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Скопировано: ${text}`, 'info');
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactHandle.trim()) {
      showToast('Пожалуйста, укажите имя и контакт', 'error');
      return;
    }

    addBooking({
      name: name.trim(),
      phoneOrMessenger: contactHandle.trim(),
      contactType,
      packageId: selectedPkg,
      date: date || undefined,
      message: message.trim() || undefined
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ffffff', '#a1a1aa', '#71717a']
      });
    } catch {}

    setIsSubmitted(true);
  };

  return (
    <section id="contacts" className="py-24 relative bg-black text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono uppercase tracking-widest mb-3">
            <span>05 / СВЯЗЬ И ЗАПИСЬ</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
            Забронировать дату съемки
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 font-light">
            Напишите напрямую в Telegram или WhatsApp, либо заполните форму онлайн-записи.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Messengers & Direct Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Messenger Action Cards */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 sm:p-7 shadow-xl">
              <h3 className="font-editorial text-xl font-bold text-white uppercase tracking-wider mb-2">
                Прямая связь в мессенджерах
              </h3>
              <p className="text-xs text-zinc-400 mb-6 font-light">
                Для быстрого уточнения свободных дат и обсуждения идеи съемки
              </p>

              <div className="space-y-3">
                {/* Telegram */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-600 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-wider">
                        Telegram
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        @{contacts.telegramUsername.replace('@', '')}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-zinc-300 bg-zinc-800 px-3 py-1 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                    В диалог →
                  </span>
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-600 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-wider">
                        WhatsApp
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">{contacts.whatsappPhone}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-zinc-300 bg-zinc-800 px-3 py-1 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                    В диалог →
                  </span>
                </a>
              </div>
            </div>

            {/* Direct Details & Copy actions */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 sm:p-7 shadow-lg">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">
                Прямые контакты
              </h4>

              <div className="space-y-3 text-xs sm:text-sm font-mono">
                {/* Phone */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <span className="text-white">{contacts.phone}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(contacts.phone, 'phone')}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Скопировать телефон"
                  >
                    {copiedField === 'phone' ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span className="text-white">{contacts.email}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(contacts.email, 'email')}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Скопировать email"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* City */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{contacts.city}</span>
                </div>

                {/* Instagram */}
                {contacts.instagram && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <Instagram className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>Instagram: <span className="text-white">{contacts.instagram}</span></span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Online Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 sm:p-9 shadow-2xl">
              
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-4 font-bold shadow-lg">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
                    Заявка принята
                  </h3>
                  <p className="text-zinc-300 text-sm max-w-md mx-auto leading-relaxed font-light">
                    Спасибо за обращение! Я свяжусь с вами через выбранный мессенджер в ближайшее время для подтверждения даты.
                  </p>

                  <div className="pt-6 flex justify-center gap-4">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      Отправить еще заявку
                    </button>
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider"
                    >
                      Написать в Telegram
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-zinc-850 pb-4 mb-6">
                    <h3 className="font-editorial text-2xl font-bold text-white uppercase tracking-wider">
                      Форма бронирования
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-light">
                      Заполните данные для предварительного согласования времени съемки
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                      Ваше имя <span className="text-white">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Как к вам обращаться?"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>

                  {/* Contact Type & Handle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Канал связи
                      </label>
                      <select
                        value={contactType}
                        onChange={(e) => setContactType(e.target.value as any)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-zinc-500 transition-colors cursor-pointer"
                      >
                        <option value="telegram">Telegram (@username или номер)</option>
                        <option value="whatsapp">WhatsApp (номер)</option>
                        <option value="phone">Телефонный звонок</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Ваш номер или ник <span className="text-white">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contactHandle}
                        onChange={(e) => setContactHandle(e.target.value)}
                        placeholder={contactType === 'telegram' ? '@username или +7...' : '+7 (999) 000-00-00'}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Package & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Пакет услуг
                      </label>
                      <select
                        value={selectedPkg}
                        onChange={(e) => setSelectedPkg(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-zinc-500 transition-colors cursor-pointer"
                      >
                        {packages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Желаемая дата</span>
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-zinc-500 transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                      Пожелания или концепция съемки
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Опишите ваши идеи, локацию или формат события..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl cursor-pointer"
                  >
                    <span>Отправить запрос на съемку</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
