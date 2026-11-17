import React from 'react';
import { Palette, RotateCcw, X, Check } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

const NAVBAR_SWATCHES = [
  { label: 'Azul PB Oficial', bg: '#0C2168', text: '#FFFFFF' },
  { label: 'Azul Noite', bg: '#091952', text: '#FFFFFF' },
  { label: 'Vermelho PB', bg: '#E7353A', text: '#FFFFFF' },
  { label: 'Grafite Moderno', bg: '#1E293B', text: '#FFFFFF' },
  { label: 'Verde Atacado', bg: '#065F46', text: '#FFFFFF' },
  { label: 'Branco Clean', bg: '#FFFFFF', text: '#0C2168' },
];

const PRIMARY_BTN_SWATCHES = [
  { label: 'Vermelho PB', bg: '#E7353A', text: '#FFFFFF' },
  { label: 'Azul PB', bg: '#0C2168', text: '#FFFFFF' },
  { label: 'Laranja Destaque', bg: '#EA580C', text: '#FFFFFF' },
  { label: 'Verde Oferta', bg: '#059669', text: '#FFFFFF' },
  { label: 'Amarelo Ouro', bg: '#F59E0B', text: '#0C2168' },
  { label: 'Escuro', bg: '#0F172A', text: '#FFFFFF' },
];

const SECONDARY_BTN_SWATCHES = [
  { label: 'Azul PB Oficial', bg: '#0C2168', text: '#FFFFFF' },
  { label: 'Azul Royal', bg: '#2A4393', text: '#FFFFFF' },
  { label: 'Vermelho PB', bg: '#E7353A', text: '#FFFFFF' },
  { label: 'Ardósia', bg: '#334155', text: '#FFFFFF' },
  { label: 'Verde Esmeralda', bg: '#0F766E', text: '#FFFFFF' },
  { label: 'Cinza Claro', bg: '#E2E8F0', text: '#0C2168' },
];

