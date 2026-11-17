import React, { useState } from 'react';
import { MapPin, Clock, Phone, ExternalLink, X, Navigation, ArrowRight } from 'lucide-react';
import { STORES, StoreUnit } from '../data/pbData';
import { useSiteData } from '../context/SiteDataContext';
import { EditableImageBadge } from './EditableImage';
import { EditableText } from './EditableText';
import { DraggableCard } from './DraggableLayoutPrimitives';

export const StoresSection: React.FC = () => {
  const [cityFilter, setCityFilter] = useState<'Todas' | 'Belém' | 'Ananindeua'>('Todas');
  const [serviceFilter, setServiceFilter] = useState<string>('Todos');
  const [selectedStore, setSelectedStore] = useState<StoreUnit | null>(null);
  const { getImage, sortByCardOrder } = useSiteData();

  const serviceOptions = [
    'Todos',
    'Farmácia',
    'Adega',
    'Aplicativo Meu PB',
    'Banco 24 horas',
    'Padaria',
    'Casa lotérica',
  ];

  const orderedStores = sortByCardOrder('stores', STORES, (s) => s.id);
  const filteredStores = orderedStores.filter((store) => {
    const matchCity = cityFilter === 'Todas' || store.city === cityFilter;
    const matchService =
      serviceFilter === 'Todos' || store.services.includes(serviceFilter);
    return matchCity && matchService;
  });

  const selectedStoreImg = selectedStore
    ? getImage(selectedStore.imageKey, selectedStore.photoImage)
    : null;

  return (
    <section id="lojas" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E7353A]">
              <span className="w-5 h-[2px] bg-[#E7353A] rounded-full" />
              <EditableText textKey="stores.eyebrow" defaultValue="Nossas 8 Unidades" label="Subtítulo Lojas" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0C2168] tracking-tight leading-[1.12]">
              <EditableText
                textKey="stores.heading"
                defaultValue="Saiba tudo sobre a sua unidade favorita!"
                label="Título Lojas"
              />
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              <EditableText
                textKey="stores.subtitle"
                defaultValue="Filtre por cidade ou serviço disponível para conferir endereço, horários, telefone e rota no mapa."
                label="Descrição Lojas"
                multiline
              />
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* City Filter */}
            <div className="inline-flex bg-[#F4F7FB] p-1.5 rounded-2xl border border-slate-200">
              {(['Todas', 'Belém', 'Ananindeua'] as const).map((city) => (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                    cityFilter === city
                      ? 'bg-[#0C2168] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0C2168]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Service Filter */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              aria-label="Filtrar por serviço"
              className="bg-[#F4F7FB] border border-slate-200 text-xs font-bold text-[#0C2168] rounded-2xl px-4 py-3 outline-none focus:border-[#0C2168] cursor-pointer"
            >
              {serviceOptions.map((srv) => (
                <option key={srv} value={srv}>
                  {srv === 'Todos' ? 'Todos os Serviços' : srv}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStores.map((store) => {
            const storeImg = getImage(store.imageKey, store.photoImage);
            return (
              <DraggableCard
                key={store.id}
                group="stores"
                cardId={store.id}
                defaultIds={STORES.map((s) => s.id)}
                className="flex"
              >
                <div className="w-full pb-card-surface rounded-3xl overflow-hidden flex flex-col justify-between group hover:-translate-y-1">
                <div className="relative aspect-[4/3] bg-[#0C2168] overflow-hidden">
                  {storeImg ? (
                    <img
                      src={storeImg}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 text-center bg-gradient-to-br from-[#0C2168] to-[#173594]">
                      <span className="font-display font-extrabold text-xl text-white/90">
                        {store.name}
                      </span>
                    </div>
                  )}
                  <EditableImageBadge imageKey={store.imageKey} label="Alterar Foto" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C2168]/85 via-[#0C2168]/15 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFBC7D]">
                      {store.city} · PA
                    </span>
                    <span className="text-[11px] font-medium text-white/85">
                      {store.services.length} serviços
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-lg text-[#0C2168] leading-snug">
                      <EditableText
                        textKey={`store.${store.id}.name`}
                        defaultValue={store.name}
                        label={`Nome (${store.name})`}
                      />
                    </h3>

                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#E7353A] shrink-0 mt-0.5" />
                        <span>
                          <EditableText
                            textKey={`store.${store.id}.address`}
                            defaultValue={store.address}
                            label={`Endereço (${store.name})`}
                            multiline
                          />
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#0C2168] shrink-0 mt-0.5" />
                        <span>
                          <EditableText
                            textKey={`store.${store.id}.hours`}
                            defaultValue={store.hours}
                            label={`Horário (${store.name})`}
                          />
                        </span>
                      </p>
                      <p className="flex items-center gap-2 font-bold text-[#0C2168] tabular-nums">
                        <Phone className="w-3.5 h-3.5 text-[#E7353A] shrink-0" />
                        <span>
                          <EditableText
                            textKey={`store.${store.id}.phone`}
                            defaultValue={store.phone}
                            label={`Telefone (${store.name})`}
                          />
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedStore(store)}
                      className="flex-1 pb-btn-navy py-2.5 px-3 text-xs rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <EditableText
                        textKey="stores.detailsBtn"
                        defaultValue="Detalhes & Mapa"
                        label="Botão Detalhes da Loja"
                        insideInteractive
                      />
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-[#F4F7FB] hover:bg-[#E7353A] text-[#0C2168] hover:text-white border border-slate-200/80 rounded-xl transition-colors"
                      aria-label={`Abrir ${store.name} no Google Maps`}
                    >
                      <Navigation className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
              </DraggableCard>
            );
          })}
        </div>
      </div>

      {/* Store Detail & Google Maps Modal */}
      {selectedStore && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedStore(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 sm:h-64 bg-[#0C2168]">
              {selectedStoreImg && (
                <img
                  src={selectedStoreImg}
                  alt={selectedStore.name}
                  className="w-full h-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C2168] via-[#0C2168]/40 to-transparent" />
              <button
                onClick={() => setSelectedStore(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/50 hover:bg-[#E7353A] text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Fechar detalhes da loja"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-bold text-[#FFBC7D] uppercase tracking-wider">
                  {selectedStore.city} · Pará
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold mt-0.5">
                  <EditableText
                    textKey={`store.${selectedStore.id}.name`}
                    defaultValue={selectedStore.name}
                    label={`Nome (${selectedStore.name})`}
                  />
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#E7353A] shrink-0 mt-1" />
                    <span>
                      <EditableText
                        textKey={`store.${selectedStore.id}.address`}
                        defaultValue={selectedStore.address}
                        label={`Endereço (${selectedStore.name})`}
                        multiline
                      />
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#0C2168] shrink-0 mt-1" />
                    <span>
                      <EditableText
                        textKey={`store.${selectedStore.id}.hours`}
                        defaultValue={selectedStore.hours}
                        label={`Horário (${selectedStore.name})`}
                      />
                    </span>
                  </p>
                  <p className="flex items-center gap-2.5 font-bold text-[#0C2168] tabular-nums">
                    <Phone className="w-4 h-4 text-[#E7353A] shrink-0" />
                    <span>
                      <EditableText
                        textKey={`store.${selectedStore.id}.phone`}
                        defaultValue={selectedStore.phone}
                        label={`Telefone (${selectedStore.name})`}
                      />
                    </span>
                  </p>
                </div>

                <div>
                  <h4 className="font-display font-bold text-xs text-[#0C2168] uppercase tracking-wider mb-2">
                    Serviços Disponíveis na Unidade
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedStore.services.join(' · ')}
                  </p>
                  {selectedStore.cartaoWhatsappUrl && (
                    <a
                      href={selectedStore.cartaoWhatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 pb-btn-primary px-4 py-2.5 text-xs rounded-xl inline-flex items-center gap-2"
                    >
                      <span>Solicitar Cartão PB nesta loja</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <iframe
                  src={selectedStore.mapsEmbedUrl}
                  title={`Mapa ${selectedStore.name}`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="flex justify-end">
                <a
                  href={selectedStore.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pb-btn-navy px-5 py-3 text-xs rounded-xl inline-flex items-center gap-2"
                >
                  <span>Abrir Rota no Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
