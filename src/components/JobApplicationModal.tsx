import React, { useRef, useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
  User,
  Briefcase,
  ShieldCheck,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { JobPosting } from '../types';
import { STORES } from '../data/pbData';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob: JobPosting | null;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  selectedJob,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [protocol, setProtocol] = useState<string | null>(null);

  // Step 1 fields
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [preferredUnit, setPreferredUnit] = useState('');

  // Step 2 fields
  const [education, setEducation] = useState('Ensino Médio Completo');
  const [availability, setAvailability] = useState('Total (Manhã / Tarde / Noite)');
  const [lastExperience, setLastExperience] = useState('');
  const [summary, setSummary] = useState('');

  // Step 3 fields
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeFileSize, setResumeFileSize] = useState('');
  const [resumeBase64, setResumeBase64] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(true);

  if (!isOpen) return null;

  const targetTitle = selectedJob ? selectedJob.title : 'Banco de Talentos Geral';
  const targetUnit = selectedJob
    ? selectedJob.unit
    : preferredUnit || 'Todas as Lojas';

  const resetAndClose = () => {
    setStep(1);
    setError('');
    setProtocol(null);
    setFullName('');
    setCpf('');
    setBirthDate('');
    setPhone('');
    setEmail('');
    setNeighborhood('');
    setPreferredUnit('');
    setLastExperience('');
    setSummary('');
    setResumeFileName('');
    setResumeFileSize('');
    setResumeBase64('');
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processSelectedFile = (file: File | undefined) => {
    setError('');
    if (!file) return;

    const ext = file.name.toLowerCase();
    const isAllowed =
      ext.endsWith('.pdf') ||
      ext.endsWith('.doc') ||
      ext.endsWith('.docx') ||
      file.type === 'application/pdf';

    if (!isAllowed) {
      setError('Selecione um arquivo PDF (ou DOC/DOCX).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('O arquivo do currículo deve ter no máximo 8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setResumeFileName(file.name);
      setResumeFileSize(formatFileSize(file.size));
      setResumeBase64(String(reader.result || ''));
    };
    reader.onerror = () => {
      setError('Não foi possível ler o arquivo selecionado. Tente novamente.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processSelectedFile(e.target.files?.[0]);
  };

  const handleRemoveFile = () => {
    setResumeFileName('');
    setResumeFileSize('');
    setResumeBase64('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!fullName.trim() || !phone.trim() || !email.trim()) {
        setError('Preencha Nome Completo, WhatsApp/Telefone e E-mail para continuar.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinalSubmit = async () => {
    if (step !== 3) return;
    setError('');
    if (!lgpdAccepted) {
      setError('É necessário concordar com o uso dos dados para o processo seletivo.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob?.id || 'banco-talentos',
          jobTitle: targetTitle,
          unit: targetUnit,
          fullName,
          cpf,
          birthDate,
          phone,
          email,
          neighborhood,
          education,
          availability,
          lastExperience,
          summary,
          resumeFileName,
          resumeBase64,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar candidatura.');
      }
      setProtocol(data.application?.protocol || 'PB-2026-0001');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar candidatura.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={resetAndClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0C2168] text-white px-6 py-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFBC7D]">
              Seleção Integrada · #SejaPB
            </span>
            <h3 className="font-display font-bold text-xl leading-snug">
              {targetTitle}
            </h3>
            <p className="text-xs text-white/75">
              Unidade: <strong className="text-white">{targetUnit}</strong>
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#E7353A] text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Fechar candidatura"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Bar (Umentor-style guided steps) */}
        {!protocol && (
          <div className="bg-[#F4F7FB] border-b border-slate-200 px-6 py-3.5 grid grid-cols-3 gap-2">
            {[
              { num: 1, label: '1. Dados Pessoais', icon: User },
              { num: 2, label: '2. Experiência', icon: Briefcase },
              { num: 3, label: '3. Currículo & Envio', icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              const active = step === item.num;
              const completed = step > item.num;
              return (
                <div
                  key={item.num}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-[#0C2168] text-white shadow-sm'
                      : completed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-slate-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {protocol ? (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E7353A]">
                  Candidatura Registrada com Sucesso
                </span>
                <h4 className="font-display font-extrabold text-2xl text-[#0C2168]">
                  Seu currículo já está com o nosso RH!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  A equipe de Seleção do Grupo Preço Baixo analisará o seu perfil para a vaga{' '}
                  <strong className="text-[#0C2168]">{targetTitle}</strong> ({targetUnit}).
                </p>
              </div>

              <div className="bg-[#F4F7FB] border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto space-y-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Protocolo de Inscrição
                  </span>
                  <div className="font-mono font-extrabold text-xl text-[#0C2168] tabular-nums">
                    {protocol}
                  </div>
                </div>
                {resumeFileName && (
                  <div className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1.5 pt-2 border-t border-slate-200">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">PDF anexado: {resumeFileName}</span>
                  </div>
                )}
              </div>

              <button
                onClick={resetAndClose}
                className="pb-btn-navy px-6 py-3 text-xs rounded-xl cursor-pointer"
              >
                Concluir e Voltar às Vagas
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step < 3) {
                  handleNextStep();
                } else {
                  void handleFinalSubmit();
                }
              }}
              className="space-y-5"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: DADOS PESSOAIS */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Digite seu nome completo"
                        className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                        WhatsApp / Telefone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(91) 98000-0000"
                        className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                      />
                    </div>

                    <div className={selectedJob ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                        Bairro & Cidade (Belém / Ananindeua)
                      </label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Ex: Cidade Nova, Ananindeua - PA"
                        className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                      />
                    </div>

                    {!selectedJob && (
                      <div>
                        <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                          Loja de Interesse
                        </label>
                        <select
                          value={preferredUnit}
                          onChange={(e) => setPreferredUnit(e.target.value)}
                          className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                        >
                          <option value="Todas as Lojas">Qualquer Unidade (Belém / Ananindeua)</option>
                          {STORES.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: PERFIL & EXPERIÊNCIA */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                        Escolaridade
                      </label>
                      <select
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                      >
                        <option>Ensino Fundamental Completo</option>
                        <option>Ensino Médio Incompleto / Cursando</option>
                        <option>Ensino Médio Completo</option>
                        <option>Ensino Técnico</option>
                        <option>Ensino Superior Cursando</option>
                        <option>Ensino Superior Completo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                        Disponibilidade de Horário
                      </label>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                      >
                        <option>Total (Manhã / Tarde / Noite)</option>
                        <option>Turno Manhã</option>
                        <option>Turno Tarde / Noite</option>
                        <option>Meio Período (Aprendiz)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                      Última Experiência Profissional (Empresa, Cargo e Tempo)
                    </label>
                    <input
                      type="text"
                      value={lastExperience}
                      onChange={(e) => setLastExperience(e.target.value)}
                      placeholder="Ex: Supermercado Modelo — Repositor (1 ano e 6 meses) ou Primeiro Emprego"
                      className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0C2168] mb-1.5">
                      Fale um pouco sobre suas habilidades e por que quer trabalhar no PB
                    </label>
                    <textarea
                      rows={4}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Descreva suas principais qualidades, cursos ou experiência no atendimento/varejo..."
                      className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0C2168] focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: CURRÍCULO & CONFIRMAÇÃO */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-[#0C2168]">
                        Anexar Currículo em PDF (ou DOC/DOCX — Máx. 8 MB)
                      </label>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Formato recomendado: .PDF
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {resumeFileName ? (
                      <div className="border-2 border-emerald-200 bg-emerald-50/70 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-emerald-900 truncate">
                              {resumeFileName}
                            </div>
                            <div className="text-xs text-emerald-700 font-medium">
                              Currículo pronto para envio {resumeFileSize ? `· ${resumeFileSize}` : ''}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0C2168] border border-emerald-200 text-xs font-bold cursor-pointer"
                          >
                            Trocar PDF
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-2 rounded-xl bg-white hover:bg-red-50 text-[#E7353A] border border-slate-200 cursor-pointer"
                            title="Remover anexo"
                            aria-label="Remover arquivo anexado"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          processSelectedFile(e.dataTransfer.files?.[0]);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                          isDragging
                            ? 'border-[#E7353A] bg-red-50/40'
                            : 'border-slate-300 hover:border-[#0C2168] bg-[#F4F7FB]'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#0C2168] flex items-center justify-center mb-3 shadow-sm">
                          <UploadCloud className="w-6 h-6 text-[#E7353A]" />
                        </div>
                        <span className="text-sm font-bold text-[#0C2168] block">
                          Anexe o PDF do seu currículo aqui
                        </span>
                        <span className="text-xs text-slate-500 mt-1 max-w-sm">
                          Arraste e solte o arquivo PDF ou clique no botão abaixo para selecionar do seu dispositivo.
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="mt-4 pb-btn-navy px-4 py-2.5 text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-[#FFBC7D]" />
                          <span>Selecionar Arquivo PDF</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Summary Preview */}
                  <div className="bg-[#F4F7FB] rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                    <div className="font-bold text-[#0C2168] uppercase tracking-wider text-[11px]">
                      Resumo da Candidatura
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700">
                      <div>
                        <strong>Candidato(a):</strong> {fullName}
                      </div>
                      <div>
                        <strong>Contato:</strong> {phone}
                      </div>
                      <div>
                        <strong>Escolaridade:</strong> {education}
                      </div>
                      <div>
                        <strong>Currículo PDF:</strong>{' '}
                        {resumeFileName ? (
                          <span className="text-emerald-700 font-bold">{resumeFileName}</span>
                        ) : (
                          <span className="text-slate-500">Não anexado (ficha online)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lgpdAccepted}
                      onChange={(e) => setLgpdAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#0C2168]"
                    />
                    <span className="leading-relaxed">
                      Autorizo o Grupo Preço Baixo Atacadista a armazenar e avaliar meus dados curriculares para processos seletivos internos (LGPD).
                    </span>
                  </label>
                </div>
              )}

              {/* Modal Navigation Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Envio direto para o RH</span>
                  </div>
                )}

                {step < 3 ? (
                  <button
                    key="btn-next-step"
                    type="button"
                    onClick={handleNextStep}
                    className="pb-btn-navy px-5 py-2.5 text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Próxima Etapa</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    key="btn-submit-app"
                    type="button"
                    onClick={() => void handleFinalSubmit()}
                    disabled={submitting}
                    className="pb-btn-primary px-6 py-3 text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>{submitting ? 'Enviando...' : 'Finalizar e Enviar Currículo'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
