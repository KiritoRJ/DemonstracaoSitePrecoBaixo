import React, { useState } from 'react';
import { Smartphone, CreditCard, Pill, Wine, ExternalLink, Phone, MapPin, Check, ArrowRight } from 'lucide-react';
import {
  APP_MEU_PB_STEPS,
  OFFICIAL_LINKS,
  PAYMENT_BADGES,
  PHARMACIES,
  STORES,
  WINE_GUIDE,
} from '../data/pbData';
import { useSiteData } from '../context/SiteDataContext';
import { EditableImageBadge } from './EditableImage';
import { EditableText } from './EditableText';

export const ServicesEcosystemSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'app' | 'cartao' | 'farma' | 'adega'>('app');
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [activeWineIdx, setActiveWineIdx] = useState(0);
  const { getImage, adminToken, inlineEditMode } = useSiteData();

  const cardStores = STORES.filter((s) => s.cartaoWhatsappUrl);
  const currentStep = APP_MEU_PB_STEPS[activeStepIdx];
  const currentWine = WINE_GUIDE[activeWineIdx];

  const currentStepImg = getImage(currentStep.imageKey, currentStep.screen);
  const cartaoPbImg = getImage('homem-cartao-pb', '/pb-assets/homem-cartao-pb.png');
  const farmaDestaqueImg = getImage('farma-destaque', '/pb-assets/farma-destaque.webp');
  const adegaImg = getImage('adega-harmonizacao', '/pb-assets/adega-harmonizacao.webp');

  const showInlineEdit = Boolean(adminToken && inlineEditMode);
  const showCartaoSlot = Boolean(cartaoPbImg) || showInlineEdit;
  const showFarmaSlot = Boolean(farmaDestaqueImg) || showInlineEdit;
  const showAdegaSlot = Boolean(adegaImg) || showInlineEdit;

  return (
    <section id="servicos" className="py-20 bg-[#F4F7FB] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E7353A]">
              <span className="w-5 h-[2px] bg-[#E7353A] rounded-full" />
              <EditableText textKey="services.eyebrow" defaultValue="Ecossistema Cliente PB" label="Subtítulo Serviços" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0C2168] tracking-tight leading-[1.12]">
              <EditableText
                textKey="services.heading"
                defaultValue="Muito mais vantagens em um só lugar"
                label="Título Serviços"
              />
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              <EditableText
                textKey="services.subtitle"
                defaultValue="Compre pelo aplicativo, parcele no Cartão PB, cuide da saúde na PB Farma e escolha rótulos na nossa Adega."
                label="Descrição Serviços"
                multiline
              />
            </p>
          </div>

          {/* Modern Segmented Tabs */}
          <div className="inline-flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('app')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'app'
                  ? 'bg-[#0C2168] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0C2168]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <EditableText textKey="services.tab.app" defaultValue="App Meu PB" label="Aba App Meu PB" insideInteractive />
            </button>
            <button
              onClick={() => setActiveTab('cartao')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'cartao'
                  ? 'bg-[#0C2168] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0C2168]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <EditableText
                textKey="services.tab.cartao"
                defaultValue="Cartão PB & Pagamentos"
                label="Aba Cartão PB"
                insideInteractive
              />
            </button>
            <button
              onClick={() => setActiveTab('farma')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'farma'
                  ? 'bg-[#0C2168] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0C2168]'
              }`}
            >
              <Pill className="w-4 h-4" />
              <EditableText textKey="services.tab.farma" defaultValue="PB Farma" label="Aba PB Farma" insideInteractive />
            </button>
            <button
              onClick={() => setActiveTab('adega')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'adega'
                  ? 'bg-[#0C2168] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0C2168]'
              }`}
            >
              <Wine className="w-4 h-4" />
              <EditableText textKey="services.tab.adega" defaultValue="Adega PB" label="Aba Adega PB" insideInteractive />
            </button>
          </div>
        </div>

        {/* TAB 1: APP MEU PB */}
        {activeTab === 'app' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2 max-w-[56ch]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E7353A]">
                    <EditableText textKey="services.app.tag" defaultValue="Aplicativo Meu PB" label="Tag App Meu PB" />
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0C2168] leading-tight">
                    <EditableText
                      textKey="services.app.title"
                      defaultValue="Faça as compras sem sair de casa, Cliente PB!"
                      label="Título App Meu PB"
                    />
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                    <EditableText
                      textKey="services.app.subtitle"
                      defaultValue="São mais de 10 mil produtos na palma da sua mão. Receba no mesmo dia ou realize a retirada na loja."
                      label="Descrição App Meu PB"
                      multiline
                    />
                  </p>
                </div>

                {/* 5 Official Interactive Steps */}
                <div className="space-y-2.5">
                  {APP_MEU_PB_STEPS.map((item, idx) => {
                    const isActive = activeStepIdx === idx;
                    return (
                      <button
                        key={item.step}
                        onClick={() => setActiveStepIdx(idx)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                          isActive
                            ? 'bg-[#0C2168] text-white border-[#0C2168] shadow-lg'
                            : 'bg-[#F4F7FB] hover:bg-slate-100 text-slate-800 border-slate-200/80'
                        }`}
                      >
                        <span
                          className={`font-display font-extrabold text-lg tabular-nums shrink-0 ${
                            isActive ? 'text-[#FFBC7D]' : 'text-[#E7353A]'
                          }`}
                        >
                          {item.step}.
                        </span>
                        <div className="space-y-0.5">
                          <div className="font-display font-bold text-sm">
                            <EditableText
                              textKey={`app.step.${item.step}.title`}
                              defaultValue={item.title}
                              label={`Passo ${item.step} Título`}
                              insideInteractive
                            />
                          </div>
                          <div
                            className={`text-xs leading-relaxed ${
                              isActive ? 'text-white/80' : 'text-slate-600'
                            }`}
                          >
                            <EditableText
                              textKey={`app.step.${item.step}.description`}
                              defaultValue={item.description}
                              label={`Passo ${item.step} Descrição`}
                              multiline
                              insideInteractive
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={OFFICIAL_LINKS.appStore}
                    target="_blank"
                    rel="noreferrer"
                    className="pb-btn-navy px-5 py-3 text-xs rounded-xl inline-flex items-center gap-2"
                  >
                    <EditableText
                      textKey="services.app.appStoreBtn"
                      defaultValue="Baixar na App Store"
                      label="Botão App Store"
                      insideInteractive
                    />
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={OFFICIAL_LINKS.googlePlay}
                    target="_blank"
                    rel="noreferrer"
                    className="pb-btn-primary px-5 py-3 text-xs rounded-xl inline-flex items-center gap-2"
                  >
                    <EditableText
                      textKey="services.app.googlePlayBtn"
                      defaultValue="Baixar no Google Play"
                      label="Botão Google Play"
                      insideInteractive
                    />
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <EditableText
                    textKey="services.app.footnote"
                    defaultValue="*O App Meu PB está disponível nas unidades Cidade Nova, Augusto Montenegro e Senador Lemos."
                    label="Nota de Rodapé App"
                    multiline
                  />
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative bg-gradient-to-br from-[#0C2168] to-[#091952] rounded-3xl p-6 sm:p-8 w-full flex flex-col items-center justify-center border border-[#2A4393]/60 shadow-xl min-h-[340px]">
                  <EditableImageBadge imageKey={currentStep.imageKey} label="Alterar Tela" positionClass="top-3.5 right-3.5" />
                  {currentStepImg ? (
                    <img
                      src={currentStepImg}
                      alt={currentStep.title}
                      className="h-80 sm:h-96 w-auto object-contain rounded-2xl shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-white/70 text-xs font-semibold">
                      Passo {currentStep.step} — {currentStep.title}
                    </div>
                  )}
                  <div className="mt-5 text-center text-white space-y-0.5">
                    <span className="text-[11px] font-bold text-[#FFBC7D] uppercase tracking-widest">
                      Passo {currentStep.step}
                    </span>
                    <p className="font-display font-bold text-lg">
                      <EditableText
                        textKey={`app.step.${currentStep.step}.title`}
                        defaultValue={currentStep.title}
                        label={`Passo ${currentStep.step} Título`}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CARTÃO PB & FORMAS DE PAGAMENTO */}
        {activeTab === 'cartao' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {showCartaoSlot && (
                <div className="lg:col-span-5 relative flex justify-center bg-gradient-to-br from-[#0C2168] to-[#091952] rounded-3xl p-6 overflow-hidden shadow-lg min-h-[240px] items-center">
                  <EditableImageBadge imageKey="homem-cartao-pb" label="Alterar Foto" positionClass="top-3 right-3" />
                  {cartaoPbImg ? (
                    <img
                      src={cartaoPbImg}
                      alt="Cartão Preço Baixo"
                      className="max-h-80 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white/60">Imagem Cartão PB removida</span>
                  )}
                </div>
              )}

              <div className={showCartaoSlot ? 'lg:col-span-7 space-y-5' : 'lg:col-span-12 space-y-5'}>
                <div className="space-y-2 max-w-[56ch]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E7353A]">
                    <EditableText
                      textKey="services.cartao.tag"
                      defaultValue="Cartão Preço Baixo · É Grátis, Tire já o seu!"
                      label="Tag Cartão PB"
                    />
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0C2168] leading-tight">
                    <EditableText
                      textKey="services.cartao.title"
                      defaultValue="Parcele no Cartão PB em até 3x sem juros"
                      label="Título Cartão PB"
                    />
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                    <EditableText
                      textKey="services.cartao.description"
                      defaultValue="Parcele suas compras no Cartão Preço Baixo em até 3x sem juros e nos demais cartões em até 2x sem juros, Cliente PB!"
                      label="Descrição Cartão PB"
                      multiline
                    />
                  </p>
                </div>

                <div className="bg-[#F4F7FB] rounded-2xl p-5 sm:p-6 border border-slate-200/80 space-y-3.5">
                  <p className="text-xs font-bold text-[#0C2168]">
                    <EditableText
                      textKey="services.cartao.notice"
                      defaultValue="Escolha a unidade mais próxima, tire suas dúvidas e solicite pelo WhatsApp:"
                      label="Aviso Cartão PB"
                    />
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {cardStores.map((store) => (
                      <a
                        key={store.id}
                        href={store.cartaoWhatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group px-4 py-2.5 bg-white hover:bg-[#E7353A] text-[#0C2168] hover:text-white border border-slate-200 text-xs font-bold rounded-xl transition-all duration-200 inline-flex items-center gap-2 shadow-sm"
                      >
                        <span>{store.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <h4 className="font-display font-bold text-lg text-[#0C2168]">
                  <EditableText
                    textKey="services.cartao.paymentsTitle"
                    defaultValue="Nossas Formas de Pagamento"
                    label="Título Pagamentos"
                  />
                </h4>
                <span className="text-xs font-medium text-slate-500">
                  <EditableText
                    textKey="services.cartao.paymentsSubtitle"
                    defaultValue="Parcele suas compras nos demais cartões em até 2x sem juros"
                    label="Subtítulo Pagamentos"
                  />
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-10 gap-3 items-center">
                {PAYMENT_BADGES.map((badge, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F4F7FB] border border-slate-200/80 rounded-xl p-2 flex items-center justify-center h-14 hover:bg-white transition-colors"
                  >
                    <img
                      src={badge}
                      alt={`Bandeira de pagamento ${idx + 1}`}
                      className="max-h-9 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PB FARMA */}
        {activeTab === 'farma' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {showFarmaSlot && (
                <div className="lg:col-span-5 relative">
                  {farmaDestaqueImg ? (
                    <img
                      src={farmaDestaqueImg}
                      alt="Farmácias Preço Baixo"
                      className="w-full rounded-2xl object-cover border border-slate-200/80 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-52 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400">
                      Imagem PB Farma removida
                    </div>
                  )}
                  <EditableImageBadge imageKey="farma-destaque" label="Alterar Foto" />
                </div>
              )}
              <div className={showFarmaSlot ? 'lg:col-span-7 space-y-4 max-w-[58ch]' : 'lg:col-span-12 space-y-4 max-w-[65ch]'}>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E7353A]">
                  <EditableText
                    textKey="services.farma.tag"
                    defaultValue="PB Farma · Nossa missão é cuidar de você!"
                    label="Tag PB Farma"
                  />
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0C2168] leading-tight">
                  <EditableText
                    textKey="services.farma.title"
                    defaultValue="Farmácias Preço Baixo"
                    label="Título PB Farma"
                  />
                </h3>
                <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                  <EditableText
                    textKey="services.farma.description"
                    defaultValue="A Farmácia Preço Baixo oferece uma ampla variedade de produtos para tratamento e prevenções: medicamentos, dermocosméticos, higiene e beleza, suplementos e conveniência — tudo com a garantia de qualidade que você merece."
                    label="Descrição PB Farma"
                    multiline
                  />
                </p>
                <a
                  href={OFFICIAL_LINKS.instagramFarma}
                  target="_blank"
                  rel="noreferrer"
                  className="pb-btn-navy px-5 py-3 text-xs rounded-xl inline-flex items-center gap-2"
                >
                  <EditableText
                    textKey="services.farma.followBtn"
                    defaultValue="Seguir @precobaixodrogaria"
                    label="Botão PB Farma"
                    insideInteractive
                  />
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
              {PHARMACIES.map((farma) => {
                const farmaImg = getImage(farma.imageKey, farma.image);
                return (
                  <div
                    key={farma.id}
                    className="bg-[#F4F7FB] hover:bg-white rounded-2xl border border-slate-200/80 p-4 flex gap-4 items-center transition-colors"
                  >
                    {(farmaImg || showInlineEdit) && (
                      <div className="relative shrink-0">
                        {farmaImg ? (
                          <img
                            src={farmaImg}
                            alt={farma.name}
                            className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 bg-white" />
                        )}
                        <EditableImageBadge imageKey={farma.imageKey} compact positionClass="-top-1.5 -right-1.5" />
                      </div>
                    )}
                    <div className="min-w-0 space-y-1">
                      <h4 className="font-display font-bold text-sm text-[#0C2168] truncate">
                        <EditableText
                          textKey={`farma.${farma.id}.name`}
                          defaultValue={farma.name}
                          label={`Nome (${farma.name})`}
                        />
                      </h4>
                      <p className="text-[11px] text-slate-600 flex items-start gap-1 leading-snug">
                        <MapPin className="w-3 h-3 text-[#E7353A] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          <EditableText
                            textKey={`farma.${farma.id}.address`}
                            defaultValue={farma.address}
                            label={`Endereço (${farma.name})`}
                            multiline
                          />
                        </span>
                      </p>
                      <p className="text-xs font-bold text-[#0C2168] flex items-center gap-1 tabular-nums">
                        <Phone className="w-3 h-3 text-[#E7353A] shrink-0" />
                        <span>
                          <EditableText
                            textKey={`farma.${farma.id}.phone`}
                            defaultValue={farma.phone}
                            label={`Telefone (${farma.name})`}
                          />
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ADEGA PB */}
        {activeTab === 'adega' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {showAdegaSlot && (
                <div className="lg:col-span-5 relative">
                  {adegaImg ? (
                    <img
                      src={adegaImg}
                      alt="Adega Preço Baixo - Harmonização"
                      className="w-full rounded-2xl object-cover border border-slate-200/80 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-52 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400">
                      Imagem Adega PB removida
                    </div>
                  )}
                  <EditableImageBadge imageKey="adega-harmonizacao" label="Alterar Foto" />
                </div>
              )}

              <div className={showAdegaSlot ? 'lg:col-span-7 space-y-5' : 'lg:col-span-12 space-y-5'}>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E7353A]">
                    <EditableText textKey="services.adega.tag" defaultValue="Adega Preço Baixo" label="Tag Adega PB" />
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0C2168] leading-tight">
                    <EditableText
                      textKey="services.adega.title"
                      defaultValue="Rótulos selecionados & Guia de Harmonização"
                      label="Título Adega PB"
                    />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    <EditableText
                      textKey="services.adega.subtitle"
                      defaultValue="Disponível nas unidades Augusto Montenegro, Cidade Nova e Senador Lemos."
                      label="Subtítulo Adega PB"
                      multiline
                    />
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {WINE_GUIDE.map((wine, idx) => (
                    <button
                      key={wine.id}
                      onClick={() => setActiveWineIdx(idx)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                        activeWineIdx === idx
                          ? 'bg-[#0C2168] text-white shadow-sm'
                          : 'bg-[#F4F7FB] text-slate-700 hover:text-[#0C2168]'
                      }`}
                    >
                      <EditableText
                        textKey={`wine.${wine.id}.country`}
                        defaultValue={wine.country}
                        label={`País (${wine.country})`}
                        insideInteractive
                      />
                    </button>
                  ))}
                </div>

                <div className="bg-[#F4F7FB] rounded-2xl p-6 border border-slate-200/80 space-y-3">
                  <div className="text-xs font-bold text-[#E7353A] uppercase tracking-wider">
                    <EditableText
                      textKey={`wine.${currentWine.id}.tagline`}
                      defaultValue={currentWine.tagline}
                      label={`Subtítulo Vinho (${currentWine.country})`}
                    />
                  </div>
                  <h4 className="font-display font-bold text-xl text-[#0C2168]">
                    <EditableText
                      textKey={`wine.${currentWine.id}.country`}
                      defaultValue={currentWine.country}
                      label={`País (${currentWine.country})`}
                    />
                  </h4>
                  <p className="text-sm text-slate-600 leading-[1.7] max-w-[60ch]">
                    <EditableText
                      textKey={`wine.${currentWine.id}.summary`}
                      defaultValue={currentWine.summary}
                      label={`Resumo (${currentWine.country})`}
                      multiline
                    />
                  </p>
                  <div className="pt-2 flex flex-wrap gap-5 text-xs font-bold text-[#0C2168]">
                    {currentWine.highlights.map((hl) => (
                      <span key={hl} className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#E7353A]" />
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
