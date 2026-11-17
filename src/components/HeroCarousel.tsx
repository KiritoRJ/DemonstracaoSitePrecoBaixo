import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, FileText, ArrowRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CAMPAIGN_SLIDES } from '../data/pbData';
import { useSiteData } from '../context/SiteDataContext';
import { EditableImageBadge } from './EditableImage';
import { DraggableCard } from './DraggableLayoutPrimitives';
import { EditableText } from './EditableText';

export const HeroCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { getImage, sortByCardOrder } = useSiteData();

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [paused]);

  const highlightBase = CAMPAIGN_SLIDES.slice(0, 4);
  const orderedHighlights = sortByCardOrder('highlights', highlightBase, (s) => s.id);
  const currentSlide = CAMPAIGN_SLIDES[activeIndex];
  const heroBgUrl = getImage('hero-bg', '/pb-assets/bg-hero.webp');
  const currentSlideImg = getImage(currentSlide.imageKey, currentSlide.image);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CAMPAIGN_SLIDES.length) % CAMPAIGN_SLIDES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
  };

  const heroStyle: React.CSSProperties | undefined = heroBgUrl
    ? {
        backgroundImage: `radial-gradient(circle at 82% 22%, rgba(231, 53, 58, 0.22) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(42, 67, 147, 0.48) 0%, transparent 50%), linear-gradient(135deg, rgba(10, 27, 88, 0.96) 0%, rgba(18, 44, 130, 0.9) 55%, rgba(12, 33, 104, 0.97) 100%), url('${heroBgUrl}')`,
      }
    : {
        backgroundImage: `radial-gradient(circle at 82% 22%, rgba(231, 53, 58, 0.22) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(42, 67, 147, 0.48) 0%, transparent 50%), linear-gradient(135deg, rgba(10, 27, 88, 0.98) 0%, rgba(18, 44, 130, 0.94) 55%, rgba(12, 33, 104, 1) 100%)`,
      };

  return (
    <section
      className="pb-hero-pattern text-white relative overflow-hidden"
      style={heroStyle}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <EditableImageBadge
        imageKey="hero-bg"
        label="Alterar Fundo Hero"
        positionClass="top-3 right-3 sm:top-4 sm:right-6"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 lg:pt-16 lg:pb-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Modern Editorial Hierarchy & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-white/75">
                <span className="w-6 h-[2px] bg-[#E7353A] rounded-full" />
                <EditableText textKey="hero.location" defaultValue="Belém & Ananindeua" label="Localização Hero" />
                <span aria-hidden="true" className="text-white/40">·</span>
                <span className="text-[#FFBC7D]">
                  <EditableText
                    textKey={`slide.${currentSlide.id}.dayTag`}
                    defaultValue={currentSlide.dayTag}
                    label={`Tag do Dia (${currentSlide.title})`}
                  />
                </span>
              </div>

              <h1 className="text-[clamp(2.35rem,4.2vw,3.6rem)] font-display font-extrabold tracking-tight text-white leading-[1.06] text-balance">
                <EditableText textKey="hero.titlePrefix" defaultValue="Confira as ofertas," label="Título Hero (Parte 1)" />{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFBC7D] via-[#FFD8A8] to-white">
                  <EditableText textKey="hero.titleHighlight" defaultValue="Cliente PB!" label="Título Hero (Destaque)" />
                </span>
              </h1>

              <p className="text-sm sm:text-base text-white/80 leading-[1.7] max-w-[44ch] font-normal">
                <EditableText
                  textKey={`slide.${currentSlide.id}.description`}
                  defaultValue={currentSlide.description}
                  label={`Descrição da Campanha (${currentSlide.title})`}
                  multiline
                />{' '}
                <strong className="text-white font-semibold">
                  <EditableText
                    textKey="hero.taglineBold"
                    defaultValue="No varejo e no atacado, é sempre Preço Baixo."
                    label="Frase de Efeito Hero"
                  />
                </strong>
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#ofertas"
                  className="group pb-btn-primary px-6 py-3.5 text-xs sm:text-sm rounded-xl inline-flex items-center gap-2.5 whitespace-nowrap"
                >
                  <FileText className="w-4 h-4" />
                  <EditableText
                    textKey="hero.ctaPrimary"
                    defaultValue="Ver Encartes & Ofertas"
                    label="Botão Primário Hero"
                    insideInteractive
                  />
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#lojas"
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/18 border border-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4 text-[#FFBC7D]" />
                  <EditableText
                    textKey="hero.ctaSecondary"
                    defaultValue="8 Lojas Próximas"
                    label="Botão Secundário Hero"
                    insideInteractive
                  />
                </a>
              </div>
            </div>

            {/* Modern Segmented Campaign Selector */}
            <div className="pt-5 border-t border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
                  <EditableText textKey="hero.campaignsLabel" defaultValue="Campanhas da Semana" label="Rótulo Campanhas" />
                </p>
                <span className="text-[11px] font-mono text-white/50 tabular-nums">
                  0{activeIndex + 1} / 0{CAMPAIGN_SLIDES.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CAMPAIGN_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      idx === activeIndex
                        ? 'bg-white text-[#0C2168] shadow-md font-bold'
                        : 'bg-white/8 text-white/80 hover:bg-white/16 hover:text-white border border-white/10'
                    }`}
                  >
                    <EditableText
                      textKey={`slide.${slide.id}.title`}
                      defaultValue={slide.title}
                      label={`Nome da Campanha ${idx + 1}`}
                      insideInteractive
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Official Campaign Carousel Spotlight */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-3xl overflow-hidden bg-[#08174A] border border-white/15 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.55)] flex-1 min-h-[270px] sm:min-h-[360px] lg:min-h-[410px] group">
              <EditableImageBadge
                imageKey={currentSlide.imageKey}
                label="Alterar Banner"
                positionClass="top-3.5 right-3.5"
              />
              {currentSlideImg ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${currentSlide.id}-${currentSlideImg}`}
                    src={currentSlideImg}
                    alt={currentSlide.title}
                    initial={{ opacity: 0.4, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.4 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full min-h-[270px] flex flex-col items-center justify-center p-10 text-center bg-gradient-to-br from-[#0C2168] via-[#173594] to-[#08174A]">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FFBC7D]">
                    {currentSlide.dayTag}
                  </span>
                  <h3 className="font-display text-3xl font-extrabold text-white mt-2">
                    {currentSlide.title}
                  </h3>
                  <p className="text-sm text-white/75 mt-2 max-w-md">{currentSlide.description}</p>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#08174A]/90 via-[#08174A]/15 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 flex items-end justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFBC7D] block">
                    <EditableText
                      textKey={`slide.${currentSlide.id}.dayTag`}
                      defaultValue={currentSlide.dayTag}
                      label="Dia da Campanha"
                    />
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl lg:text-[26px] font-bold text-white leading-tight text-balance">
                    <EditableText
                      textKey={`slide.${currentSlide.id}.title`}
                      defaultValue={currentSlide.title}
                      label="Título da Campanha"
                    />{' '}
                    —{' '}
                    <EditableText
                      textKey={`slide.${currentSlide.id}.subtitle`}
                      defaultValue={currentSlide.subtitle}
                      label="Subtítulo da Campanha"
                    />
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-xl bg-white/15 hover:bg-[#E7353A] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Campanha anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-xl bg-white/15 hover:bg-[#E7353A] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Próxima campanha"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Modern Weekly Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/15">
          {orderedHighlights.map((item, idx) => {
            const slideIdx = CAMPAIGN_SLIDES.findIndex((s) => s.id === item.id);
            const isActive = activeIndex === slideIdx;
            return (
              <DraggableCard
                key={item.id}
                group="highlights"
                cardId={item.id}
                defaultIds={highlightBase.map((s) => s.id)}
                className="flex"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(slideIdx >= 0 ? slideIdx : 0)}
                  className={`w-full relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-white text-[#0C2168] border-white shadow-xl -translate-y-0.5'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/15'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-[#E7353A]/10 text-[#E7353A]' : 'bg-white/10 text-[#FFBC7D]'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-wider opacity-65 tabular-nums">
                      0{idx + 1}.{' '}
                      <EditableText
                        textKey={`slide.${item.id}.dayTag`}
                        defaultValue={item.dayTag}
                        label={`Tag Card ${item.title}`}
                        insideInteractive
                      />
                    </div>
                    <div className="font-display font-bold text-base mt-0.5 truncate">
                      <EditableText
                        textKey={`slide.${item.id}.title`}
                        defaultValue={item.title}
                        label={`Título Card ${item.title}`}
                        insideInteractive
                      />
                    </div>
                  </div>
                </button>
              </DraggableCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
