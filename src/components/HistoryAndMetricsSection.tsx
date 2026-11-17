import React, { useState } from 'react';
import { FileDown, Target, Eye, Heart, ArrowRight } from 'lucide-react';
import { IMPACT_METRICS, SALARY_REPORTS } from '../data/pbData';
import { useSiteData } from '../context/SiteDataContext';
import { EditableImageBadge } from './EditableImage';
import { EditableText } from './EditableText';

interface HistoryAndMetricsSectionProps {
  onOpenCareers: () => void;
}

export const HistoryAndMetricsSection: React.FC<HistoryAndMetricsSectionProps> = ({
  onOpenCareers,
}) => {
  const [activeTab, setActiveTab] = useState<'historia' | 'mvv' | 'transparencia'>('historia');
  const { getImage, adminToken, inlineEditMode } = useSiteData();

  const cestaFrutasImg = getImage('cesta-frutas', '/pb-assets/cesta-frutas.webp');
  const sejaPbImg = getImage('seja-pb', '/pb-assets/seja-pb.webp');
  const showCestaSlot = Boolean(cestaFrutasImg) || Boolean(adminToken && inlineEditMode);

  return (
    <section id="historia" className="py-20 bg-[#F4F7FB] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Modern Impact Metrics Showcase */}
        <div className="bg-gradient-to-br from-[#0C2168] via-[#122B82] to-[#091952] rounded-3xl p-8 sm:p-11 text-white shadow-[0_20px_50px_-15px_rgba(12,33,104,0.45)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/15">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFBC7D]">
                <span className="w-5 h-[2px] bg-[#E7353A] rounded-full" />
                <EditableText textKey="history.metricsTag" defaultValue="Grupo Preço Baixo" label="Sobretítulo Indicadores" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                <EditableText
                  textKey="history.metricsHeading"
                  defaultValue="No varejo e no atacado, é sempre Preço Baixo!"
                  label="Título Indicadores"
                />
              </h2>
            </div>
            <span className="text-xs text-white/75 font-medium tracking-wide">
              <EditableText textKey="history.metricsLocation" defaultValue="Belém & Ananindeua · Pará" label="Localização Indicadores" />
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 pt-8">
            {IMPACT_METRICS.map((metric, idx) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tabular-nums tracking-tight">
                  <EditableText
                    textKey={`history.metric.${idx}.value`}
                    defaultValue={`${metric.prefix}${
                      metric.decimals
                        ? metric.value.toLocaleString('pt-BR', { minimumFractionDigits: 1 })
                        : metric.value.toLocaleString('pt-BR')
                    }${metric.suffix}`}
                    label={`Número Indicador ${idx + 1}`}
                  />
                </div>
                <p className="text-xs sm:text-[13px] text-white/75 leading-snug">
                  <EditableText
                    textKey={`history.metric.${idx}.label`}
                    defaultValue={metric.label}
                    label={`Rótulo Indicador ${idx + 1}`}
                  />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nossa História & Editorial Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {showCestaSlot && (
            <div className="lg:col-span-5">
              <div className="pb-card-surface rounded-3xl p-6 sm:p-8 relative">
                <div className="relative">
                  {cestaFrutasImg ? (
                    <img
                      src={cestaFrutasImg}
                      alt="Cesta de frutas frescas Preço Baixo Atacadista"
                      className="w-full h-auto object-contain rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-56 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center p-6 text-center text-xs font-bold text-slate-400">
                      Imagem removida (clique no botão ao lado para enviar ou restaurar)
                    </div>
                  )}
                  <EditableImageBadge imageKey="cesta-frutas" label="Alterar Foto" />
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-[#0C2168]">Qualidade & Frescor Diário</span>
                  <span className="font-medium text-slate-500">+2.850 colaboradores</span>
                </div>
              </div>
            </div>
          )}

          <div className={showCestaSlot ? 'lg:col-span-7 space-y-6' : 'lg:col-span-12 space-y-6'}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E7353A]">
                <span className="w-5 h-[2px] bg-[#E7353A] rounded-full" />
                <EditableText textKey="history.eyebrow" defaultValue="Nossa História" label="Sobretítulo História" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0C2168] tracking-tight leading-[1.12] text-balance">
                <EditableText
                  textKey="history.heading"
                  defaultValue="20 anos como força positiva no mercado paraense"
                  label="Título Nossa História"
                />
              </h2>
            </div>

            {/* Modern Segmented Tabs */}
            <div className="inline-flex flex-wrap gap-1 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <button
                onClick={() => setActiveTab('historia')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'historia'
                    ? 'bg-[#0C2168] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0C2168]'
                }`}
              >
                História do Grupo
              </button>
              <button
                onClick={() => setActiveTab('mvv')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'mvv'
                    ? 'bg-[#0C2168] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0C2168]'
                }`}
              >
                Missão, Visão & Valores
              </button>
              <button
                onClick={() => setActiveTab('transparencia')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'transparencia'
                    ? 'bg-[#0C2168] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0C2168]'
                }`}
              >
                Igualdade Salarial
              </button>
            </div>

            {activeTab === 'historia' && (
              <div className="space-y-4 text-sm sm:text-[15px] text-slate-600 leading-[1.75] max-w-[65ch]">
                <p className="text-slate-800 font-medium text-base leading-relaxed">
                  <EditableText
                    textKey="history.p1"
                    defaultValue="Há 20 anos, o Grupo Preço Baixo tornou-se parte fundamental da comunidade que atendemos, crescendo e evoluindo para ser uma força positiva no mercado paraense."
                    label="História Parágrafo 1"
                    multiline
                  />
                </p>
                <p>
                  <EditableText
                    textKey="history.p2"
                    defaultValue="Somos mais de 2.000 colaboradores diretos e cerca de 850 indiretos, operando atualmente 08 lojas distribuídas estrategicamente em Belém e Ananindeua (PA) — pilares da comunidade com produtos de qualidade e atendimento acolhedor."
                    label="História Parágrafo 2"
                    multiline
                  />
                </p>
                <p>
                  <EditableText
                    textKey="history.p3"
                    defaultValue="Somos parceiros de confiança dos paraenses, comprometidos em contribuir para o bem-estar e o desenvolvimento de todos que servimos, trabalhando com paixão para cumprir nossa missão socioambiental."
                    label="História Parágrafo 3"
                    multiline
                  />
                </p>
              </div>
            )}

            {activeTab === 'mvv' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="pb-card-surface p-5 rounded-2xl space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E7353A]/10 text-[#E7353A] flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-base text-[#0C2168]">
                    <EditableText textKey="history.missionTitle" defaultValue="Missão" label="Título Missão" />
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <EditableText
                      textKey="history.missionText"
                      defaultValue="Comercializar produtos de qualidade a preços justos, com eficiência operacional e colaboradores comprometidos com a sustentabilidade."
                      label="Texto Missão"
                      multiline
                    />
                  </p>
                </div>
                <div className="pb-card-surface p-5 rounded-2xl space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0C2168]/10 text-[#0C2168] flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-base text-[#0C2168]">
                    <EditableText textKey="history.visionTitle" defaultValue="Visão" label="Título Visão" />
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <EditableText
                      textKey="history.visionText"
                      defaultValue="Ser referência no segmento de atacarejo na região norte, por meio da oferta de serviços de qualidade e mix de produtos a preço justo."
                      label="Texto Visão"
                      multiline
                    />
                  </p>
                </div>
                <div className="pb-card-surface p-5 rounded-2xl space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E7353A]/10 text-[#E7353A] flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-base text-[#0C2168]">
                    <EditableText textKey="history.valuesTitle" defaultValue="Valores" label="Título Valores" />
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <EditableText
                      textKey="history.valuesText"
                      defaultValue="Acolhimento ao cliente, ética nos serviços, respeito ao próximo e comprometimento com o trabalho e a comunidade."
                      label="Texto Valores"
                      multiline
                    />
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'transparencia' && (
              <div className="pb-card-surface rounded-2xl p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Consulte os Relatórios de Transparência e Igualdade Salarial publicados por unidade do Grupo Preço Baixo:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SALARY_REPORTS.map((rep) => (
                    <a
                      key={rep.store}
                      href={rep.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-[#F4F7FB] hover:bg-[#0C2168] text-[#0C2168] hover:text-white border border-slate-200/80 text-xs font-semibold transition-all duration-200 flex items-center justify-between gap-2"
                    >
                      <span className="truncate">{rep.store}</span>
                      <FileDown className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Modern #SejaPB Highlight Strip */}
            <div className="pb-card-surface rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {(sejaPbImg || (adminToken && inlineEditMode)) && (
                  <div className="relative shrink-0">
                    {sejaPbImg ? (
                      <img
                        src={sejaPbImg}
                        alt="#SejaPB Faça parte do nosso time"
                        className="w-20 h-14 object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-20 h-14 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50" />
                    )}
                    <EditableImageBadge imageKey="seja-pb" compact positionClass="-top-2 -right-2" />
                  </div>
                )}
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E7353A]">
                    <EditableText textKey="history.sejapbTag" defaultValue="Carreiras · #SejaPB" label="Tag #SejaPB" />
                  </span>
                  <h4 className="font-display font-bold text-base text-[#0C2168]">
                    <EditableText textKey="history.sejapbTitle" defaultValue="Faça parte do nosso time!" label="Título #SejaPB" />
                  </h4>
                  <p className="text-xs text-slate-500">
                    <EditableText
                      textKey="history.sejapbDesc"
                      defaultValue="Confira as vagas abertas em Belém e Ananindeua e envie seu currículo na nossa página de carreiras."
                      label="Descrição #SejaPB"
                    />
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenCareers}
                className="pb-btn-primary px-5 py-3 text-xs rounded-xl whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <EditableText textKey="history.sejapbBtn" defaultValue="Ver Vagas Abertas" label="Botão #SejaPB" insideInteractive />
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
