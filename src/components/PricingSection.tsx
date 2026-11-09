import React from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import { Check, Clock, Image, ArrowUpRight, Edit3 } from 'lucide-react';

interface PricingSectionProps {
  onSelectPackage: (packageId: string) => void;
  onOpenAdmin: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPackage,
  onOpenAdmin
}) => {
  const { data, isAdmin } = usePhotographer();
  const { packages } = data;

  return (
    <section id="pricing" className="py-24 relative bg-zinc-950 text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono uppercase tracking-widest mb-3">
            <span>03 / СТОИМОСТЬ СЪЕМКИ</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
            Услуги и пакетные предложения
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 font-light">
            Прозрачные условия без скрытых доплат. Каждый формат включает тщательный пре-продакшн и авторскую ретушь.
          </p>

          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Редактировать прайс в панели</span>
            </button>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {packages.map((pkg) => {
            const isPopular = pkg.popular;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-zinc-900 border-2 border-white shadow-2xl -translate-y-1'
                    : 'bg-black border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest font-mono shadow-md">
                    Самый востребованный
                  </div>
                )}

                <div>
                  <h3 className="font-editorial text-xl font-bold text-white mb-2 uppercase tracking-wide">
                    {pkg.title}
                  </h3>

                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-3xl sm:text-4xl font-bold text-white font-editorial tracking-tight">
                      {pkg.price}
                    </span>
                  </div>

                  {/* Quick specs */}
                  <div className="space-y-2 py-3 border-y border-zinc-800 text-xs text-zinc-300 font-mono">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{pkg.photosCount}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Срок готовности: <strong className="text-zinc-200">{pkg.turnaroundTime}</strong>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-6 space-y-3 text-xs sm:text-sm text-zinc-300">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="p-0.5 rounded-full bg-zinc-800 text-white shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-snug font-light">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Booking Button */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onSelectPackage(pkg.id)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isPopular
                        ? 'bg-white hover:bg-zinc-200 text-black shadow-lg'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                    }`}
                  >
                    <span>Выбрать пакет</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-12 text-center text-xs text-zinc-500 max-w-xl mx-auto font-mono">
          Бронирование даты осуществляется по предоплате 20%. Дата может быть перенесена в случае форс-мажора или неблагоприятных погодных условий.
        </div>

      </div>
    </section>
  );
};
