import React, { useState } from 'react';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { HomeSectionId, SiteLayoutConfig } from '../types';
import { useSiteData } from '../context/SiteDataContext';

type CardGroup = keyof SiteLayoutConfig['cardOrders'];

interface ActiveDragState {
  type: 'section' | 'card';
  sectionId?: HomeSectionId;
  cardGroup?: CardGroup;
  cardId?: string;
}

// Shared module-level drag reference because browsers hide dataTransfer payloads during dragover
let activeDrag: ActiveDragState | null = null;

interface DraggableSectionProps {
  sectionId: HomeSectionId;
  title: string;
  index: number;
  total: number;
  children: React.ReactNode;
}

export const DraggableSection: React.FC<DraggableSectionProps> = ({
  sectionId,
  title,
  index,
  total,
  children,
}) => {
  const { isSuperAdmin, layoutEditMode, reorderSections, moveSectionStep } = useSiteData();
  const [isOver, setIsOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const canDrag = Boolean(isSuperAdmin && layoutEditMode);

  if (!canDrag) {
    return <>{children}</>;
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        // Avoid hijacking text inputs or nested draggable cards
        const target = e.target as HTMLElement | null;
        if (target && target.closest('input, textarea, select')) {
          e.preventDefault();
          return;
        }
        activeDrag = { type: 'section', sectionId };
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `section:${sectionId}`);
        setIsDragging(true);
      }}
      onDragEnd={() => {
        activeDrag = null;
        setIsDragging(false);
        setIsOver(false);
      }}
      onDragOver={(e) => {
        if (!activeDrag || activeDrag.type !== 'section' || activeDrag.sectionId === sectionId) {
          return;
        }
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!isOver) setIsOver(true);

        // Smooth edge auto-scroll when dragging tall sections
        if (e.clientY < 110) {
          window.scrollBy({ top: -18, behavior: 'auto' });
        } else if (window.innerHeight - e.clientY < 110) {
          window.scrollBy({ top: 18, behavior: 'auto' });
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        if (activeDrag?.type === 'section' && activeDrag.sectionId && activeDrag.sectionId !== sectionId) {
          reorderSections(activeDrag.sectionId, sectionId);
        }
        activeDrag = null;
      }}
      className={`relative transition-all duration-200 ${
        isDragging ? 'opacity-55 scale-[0.99]' : ''
      } ${
        isOver
          ? 'ring-4 ring-[#E7353A] ring-offset-2 z-20'
          : 'hover:ring-2 hover:ring-[#0C2168]/30'
      }`}
    >
      {/* Floating Section Drag Handle Bar */}
      <div className="bg-[#F4F7FB] border-y border-dashed border-[#0C2168]/25 px-4 py-1.5 flex items-center justify-between gap-3 text-[11px] select-none cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2 font-bold text-[#0C2168]">
          <GripVertical className="w-4 h-4 text-[#E7353A]" />
          <span>
            Bloco {index + 1}/{total}: {title}
          </span>
          <span className="hidden sm:inline font-medium text-slate-500">
            (Segure e arraste para mover esta seção)
          </span>
        </div>

        <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled={index === 0}
            onClick={() => moveSectionStep(sectionId, 'up')}
            className="p-1 rounded-md bg-white border border-slate-200 text-[#0C2168] hover:bg-[#0C2168] hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
            title="Mover seção para cima"
            aria-label={`Mover ${title} para cima`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => moveSectionStep(sectionId, 'down')}
            className="p-1 rounded-md bg-white border border-slate-200 text-[#0C2168] hover:bg-[#0C2168] hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
            title="Mover seção para baixo"
            aria-label={`Mover ${title} para baixo`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {children}
    </div>
  );
};

interface DraggableCardProps {
  group: CardGroup;
  cardId: string;
  defaultIds: string[];
  className?: string;
  children: React.ReactNode;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  group,
  cardId,
  defaultIds,
  className = '',
  children,
}) => {
  const { isSuperAdmin, layoutEditMode, reorderCards } = useSiteData();
  const [isOver, setIsOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const canDrag = Boolean(isSuperAdmin && layoutEditMode);

  if (!canDrag) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        activeDrag = { type: 'card', cardGroup: group, cardId };
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `card:${group}:${cardId}`);
        setIsDragging(true);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        activeDrag = null;
        setIsDragging(false);
        setIsOver(false);
      }}
      onDragOver={(e) => {
        if (
          !activeDrag ||
          activeDrag.type !== 'card' ||
          activeDrag.cardGroup !== group ||
          activeDrag.cardId === cardId
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        if (!isOver) setIsOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsOver(false);
        }
      }}
      onDrop={(e) => {
        if (!activeDrag || activeDrag.type !== 'card' || activeDrag.cardGroup !== group) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
        if (activeDrag.cardId && activeDrag.cardId !== cardId) {
          reorderCards(group, activeDrag.cardId, cardId, defaultIds);
        }
        activeDrag = null;
      }}
      className={`relative cursor-grab active:cursor-grabbing select-none transition-all duration-150 ${className} ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${
        isOver
          ? 'ring-4 ring-[#E7353A] rounded-3xl scale-[1.02] z-20'
          : 'ring-1 ring-dashed ring-[#0C2168]/25 hover:ring-2 hover:ring-[#0C2168]/50 rounded-3xl'
      }`}
    >
      <div
        className="absolute top-2.5 left-2.5 z-30 pointer-events-none inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0C2168]/90 text-white text-[10px] font-bold shadow-md backdrop-blur-sm border border-white/25"
      >
        <GripVertical className="w-3 h-3 text-[#FFBC7D]" />
        <span>Arrastar</span>
      </div>
      {children}
    </div>
  );
};
