import React from 'react';
import { Pencil, EyeOff } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface EditableImageBadgeProps {
  imageKey: string;
  label?: string;
  compact?: boolean;
  positionClass?: string;
}

export const EditableImageBadge: React.FC<EditableImageBadgeProps> = ({
  imageKey,
  label = 'Alterar imagem',
  compact = false,
  positionClass = 'top-2.5 right-2.5',
}) => {
  const { isSuperAdmin, inlineEditMode, openImageEditor, isImageRemoved } = useSiteData();

  if (!isSuperAdmin || !inlineEditMode) return null;

  const removed = isImageRemoved(imageKey);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openImageEditor(imageKey);
      }}
      title={removed ? 'Restaurar ou enviar nova imagem' : label}
      className={`absolute ${positionClass} z-30 inline-flex items-center gap-1.5 rounded-xl font-bold shadow-lg border transition-all cursor-pointer ${
        removed
          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-300'
          : 'bg-[#0C2168]/95 hover:bg-[#E7353A] text-white border-white/30 backdrop-blur-md'
      } ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-[11px]'}`}
    >
      {removed ? <EyeOff className="w-3 h-3 shrink-0" /> : <Pencil className="w-3 h-3 shrink-0" />}
      {!compact && <span>{removed ? 'Imagem Removida' : label}</span>}
    </button>
  );
};
