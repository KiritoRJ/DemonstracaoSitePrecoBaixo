import React, { useState } from 'react';
import { ZoomIn, X, Sparkles, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { ACTIVE_FLYERS, OFFICIAL_LINKS, FlyerPoster } from '../data/pbData';
import { useSiteData } from '../context/SiteDataContext';
import { EditableImageBadge } from './EditableImage';
import { DraggableCard } from './DraggableLayoutPrimitives';
import { EditableText } from './EditableText';

interface OffersAndFlyersSectionProps {
  onOpenAiChef: () => void;
}

export const OffersAndFlyersSection: React.FC<OffersAndFlyersSectionProps> = ({ onOpenAiChef }) => {
  const [selectedFlyer, setSelectedFlyer] = useState<FlyerPoster | null>(null);
  const { getImage, adminToken, inlineEditMode, sortByCardOrder } = useSiteData();
  const orderedFlyers = sortByCardOrder('flyers', ACTIVE_FLYERS, (f) => f.id);

  const foodServiceImg = getImage('food-service-card', '/pb-assets/slide-food-service.webp');
  const selectedFlyerImg = selectedFlyer
    ? getImage(selectedFlyer.imageKey, selectedFlyer.image)
    : null;

  return (
    <section id="ofertas" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E7353A]">
              <span className="w-5 h-[2px] bg-[#E7353A] rounded-full" />
              <EditableText
                textKey="offers.eyebrow"
                defaultValue="Encartes & Destaques da Semana"
                label="Sobretítulo Ofertas"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0C2168] tracking-tight leading-[1.12] text-balance">
              <EditableText
                textKey="offers.heading"
                defaultValue="Fique por dentro de todos os encartes, promoções e ofertas"
                label="Título Seção Ofertas"
              />
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              <EditableText
                textKey="offers.subtitle"
                defaultValue="Confira os tablóides vigentes em nossas lojas e acompanhe os destaques oficiais do Preço Baixo Atacadista."
                label="Subtítulo Ofertas"
                multiline
              />
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenAiChef}
              className="group pb-btn-navy px-5 py-3 text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-[#FFBC7D]" />
              <EditableText
                textKey="offers.aiChefBtn"
                defaultValue="Receitas Econômicas (Chef IA)"
                label="Botão Chef IA"
                insideInteractive
              />
              <ArrowRight className="w-3.5 h-3.5 opacity-75 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Official Flyers (Sadia & Perdigão) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {orderedFlyers.map((flyer) => {
              const flyerImg = getImage(flyer.imageKey, flyer.image);
              return (
                <DraggableCard
                  key={flyer.id}
                  group="flyers"
                  cardId={flyer.id}
                  defaultIds={ACTIVE_FLYERS.map((f) => f.id)}
                  className="h-full"
                >
                  <div className="group pb-card-surface rounded-3xl overflow-hidden flex flex-col justify-between h-full hover:-translate-y-1">
                  {flyerImg ? (
                    <div className="relative aspect-[9/14] bg-slate-100 overflow-hidden">
                      <img
                        src={flyerImg}
                        alt={flyer.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <EditableImageBadge imageKey={flyer.imageKey} label="Alterar Encarte" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C2168]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-6">
                        <button
                          onClick={() => setSelectedFlyer(flyer)}
                          className="px-5 py-3 bg-white text-[#0C2168] font-bold text-xs rounded-xl shadow-xl inline-flex items-center gap-2 cursor-pointer hover:bg-[#F4F7FB] transition-colors"
                        >
                          <ZoomIn className="w-4 h-4 text-[#E7353A]" />
                          <span>Ampliar Encarte</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[9/14] bg-[#F4F7FB] flex flex-col items-center justify-center p-6 text-center space-y-2 border-b border-slate-200">
                      <EditableImageBadge imageKey={flyer.imageKey} label="Restaurar Encarte" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#E7353A]">
                        {flyer.brand}
                      </span>
                      <span className="font-display font-bold text-lg text-[#0C2168]">
                        {flyer.title}
                      </span>
                      <span className="text-xs text-slate-500">{flyer.validity}</span>
                    </div>
                  )}

                  <div className="p-5 flex items-center justify-between gap-4 bg-white border-t border-slate-100">
                    <div className="min-w-0 space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#E7353A] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          <EditableText
                            textKey={`flyer.${flyer.id}.validity`}
                            defaultValue={flyer.validity}
                            label={`Validade (${flyer.title})`}
                          />
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-[#0C2168] truncate">
                        <EditableText
                          textKey={`flyer.${flyer.id}.title`}
                          defaultValue={flyer.title}
                          label={`Título Encarte (${flyer.brand})`}
                        />
                      </h3>
                    </div>

                    {flyerImg && (
                      <button
                        onClick={() => setSelectedFlyer(flyer)}
                        className="pb-btn-primary px-4 py-2.5 text-xs rounded-xl shrink-0 cursor-pointer"
                      >
                        <EditableText
                          textKey="offers.openFlyerBtn"
                          defaultValue="Abrir"
                          label="Botão Abrir Encarte"
                          insideInteractive
                        />
                      </button>
                    )}
                  </div>
                  </div>
                </DraggableCard>
              );
            })}
          </div>

          {/* Right Column: Official YouTube Showcase + Food Service Highlight */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0C2168] rounded-3xl p-6 sm:p-7 text-white shadow-[0_18px_40px_-12px_rgba(12,33,104,0.35)] border border-[#2A4393]/60 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFBC7D] block">
                    <EditableText textKey="offers.youtubeTag" defaultValue="Estamos no YouTube" label="Tag YouTube" />
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5 leading-snug">
                    <EditableText textKey="offers.youtubeTitle" defaultValue="Vídeo Oficial Preço Baixo" label="Título YouTube" />
                  </h3>
                </div>
                <a
                  href={OFFICIAL_LINKS.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white inline-flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <span>Canal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/15 shadow-inner">
                <iframe
                  src={OFFICIAL_LINKS.youtubeEmbed}
                  title="Preço Baixo Atacadista - Vídeo Oficial"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                <EditableText
                  textKey="offers.youtubeDesc"
                  defaultValue="Acompanhe nossas campanhas semanais, inaugurações e novidades direto no canal oficial do Grupo Preço Baixo."
                  label="Descrição YouTube"
                  multiline
                />
              </p>
            </div>

            <div className="pb-card-surface rounded-3xl overflow-hidden">
              {(foodServiceImg || (adminToken && inlineEditMode)) && (
                <div className="relative aspect-[2/1] overflow-hidden bg-slate-100">
                  {foodServiceImg ? (
                    <>
                      <img
                        src={foodServiceImg}
                        alt="Ofertas Food Service Preço Baixo"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C2168]/70 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400 border-b border-dashed border-slate-300">
                      Imagem Food Service removida
                    </div>
                  )}
                  <EditableImageBadge imageKey="food-service-card" label="Alterar Imagem" />
                </div>
              )}
              <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E7353A]">
                    <EditableText textKey="offers.foodTag" defaultValue="Atacado & Comércio" label="Tag Food Service" />
                  </span>
                  <h4 className="font-display font-bold text-lg text-[#0C2168]">
                    <EditableText textKey="offers.foodTitle" defaultValue="Abasteça seu negócio conosco" label="Título Food Service" />
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <EditableText
                      textKey="offers.foodDesc"
                      defaultValue="Embalagens econômicas e condições especiais nas 8 lojas."
                      label="Descrição Food Service"
                    />
                  </p>
                </div>
                <a
                  href="#lojas"
                  className="pb-btn-navy px-4 py-2.5 text-xs rounded-xl whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
                >
                  <EditableText textKey="offers.foodBtn" defaultValue="Ver Lojas" label="Botão Food Service" insideInteractive />
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flyer Lightbox Modal */}
      {selectedFlyer && selectedFlyerImg && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedFlyer(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl text-[#0C2168]">
                  {selectedFlyer.title}
                </h3>
                <p className="text-xs text-[#E7353A] font-semibold mt-0.5">{selectedFlyer.validity}</p>
              </div>
              <button
                onClick={() => setSelectedFlyer(null)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Fechar encarte"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto bg-[#F4F7FB] p-5 flex justify-center">
              <img
                src={selectedFlyerImg}
                alt={selectedFlyer.title}
                className="max-h-[75vh] w-auto rounded-2xl shadow-lg object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
