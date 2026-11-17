import React from 'react';
import { X, MessageCircle, ExternalLink } from 'lucide-react';
import { WHATSAPP_GROUPS } from '../data/pbData';

interface WhatsAppGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppGroupsModal: React.FC<WhatsAppGroupsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0C2168] text-white flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#FFBC7D]" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[#0C2168]">
                PB NO ZAPP!
              </h2>
              <p className="text-xs text-slate-600">
                Receba ofertas e novidades diariamente
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar grupos do WhatsApp"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Escolha um dos nossos grupos oficiais no WhatsApp para acompanhar encartes, Quarta da Carne, Quinta do Horti e ofertas de fim de semana em Belém e Ananindeua:
        </p>

        <div className="space-y-2.5">
          {WHATSAPP_GROUPS.map((group) => (
            <a
              key={group.id}
              href={group.url}
              target="_blank"
              rel="noreferrer"
              className="w-full px-4 py-3.5 bg-[#F0F5FA] hover:bg-[#0C2168] text-[#0C2168] hover:text-white border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#E7353A]" />
                <span>Entrar no {group.label}</span>
              </span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
