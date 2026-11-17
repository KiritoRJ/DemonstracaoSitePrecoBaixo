import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Move,
  Palette,
  RotateCcw,
  Shield,
  Type,
} from 'lucide-react';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { OffersAndFlyersSection } from './components/OffersAndFlyersSection';
import { HistoryAndMetricsSection } from './components/HistoryAndMetricsSection';
import { StoresSection } from './components/StoresSection';
import { ServicesEcosystemSection } from './components/ServicesEcosystemSection';
import { CareersSection } from './components/CareersSection';
import { CommunityAndContactSection } from './components/CommunityAndContactSection';
import { Footer } from './components/Footer';
import { WhatsAppGroupsModal } from './components/WhatsAppGroupsModal';
import { AiChefAssistant } from './components/AiChefAssistant';
import { JobApplicationModal } from './components/JobApplicationModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { QuickImageEditorModal } from './components/QuickImageEditorModal';
import { QuickTextEditorModal } from './components/QuickTextEditorModal';
import { LiveColorCustomizer } from './components/LiveColorCustomizer';
import { DraggableSection } from './components/DraggableLayoutPrimitives';
import { LocalSeoHead } from './components/LocalSeoHead';
import { HomeSectionId, JobPosting } from './types';

const SECTION_LABELS: Record<HomeSectionId, string> = {
  hero: 'Banner & Campanhas (Hero)',
  offers: 'Encartes & Vídeo Oficial',
  history: 'Nossa História & Indicadores',
  stores: 'Nossas 8 Lojas',
  services: 'App Meu PB, Cartão, Farma & Adega',
  community: 'PB no Zapp, Instagram & Contato',
};

