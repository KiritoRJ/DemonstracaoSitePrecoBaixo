import React, { useEffect, useState } from 'react';
import { X, Check, RotateCcw, Type, AlertCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const QuickTextEditorModal: React.FC = () => {
  const {
    adminToken,
    editingTextSlot,
    closeTextEditor,
    getText,
    isTextCustomized,
    saveTextOverride,
    resetTextOverride,
  } = useSiteData();

  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTextSlot) {
      setDraft(getText(editingTextSlot.key, editingTextSlot.defaultValue));
      setError('');
    }
  }, [editingTextSlot, getText]);

  if (!adminToken || !editingTextSlot) return null;

  const customized = isTextCustomized(editingTextSlot.key);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await saveTextOverride(editingTextSlot.key, draft);
      closeTextEditor();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar texto.');
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setBusy(true);
    setError('');
    try {
      await resetTextOverride(editingTextSlot.key);
      closeTextEditor();
    } catch {
      setError('Não foi possível restaurar o texto original.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[75] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeTextEditor}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0C2168] text-white px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Type className="w-4 h-4 text-[#FFBC7D]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFBC7D] block">
                Edição de Texto ao Vivo
              </span>
              <h3 className="font-display font-bold text-base truncate">
                {editingTextSlot.label || editingTextSlot.key}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeTextEditor}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E7353A] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar editor de texto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="pb-quick-text" className="block text-xs font-bold text-[#0C2168] mb-1.5">
              Novo conteúdo do texto
            </label>
            {editingTextSlot.multiline ? (
              <textarea
                id="pb-quick-text"
                rows={4}
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white leading-relaxed"
              />
            ) : (
              <input
                id="pb-quick-text"
                type="text"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
              />
            )}
          </div>

          <div className="bg-[#F4F7FB] border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600">
            <span className="font-bold text-[#0C2168] block mb-0.5">Texto padrão original:</span>
            <span>{editingTextSlot.defaultValue}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            {customized ? (
              <button
                type="button"
                disabled={busy}
                onClick={handleReset}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Original</span>
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeTextEditor}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={busy}
                className="pb-btn-primary px-5 py-2.5 text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                <span>{busy ? 'Salvando...' : 'Salvar Texto'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
