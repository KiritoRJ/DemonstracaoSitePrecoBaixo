import React, { useState } from 'react';
import { X, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAdmin, loginAdminAutoTest } = useSiteData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(username, password);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoTestLogin = async () => {
    setError('');
    setAutoLoading(true);
    try {
      await loginAdminAutoTest();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro no login automático de teste');
    } finally {
      setAutoLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0C2168] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFBC7D]">
              Portal Interno · Grupo PB
            </span>
            <h3 className="font-display font-bold text-xl">Login Administrativo / RH</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#E7353A] text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar login"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="adm-user" className="block text-xs font-bold text-[#0C2168] mb-1.5">
              Usuário ou E-mail RH
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="adm-user"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="rh@precobaixoatacadista.com.br ou admin"
                className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="adm-pass" className="block text-xs font-bold text-[#0C2168] mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="adm-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
              />
            </div>
          </div>

          {/* Encrypted Auth Info Box */}
          <div className="bg-[#F4F7FB] border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0C2168]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Acesso Criptografado (scrypt + AES-256-GCM)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Login e senha validados diretamente contra o cofre criptografado do servidor, sem exposição de credenciais no navegador.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || autoLoading}
            className="w-full pb-btn-primary py-3 text-xs rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span>{loading ? 'Autenticando...' : 'Entrar no Painel Administrativo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-center text-slate-400">
              Modo Demonstração / Testes
            </div>
            <button
              type="button"
              onClick={handleAutoTestLogin}
              disabled={loading || autoLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
            >
              <Zap className="w-4 h-4 text-amber-600" />
              <span>
                {autoLoading
                  ? 'Conectando como Adm...'
                  : 'Entrar Automaticamente como Adm (Teste)'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