function AppShell() {
  const {
    adminToken,
    adminUser,
    isSuperAdmin,
    inlineEditMode,
    setInlineEditMode,
    textEditMode,
    setTextEditMode,
    layoutEditMode,
    setLayoutEditMode,
    isColorEditorOpen,
    setIsColorEditorOpen,
    layoutConfig,
    resetLayout,
    openImageEditor,
    logoutAdmin,
  } = useSiteData();

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isAiChefOpen, setIsAiChefOpen] = useState(false);

  // Integrated Job Application Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  // Page & Admin State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'careers' | 'admin'>('home');

  const handleOpenApply = (job: JobPosting | null) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleOpenAdmin = () => {
    if (adminToken) {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCareers = () => {
    setCurrentPage('careers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSection = (sectionId: string) => {
    const cleanId = sectionId.startsWith('#') ? sectionId.slice(1) : sectionId;
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(cleanId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      const el = document.getElementById(cleanId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentPage === 'admin' && adminToken) {
    return (
      <>
        <LocalSeoHead currentPage={currentPage} />
        <AdminDashboard onBackToSite={() => setCurrentPage('home')} />
      </>
    );
  }

  const renderHomeSection = (sectionId: HomeSectionId) => {
    switch (sectionId) {
      case 'hero':
        return <HeroCarousel />;
      case 'offers':
        return <OffersAndFlyersSection onOpenAiChef={() => setIsAiChefOpen(true)} />;
      case 'history':
        return <HistoryAndMetricsSection onOpenCareers={navigateToCareers} />;
      case 'stores':
        return <StoresSection />;
      case 'services':
        return <ServicesEcosystemSection />;
      case 'community':
        return (
          <CommunityAndContactSection
            onOpenCareers={navigateToCareers}
            onApplyGeneral={() => handleOpenApply(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F0F5FA] text-[#1E293B] ${
        isSuperAdmin && layoutEditMode ? 'pb-layout-editing' : ''
      }`}
    >
      <LocalSeoHead currentPage={currentPage} />
      <Navbar
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onNavigateHome={navigateToHome}
        onNavigateSection={navigateToSection}
        onOpenCareers={navigateToCareers}
        onOpenAdmin={handleOpenAdmin}
        activePage={currentPage === 'careers' ? 'careers' : 'home'}
      />

      {/* Visual Builder Toolbar ONLY for Super Admin */}
      {isSuperAdmin && (
        <div className="bg-[#091952] text-white border-b border-white/15 py-2.5 px-4 sm:px-6 lg:px-8 sticky top-20 z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFBC7D]/15 text-[#FFBC7D] font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>Modo Adm ({adminUser?.name || 'RH'})</span>
              </span>
              <span className="hidden xl:inline text-white/75">
                {textEditMode
                  ? 'Clique em qualquer texto (ou lápis nos botões) para editar.'
                  : layoutEditMode
                  ? 'Segure e arraste seções ou cards para organizar o layout.'
                  : 'Modo de visualização pública limpo ativo.'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setLayoutEditMode((v) => !v)}
                className={`px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  layoutEditMode
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 hover:bg-emerald-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                <span>{layoutEditMode ? 'Arrastar Layout: ON' : 'Arrastar Layout: OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsColorEditorOpen((v) => !v)}
                className={`px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isColorEditorOpen
                    ? 'bg-[#FFBC7D] text-[#0C2168]'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Cores do Menu & Botões</span>
              </button>

              <button
                type="button"
                onClick={() => setTextEditMode((v) => !v)}
                className={`px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  textEditMode
                    ? 'bg-amber-400/20 text-amber-200 border border-amber-400/45 hover:bg-amber-400/30'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>{textEditMode ? 'Textos: ON' : 'Textos: OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setInlineEditMode((v) => !v)}
                className={`px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  inlineEditMode
                    ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 hover:bg-sky-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {inlineEditMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{inlineEditMode ? 'Imagens: ON' : 'Imagens: OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => openImageEditor('hero-bg')}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
              >
                Fundo Hero
              </button>

              <button
                type="button"
                onClick={resetLayout}
                title="Restaurar ordem original do layout"
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Ordem Padrão</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage('admin')}
                className="px-3 py-1.5 rounded-lg bg-[#E7353A] hover:bg-[#c82328] text-white font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Painel Completo</span>
              </button>

              <button
                type="button"
                onClick={logoutAdmin}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/85 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                title="Sair do modo administrativo"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean read-only notice bar for RH users viewing the public site */}
      {adminToken && !isSuperAdmin && (
        <div className="bg-[#091952] text-white border-b border-white/15 py-2.5 px-4 sm:px-6 lg:px-8 sticky top-20 z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-400/15 text-emerald-200 font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>Acesso RH ({adminUser?.name || 'RH'})</span>
              </span>
              <span className="hidden md:inline text-white/75">
                Modo de visualização pública (alterações no layout do site restritas ao Administrador).
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage('admin')}
                className="px-3 py-1.5 rounded-lg bg-[#E7353A] hover:bg-[#c82328] text-white font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Voltar ao Painel RH</span>
              </button>
              <button
                type="button"
                onClick={logoutAdmin}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/85 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col">
        {currentPage === 'careers' ? (
          <CareersSection
            onApplyJob={handleOpenApply}
            onOpenAdmin={handleOpenAdmin}
            onBackToHome={navigateToHome}
          />
        ) : (
          layoutConfig.sectionOrder.map((sectionId, idx) => (
            <DraggableSection
              key={sectionId}
              sectionId={sectionId}
              title={SECTION_LABELS[sectionId] || sectionId}
              index={idx}
              total={layoutConfig.sectionOrder.length}
            >
              {renderHomeSection(sectionId)}
            </DraggableSection>
          ))
        )}
      </main>

      <Footer
        onOpenAdmin={handleOpenAdmin}
        onOpenCareers={navigateToCareers}
        onNavigateSection={navigateToSection}
      />

      <WhatsAppGroupsModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      <AiChefAssistant
        isOpen={isAiChefOpen}
        onClose={() => setIsAiChefOpen(false)}
      />

      <JobApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        selectedJob={selectedJob}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setCurrentPage('admin')}
      />

      {isSuperAdmin && (
        <>
          <QuickImageEditorModal />
          <QuickTextEditorModal />
          <LiveColorCustomizer />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <AppShell />
    </SiteDataProvider>
  );
}
