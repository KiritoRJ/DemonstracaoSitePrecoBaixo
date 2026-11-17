import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  AdminUser,
  HomeSectionId,
  JobPosting,
  SiteLayoutConfig,
  SiteThemeConfig,
} from '../types';

export const DEFAULT_THEME_CONFIG: SiteThemeConfig = {
  navbarBg: '#0C2168',
  navbarText: '#FFFFFF',
  primaryBtnBg: '#E7353A',
  primaryBtnText: '#FFFFFF',
  secondaryBtnBg: '#0C2168',
  secondaryBtnText: '#FFFFFF',
};

export const DEFAULT_LAYOUT_CONFIG: SiteLayoutConfig = {
  sectionOrder: ['hero', 'offers', 'history', 'stores', 'services', 'community'],
  cardOrders: {},
};

type CardOrderGroup = keyof SiteLayoutConfig['cardOrders'];

export interface EditingTextSlot {
  key: string;
  defaultValue: string;
  label?: string;
  multiline?: boolean;
}

interface SiteDataContextValue {
  jobs: JobPosting[];
  imageOverrides: Record<string, string | null>;
  textOverrides: Record<string, string>;
  themeConfig: SiteThemeConfig;
  layoutConfig: SiteLayoutConfig;
  loading: boolean;
  adminToken: string | null;
  adminUser: AdminUser | null;
  isSuperAdmin: boolean;
  inlineEditMode: boolean;
  setInlineEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  textEditMode: boolean;
  setTextEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  layoutEditMode: boolean;
  setLayoutEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isColorEditorOpen: boolean;
  setIsColorEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingImageKey: string | null;
  openImageEditor: (key: string) => void;
  closeImageEditor: () => void;
  editingTextSlot: EditingTextSlot | null;
  openTextEditor: (slot: EditingTextSlot) => void;
  closeTextEditor: () => void;
  getText: (key: string, defaultValue: string) => string;
  isTextCustomized: (key: string) => boolean;
  saveTextOverride: (key: string, value: string) => Promise<void>;
  resetTextOverride: (key: string) => Promise<void>;
  resetAllTextOverrides: () => Promise<void>;
  getImage: (key: string, defaultUrl: string) => string | null;
  isImageRemoved: (key: string) => boolean;
  isImageCustomized: (key: string) => boolean;
  refreshBootstrap: () => Promise<void>;
  loginAdmin: (username: string, password: string) => Promise<void>;
  loginAdminAutoTest: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  setJobsState: React.Dispatch<React.SetStateAction<JobPosting[]>>;
  setImageOverridesState: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
  updateTheme: (patch: Partial<SiteThemeConfig>) => void;
  resetTheme: () => Promise<void>;
  reorderSections: (sourceId: HomeSectionId, targetId: HomeSectionId) => Promise<void>;
  moveSectionStep: (sectionId: HomeSectionId, direction: 'up' | 'down') => Promise<void>;
  reorderCards: (
    group: CardOrderGroup,
    sourceId: string,
    targetId: string,
    defaultIds: string[]
  ) => Promise<void>;
  sortByCardOrder: <T>(group: CardOrderGroup, items: T[], getId: (item: T) => string) => T[];
  resetLayout: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'pb_admin_token';
const USER_STORAGE_KEY = 'pb_admin_user';

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobsState] = useState<JobPosting[]>([]);
  const [imageOverrides, setImageOverridesState] = useState<Record<string, string | null>>({});
  const [textOverrides, setTextOverridesState] = useState<Record<string, string>>({});
  const [themeConfig, setThemeConfig] = useState<SiteThemeConfig>(DEFAULT_THEME_CONFIG);
  const [layoutConfig, setLayoutConfig] = useState<SiteLayoutConfig>(DEFAULT_LAYOUT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [inlineEditMode, setInlineEditMode] = useState(true);
  const [textEditMode, setTextEditMode] = useState(true);
  const [layoutEditMode, setLayoutEditMode] = useState(true);
  const [isColorEditorOpen, setIsColorEditorOpen] = useState(false);
  const [editingImageKey, setEditingImageKey] = useState<string | null>(null);
  const [editingTextSlot, setEditingTextSlot] = useState<EditingTextSlot | null>(null);
  const themeSaveTimer = useRef<number | null>(null);

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const raw = sessionStorage.getItem(USER_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch {
      return null;
    }
  });

  // Sync themeConfig live to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--pb-nav-bg', themeConfig.navbarBg);
    root.style.setProperty('--pb-nav-text', themeConfig.navbarText);
    root.style.setProperty('--pb-btn-primary-bg', themeConfig.primaryBtnBg);
    root.style.setProperty('--pb-btn-primary-text', themeConfig.primaryBtnText);
    root.style.setProperty('--pb-btn-navy-bg', themeConfig.secondaryBtnBg);
    root.style.setProperty('--pb-btn-navy-text', themeConfig.secondaryBtnText);
  }, [themeConfig]);

  const openImageEditor = useCallback((key: string) => {
    setEditingImageKey(key);
  }, []);

  const closeImageEditor = useCallback(() => {
    setEditingImageKey(null);
  }, []);

  const openTextEditor = useCallback((slot: EditingTextSlot) => {
    setEditingTextSlot(slot);
  }, []);

  const closeTextEditor = useCallback(() => {
    setEditingTextSlot(null);
  }, []);

  const refreshBootstrap = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.jobs)) {
        setJobsState(data.jobs);
      }
      if (data.imageOverrides && typeof data.imageOverrides === 'object') {
        setImageOverridesState(data.imageOverrides);
      }
      if (data.textOverrides && typeof data.textOverrides === 'object') {
        setTextOverridesState(data.textOverrides);
      }
      if (data.themeConfig && typeof data.themeConfig === 'object') {
        setThemeConfig({ ...DEFAULT_THEME_CONFIG, ...data.themeConfig });
      }
      if (data.layoutConfig && typeof data.layoutConfig === 'object') {
        setLayoutConfig({
          sectionOrder:
            Array.isArray(data.layoutConfig.sectionOrder) &&
            data.layoutConfig.sectionOrder.length > 0
              ? data.layoutConfig.sectionOrder
              : DEFAULT_LAYOUT_CONFIG.sectionOrder,
          cardOrders: data.layoutConfig.cardOrders || {},
        });
      }
    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBootstrap();
  }, [refreshBootstrap]);

  const getImage = useCallback(
    (key: string, defaultUrl: string): string | null => {
      if (Object.prototype.hasOwnProperty.call(imageOverrides, key)) {
        return imageOverrides[key];
      }
      return defaultUrl;
    },
    [imageOverrides]
  );

  const isImageRemoved = useCallback(
    (key: string): boolean => {
      return Object.prototype.hasOwnProperty.call(imageOverrides, key) && imageOverrides[key] === null;
    },
    [imageOverrides]
  );

  const isImageCustomized = useCallback(
    (key: string): boolean => {
      return Object.prototype.hasOwnProperty.call(imageOverrides, key) && imageOverrides[key] !== null;
    },
    [imageOverrides]
  );

  const isSuperAdmin = Boolean(adminToken && adminUser?.roleKey === 'super_admin');

  const parseApiJson = async (res: Response, fallbackError: string) => {
    const raw = await res.text();
    let data: Record<string, any> = {};
    try {
      data = raw ? (JSON.parse(raw) as Record<string, any>) : {};
    } catch {
      throw new Error(raw ? `${fallbackError} (${raw.slice(0, 80)})` : fallbackError);
    }
    if (!res.ok) {
      throw new Error(String(data.error || fallbackError));
    }
    return data;
  };

  const loginAdmin = useCallback(async (username: string, password: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await parseApiJson(res, 'Falha na autenticação administrativa.');
    const superFlag = data.user?.roleKey === 'super_admin';
    setAdminToken(data.token);
    setAdminUser(data.user);
    setInlineEditMode(superFlag);
    setTextEditMode(superFlag);
    setLayoutEditMode(superFlag);
    if (!superFlag) {
      setIsColorEditorOpen(false);
    }
    try {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  const loginAdminAutoTest = useCallback(async () => {
    const res = await fetch('/api/admin/test-login', {
      method: 'POST',
    });
    const data = await parseApiJson(res, 'Falha no acesso automático de teste.');
    const superFlag = data.user?.roleKey === 'super_admin';
    setAdminToken(data.token);
    setAdminUser(data.user);
    setInlineEditMode(superFlag);
    setTextEditMode(superFlag);
    setLayoutEditMode(superFlag);
    if (!superFlag) {
      setIsColorEditorOpen(false);
    }
    try {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  const logoutAdmin = useCallback(async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } catch {
        // Ignore network errors on logout
      }
    }
    setAdminToken(null);
    setAdminUser(null);
    setEditingImageKey(null);
    setEditingTextSlot(null);
    setIsColorEditorOpen(false);
    try {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, [adminToken]);

  const persistTheme = useCallback(
    async (nextTheme: SiteThemeConfig) => {
      if (!adminToken) return;
      try {
        const res = await fetch('/api/admin/theme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ themeConfig: nextTheme }),
        });
        if (res.status === 401) {
          await logoutAdmin();
        }
      } catch (err) {
        console.error('Erro ao salvar tema:', err);
      }
    },
    [adminToken, logoutAdmin]
  );

  const updateTheme = useCallback(
    (patch: Partial<SiteThemeConfig>) => {
      setThemeConfig((prev) => {
        const next = { ...prev, ...patch };
        if (themeSaveTimer.current) {
          window.clearTimeout(themeSaveTimer.current);
        }
        themeSaveTimer.current = window.setTimeout(() => {
          persistTheme(next);
        }, 250);
        return next;
      });
    },
    [persistTheme]
  );

  const resetTheme = useCallback(async () => {
    setThemeConfig(DEFAULT_THEME_CONFIG);
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ action: 'reset' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.themeConfig) setThemeConfig(data.themeConfig);
      }
    } catch (err) {
      console.error('Erro ao restaurar cores:', err);
    }
  }, [adminToken]);

  const persistLayout = useCallback(
    async (nextLayout: SiteLayoutConfig) => {
      if (!adminToken) return;
      try {
        const res = await fetch('/api/admin/layout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ layoutConfig: nextLayout }),
        });
        if (res.status === 401) {
          await logoutAdmin();
        }
      } catch (err) {
        console.error('Erro ao salvar layout:', err);
      }
    },
    [adminToken, logoutAdmin]
  );

  const reorderSections = useCallback(
    async (sourceId: HomeSectionId, targetId: HomeSectionId) => {
      if (sourceId === targetId) return;
      let nextLayout: SiteLayoutConfig | null = null;
      setLayoutConfig((prev) => {
        const order = [...prev.sectionOrder];
        const fromIdx = order.indexOf(sourceId);
        const toIdx = order.indexOf(targetId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        order.splice(fromIdx, 1);
        order.splice(toIdx, 0, sourceId);
        nextLayout = { ...prev, sectionOrder: order };
        return nextLayout;
      });
      if (nextLayout) await persistLayout(nextLayout);
    },
    [persistLayout]
  );

  const moveSectionStep = useCallback(
    async (sectionId: HomeSectionId, direction: 'up' | 'down') => {
      let nextLayout: SiteLayoutConfig | null = null;
      setLayoutConfig((prev) => {
        const order = [...prev.sectionOrder];
        const idx = order.indexOf(sectionId);
        if (idx === -1) return prev;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= order.length) return prev;
        [order[idx], order[swapIdx]] = [order[swapIdx], order[idx]];
        nextLayout = { ...prev, sectionOrder: order };
        return nextLayout;
      });
      if (nextLayout) await persistLayout(nextLayout);
    },
    [persistLayout]
  );

  const reorderCards = useCallback(
    async (
      group: CardOrderGroup,
      sourceId: string,
      targetId: string,
      defaultIds: string[]
    ) => {
      if (sourceId === targetId) return;
      let nextLayout: SiteLayoutConfig | null = null;
      setLayoutConfig((prev) => {
        const existing = prev.cardOrders[group];
        const baseOrder =
          existing && existing.length > 0
            ? [
                ...existing.filter((id) => defaultIds.includes(id)),
                ...defaultIds.filter((id) => !existing.includes(id)),
              ]
            : [...defaultIds];
        const fromIdx = baseOrder.indexOf(sourceId);
        const toIdx = baseOrder.indexOf(targetId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        baseOrder.splice(fromIdx, 1);
        baseOrder.splice(toIdx, 0, sourceId);
        nextLayout = {
          ...prev,
          cardOrders: {
            ...prev.cardOrders,
            [group]: baseOrder,
          },
        };
        return nextLayout;
      });
      if (nextLayout) await persistLayout(nextLayout);
    },
    [persistLayout]
  );

  const sortByCardOrder = useCallback(
    <T,>(group: CardOrderGroup, items: T[], getId: (item: T) => string): T[] => {
      const order = layoutConfig.cardOrders[group];
      if (!order || order.length === 0) return items;
      const rank = new Map<string, number>();
      order.forEach((id, idx) => rank.set(id, idx));
      return [...items].sort((a, b) => {
        const rA = rank.has(getId(a)) ? rank.get(getId(a))! : Number.MAX_SAFE_INTEGER;
        const rB = rank.has(getId(b)) ? rank.get(getId(b))! : Number.MAX_SAFE_INTEGER;
        return rA - rB;
      });
    },
    [layoutConfig.cardOrders]
  );

  const resetLayout = useCallback(async () => {
    setLayoutConfig(DEFAULT_LAYOUT_CONFIG);
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ action: 'reset' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.layoutConfig) setLayoutConfig(data.layoutConfig);
      }
    } catch (err) {
      console.error('Erro ao restaurar layout:', err);
    }
  }, [adminToken]);

  const getText = useCallback(
    (key: string, defaultValue: string): string => {
      if (Object.prototype.hasOwnProperty.call(textOverrides, key)) {
        return textOverrides[key];
      }
      return defaultValue;
    },
    [textOverrides]
  );

  const isTextCustomized = useCallback(
    (key: string): boolean => Object.prototype.hasOwnProperty.call(textOverrides, key),
    [textOverrides]
  );

  const saveTextOverride = useCallback(
    async (key: string, value: string) => {
      if (!adminToken) return;
      const res = await fetch('/api/admin/texts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ key, value }),
      });
      if (res.status === 401) {
        await logoutAdmin();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar texto.');
      if (data.textOverrides) setTextOverridesState(data.textOverrides);
    },
    [adminToken, logoutAdmin]
  );

  const resetTextOverride = useCallback(
    async (key: string) => {
      if (!adminToken) return;
      const res = await fetch('/api/admin/texts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ key, action: 'reset' }),
      });
      if (res.status === 401) {
        await logoutAdmin();
        return;
      }
      const data = await res.json();
      if (res.ok && data.textOverrides) setTextOverridesState(data.textOverrides);
    },
    [adminToken, logoutAdmin]
  );

  const resetAllTextOverrides = useCallback(async () => {
    if (!adminToken) return;
    const res = await fetch('/api/admin/texts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ action: 'reset-all' }),
    });
    if (res.ok) {
      const data = await res.json();
      setTextOverridesState(data.textOverrides || {});
    }
  }, [adminToken]);

  return (
    <SiteDataContext.Provider
      value={{
        jobs,
        imageOverrides,
        textOverrides,
        themeConfig,
        layoutConfig,
        loading,
        adminToken,
        adminUser,
        isSuperAdmin,
        inlineEditMode: isSuperAdmin && inlineEditMode,
        setInlineEditMode,
        textEditMode: isSuperAdmin && textEditMode,
        setTextEditMode,
        layoutEditMode: isSuperAdmin && layoutEditMode,
        setLayoutEditMode,
        isColorEditorOpen: isSuperAdmin && isColorEditorOpen,
        setIsColorEditorOpen,
        editingImageKey,
        openImageEditor,
        closeImageEditor,
        editingTextSlot,
        openTextEditor,
        closeTextEditor,
        getText,
        isTextCustomized,
        saveTextOverride,
        resetTextOverride,
        resetAllTextOverrides,
        getImage,
        isImageRemoved,
        isImageCustomized,
        refreshBootstrap,
        loginAdmin,
        loginAdminAutoTest,
        logoutAdmin,
        setJobsState,
        setImageOverridesState,
        updateTheme,
        resetTheme,
        reorderSections,
        moveSectionStep,
        reorderCards,
        sortByCardOrder,
        resetLayout,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData deve ser utilizado dentro de SiteDataProvider');
  }
  return ctx;
}
