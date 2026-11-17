import React, { useState } from 'react';
import { Menu, X, MessageCircle, ArrowRight, Shield } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { EditableImageBadge } from './EditableImage';
import { EditableText } from './EditableText';

interface NavbarProps {
  onOpenWhatsAppModal: () => void;
  onNavigateHome: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenCareers: () => void;
  onOpenAdmin: () => void;
  activePage: 'home' | 'careers';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWhatsAppModal,
  onNavigateHome,
  onNavigateSection,
  onOpenCareers,
  onOpenAdmin,
  activePage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getImage, adminToken, isSuperAdmin, themeConfig } = useSiteData();
  const logoSrc = getImage('logo-branca', '/pb-assets/logo-branca.png');
  const isLightText = themeConfig.navbarText.toUpperCase() === '#FFFFFF';

  const sectionItems = [
    { label: 'Ofertas', href: '#ofertas' },
    { label: 'Nossa História', href: '#historia' },
    { label: 'Nossas Lojas', href: '#lojas' },
    { label: 'App & Serviços', href: '#servicos' },
  ];

  return (
    <header
      style={{
        backgroundColor: themeConfig.navbarBg,
        color: themeConfig.navbarText,
      }}
      className="sticky top-0 z-40 backdrop-blur-xl border-b border-black/10 shadow-[0_4px_24px_-6px_rgba(12,33,104,0.35)] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 xl:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="relative inline-flex items-center shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className="flex items-center shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50 rounded-xl p-1 -ml-1 transition-transform hover:scale-[1.02]"
            aria-label="Preço Baixo Atacadista - Início"
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt="Preço Baixo Atacadista"
                className={`h-9 sm:h-10 xl:h-11 w-auto object-contain ${
                  !isLightText ? 'bg-[#0C2168] px-2.5 py-1 rounded-xl' : ''
                }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight">
                PREÇO BAIXO <span className="text-[#E7353A]">ATACADISTA</span>
              </span>
            )}
          </a>
          <EditableImageBadge imageKey="logo-branca" compact positionClass="-top-1 -right-2" />
        </div>

        {/* Zone 2: Clean Typography Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13px] font-semibold tracking-wide">
          {sectionItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => onNavigateSection(item.href)}
              className="opacity-85 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shrink-0 relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:rounded-full after:bg-[#E7353A] hover:after:w-full after:transition-all after:duration-200 cursor-pointer"
            >
              <EditableText
                textKey={`nav.${item.href.slice(1)}`}
                defaultValue={item.label}
                label={`Menu: ${item.label}`}
                insideInteractive
              />
            </button>
          ))}
          <button
            type="button"
            onClick={onOpenCareers}
            className={`transition-opacity duration-200 whitespace-nowrap shrink-0 relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:bg-[#E7353A] after:transition-all after:duration-200 cursor-pointer ${
              activePage === 'careers'
                ? 'opacity-100 after:w-full font-bold'
                : 'opacity-85 hover:opacity-100 after:w-0 hover:after:w-full'
            }`}
          >
            <EditableText
              textKey="nav.careers"
              defaultValue="Trabalhe Conosco"
              label="Menu: Trabalhe Conosco"
              insideInteractive
            />
          </button>
        </nav>

        {/* Zone 3: Admin Login + PB no Zapp + Mobile Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenAdmin}
            className={`hidden sm:inline-flex px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              adminToken
                ? isLightText
                  ? 'bg-[#FFBC7D]/15 border-[#FFBC7D]/50 text-[#FFBC7D] hover:bg-[#FFBC7D] hover:text-[#0C2168]'
                  : 'bg-[#0C2168] border-[#0C2168] text-white hover:bg-[#E7353A] hover:border-[#E7353A]'
                : isLightText
                ? 'bg-white/10 border-white/25 text-white hover:bg-white hover:text-[#0C2168]'
                : 'bg-[#0C2168]/10 border-[#0C2168]/25 text-[#0C2168] hover:bg-[#0C2168] hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>{adminToken ? (isSuperAdmin ? 'Painel Adm' : 'Painel RH') : 'Login Adm'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenWhatsAppModal}
            className="group pb-btn-primary px-4 sm:px-5 py-2.5 text-xs rounded-xl flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <EditableText
              textKey="nav.cta"
              defaultValue="PB no Zapp"
              label="Botão Menu Principal"
              insideInteractive
            />
            <ArrowRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform hidden xl:inline" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className={`lg:hidden p-2.5 rounded-xl transition-colors cursor-pointer ${
              isLightText ? 'bg-white/10 hover:bg-white/20' : 'bg-[#0C2168]/10 hover:bg-[#0C2168]/20'
            }`}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: themeConfig.navbarBg,
            color: themeConfig.navbarText,
          }}
          className="lg:hidden border-t border-black/10 px-4 py-4 space-y-1.5"
        >
          {sectionItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection(item.href);
              }}
              className="w-full text-left block px-4 py-3 rounded-xl text-sm font-semibold opacity-90 hover:opacity-100 hover:bg-black/10 transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCareers();
            }}
            className={`w-full text-left block px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activePage === 'careers'
                ? 'bg-[#E7353A] text-white font-bold'
                : 'opacity-90 hover:opacity-100 hover:bg-black/10'
            }`}
          >
            Trabalhe Conosco
          </button>
          <div className="pt-2 border-t border-black/10">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-black/15 hover:bg-black/25 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>
                {adminToken
                  ? isSuperAdmin
                    ? 'Acessar Painel Administrativo'
                    : 'Acessar Painel RH'
                  : 'Login Administrativo (RH)'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
