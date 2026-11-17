import React, { useMemo, useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  Check,
  ArrowRight,
  ArrowLeft,
  FilePlus2,
  Shield,
} from 'lucide-react';
import { JobPosting } from '../types';
import { useSiteData } from '../context/SiteDataContext';
import { EditableText } from './EditableText';

interface CareersSectionProps {
  onApplyJob: (job: JobPosting | null) => void;
  onOpenAdmin: () => void;
  onBackToHome?: () => void;
}

export const CareersSection: React.FC<CareersSectionProps> = ({
  onApplyJob,
  onOpenAdmin,
  onBackToHome,
}) => {
  const { jobs, adminUser } = useSiteData();
  const [unitFilter, setUnitFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const activeJobs = useMemo(() => jobs.filter((j) => j.active), [jobs]);

  const unitOptions = useMemo(() => {
    const units = Array.from(new Set(activeJobs.map((j) => j.unit)));
    return ['Todas', ...units];
  }, [activeJobs]);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activeJobs.filter((job) => {
      const matchUnit = unitFilter === 'Todas' || job.unit === unitFilter;
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.unit.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q);
      return matchUnit && matchSearch;
    });
  }, [activeJobs, unitFilter, searchQuery]);

  return (
    <section id="vagas" className="py-12 sm:py-16 bg-[#F4F7FB] flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {onBackToHome && (
          <div>
            <button
              type="button"
              onClick={onBackToHome}
              className="px-4 py-2 bg-white hover:bg-[#0C2168] text-[#0C2168] hover:text-white border border-slate-200 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <EditableText
                textKey="careers.backBtn"
                defaultValue="Voltar para a Página Inicial"
                label="Botão Voltar (Carreiras)"
                insideInteractive
              />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E7353A]">
              <span className="w-5 h-[2px] bg-[#E7353A] rounded-full" />
              <EditableText
                textKey="careers.eyebrow"
                defaultValue="Carreiras · #SejaPB"
                label="Subtítulo Página Carreiras"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0C2168] tracking-tight leading-[1.12]">
              <EditableText
                textKey="careers.heading"
                defaultValue="Trabalhe Conosco — Vagas Abertas"
                label="Título Página Carreiras"
              />
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              <EditableText
                textKey="careers.subtitle"
                defaultValue="Escolha uma oportunidade em nossas 8 lojas ou cadastre seu currículo diretamente no nosso Banco de Talentos integrado, sem sair do site."
                label="Descrição Página Carreiras"
                multiline
              />
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onApplyJob(null)}
              className="pb-btn-primary px-5 py-3 text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <FilePlus2 className="w-4 h-4" />
              <EditableText
                textKey="careers.applyGeneralBtn"
                defaultValue="Enviar Currículo (Banco de Talentos)"
                label="Botão Banco de Talentos"
                insideInteractive
              />
            </button>

            <button
              onClick={onOpenAdmin}
              className="px-4 py-3 bg-white hover:bg-[#0C2168] text-[#0C2168] hover:text-white border border-slate-200 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            >
              <Shield className="w-4 h-4 text-[#E7353A]" />
              <span>{adminUser ? 'Painel RH / Admin' : 'Acesso RH / Admin'}</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar vaga por cargo, setor ou loja..."
              className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              aria-label="Filtrar vagas por unidade"
              className="bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0C2168] outline-none focus:border-[#0C2168] cursor-pointer"
            >
              {unitOptions.map((u) => (
                <option key={u} value={u}>
                  {u === 'Todas' ? 'Todas as Unidades' : u}
                </option>
              ))}
            </select>

            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              {filteredJobs.length}{' '}
              {filteredJobs.length === 1 ? 'vaga disponível' : 'vagas disponíveis'}
            </span>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-[#0C2168]/40 mx-auto" />
            <h3 className="font-display font-bold text-xl text-[#0C2168]">
              Nenhuma vaga encontrada com este filtro
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Você ainda pode enviar seu currículo para o nosso Banco de Talentos para futuras oportunidades nas 8 lojas.
            </p>
            <button
              onClick={() => onApplyJob(null)}
              className="pb-btn-navy px-5 py-3 text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Cadastrar Currículo no Banco de Talentos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="pb-card-surface rounded-3xl p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#E7353A] flex items-center gap-1.5">
                      <span>{job.department}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[#0C2168]">{job.contractType}</span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#0C2168] leading-snug">
                      {job.title}
                    </h3>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 font-semibold text-[#0C2168]">
                      <MapPin className="w-3.5 h-3.5 text-[#E7353A] shrink-0" />
                      <span>{job.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#0C2168] shrink-0" />
                      <span>{job.schedule}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  {job.requirements.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Requisitos Principais
                      </div>
                      <ul className="space-y-1">
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-600 flex items-start gap-1.5 leading-snug"
                          >
                            <Check className="w-3.5 h-3.5 text-[#E7353A] shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onApplyJob(job)}
                  className="w-full pb-btn-navy py-3 px-4 text-xs rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <EditableText
                    textKey="careers.applyJobBtn"
                    defaultValue="Candidatar-se à Vaga"
                    label="Botão Candidatar-se"
                    insideInteractive
                  />
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
