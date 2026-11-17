import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  Users,
  Image as ImageIcon,
  LogOut,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  PauseCircle,
  PlayCircle,
  Download,
  Upload,
  RotateCcw,
  EyeOff,
  Search,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  FileText,
  Eye,
  RefreshCw,
  Maximize2,
  ShieldCheck,
  KeyRound,
  Lock,
  Copy,
  UserPlus,
  UserCheck,
  UserX,
  ShieldAlert,
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { JobApplication, JobPosting, ManagedRhUser, SiteImageSlot } from '../types';
import { SITE_IMAGE_CATALOG, STORES } from '../data/pbData';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

type AdminTab = 'vagas' | 'candidatos' | 'imagens' | 'seguranca';

interface SecurityStatusInfo {
  passwordAlgorithm: string;
  vaultAlgorithm: string;
  sessionTokenAlgorithm: string;
  piiAtRestAlgorithm: string;
  passwordHashPreview: string;
  vaultPreview: string;
  allowedLoginsCount: number;
  customEnvSecretActive: boolean;
  encryptedApplicationsCount: number;
  totalApplicationsCount: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const {
    jobs,
    imageOverrides,
    adminToken,
    adminUser,
    isSuperAdmin,
    logoutAdmin,
    setJobsState,
    setImageOverridesState,
    getImage,
    isImageRemoved,
    isImageCustomized,
  } = useSiteData();

