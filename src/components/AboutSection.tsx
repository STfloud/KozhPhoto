import React from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import { Camera, Award, Globe, HeartHandshake, Quote, Edit3 } from 'lucide-react';

interface AboutSectionProps {
  onOpenAdmin: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenAdmin }) => {
  const { data, isAdmin } = usePhotographer();
  const { profile } = data;

  return (
    <section id="about" className="py-24 sm:py-32 relative bg-zinc-950 text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Photographer Portrait with clean minimal frame */}
          <div className="w-full lg:w-5/12">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-2 border border-zinc-700/80 rounded-2xl transform rotate-1 pointer-events-none" />
              <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/5] bg-zinc-900 border border-zinc-800">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-center filter grayscale contrast-[1.15]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Floating caption */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-black/90 backdrop-blur-md border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-editorial text-lg font-bold text-white uppercase tracking-wider">
                        {profile.name}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        Visual Artist & Photographer
                      </div>
                    </div>
                    <Camera className="w-5 h-5 text-zinc-300" />
                  </div>
                </div>
              </div>

              {/* Admin quick edit badge */}
              {isAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="absolute -top-3 -right-3 p-2.5 rounded-full bg-white text-black font-bold shadow-lg hover:bg-zinc-200 transition-all flex items-center gap-1 text-xs cursor-pointer"
                  title="Редактировать биографию"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Редактировать</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Narrative & Philosophy */}
          <div className="w-full lg:w-7/12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono uppercase tracking-widest mb-4">
              <span>01 / БИОГРАФИЯ</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6 uppercase">
              «В кадре нет места фальши. Только естественный свет, форма и характер»
            </h2>

            {/* Philosophy quote */}
            <div className="relative pl-6 border-l-2 border-white mb-8 py-2">
              <Quote className="w-6 h-6 text-zinc-700 absolute -top-3 left-1" />
              <p className="font-editorial italic text-lg sm:text-xl text-zinc-200 leading-relaxed">
                {profile.philosophy}
              </p>
            </div>

            {/* Full Bio Paragraphs */}
            <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed mb-10 font-light">
              {profile.fullBio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Highlights badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800">
                <Award className="w-7 h-7 text-zinc-300 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Публикации</div>
                  <div className="text-[11px] text-zinc-400">Vogue, WedVibes, L’Officiel</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800">
                <Globe className="w-7 h-7 text-zinc-300 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">География съемок</div>
                  <div className="text-[11px] text-zinc-400">Европа, Азия, РФ</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800">
                <HeartHandshake className="w-7 h-7 text-zinc-300 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Комфорт в процессе</div>
                  <div className="text-[11px] text-zinc-400">Без напряжения и шаблонов</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
