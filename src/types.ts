export interface RecipeResult {
  recipeName: string;
  prepTime: string;
  costEstimate: string;
  description: string;
  ingredientsList: string[];
  instructions: string[];
  wholesaleTip: string;
}

export interface JobPosting {
  id: string;
  title: string;
  unit: string;
  department: string;
  contractType: string;
  schedule: string;
  description: string;
  requirements: string[];
  benefits: string[];
  active: boolean;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  protocol: string;
  jobId: string;
  jobTitle: string;
  unit: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  neighborhood: string;
  education: string;
  availability: string;
  lastExperience: string;
  summary: string;
  resumeFileName?: string;
  resumeStoredName?: string;
  status: 'Novo' | 'Em Análise' | 'Entrevista' | 'Aprovado' | 'Banco de Talentos';
  createdAt: string;
}

export type AdminRoleKey = 'super_admin' | 'rh';

export interface AdminUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  roleKey: AdminRoleKey;
}

export interface ManagedRhUser {
  id: string;
  username: string;
  name: string;
  email: string;
  roleKey: AdminRoleKey;
  roleLabel: string;
  active: boolean;
  createdAt: string;
  isMaster?: boolean;
}

export interface SiteImageSlot {
  key: string;
  label: string;
  section:
    | 'Identidade Visual'
    | 'Campanhas (Hero)'
    | 'Encartes Ativos'
    | 'Institucional & Serviços'
    | 'Fotos das 8 Lojas'
    | 'Telas App Meu PB'
    | 'PB Farma & Instagram';
  defaultUrl: string;
  recommendedSize: string;
  aspectRatio: string;
  formatHint?: string;
}

export type HomeSectionId =
  | 'hero'
  | 'offers'
  | 'history'
  | 'stores'
  | 'services'
  | 'community';

export interface SiteThemeConfig {
  navbarBg: string;
  navbarText: string;
  primaryBtnBg: string;
  primaryBtnText: string;
  secondaryBtnBg: string;
  secondaryBtnText: string;
}

export interface SiteLayoutConfig {
  sectionOrder: HomeSectionId[];
  cardOrders: {
    flyers?: string[];
    stores?: string[];
    reels?: string[];
    highlights?: string[];
  };
}
