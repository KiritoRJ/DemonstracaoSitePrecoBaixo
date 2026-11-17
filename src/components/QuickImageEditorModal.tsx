import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Upload,
  RotateCcw,
  EyeOff,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Maximize2,
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { SITE_IMAGE_CATALOG } from '../data/pbData';

export const QuickImageEditorModal: React.FC = () => {
  const {
    adminToken,
    editingImageKey,
    closeImageEditor,
    getImage,
    isImageRemoved,
    isImageCustomized,
    setImageOverridesState,
    logoutAdmin,
  } = useSiteData();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [currentDims, setCurrentDims] = useState<{ w: number; h: number } | null>(null);

  const slot = SITE_IMAGE_CATALOG.find((s) => s.key === editingImageKey) || {
    key: editingImageKey || '',
    label: editingImageKey || '',
    section: 'Identidade Visual' as const,
    defaultUrl: '',
    recommendedSize: '1200 × 800 px',
    aspectRatio: '3:2 (Paisagem)',
    formatHint: 'WEBP, PNG ou JPG (máx. 6 MB)',
  };

  const currentUrl = editingImageKey ? getImage(slot.key, slot.defaultUrl) : null;
  const removed = editingImageKey ? isImageRemoved(slot.key) : false;
  const customized = editingImageKey ? isImageCustomized(slot.key) : false;

  useEffect(() => {
    setCurrentDims(null);
  }, [editingImageKey, currentUrl]);

  if (!editingImageKey || !adminToken) return null;

  const handleClose = () => {
    setUrlInput('');
    setStatusMsg(null);
    setCurrentDims(null);
    closeImageEditor();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      setStatusMsg({ type: 'err', text: 'A imagem deve ter no máximo 6 MB.' });
      return;
    }

    setBusy(true);
    setStatusMsg(null);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            key: slot.key,
            filename: file.name,
            base64Data: reader.result,
          }),
        });
        if (res.status === 401) {
          await logoutAdmin();
          handleClose();
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Falha ao enviar imagem.');
        setImageOverridesState(data.imageOverrides || {});
        setStatusMsg({ type: 'ok', text: 'Imagem atualizada ao vivo na página!' });
      } catch (err: unknown) {
        setStatusMsg({
          type: 'err',
          text: err instanceof Error ? err.message : 'Erro ao enviar imagem.',
        });
      } finally {
        setBusy(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAction = async (payload: { action?: 'reset' | 'remove'; url?: string }) => {
    setBusy(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/admin/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ key: slot.key, ...payload }),
      });
      if (res.status === 401) {
        await logoutAdmin();
        handleClose();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao alterar imagem.');
      setImageOverridesState(data.imageOverrides || {});
      if (payload.action === 'remove') {
        setStatusMsg({ type: 'ok', text: 'Imagem removida desta área do site.' });
      } else if (payload.action === 'reset') {
        setStatusMsg({ type: 'ok', text: 'Imagem restaurada para o padrão oficial.' });
      } else {
        setUrlInput('');
        setStatusMsg({ type: 'ok', text: 'URL aplicada ao vivo na página!' });
      }
    } catch (err: unknown) {
      setStatusMsg({
        type: 'err',
        text: err instanceof Error ? err.message : 'Erro ao atualizar imagem.',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0C2168] text-white px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFBC7D]">
              Edição Visual Rápida · {slot.section}
            </span>
            <h3 className="font-display font-bold text-lg truncate">{slot.label}</h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E7353A] flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Fechar editor de imagem"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {statusMsg && (
            <div
              className={`rounded-xl p-3 text-xs font-bold flex items-center gap-2 border ${
                statusMsg.type === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {statusMsg.type === 'ok' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Live Preview */}
          <div className="relative h-44 bg-[#0C2168]/5 rounded-2xl border border-slate-200 flex items-center justify-center p-4 overflow-hidden">
            {currentUrl ? (
              <img
                src={currentUrl}
                alt={slot.label}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    setCurrentDims({ w: img.naturalWidth, h: img.naturalHeight });
                  }
                }}
                className="max-h-full max-w-full object-contain rounded-xl shadow-sm"
              />
            ) : (
              <div className="text-center space-y-1 text-slate-400">
                <EyeOff className="w-8 h-8 mx-auto" />
                <span className="text-xs font-bold block">Imagem atualmente removida do site</span>
              </div>
            )}
            <span
              className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                removed
                  ? 'bg-red-100 text-red-700'
                  : customized
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {removed ? 'Removida' : customized ? 'Personalizada' : 'Original'}
            </span>
            {currentUrl && currentDims && (
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/75 text-white text-[10px] font-bold tabular-nums">
                Atual: {currentDims.w} × {currentDims.h} px
              </span>
            )}
          </div>

          {/* Ideal Image Dimensions Callout */}
          <div className="bg-[#F4F7FB] border border-[#0C2168]/15 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0C2168] text-[#FFBC7D] flex items-center justify-center shrink-0 mt-0.5">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-0.5 min-w-0">
              <div className="font-bold text-[#0C2168]">
                Tamanho ideal recomendado:{' '}
                <span className="text-[#E7353A] tabular-nums">{slot.recommendedSize}</span>
              </div>
              <div className="text-[11px] text-slate-600">
                Proporção: <strong className="text-slate-800">{slot.aspectRatio}</strong>
                {slot.formatHint ? ` · ${slot.formatHint}` : ''}
              </div>
            </div>
          </div>

          {/* Primary Actions */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
              className="pb-btn-primary px-4 py-3 text-xs rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Upload className="w-4 h-4" />
              <span>{busy ? 'Enviando...' : 'Subir Nova Imagem'}</span>
            </button>

            {!removed ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => handleAction({ action: 'remove' })}
                className="px-4 py-3 bg-red-50 hover:bg-red-100 text-[#E7353A] border border-red-200 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
                <span>Remover Imagem</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => handleAction({ action: 'reset' })}
                className="pb-btn-navy px-4 py-3 text-xs rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar Original</span>
              </button>
            )}
          </div>

          {customized && !removed && (
            <button
              type="button"
              disabled={busy}
              onClick={() => handleAction({ action: 'reset' })}
              className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Voltar para a Imagem Oficial Original</span>
            </button>
          )}

          {/* URL Paste */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Ou alterar usando link/URL da imagem</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://exemplo.com/nova-imagem.webp"
                className="flex-1 bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#0C2168]"
              />
              <button
                type="button"
                disabled={busy || !urlInput.trim()}
                onClick={() => handleAction({ url: urlInput.trim() })}
                className="px-4 py-2 bg-[#0C2168] hover:bg-[#162F8A] disabled:opacity-40 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Aplicar URL
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 shrink-0 text-[#0C2168]" />
            <span>As alterações são aplicadas instantaneamente para todos os visitantes.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
