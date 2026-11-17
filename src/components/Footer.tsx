import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { OFFICIAL_LINKS, STORES } from '../data/pbData';
import { useSiteData } from '../context/SiteDataContext';
import { EditableImageBadge } from './EditableImage';
import { EditableText } from './EditableText';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenCareers: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenCareers,
  onNavigateSection,
}) => {
  const [legalModal, setLegalModal] = useState<'termos' | 'privacidade' | null>(null);
  const { getImage, adminUser } = useSiteData();
  const logoSrc = getImage('logo-branca', '/pb-assets/logo-branca.png');

  return (
    <footer className="bg-[#0C2168] text-white pt-14 pb-10 border-t-4 border-[#E7353A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/15">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="relative inline-block">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt="Preço Baixo Atacadista"
                  className="h-11 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="font-display font-extrabold text-xl text-white">
                  PREÇO BAIXO <span className="text-[#E7353A]">ATACADISTA</span>
                </div>
              )}
              <EditableImageBadge imageKey="logo-branca" compact positionClass="-top-2 -right-3" />
            </div>
            <p className="text-xs text-white/75 leading-relaxed max-w-sm">
              <EditableText
                textKey="footer.description"
                defaultValue="Há 20 anos oferecendo produtos de qualidade e atendimento acolhedor em Belém e Ananindeua (PA). No varejo e no atacado, é sempre Preço Baixo!"
                label="Descrição Rodapé"
                multiline
              />
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/85 pt-1">
              <a href={OFFICIAL_LINKS.facebook} target="_blank" rel="noreferrer" className="hover:text-[#FFBC7D]">
                Facebook
              </a>
              <span aria-hidden="true">·</span>
              <a href={OFFICIAL_LINKS.instagram} target="_blank" rel="noreferrer" className="hover:text-[#FFBC7D]">
                Instagram
              </a>
              <span aria-hidden="true">·</span>
              <a href={OFFICIAL_LINKS.youtube} target="_blank" rel="noreferrer" className="hover:text-[#FFBC7D]">
                YouTube
              </a>
              <span aria-hidden="true">·</span>
              <a href={OFFICIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#FFBC7D]">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Stores Column */}
          <div className="md:col-span-4">
            <h4 className="font-display font-bold text-sm text-[#FFBC7D] uppercase tracking-wider mb-4">
              <EditableText textKey="footer.storesTitle" defaultValue="Nossas Lojas" label="Título Coluna Lojas (Rodapé)" />
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-white/80">
              {STORES.map((store) => (
                <li key={store.id}>
                  <button
                    type="button"
                    onClick={() => onNavigateSection('#lojas')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {store.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Links */}
          <div className="md:col-span-4">
            <h4 className="font-display font-bold text-sm text-[#FFBC7D] uppercase tracking-wider mb-4">
              <EditableText textKey="footer.linksTitle" defaultValue="Institucional & Serviços" label="Título Coluna Institucional (Rodapé)" />
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-white/80">
              <li><button type="button" onClick={() => onNavigateSection('#historia')} className="hover:text-white cursor-pointer">Sobre nós</button></li>
              <li><button type="button" onClick={() => onNavigateSection('#ofertas')} className="hover:text-white cursor-pointer">Ofertas</button></li>
              <li><button type="button" onClick={() => onNavigateSection('#servicos')} className="hover:text-white cursor-pointer">Cartão PB</button></li>
              <li><button type="button" onClick={() => onNavigateSection('#servicos')} className="hover:text-white cursor-pointer">Farmácia PB</button></li>
              <li><button type="button" onClick={() => onNavigateSection('#servicos')} className="hover:text-white cursor-pointer">App Meu PB</button></li>
              <li><button type="button" onClick={() => onNavigateSection('#servicos')} className="hover:text-white cursor-pointer">Adega PB</button></li>
              <li><button type="button" onClick={onOpenCareers} className="hover:text-[#FFBC7D] font-semibold cursor-pointer">Trabalhe conosco</button></li>
              <li><button type="button" onClick={() => onNavigateSection('#contato')} className="hover:text-white cursor-pointer">Fale Conosco</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>
            <EditableText
              textKey="footer.copyright"
              defaultValue="© Copyright Grupo Preço Baixo | Todos os Direitos Reservados"
              label="Copyright Rodapé"
            />
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => setLegalModal('termos')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Termos de Uso (App Meu PB)
            </button>
            <button
              onClick={() => setLegalModal('privacidade')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Política de Privacidade
            </button>
            <button
              onClick={onOpenAdmin}
              className="text-white/85 hover:text-[#FFBC7D] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#E7353A]" />
              <span>{adminUser ? 'Painel RH / Admin' : 'Área RH / Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="bg-white text-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-display font-bold text-xl text-[#0C2168]">
                {legalModal === 'termos'
                  ? 'Termos de Uso — Aplicativo Meu PB'
                  : 'Política de Privacidade — Grupo Preço Baixo'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed space-y-3 max-h-[60vh] overflow-y-auto">
              {legalModal === 'termos' ? (
                <>
                  <p>
                    O Aplicativo <strong>Meu PB</strong> é disponibilizado pelo Grupo Preço Baixo Atacadista para consulta de produtos, ofertas e realização de pedidos nas áreas de cobertura das unidades Cidade Nova, Augusto Montenegro e Senador Lemos.
                  </p>
                  <p>
                    Os pedidos podem ser recebidos no endereço cadastrado (dentro do raio de entrega disponível) ou retirados diretamente na unidade selecionada no momento da compra.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    O <strong>Grupo Preço Baixo</strong> respeita a privacidade dos seus clientes e utiliza os dados fornecidos nos canais digitais exclusivamente para atendimento, comunicação de ofertas autorizadas e melhoria contínua dos serviços.
                  </p>
                  <p>
                    Para dúvidas relacionadas à LGPD, Ouvidoria ou solicitações sobre seus dados, entre em contato pelo e-mail oficial: <strong>{OFFICIAL_LINKS.email}</strong>.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
