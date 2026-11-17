import React, { useState } from 'react';
import { MessageCircle, Instagram, Send, CheckCircle2, Phone, Mail, Briefcase, ArrowRight } from 'lucide-react';
import { INSTAGRAM_REELS, OFFICIAL_LINKS, STORES, WHATSAPP_GROUPS } from '../data/pbData';
import { useSiteData } from '../context/SiteDataContext';
import { EditableImageBadge } from './EditableImage';
import { EditableText } from './EditableText';
import { DraggableCard } from './DraggableLayoutPrimitives';

interface CommunityAndContactSectionProps {
  onOpenCareers: () => void;
  onApplyGeneral?: () => void;
}

export const CommunityAndContactSection: React.FC<CommunityAndContactSectionProps> = ({
  onOpenCareers,
  onApplyGeneral,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { getImage, adminToken, inlineEditMode, sortByCardOrder } = useSiteData();

  const orderedReels = sortByCardOrder('reels', INSTAGRAM_REELS, (r) => r.id);
  const trabalheImg = getImage('trabalhe-conosco', '/pb-assets/trabalhe-conosco.webp');
  const showInlineEdit = Boolean(adminToken && inlineEditMode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section id="contato" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* PB NO ZAPP + Instagram Reels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* PB NO ZAPP */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0C2168] to-[#091952] rounded-3xl p-8 text-white flex flex-col justify-between space-y-6 shadow-[0_20px_48px_-14px_rgba(12,33,104,0.45)]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFBC7D]">
                <span className="w-5 h-[2px] bg-[#E7353A] rounded-full" />
                <EditableText
                  textKey="community.zapp.eyebrow"
                  defaultValue="Ofertas Diárias no Celular"
                  label="Subtítulo PB no Zapp"
                />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                <EditableText textKey="community.zapp.heading" defaultValue="PB NO ZAPP!" label="Título PB no Zapp" />
              </h2>
              <p className="text-sm text-white/80 leading-relaxed max-w-[40ch]">
                <EditableText
                  textKey="community.zapp.description"
                  defaultValue="Entre em um de nossos grupos oficiais no WhatsApp e receba todas as ofertas, encartes e novidades diariamente."
                  label="Descrição PB no Zapp"
                  multiline
                />
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WHATSAPP_GROUPS.map((group) => (
                <a
                  key={group.id}
                  href={group.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group px-4 py-3.5 bg-white/10 hover:bg-[#E7353A] border border-white/15 rounded-xl text-xs font-bold text-white transition-all duration-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#FFBC7D] group-hover:text-white transition-colors" />
                    <span>{group.label}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Instagram @precobaixo.atacadista */}
          <div className="lg:col-span-7 bg-[#F4F7FB] rounded-3xl p-6 sm:p-8 border border-slate-200/80 flex flex-col justify-between space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E7353A]">
                  <EditableText
                    textKey="community.ig.eyebrow"
                    defaultValue="Estamos ON, #ClientePB!"
                    label="Subtítulo Instagram"
                  />
                </span>
                <h3 className="text-2xl font-display font-extrabold text-[#0C2168]">
                  <EditableText
                    textKey="community.ig.heading"
                    defaultValue="Aqui, você sempre encontra uma novidade."
                    label="Título Instagram"
                  />
                </h3>
              </div>
              <a
                href={OFFICIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="pb-btn-navy px-4 py-2.5 text-xs rounded-xl inline-flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Instagram className="w-4 h-4" />
                <EditableText
                  textKey="community.ig.followBtn"
                  defaultValue="@precobaixo.atacadista"
                  label="Botão Instagram"
                  insideInteractive
                />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {orderedReels.map((reel) => {
                const thumbImg = getImage(reel.imageKey, reel.thumb);
                return (
                  <DraggableCard
                    key={reel.id}
                    group="reels"
                    cardId={reel.id}
                    defaultIds={INSTAGRAM_REELS.map((r) => r.id)}
                    className="flex"
                  >
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full group pb-card-surface rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] bg-[#0C2168] overflow-hidden">
                        {thumbImg && (
                          <img
                            src={thumbImg}
                            alt={reel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <EditableImageBadge imageKey={reel.imageKey} compact positionClass="top-2 right-2" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C2168]/80 via-transparent to-transparent flex items-end p-3.5 pointer-events-none">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <Instagram className="w-3.5 h-3.5 text-[#FFBC7D]" />
                            <span>Ver Reel</span>
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="font-display font-bold text-sm text-[#0C2168] line-clamp-1">
                          <EditableText
                            textKey={`reel.${reel.id}.title`}
                            defaultValue={reel.title}
                            label={`Reel Título (${reel.title})`}
                            insideInteractive
                          />
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          <EditableText
                            textKey={`reel.${reel.id}.caption`}
                            defaultValue={reel.caption}
                            label={`Reel Legenda (${reel.title})`}
                            multiline
                            insideInteractive
                          />
                        </p>
                      </div>
                    </a>
                  </DraggableCard>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fale Conosco + Trabalhe Conosco */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Espaço do Cliente PB Form */}
          <div className="lg:col-span-7 bg-[#F4F7FB] rounded-3xl p-6 sm:p-9 border border-slate-200/80 space-y-6">
            <div className="space-y-1.5 max-w-[54ch]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E7353A]">
                <span className="w-5 h-[2px] bg-[#E7353A] rounded-full" />
                <EditableText textKey="community.contact.eyebrow" defaultValue="Fale Conosco" label="Subtítulo Contato" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0C2168]">
                <EditableText
                  textKey="community.contact.heading"
                  defaultValue="Espaço do Cliente PB"
                  label="Título Contato"
                />
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <EditableText
                  textKey="community.contact.description"
                  defaultValue="Este é o nosso canal direto com você. Deixe o seu feedback, sugestão de melhoria ou outros assuntos."
                  label="Descrição Contato"
                  multiline
                />
              </p>
            </div>

            {submitted ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-display font-bold text-xl text-[#0C2168]">
                  Mensagem enviada com sucesso!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Agradecemos o seu contato. Nossa equipe de atendimento ao Cliente PB analisará sua mensagem em breve.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="pb-btn-navy px-5 py-2.5 text-xs rounded-xl cursor-pointer"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pb-name" className="block text-xs font-bold text-[#0C2168] mb-1.5">
                      Nome
                    </label>
                    <input
                      id="pb-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:ring-2 focus:ring-[#0C2168]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="pb-email" className="block text-xs font-bold text-[#0C2168] mb-1.5">
                      E-mail
                    </label>
                    <input
                      id="pb-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:ring-2 focus:ring-[#0C2168]/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pb-message" className="block text-xs font-bold text-[#0C2168] mb-1.5">
                    Mensagem
                  </label>
                  <textarea
                    id="pb-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreva sua sugestão, elogio ou dúvida..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:ring-2 focus:ring-[#0C2168]/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="pb-btn-primary px-6 py-3.5 text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <EditableText
                    textKey="community.contact.submitBtn"
                    defaultValue="Enviar Mensagem"
                    label="Botão Enviar Mensagem"
                    insideInteractive
                  />
                </button>
              </form>
            )}
          </div>

          {/* Telefones + Trabalhe Conosco */}
          <div className="lg:col-span-5 space-y-6">
            <div className="pb-card-surface rounded-3xl p-6 sm:p-7 space-y-4">
              <h3 className="font-display font-bold text-lg text-[#0C2168]">
                <EditableText
                  textKey="community.phones.heading"
                  defaultValue="Telefones & Ouvidoria"
                  label="Título Telefones"
                />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {STORES.slice(0, 6).map((s) => (
                  <div key={s.id} className="bg-[#F4F7FB] p-3.5 rounded-xl border border-slate-200/60">
                    <div className="font-bold text-[#0C2168]">
                      <EditableText
                        textKey={`store.${s.id}.name`}
                        defaultValue={s.name}
                        label={`Nome (${s.name})`}
                      />
                    </div>
                    <div className="text-slate-600 flex items-center gap-1.5 mt-1 tabular-nums font-medium">
                      <Phone className="w-3 h-3 text-[#E7353A]" />
                      <span>{s.phone.split('/')[0].trim()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  <EditableText
                    textKey="community.phones.pressLabel"
                    defaultValue="Imprensa e Ouvidoria:"
                    label="Rótulo Ouvidoria"
                  />
                </span>
                <a
                  href={`mailto:${OFFICIAL_LINKS.email}`}
                  className="font-bold text-[#0C2168] hover:text-[#E7353A] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{OFFICIAL_LINKS.email}</span>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0C2168] to-[#091952] rounded-3xl p-6 text-white flex items-center gap-5 shadow-xl">
              {(trabalheImg || showInlineEdit) && (
                <div className="relative shrink-0">
                  {trabalheImg ? (
                    <img
                      src={trabalheImg}
                      alt="#SejaPB Trabalhe Conosco"
                      className="w-24 h-24 rounded-2xl object-cover border border-white/15"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/30 bg-white/5" />
                  )}
                  <EditableImageBadge imageKey="trabalhe-conosco" compact positionClass="-top-2 -right-2" />
                </div>
              )}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFBC7D] block">
                  <EditableText
                    textKey="community.careers.tag"
                    defaultValue="#SejaPB · Carreiras"
                    label="Tag Trabalhe Conosco"
                  />
                </span>
                <h4 className="font-display font-bold text-lg text-white leading-tight">
                  <EditableText
                    textKey="community.careers.title"
                    defaultValue="Faça parte do nosso time!"
                    label="Título Trabalhe Conosco"
                  />
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenCareers}
                    className="pb-btn-primary px-4 py-2.5 text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <EditableText
                      textKey="community.careers.jobsBtn"
                      defaultValue="Ver Vagas"
                      label="Botão Ver Vagas"
                      insideInteractive
                    />
                  </button>
                  {onApplyGeneral && (
                    <button
                      type="button"
                      onClick={onApplyGeneral}
                      className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <EditableText
                        textKey="community.careers.applyBtn"
                        defaultValue="Enviar Currículo"
                        label="Botão Enviar Currículo"
                        insideInteractive
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