export const LiveColorCustomizer: React.FC = () => {
  const {
    adminToken,
    isColorEditorOpen,
    setIsColorEditorOpen,
    themeConfig,
    updateTheme,
    resetTheme,
  } = useSiteData();

  if (!adminToken || !isColorEditorOpen) return null;

  return (
    <aside
      aria-label="Personalizador de Cores ao Vivo"
      className="fixed top-36 right-4 z-50 w-[350px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-10rem)] bg-white rounded-3xl shadow-[0_24px_60px_-15px_rgba(12,33,104,0.45)] border border-slate-200 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#0C2168] text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Palette className="w-4 h-4 text-[#FFBC7D]" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFBC7D] block">
              Visualizador ao Vivo
            </span>
            <h3 className="font-display font-bold text-sm truncate">
              Cores do Menu & Botões
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsColorEditorOpen(false)}
          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E7353A] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          aria-label="Fechar painel de cores"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5 overflow-y-auto text-slate-800">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Altere as cores abaixo e veja a mudança instantaneamente no menu superior e em todos os botões da página pública.
        </p>

        {/* 1. Barra Superior do Menu */}
        <div className="space-y-2.5 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-[#0C2168] uppercase tracking-wider">
              Barra Superior (Menu)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={themeConfig.navbarBg}
                onChange={(e) => updateTheme({ navbarBg: e.target.value })}
                aria-label="Cor de fundo da barra superior"
                className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
              />
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                {themeConfig.navbarBg}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {NAVBAR_SWATCHES.map((sw) => {
              const active = themeConfig.navbarBg.toLowerCase() === sw.bg.toLowerCase();
              return (
                <button
                  key={sw.bg}
                  type="button"
                  title={sw.label}
                  onClick={() => updateTheme({ navbarBg: sw.bg, navbarText: sw.text })}
                  style={{ backgroundColor: sw.bg }}
                  className={`h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                    active ? 'ring-2 ring-[#E7353A] border-white' : 'border-slate-300'
                  }`}
                >
                  {active && (
                    <Check
                      className="w-3.5 h-3.5"
                      style={{ color: sw.text }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-semibold text-slate-600">Cor dos textos do menu:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => updateTheme({ navbarText: '#FFFFFF' })}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-colors ${
                  themeConfig.navbarText === '#FFFFFF'
                    ? 'bg-[#0C2168] text-white'
                    : 'text-slate-600'
                }`}
              >
                Branco
              </button>
              <button
                type="button"
                onClick={() => updateTheme({ navbarText: '#0C2168' })}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-colors ${
                  themeConfig.navbarText === '#0C2168'
                    ? 'bg-[#0C2168] text-white'
                    : 'text-slate-600'
                }`}
              >
                Azul PB
              </button>
            </div>
          </div>
        </div>

        {/* 2. Botões Principais */}
        <div className="space-y-2.5 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-[#0C2168] uppercase tracking-wider">
              Botões Principais (Destaques)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={themeConfig.primaryBtnBg}
                onChange={(e) => updateTheme({ primaryBtnBg: e.target.value })}
                aria-label="Cor dos botões principais"
                className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
              />
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                {themeConfig.primaryBtnBg}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {PRIMARY_BTN_SWATCHES.map((sw) => {
              const active = themeConfig.primaryBtnBg.toLowerCase() === sw.bg.toLowerCase();
              return (
                <button
                  key={sw.bg}
                  type="button"
                  title={sw.label}
                  onClick={() => updateTheme({ primaryBtnBg: sw.bg, primaryBtnText: sw.text })}
                  style={{ backgroundColor: sw.bg }}
                  className={`h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                    active ? 'ring-2 ring-[#0C2168] border-white' : 'border-slate-300'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" style={{ color: sw.text }} />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-semibold text-slate-600">Texto do botão:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => updateTheme({ primaryBtnText: '#FFFFFF' })}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer ${
                  themeConfig.primaryBtnText === '#FFFFFF'
                    ? 'bg-[#0C2168] text-white'
                    : 'text-slate-600'
                }`}
              >
                Branco
              </button>
              <button
                type="button"
                onClick={() => updateTheme({ primaryBtnText: '#0C2168' })}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer ${
                  themeConfig.primaryBtnText === '#0C2168'
                    ? 'bg-[#0C2168] text-white'
                    : 'text-slate-600'
                }`}
              >
                Escuro
              </button>
            </div>
          </div>
        </div>

        {/* 3. Botões Secundários */}
        <div className="space-y-2.5 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-[#0C2168] uppercase tracking-wider">
              Botões Secundários (Ações)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={themeConfig.secondaryBtnBg}
                onChange={(e) => updateTheme({ secondaryBtnBg: e.target.value })}
                aria-label="Cor dos botões secundários"
                className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
              />
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                {themeConfig.secondaryBtnBg}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {SECONDARY_BTN_SWATCHES.map((sw) => {
              const active = themeConfig.secondaryBtnBg.toLowerCase() === sw.bg.toLowerCase();
              return (
                <button
                  key={sw.bg}
                  type="button"
                  title={sw.label}
                  onClick={() => updateTheme({ secondaryBtnBg: sw.bg, secondaryBtnText: sw.text })}
                  style={{ backgroundColor: sw.bg }}
                  className={`h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                    active ? 'ring-2 ring-[#E7353A] border-white' : 'border-slate-300'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" style={{ color: sw.text }} />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-semibold text-slate-600">Texto do botão:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => updateTheme({ secondaryBtnText: '#FFFFFF' })}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer ${
                  themeConfig.secondaryBtnText === '#FFFFFF'
                    ? 'bg-[#0C2168] text-white'
                    : 'text-slate-600'
                }`}
              >
                Branco
              </button>
              <button
                type="button"
                onClick={() => updateTheme({ secondaryBtnText: '#0C2168' })}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer ${
                  themeConfig.secondaryBtnText === '#0C2168'
                    ? 'bg-[#0C2168] text-white'
                    : 'text-slate-600'
                }`}
              >
                Escuro
              </button>
            </div>
          </div>
        </div>

        {/* Reset */}
        <button
          type="button"
          onClick={resetTheme}
          className="w-full py-2.5 px-4 bg-[#F4F7FB] hover:bg-slate-200 text-[#0C2168] border border-slate-200 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Cores Oficiais Preço Baixo</span>
        </button>
      </div>
    </aside>
  );
};
