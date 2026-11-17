import React from 'react';
import { Pencil } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface EditableTextProps {
  textKey: string;
  defaultValue: string;
  label?: string;
  multiline?: boolean;
  insideInteractive?: boolean;
  className?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  textKey,
  defaultValue,
  label,
  multiline = false,
  insideInteractive = false,
  className = '',
}) => {
  const { isSuperAdmin, textEditMode, getText, isTextCustomized, openTextEditor } = useSiteData();
  const value = getText(textKey, defaultValue);

  if (!isSuperAdmin || !textEditMode) {
    return <>{value}</>;
  }

  const handleOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openTextEditor({
      key: textKey,
      defaultValue,
      label,
      multiline,
    });
  };

  if (insideInteractive) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span>{value}</span>
        <span
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpen(e);
          }}
          title={`Editar texto: ${label || textKey}`}
          className="inline-flex items-center justify-center w-4 h-4 rounded-md bg-amber-400 hover:bg-amber-300 text-[#0C2168] shadow-sm shrink-0 cursor-pointer transition-transform hover:scale-110"
        >
          <Pencil className="w-2.5 h-2.5" />
        </span>
      </span>
    );
  }

  const customized = isTextCustomized(textKey);

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleOpen(e);
      }}
      title={`Clique para editar este texto${label ? ` (${label})` : ''}`}
      className={`inline rounded px-0.5 -mx-0.5 cursor-text transition-all border-b border-dashed ${
        customized
          ? 'border-amber-400 hover:bg-amber-400/20'
          : 'border-current/35 hover:border-[#E7353A] hover:bg-[#E7353A]/12'
      } ${className}`}
    >
      {value}
    </span>
  );
};