  const [activeTab, setActiveTab] = useState<AdminTab>('vagas');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  // Job Modal state
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobUnit, setJobUnit] = useState('PB Augusto Montenegro');
  const [jobDept, setJobDept] = useState('Operação de Loja');
  const [jobContract, setJobContract] = useState('CLT · Efetivo');
  const [jobSchedule, setJobSchedule] = useState('Escala 6x1 · Integral');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState('');
  const [jobBenefits, setJobBenefits] = useState('');
  const [jobActive, setJobActive] = useState(true);
  const [savingJob, setSavingJob] = useState(false);

  // Candidates filters & inspect
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [candSearch, setCandSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<JobApplication | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewPdf, setPreviewPdf] = useState<{ title: string; url: string; fileName: string } | null>(null);

  // Images CMS filters & URL editing
  const [imgSectionFilter, setImgSectionFilter] = useState<string>('Todas');
  const [imgSearch, setImgSearch] = useState('');
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>({});
  const [busyImageKey, setBusyImageKey] = useState<string | null>(null);

  // Own Password Change state (Admin & RH)
  const [ownCurrentPass, setOwnCurrentPass] = useState('');
  const [ownNewPass, setOwnNewPass] = useState('');
  const [ownConfirmPass, setOwnConfirmPass] = useState('');
  const [changingOwnPass, setChangingOwnPass] = useState(false);

  // RH Users Management state (Super Admin only)
  const [rhUsers, setRhUsers] = useState<ManagedRhUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newRhName, setNewRhName] = useState('');
  const [newRhUsername, setNewRhUsername] = useState('');
  const [newRhEmail, setNewRhEmail] = useState('');
  const [newRhPassword, setNewRhPassword] = useState('');
  const [creatingRhUser, setCreatingRhUser] = useState(false);
  const [resettingUser, setResettingUser] = useState<ManagedRhUser | null>(null);
  const [resetUserNewPass, setResetUserNewPass] = useState('');
  const [resetUserConfirmPass, setResetUserConfirmPass] = useState('');
  const [deletingUser, setDeletingUser] = useState<ManagedRhUser | null>(null);
  const [savingUserAction, setSavingUserAction] = useState(false);

  // Security & Encryption tab state
  const [securityStatus, setSecurityStatus] = useState<SecurityStatusInfo | null>(null);
  const [secLogins, setSecLogins] = useState('admin, rh@precobaixoatacadista.com.br');
  const [secAdminName, setSecAdminName] = useState('RH / Administração Preço Baixo');
  const [secNewPass, setSecNewPass] = useState('');
  const [secConfirmPass, setSecConfirmPass] = useState('');
  const [secGenerating, setSecGenerating] = useState(false);
  const [secSnippet, setSecSnippet] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const showToast = (type: 'ok' | 'err', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  useEffect(() => {
    if (!isSuperAdmin && activeTab === 'imagens') {
      setActiveTab('vagas');
    }
  }, [isSuperAdmin, activeTab]);

  const fetchApplications = useCallback(async () => {
    if (!adminToken) return;
    setLoadingApps(true);
    try {
      const res = await fetch('/api/admin/applications', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        await logoutAdmin();
        onBackToSite();
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.applications)) {
        setApplications(data.applications);
      }
    } catch {
      showToast('err', 'Não foi possível carregar os currículos recebidos.');
    } finally {
      setLoadingApps(false);
    }
  }, [adminToken, logoutAdmin, onBackToSite]);

  const fetchSecurityStatus = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/security/status', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = (await res.json()) as SecurityStatusInfo;
        setSecurityStatus(data);
      }
    } catch {
      // Ignore silent status error
    }
  }, [adminToken]);

  const fetchRhUsers = useCallback(async () => {
    if (!adminToken || !isSuperAdmin) return;
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.users)) {
          setRhUsers(data.users);
        }
      }
    } catch {
      // Silent error
    } finally {
      setLoadingUsers(false);
    }
  }, [adminToken, isSuperAdmin]);

  useEffect(() => {
    fetchApplications();
    fetchSecurityStatus();
    if (isSuperAdmin) {
      fetchRhUsers();
    }
  }, [fetchApplications, fetchSecurityStatus, fetchRhUsers, isSuperAdmin, activeTab]);

  const handleChangeOwnPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    if (ownNewPass.length < 6) {
      showToast('err', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (ownNewPass !== ownConfirmPass) {
      showToast('err', 'A confirmação da nova senha não confere.');
      return;
    }
    setChangingOwnPass(true);
    try {
      const res = await fetch('/api/admin/security/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          currentPassword: ownCurrentPass,
          newPassword: ownNewPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao alterar senha.');
      setOwnCurrentPass('');
      setOwnNewPass('');
      setOwnConfirmPass('');
      showToast('ok', 'Sua senha foi alterada e criptografada com sucesso!');
      fetchSecurityStatus();
    } catch (err: unknown) {
      showToast('err', err instanceof Error ? err.message : 'Erro ao alterar senha.');
    } finally {
      setChangingOwnPass(false);
    }
  };

  const handleCreateRhUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !isSuperAdmin) return;
    if (newRhPassword.length < 6) {
      showToast('err', 'A senha inicial do RH deve ter pelo menos 6 caracteres.');
      return;
    }
    setCreatingRhUser(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: newRhName.trim(),
          username: newRhUsername.trim(),
          email: newRhEmail.trim(),
          password: newRhPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar acesso de RH.');
      setNewRhName('');
      setNewRhUsername('');
      setNewRhEmail('');
      setNewRhPassword('');
      showToast('ok', `Acesso RH "${data.user?.name}" criado sem permissão de edição pública!`);
      fetchRhUsers();
      fetchSecurityStatus();
    } catch (err: unknown) {
      showToast('err', err instanceof Error ? err.message : 'Erro ao criar acesso de RH.');
    } finally {
      setCreatingRhUser(false);
    }
  };

  const handleToggleRhUserActive = async (user: ManagedRhUser) => {
    if (!adminToken || !isSuperAdmin || user.isMaster) return;
    setSavingUserAction(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ active: !user.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar acesso.');
      showToast(
        'ok',
        user.active
          ? `Acesso de "${user.name}" bloqueado.`
          : `Acesso de "${user.name}" reativado.`
      );
      fetchRhUsers();
    } catch (err: unknown) {
      showToast('err', err instanceof Error ? err.message : 'Erro ao atualizar usuário.');
    } finally {
      setSavingUserAction(false);
    }
  };

  const handleResetRhPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !isSuperAdmin || !resettingUser) return;
    if (resetUserNewPass.length < 6) {
      showToast('err', 'A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (resetUserNewPass !== resetUserConfirmPass) {
      showToast('err', 'A confirmação da senha não confere.');
      return;
    }
    setSavingUserAction(true);
    try {
      const res = await fetch(`/api/admin/users/${resettingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ newPassword: resetUserNewPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao redefinir senha.');
      showToast('ok', `Senha de "${resettingUser.name}" redefinida com criptografia scrypt!`);
      setResettingUser(null);
      setResetUserNewPass('');
      setResetUserConfirmPass('');
      fetchRhUsers();
    } catch (err: unknown) {
      showToast('err', err instanceof Error ? err.message : 'Erro ao redefinir senha.');
    } finally {
      setSavingUserAction(false);
    }
  };

  const handleConfirmDeleteRhUser = async () => {
    if (!adminToken || !isSuperAdmin || !deletingUser) return;
    setSavingUserAction(true);
    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir acesso.');
      showToast('ok', `Acesso de "${deletingUser.name}" removido.`);
      setDeletingUser(null);
      fetchRhUsers();
      fetchSecurityStatus();
    } catch (err: unknown) {
      showToast('err', err instanceof Error ? err.message : 'Erro ao excluir acesso.');
    } finally {
      setSavingUserAction(false);
    }
  };

  const handleDownloadResume = async (app: JobApplication) => {
    if (!adminToken || !app.resumeStoredName) return;
    setDownloadingId(app.id);
    try {
      const res = await fetch(`/api/admin/resumes/${encodeURIComponent(app.resumeStoredName)}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error('Arquivo indisponível');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = app.resumeFileName || `${app.fullName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    } catch {
      showToast('err', 'Não foi possível baixar o arquivo do currículo.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreviewResume = async (app: JobApplication) => {
    if (!adminToken || !app.resumeStoredName) return;
    setDownloadingId(app.id);
    try {
      const res = await fetch(
        `/api/admin/resumes/${encodeURIComponent(app.resumeStoredName)}?inline=1`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (!res.ok) throw new Error('Arquivo indisponível');
      const blob = await res.blob();
      const pdfBlob =
        blob.type === 'application/pdf' || (app.resumeFileName || '').toLowerCase().endsWith('.pdf')
          ? new Blob([blob], { type: 'application/pdf' })
          : blob;
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPreviewPdf({
        title: app.fullName,
        url: blobUrl,
        fileName: app.resumeFileName || 'curriculo.pdf',
      });
    } catch {
      showToast('err', 'Não foi possível abrir o currículo para visualização.');
    } finally {
      setDownloadingId(null);
    }
  };

  const closePreviewPdf = () => {
    if (previewPdf?.url) {
      URL.revokeObjectURL(previewPdf.url);
    }
    setPreviewPdf(null);
  };

  // --- JOBS CRUD ---
  const openCreateJob = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobUnit('PB Augusto Montenegro');
    setJobDept('Operação de Loja');
    setJobContract('CLT · Efetivo');
    setJobSchedule('Escala 6x1 · Integral');
    setJobDesc('');
    setJobReqs('Ensino médio completo\nBoa comunicação e trabalho em equipe');
    setJobBenefits('Vale-transporte e refeição no local\nDesconto colaborador nas lojas PB');
    setJobActive(true);
    setIsJobModalOpen(true);
  };

  const openEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobUnit(job.unit);
    setJobDept(job.department);
    setJobContract(job.contractType);
    setJobSchedule(job.schedule);
    setJobDesc(job.description);
    setJobReqs(job.requirements.join('\n'));
    setJobBenefits(job.benefits.join('\n'));
    setJobActive(job.active);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setSavingJob(true);
    const payload = {
      title: jobTitle,
      unit: jobUnit,
      department: jobDept,
      contractType: jobContract,
      schedule: jobSchedule,
      description: jobDesc,
      requirements: jobReqs
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: jobBenefits
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      active: jobActive,
    };

    try {
      const url = editingJob ? `/api/admin/jobs/${editingJob.id}` : '/api/admin/jobs';
      const method = editingJob ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar vaga');

      if (editingJob) {
        setJobsState((prev) => prev.map((j) => (j.id === editingJob.id ? data.job : j)));
        showToast('ok', 'Vaga atualizada com sucesso!');
      } else {
        setJobsState((prev) => [data.job, ...prev]);
        showToast('ok', 'Nova vaga publicada no site!');
      }
      setIsJobModalOpen(false);
    } catch (err: unknown) {
      showToast('err', err instanceof Error ? err.message : 'Erro ao salvar vaga.');
    } finally {
      setSavingJob(false);
    }
  };

  const handleToggleJobActive = async (job: JobPosting) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ active: !job.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setJobsState((prev) => prev.map((j) => (j.id === job.id ? data.job : j)));
      showToast('ok', data.job.active ? 'Vaga reativada no site.' : 'Vaga pausada.');
    } catch {
      showToast('err', 'Não foi possível alterar o status da vaga.');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error();
      setJobsState((prev) => prev.filter((j) => j.id !== jobId));
      showToast('ok', 'Vaga removida.');
    } catch {
      showToast('err', 'Erro ao remover vaga.');
    }
  };

  // --- CANDIDATES PIPELINE ---
  const handleStatusChange = async (appId: string, newStatus: JobApplication['status']) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApplications((prev) => prev.map((a) => (a.id === appId ? data.application : a)));
      if (selectedCandidate?.id === appId) {
        setSelectedCandidate(data.application);
      }
      showToast('ok', `Status atualizado para "${newStatus}".`);
    } catch {
      showToast('err', 'Erro ao atualizar status do candidato.');
    }
  };

  const handleDeleteCandidate = async (appId: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error();
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      if (selectedCandidate?.id === appId) setSelectedCandidate(null);
      showToast('ok', 'Candidatura removida.');
    } catch {
      showToast('err', 'Erro ao excluir candidatura.');
    }
  };

  // --- SITE IMAGES CMS ---
  const handleImageAction = async (
    key: string,
    payload: { action?: 'reset' | 'remove'; url?: string }
  ) => {
    if (!adminToken) return;
    setBusyImageKey(key);
    try {
      const res = await fetch('/api/admin/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ key, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar imagem');
      setImageOverridesState(data.imageOverrides || {});
      if (payload.action === 'reset') {
        showToast('ok', 'Imagem restaurada para o padrão oficial.');
      } else if (payload.action === 'remove') {
        showToast('ok', 'Imagem removida do site.');
      } else {
        showToast('ok', 'Imagem atualizada em tempo real no site!');
      }
    } catch (err: unknown) {
      showToast('err', err instanceof Error ? err.message : 'Erro ao atualizar imagem.');
    } finally {
      setBusyImageKey(null);
    }
  };

  const handleImageFileUpload = (slot: SiteImageSlot, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !adminToken) return;
    if (file.size > 6 * 1024 * 1024) {
      showToast('err', 'A imagem deve ter no máximo 6 MB.');
      return;
    }
    setBusyImageKey(slot.key);
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
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro no upload');
        setImageOverridesState(data.imageOverrides || {});
        showToast('ok', `Nova imagem enviada para "${slot.label}"!`);
      } catch (err: unknown) {
        showToast('err', err instanceof Error ? err.message : 'Erro ao enviar imagem.');
      } finally {
        setBusyImageKey(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredApplications = useMemo(() => {
    const q = candSearch.trim().toLowerCase();
    return applications.filter((a) => {
      const matchStatus = statusFilter === 'Todos' || a.status === statusFilter;
      const matchSearch =
        !q ||
        a.fullName.toLowerCase().includes(q) ||
        a.jobTitle.toLowerCase().includes(q) ||
        a.protocol.toLowerCase().includes(q) ||
        a.unit.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [applications, statusFilter, candSearch]);

  const imageSections = useMemo(
    () => ['Todas', ...Array.from(new Set(SITE_IMAGE_CATALOG.map((s) => s.section)))],
    []
  );

  const filteredImages = useMemo(() => {
    const q = imgSearch.trim().toLowerCase();
    return SITE_IMAGE_CATALOG.filter((slot) => {
      const matchSec = imgSectionFilter === 'Todas' || slot.section === imgSectionFilter;
      const matchQ =
        !q || slot.label.toLowerCase().includes(q) || slot.key.toLowerCase().includes(q);
      return matchSec && matchQ;
    });
  }, [imgSectionFilter, imgSearch]);

  const activeJobsCount = jobs.filter((j) => j.active).length;
  const pausedJobsCount = jobs.length - activeJobsCount;
  const modifiedImagesCount = Object.keys(imageOverrides).length;

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col lg:flex-row text-slate-800">
      {/* Sidebar 240px */}
      <aside className="lg:w-64 bg-[#0C2168] text-white flex flex-col justify-between shrink-0 border-r border-white/10">
        <div className="p-5 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFBC7D]">
              {isSuperAdmin ? 'Painel Administrativo' : 'Portal RH · Acesso Restrito'}
            </span>
            <div className="font-display font-extrabold text-lg tracking-tight">
              {isSuperAdmin ? 'Preço Baixo RH & CMS' : 'Preço Baixo · Equipe RH'}
            </div>
            <p className="text-[11px] text-white/65 truncate">{adminUser?.email}</p>
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-white/90">
              {isSuperAdmin ? 'Acesso Total + Edição Pública' : 'Somente Vagas e Currículos'}
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('vagas')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'vagas'
                  ? 'bg-[#E7353A] text-white shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Vagas de Emprego</span>
              </span>
              <span className="tabular-nums opacity-85">{jobs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('candidatos')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'candidatos'
                  ? 'bg-[#E7353A] text-white shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Currículos Recebidos</span>
              </span>
              <span className="tabular-nums opacity-85">{applications.length}</span>
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('imagens')}
                className={`hidden w-full px-3.5 py-2.5 rounded-xl text-xs font-bold items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'imagens'
                    ? 'bg-[#E7353A] text-white shadow-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Imagens do Site</span>
                </span>
                <span className="tabular-nums opacity-85">{SITE_IMAGE_CATALOG.length}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('seguranca')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'seguranca'
                  ? 'bg-[#E7353A] text-white shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{isSuperAdmin ? 'Segurança & Acessos' : 'Trocar Senha'}</span>
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200">
                {isSuperAdmin ? 'RH/ADM' : 'SENHA'}
              </span>
            </button>
          </nav>
        </div>

        <div className="p-5 border-t border-white/10 space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Visualizar Site Público</span>
          </button>
          <button
            onClick={async () => {
              await logoutAdmin();
              onBackToSite();
            }}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/75 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isSuperAdmin
                ? 'Administração · Preço Baixo Atacadista'
                : 'RH · Preço Baixo Atacadista (Sem edição da página pública)'}
            </div>
            <h1 className="font-display font-extrabold text-xl text-[#0C2168]">
              {activeTab === 'vagas' && 'Gestão de Vagas de Emprego'}
              {activeTab === 'candidatos' && 'Triagem de Currículos (Sistema Integrado)'}
              {activeTab === 'imagens' && isSuperAdmin && 'Gerenciador de Todas as Imagens do Site'}
              {activeTab === 'seguranca' &&
                (isSuperAdmin
                  ? 'Troca de Senha, Acessos de RH & Criptografia'
                  : 'Alterar Minha Senha de Acesso RH')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'vagas' && (
              <button
                onClick={openCreateJob}
                className="pb-btn-primary px-4 py-2.5 text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Nova Vaga</span>
              </button>
            )}
            <button
              onClick={onBackToSite}
              className="px-4 py-2.5 bg-[#F4F7FB] hover:bg-slate-200 text-[#0C2168] rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Voltar ao Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Feedback Banner */}
        {feedback && (
          <div className="px-6 pt-4">
            <div
              className={`rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 border ${
                feedback.type === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {feedback.type === 'ok' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.msg}</span>
            </div>
          </div>
        )}

        {/* Workspace Body */}
        <main className="p-6 space-y-6 flex-1">
          {/* KPI Strip */}
          <div className={`grid grid-cols-2 ${isSuperAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Vagas Ativas
              </div>
              <div className="font-display font-extrabold text-2xl text-[#0C2168] mt-1 tabular-nums">
                {activeJobsCount}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Vagas Pausadas
              </div>
              <div className="font-display font-extrabold text-2xl text-slate-700 mt-1 tabular-nums">
                {pausedJobsCount}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Currículos Recebidos
              </div>
              <div className="font-display font-extrabold text-2xl text-[#E7353A] mt-1 tabular-nums">
                {applications.length}
              </div>
            </div>
            {isSuperAdmin && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Imagens Customizadas / Removidas
                </div>
                <div className="font-display font-extrabold text-2xl text-[#0C2168] mt-1 tabular-nums">
                  {modifiedImagesCount}
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: VAGAS CRUD */}
          {activeTab === 'vagas' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F4F7FB] border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-5">Cargo / Título</th>
                      <th className="py-3.5 px-4">Unidade</th>
                      <th className="py-3.5 px-4">Setor / Regime</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-[#F4F7FB]/60 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-sm text-[#0C2168]">{job.title}</div>
                          <div className="text-slate-500 mt-0.5">{job.schedule}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">{job.unit}</td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div>{job.department}</div>
                          <div className="text-[11px] text-slate-400">{job.contractType}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              job.active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {job.active ? 'Ativa no Site' : 'Pausada'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleJobActive(job)}
                              title={job.active ? 'Pausar vaga' : 'Reativar vaga'}
                              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                            >
                              {job.active ? (
                                <PauseCircle className="w-4 h-4 text-amber-600" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-emerald-600" />
                              )}
                            </button>
                            <button
                              onClick={() => openEditJob(job)}
                              title="Editar vaga"
                              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-[#0C2168] cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              title="Excluir vaga"
                              className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 text-[#E7353A] cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CANDIDATOS / CURRÍCULOS */}
          {activeTab === 'candidatos' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={candSearch}
                    onChange={(e) => setCandSearch(e.target.value)}
                    placeholder="Buscar por nome, vaga, unidade ou protocolo..."
                    className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-[#0C2168]"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-[#0C2168] outline-none"
                  >
                    <option value="Todos">Todos os Status</option>
                    <option value="Novo">Novo</option>
                    <option value="Em Análise">Em Análise</option>
                    <option value="Entrevista">Entrevista</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Banco de Talentos">Banco de Talentos</option>
                  </select>
                  <button
                    onClick={fetchApplications}
                    disabled={loadingApps}
                    className="px-3.5 py-2 rounded-xl bg-[#F4F7FB] hover:bg-slate-200 border border-slate-200 text-[#0C2168] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingApps ? 'animate-spin' : ''}`} />
                    <span>Atualizar</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F4F7FB] border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-5">Protocolo</th>
                        <th className="py-3.5 px-4">Candidato(a)</th>
                        <th className="py-3.5 px-4">Vaga / Unidade</th>
                        <th className="py-3.5 px-4">Currículo Anexado</th>
                        <th className="py-3.5 px-4">Etapa</th>
                        <th className="py-3.5 px-5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      {loadingApps ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-slate-500">
                            Carregando currículos...
                          </td>
                        </tr>
                      ) : filteredApplications.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-slate-500">
                            Nenhum currículo encontrado.
                          </td>
                        </tr>
                      ) : (
                        filteredApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-[#F4F7FB]/60 transition-colors">
                            <td className="py-3.5 px-5 font-mono font-bold text-[#0C2168] tabular-nums">
                              {app.protocol}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-800">{app.fullName}</div>
                              <div className="text-slate-500">
                                {app.phone} · {app.neighborhood || 'Belém/Ananindeua'}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-[#0C2168]">{app.jobTitle}</div>
                              <div className="text-slate-500">{app.unit}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              {app.resumeStoredName ? (
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadResume(app)}
                                    disabled={downloadingId === app.id}
                                    className="px-3 py-1.5 rounded-lg bg-[#E7353A] hover:bg-[#d1292e] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                                    title={`Baixar ${app.resumeFileName || 'currículo'}`}
                                  >
                                    <Download className="w-3.5 h-3.5 shrink-0" />
                                    <span>Baixar PDF</span>
                                  </button>
                                  {(app.resumeFileName || '').toLowerCase().endsWith('.pdf') && (
                                    <button
                                      type="button"
                                      onClick={() => handlePreviewResume(app)}
                                      disabled={downloadingId === app.id}
                                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[#0C2168] cursor-pointer"
                                      title="Visualizar PDF"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {app.resumeFileName && (
                                    <span className="text-[11px] text-slate-500 truncate max-w-[140px] block">
                                      {app.resumeFileName}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400">Somente ficha online</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={app.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    app.id,
                                    e.target.value as JobApplication['status']
                                  )
                                }
                                className="bg-[#F4F7FB] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0C2168] outline-none cursor-pointer"
                              >
                                <option value="Novo">Novo</option>
                                <option value="Em Análise">Em Análise</option>
                                <option value="Entrevista">Entrevista</option>
                                <option value="Aprovado">Aprovado</option>
                                <option value="Banco de Talentos">Banco de Talentos</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => setSelectedCandidate(app)}
                                  className="px-3 py-1.5 rounded-lg bg-[#0C2168] text-white font-bold hover:bg-[#162F8A] cursor-pointer"
                                >
                                  Ver Ficha
                                </button>
                                <button
                                  onClick={() => handleDeleteCandidate(app.id)}
                                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-[#E7353A] cursor-pointer"
                                  title="Remover candidatura"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GERENCIADOR DE IMAGENS DO SITE (SUPER ADMIN ONLY) */}
          {isSuperAdmin && activeTab === 'imagens' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={imgSearch}
                    onChange={(e) => setImgSearch(e.target.value)}
                    placeholder="Buscar imagem por nome ou seção..."
                    className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-[#0C2168]"
                  />
                </div>
                <select
                  value={imgSectionFilter}
                  onChange={(e) => setImgSectionFilter(e.target.value)}
                  className="bg-[#F4F7FB] border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-[#0C2168] outline-none cursor-pointer"
                >
                  {imageSections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec === 'Todas' ? 'Todas as Seções do Site' : sec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredImages.map((slot) => {
                  const currentUrl = getImage(slot.key, slot.defaultUrl);
                  const removed = isImageRemoved(slot.key);
                  const customized = isImageCustomized(slot.key);
                  const draftUrl = urlDrafts[slot.key] ?? '';
                  const busy = busyImageKey === slot.key;

                  return (
                    <div
                      key={slot.key}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm"
                    >
                      {/* Preview Box */}
                      <div className="relative h-44 bg-[#0C2168]/5 border-b border-slate-200 flex items-center justify-center p-3">
                        {currentUrl ? (
                          <img
                            src={currentUrl}
                            alt={slot.label}
                            className="max-h-full max-w-full object-contain rounded-lg"
                          />
                        ) : (
                          <div className="text-center space-y-1 text-slate-400">
                            <EyeOff className="w-7 h-7 mx-auto" />
                            <span className="text-xs font-bold block">Imagem Removida do Site</span>
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
                          {removed ? 'Removida' : customized ? 'Alterada' : 'Padrão'}
                        </span>
                      </div>

                      {/* Slot Details & Controls */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#E7353A]">
                              {slot.section}
                            </div>
                            <h4 className="font-display font-bold text-sm text-[#0C2168] mt-0.5 leading-snug">
                              {slot.label}
                            </h4>
                          </div>

                          <div className="bg-[#F4F7FB] border border-slate-200/80 rounded-xl px-3 py-2 flex items-start gap-2">
                            <Maximize2 className="w-3.5 h-3.5 text-[#0C2168] shrink-0 mt-0.5" />
                            <div className="text-[11px] leading-snug">
                              <div className="font-bold text-[#0C2168]">
                                Tamanho ideal:{' '}
                                <span className="text-[#E7353A] tabular-nums">{slot.recommendedSize}</span>
                              </div>
                              <div className="text-slate-500">
                                {slot.aspectRatio}
                                {slot.formatHint ? ` · ${slot.formatHint}` : ''}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          {/* Upload File + Remove + Restore buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="flex-1 px-3 py-2 bg-[#0C2168] hover:bg-[#162F8A] text-white rounded-xl text-[11px] font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{busy ? 'Enviando...' : 'Subir Arquivo'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={busy}
                                onChange={(e) => handleImageFileUpload(slot, e)}
                                className="hidden"
                              />
                            </label>

                            {!removed && (
                              <button
                                onClick={() => handleImageAction(slot.key, { action: 'remove' })}
                                disabled={busy}
                                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-[#E7353A] rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                title="Remover esta imagem do site"
                              >
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Remover</span>
                              </button>
                            )}

                            {(removed || customized) && (
                              <button
                                onClick={() => handleImageAction(slot.key, { action: 'reset' })}
                                disabled={busy}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                title="Restaurar imagem original"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restaurar</span>
                              </button>
                            )}
                          </div>

                          {/* Custom URL input */}
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={draftUrl}
                              onChange={(e) =>
                                setUrlDrafts((prev) => ({ ...prev, [slot.key]: e.target.value }))
                              }
                              placeholder="Ou cole uma URL de imagem..."
                              className="flex-1 bg-[#F4F7FB] border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] outline-none focus:border-[#0C2168]"
                            />
                            <button
                              onClick={() => {
                                if (!draftUrl.trim()) return;
                                handleImageAction(slot.key, { url: draftUrl.trim() });
                              }}
                              disabled={busy || !draftUrl.trim()}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-[#0C2168] disabled:opacity-40 text-white rounded-xl text-[11px] font-bold cursor-pointer"
                            >
                              Salvar URL
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SEGURANÇA, TROCA DE SENHA & ACESSOS RH */}
          {activeTab === 'seguranca' && (
            <div className="space-y-6">
              {/* 1. Trocar Minha Senha (Visível para Adm e RH) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E7353A]">
                      Minha Conta Conectada
                    </span>
                    <h3 className="font-display font-bold text-lg text-[#0C2168]">
                      Alterar Minha Senha de Acesso
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Usuário atual: <strong className="text-[#0C2168]">{adminUser?.name}</strong> ({adminUser?.email}). A nova senha é protegida com hash <code className="font-mono text-[#0C2168]">scrypt</code> dentro do cofre criptografado <code className="font-mono text-[#0C2168]">AES-256-GCM</code>, sem banco de dados externo.
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold border ${
                      isSuperAdmin
                        ? 'bg-[#0C2168]/5 border-[#0C2168]/20 text-[#0C2168]'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    {isSuperAdmin ? 'Administrador Principal' : 'Acesso Somente RH'}
                  </span>
                </div>

                <form
                  onSubmit={handleChangeOwnPassword}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                >
                  <div>
                    <label className="block font-bold text-[#0C2168] mb-1">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      required
                      value={ownCurrentPass}
                      onChange={(e) => setOwnCurrentPass(e.target.value)}
                      placeholder="Digite sua senha atual"
                      className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#0C2168] mb-1">
                      Nova Senha (mín. 6 caracteres)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={ownNewPass}
                      onChange={(e) => setOwnNewPass(e.target.value)}
                      placeholder="Nova senha segura"
                      className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#0C2168] mb-1">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={ownConfirmPass}
                      onChange={(e) => setOwnConfirmPass(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={changingOwnPass}
                      className="pb-btn-primary px-5 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{changingOwnPass ? 'Salvando nova senha...' : 'Salvar Nova Senha'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. Gerenciar Acessos de RH (Exclusivo Super Admin) */}
              {isSuperAdmin && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#E7353A]">
                        Controle de Equipe · Permissões Isoladas
                      </span>
                      <h3 className="font-display font-bold text-lg text-[#0C2168]">
                        Criar & Gerenciar Acessos de RH (Sem Edição da Página Pública)
                      </h3>
                      <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                        Contas criadas aqui recebem o perfil <strong>RH Restrito</strong>: acessam apenas <strong>Vagas de Emprego</strong>, <strong>Currículos Recebidos</strong> e <strong>Trocar Própria Senha</strong>. O servidor bloqueia automaticamente qualquer alteração de textos, cores, layout ou imagens do site público.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Site público protegido (403 para RH)</span>
                    </div>
                  </div>

                  {/* Form Criar Novo Acesso RH */}
                  <form
                    onSubmit={handleCreateRhUser}
                    className="bg-[#F4F7FB] rounded-2xl border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs"
                  >
                    <div>
                      <label className="block font-bold text-[#0C2168] mb-1">Nome completo</label>
                      <input
                        type="text"
                        required
                        value={newRhName}
                        onChange={(e) => setNewRhName(e.target.value)}
                        placeholder="Ex: Ana Paula (RH)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0C2168]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0C2168] mb-1">Usuário de login</label>
                      <input
                        type="text"
                        required
                        value={newRhUsername}
                        onChange={(e) => setNewRhUsername(e.target.value)}
                        placeholder="Ex: anapaula.rh"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0C2168]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0C2168] mb-1">E-mail de acesso</label>
                      <input
                        type="email"
                        required
                        value={newRhEmail}
                        onChange={(e) => setNewRhEmail(e.target.value)}
                        placeholder="ana@precobaixoatacadista.com.br"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0C2168]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0C2168] mb-1">Senha inicial</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newRhPassword}
                        onChange={(e) => setNewRhPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0C2168]"
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-4 flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={creatingRhUser}
                        className="px-4 py-2.5 bg-[#0C2168] hover:bg-[#162F8A] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{creatingRhUser ? 'Criando acesso RH...' : 'Criar Novo Acesso de RH'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Lista de Acessos Cadastrados */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#F4F7FB] border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <th className="py-3 px-4">Nome / E-mail</th>
                            <th className="py-3 px-4">Login</th>
                            <th className="py-3 px-4">Perfil & Permissões</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {loadingUsers ? (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-slate-500">
                                Carregando acessos do cofre...
                              </td>
                            </tr>
                          ) : rhUsers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-slate-500">
                                Nenhuma conta de RH cadastrada além do Administrador Principal.
                              </td>
                            </tr>
                          ) : (
                            rhUsers.map((u) => (
                              <tr key={u.id} className="hover:bg-[#F4F7FB]/60">
                                <td className="py-3 px-4">
                                  <div className="font-bold text-[#0C2168]">{u.name}</div>
                                  <div className="text-[11px] text-slate-500">{u.email}</div>
                                </td>
                                <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                                  {u.username}
                                </td>
                                <td className="py-3 px-4">
                                  {u.roleKey === 'super_admin' ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#0C2168]/10 text-[#0C2168] font-bold text-[11px]">
                                      Administrador Total (Site + RH)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[11px]">
                                      Somente RH (Sem Edição Pública)
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                                      u.active
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}
                                  >
                                    {u.active ? 'Ativo' : 'Bloqueado'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {u.isMaster ? (
                                    <span className="text-[11px] font-semibold text-slate-400">
                                      Conta Master Protegida
                                    </span>
                                  ) : (
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        onClick={() => {
                                          setResettingUser(u);
                                          setResetUserNewPass('');
                                          setResetUserConfirmPass('');
                                        }}
                                        disabled={savingUserAction}
                                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-[#0C2168] font-bold inline-flex items-center gap-1 cursor-pointer"
                                        title="Redefinir senha deste RH"
                                      >
                                        <KeyRound className="w-3.5 h-3.5" />
                                        <span>Senha</span>
                                      </button>
                                      <button
                                        onClick={() => handleToggleRhUserActive(u)}
                                        disabled={savingUserAction}
                                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                                        title={u.active ? 'Bloquear acesso' : 'Reativar acesso'}
                                      >
                                        {u.active ? (
                                          <UserX className="w-4 h-4 text-amber-600" />
                                        ) : (
                                          <UserCheck className="w-4 h-4 text-emerald-600" />
                                        )}
                                      </button>
                                      <button
                                        onClick={() => setDeletingUser(u)}
                                        disabled={savingUserAction}
                                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-[#E7353A] cursor-pointer"
                                        title="Excluir acesso RH"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Status da Criptografia & Gerador em Código (Exclusivo Super Admin) */}
              {isSuperAdmin && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                            Senha Administrativa (scrypt)
                          </div>
                          <h3 className="font-display font-bold text-sm text-[#0C2168]">
                            Salva criptografada direto no código
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {securityStatus?.passwordAlgorithm || 'scrypt (N=16384, r=8, p=1) + Sal aleatório 128 bits'} · comparação constante via <code className="font-mono text-[#0C2168]">timingSafeEqual</code>.
                      </p>
                      <div className="bg-[#F4F7FB] rounded-xl px-3 py-2 font-mono text-[11px] text-slate-600 truncate border border-slate-200">
                        {securityStatus?.passwordHashPreview || 'scrypt:16384:8:1:••••••••'}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#0C2168]/10 text-[#0C2168] flex items-center justify-center">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#0C2168]">
                            Cofre de Logins & Sessões
                          </div>
                          <h3 className="font-display font-bold text-sm text-[#0C2168]">
                            AES-256-GCM sem Banco de Dados
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {securityStatus?.vaultAlgorithm || 'AES-256-GCM'} · Tokens de sessão criptografados com validade de 12h.
                      </p>
                      <div className="bg-[#F4F7FB] rounded-xl px-3 py-2 font-mono text-[11px] text-slate-600 truncate border border-slate-200">
                        {securityStatus?.vaultPreview || 'enc:v1:••••••••'} ({securityStatus?.allowedLoginsCount ?? 2} logins autorizados)
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 md:col-span-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                              Proteção de Dados Sensíveis (LGPD)
                            </div>
                            <h3 className="font-display font-bold text-sm text-[#0C2168]">
                              CPF, Telefone, E-mail, Nascimento e Currículos PDF Criptografados em Repouso
                            </h3>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tabular-nums">
                          {securityStatus?.encryptedApplicationsCount ?? 0} / {securityStatus?.totalApplicationsCount ?? 0} fichas cifradas
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Todos os novos currículos e arquivos PDF enviados pelos candidatos são cifrados com <strong>AES-256-GCM</strong> antes de serem gravados em disco e só são descriptografados quando o RH autenticado acessa o Painel Admin.
                      </p>
                    </div>
                  </div>

                  {/* Password & Vault Code Generator */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#E7353A]">
                        Gerador de Credenciais Criptografadas (Opcional para Código)
                      </span>
                      <h3 className="font-display font-bold text-lg text-[#0C2168]">
                        Exportar Hash & Cofre Master para <code className="font-mono">server-security.ts</code>
                      </h3>
                      <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                        Caso queira fixar uma nova senha master diretamente no código-fonte (<code className="font-mono text-[#0C2168]">server-security.ts</code>), gere o bloco criptografado abaixo. Para trocar a senha agora mesmo neste servidor, use o formulário &ldquo;Alterar Minha Senha de Acesso&rdquo; no topo desta aba.
                      </p>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!adminToken) return;
                        if (secNewPass.length < 6) {
                          showToast('err', 'A senha deve ter no mínimo 6 caracteres.');
                          return;
                        }
                        if (secNewPass !== secConfirmPass) {
                          showToast('err', 'A confirmação da senha não confere.');
                          return;
                        }
                        setSecGenerating(true);
                        setCopiedSnippet(false);
                        try {
                          const res = await fetch('/api/admin/security/generate-vault', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${adminToken}`,
                            },
                            body: JSON.stringify({
                              logins: secLogins,
                              newPassword: secNewPass,
                              adminName: secAdminName,
                            }),
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error || 'Erro ao gerar cofre.');
                          setSecSnippet(data.codeSnippet || '');
                          setSecNewPass('');
                          setSecConfirmPass('');
                          showToast('ok', 'Hash scrypt e cofre AES-256-GCM gerados com sucesso!');
                        } catch (err: unknown) {
                          showToast('err', err instanceof Error ? err.message : 'Erro ao gerar credenciais.');
                        } finally {
                          setSecGenerating(false);
                        }
                      }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
                    >
                      <div>
                        <label className="block font-bold text-[#0C2168] mb-1">
                          Logins / E-mails permitidos (separados por vírgula)
                        </label>
                        <input
                          type="text"
                          required
                          value={secLogins}
                          onChange={(e) => setSecLogins(e.target.value)}
                          className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#0C2168] mb-1">
                          Nome de exibição do Administrador
                        </label>
                        <input
                          type="text"
                          value={secAdminName}
                          onChange={(e) => setSecAdminName(e.target.value)}
                          className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#0C2168] mb-1">
                          Nova Senha Master (mín. 6 caracteres)
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={secNewPass}
                          onChange={(e) => setSecNewPass(e.target.value)}
                          placeholder="Digite a nova senha"
                          className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#0C2168] mb-1">
                          Confirmar Nova Senha
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={secConfirmPass}
                          onChange={(e) => setSecConfirmPass(e.target.value)}
                          placeholder="Repita a nova senha"
                          className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={secGenerating}
                          className="pb-btn-primary px-5 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>{secGenerating ? 'Criptografando...' : 'Gerar Hash & Cofre Criptografado'}</span>
                        </button>
                      </div>
                    </form>

                    {secSnippet && (
                      <div className="space-y-2.5 pt-3 border-t border-slate-200">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#0C2168]">
                            Bloco pronto para salvar em <code className="font-mono">server-security.ts</code>:
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(secSnippet);
                                setCopiedSnippet(true);
                                setTimeout(() => setCopiedSnippet(false), 2500);
                              } catch {
                                showToast('err', 'Não foi possível copiar automaticamente.');
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#0C2168] hover:bg-[#162F8A] text-white text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSnippet ? 'Copiado!' : 'Copiar Código Criptografado'}</span>
                          </button>
                        </div>
                        <pre className="bg-slate-950 text-emerald-300 rounded-2xl p-4 text-[11px] font-mono overflow-x-auto leading-relaxed">
                          {secSnippet}
                        </pre>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Create / Edit Job Modal */}
      {isJobModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsJobModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0C2168] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">
                {editingJob ? 'Editar Vaga de Emprego' : 'Publicar Nova Vaga'}
              </h3>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E7353A] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0C2168] mb-1">Título da Vaga *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Ex: Operador(a) de Caixa"
                    className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C2168] mb-1">Unidade / Loja *</label>
                  <select
                    value={jobUnit}
                    onChange={(e) => setJobUnit(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                  >
                    <option value="Todas as Lojas">Todas as Lojas</option>
                    {STORES.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Matriz / Administrativo">Matriz / Administrativo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0C2168] mb-1">Departamento / Setor</label>
                  <input
                    type="text"
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    placeholder="Ex: Frente de Caixa, Açougue, PB Farma"
                    className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C2168] mb-1">Tipo de Contrato</label>
                  <select
                    value={jobContract}
                    onChange={(e) => setJobContract(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                  >
                    <option>CLT · Efetivo</option>
                    <option>Jovem Aprendiz</option>
                    <option>Estágio</option>
                    <option>Temporário</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0C2168] mb-1">Escala / Turno</label>
                  <input
                    type="text"
                    value={jobSchedule}
                    onChange={(e) => setJobSchedule(e.target.value)}
                    placeholder="Ex: Escala 6x1 · Turno Tarde"
                    className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0C2168] mb-1">Descrição das Atividades</label>
                <textarea
                  rows={3}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Descreva as responsabilidades principais do cargo..."
                  className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0C2168] mb-1">
                    Requisitos (1 por linha)
                  </label>
                  <textarea
                    rows={3}
                    value={jobReqs}
                    onChange={(e) => setJobReqs(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0C2168]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0C2168] mb-1">
                    Benefícios (1 por linha)
                  </label>
                  <textarea
                    rows={3}
                    value={jobBenefits}
                    onChange={(e) => setJobBenefits(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0C2168]"
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-2 font-bold text-[#0C2168] cursor-pointer">
                <input
                  type="checkbox"
                  checked={jobActive}
                  onChange={(e) => setJobActive(e.target.checked)}
                />
                <span>Publicar vaga imediatamente no site</span>
              </label>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingJob}
                  className="pb-btn-primary px-5 py-2.5 rounded-xl cursor-pointer disabled:opacity-60"
                >
                  {savingJob ? 'Salvando...' : editingJob ? 'Salvar Alterações' : 'Publicar Vaga'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0C2168] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#FFBC7D]">
                  {selectedCandidate.protocol}
                </span>
                <h3 className="font-display font-bold text-lg">{selectedCandidate.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E7353A] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-[#F4F7FB] p-4 rounded-2xl border border-slate-200">
                <div>
                  <strong className="text-[#0C2168] block">Vaga Pretendida</strong>
                  <span>{selectedCandidate.jobTitle}</span>
                </div>
                <div>
                  <strong className="text-[#0C2168] block">Unidade</strong>
                  <span>{selectedCandidate.unit}</span>
                </div>
                <div>
                  <strong className="text-[#0C2168] block">WhatsApp / Telefone</strong>
                  <span>{selectedCandidate.phone}</span>
                </div>
                <div>
                  <strong className="text-[#0C2168] block">E-mail</strong>
                  <span>{selectedCandidate.email}</span>
                </div>
                <div>
                  <strong className="text-[#0C2168] block">Escolaridade</strong>
                  <span>{selectedCandidate.education}</span>
                </div>
                <div>
                  <strong className="text-[#0C2168] block">Disponibilidade</strong>
                  <span>{selectedCandidate.availability}</span>
                </div>
                <div>
                  <strong className="text-[#0C2168] block">Bairro / Cidade</strong>
                  <span>{selectedCandidate.neighborhood || 'Não informado'}</span>
                </div>
                <div>
                  <strong className="text-[#0C2168] block">CPF</strong>
                  <span>{selectedCandidate.cpf || 'Não informado'}</span>
                </div>
              </div>

              <div>
                <strong className="text-[#0C2168] block mb-1">Última Experiência</strong>
                <p className="bg-[#F4F7FB] p-3 rounded-xl border border-slate-200">
                  {selectedCandidate.lastExperience || 'Não informada'}
                </p>
              </div>

              <div>
                <strong className="text-[#0C2168] block mb-1">Resumo do Candidato</strong>
                <p className="bg-[#F4F7FB] p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedCandidate.summary || 'Sem observações adicionais.'}
                </p>
              </div>

              {selectedCandidate.resumeStoredName ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-emerald-900 text-xs">
                        Currículo Anexado
                      </div>
                      <div className="text-[11px] text-emerald-700 truncate">
                        {selectedCandidate.resumeFileName || selectedCandidate.resumeStoredName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(selectedCandidate.resumeFileName || '').toLowerCase().endsWith('.pdf') && (
                      <button
                        type="button"
                        onClick={() => handlePreviewResume(selectedCandidate)}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0C2168] border border-emerald-200 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visualizar</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDownloadResume(selectedCandidate)}
                      className="pb-btn-primary px-4 py-2 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar Currículo</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-500 text-center">
                  Candidato não anexou arquivo PDF (apenas ficha online).
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inline PDF Preview Modal */}
      {previewPdf && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closePreviewPdf}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0C2168] text-white px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFBC7D]">
                  Visualização de Currículo PDF
                </div>
                <h3 className="font-display font-bold text-base truncate">
                  {previewPdf.title} — {previewPdf.fileName}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewPdf.url}
                  download={previewPdf.fileName}
                  className="px-3.5 py-2 rounded-xl bg-[#E7353A] hover:bg-[#d1292e] text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </a>
                <button
                  onClick={closePreviewPdf}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E7353A] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <iframe
              src={previewPdf.url}
              title={`Currículo de ${previewPdf.title}`}
              className="w-full flex-1 bg-slate-100 border-0"
            />
          </div>
        </div>
      )}
      {/* Reset RH User Password Modal */}
      {resettingUser && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setResettingUser(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0C2168] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFBC7D]">
                  Redefinir Senha RH
                </div>
                <h3 className="font-display font-bold text-base truncate">
                  {resettingUser.name}
                </h3>
              </div>
              <button
                onClick={() => setResettingUser(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E7353A] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleResetRhPassword} className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Defina a nova senha de acesso para <strong className="text-[#0C2168]">{resettingUser.username}</strong> ({resettingUser.email}).
              </p>
              <div>
                <label className="block font-bold text-[#0C2168] mb-1">Nova Senha (mín. 6 caracteres)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={resetUserNewPass}
                  onChange={(e) => setResetUserNewPass(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0C2168] mb-1">Confirmar Nova Senha</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={resetUserConfirmPass}
                  onChange={(e) => setResetUserConfirmPass(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full bg-[#F4F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0C2168]"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingUserAction}
                  className="pb-btn-primary px-5 py-2.5 rounded-xl cursor-pointer disabled:opacity-60"
                >
                  {savingUserAction ? 'Salvando...' : 'Salvar Nova Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete RH User Confirmation Modal */}
      {deletingUser && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingUser(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#E7353A] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-display font-bold text-base">Excluir Acesso de RH</h3>
              <button
                onClick={() => setDeletingUser(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-black/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs text-slate-700">
              <p className="leading-relaxed">
                Tem certeza que deseja remover permanentemente o acesso de{' '}
                <strong className="text-[#0C2168]">{deletingUser.name}</strong> ({deletingUser.email})? Esta conta perderá imediatamente o acesso ao painel de vagas e currículos.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteRhUser}
                  disabled={savingUserAction}
                  className="px-5 py-2.5 rounded-xl bg-[#E7353A] hover:bg-[#d1292e] text-white font-bold cursor-pointer disabled:opacity-60"
                >
                  {savingUserAction ? 'Excluindo...' : 'Excluir Acesso'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
