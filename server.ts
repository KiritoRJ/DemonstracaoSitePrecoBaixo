import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  AuthenticatedTokenPayload,
  authenticateAdmin,
  authenticateMasterTestLogin,
  changeOwnPassword,
  createRhUser,
  decryptApplicationSensitiveData,
  decryptBuffer,
  deleteRhUser,
  encryptApplicationSensitiveData,
  encryptBuffer,
  generateEncryptedCredentialsSnippet,
  getSecurityStatus,
  issueEncryptedAdminToken,
  listRhAndAdminUsers,
  revokeAdminToken,
  updateRhUser,
  verifyEncryptedAdminToken,
} from "./server-security";

dotenv.config();

const app = express();
app.use(express.json({ limit: "20mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Persistent local JSON store (or /tmp seeded store on Vercel serverless)
const BUNDLED_DATA_DIR = path.resolve(process.cwd(), "server-data");
const DATA_DIR = process.env.VERCEL ? "/tmp/pb-server-data" : BUNDLED_DATA_DIR;
const RESUMES_DIR = path.join(DATA_DIR, "resumes");
const UPLOADS_DIR = process.env.VERCEL
  ? "/tmp/pb-uploads"
  : path.resolve(process.cwd(), "public/pb-assets/uploads");
const DB_FILE = path.join(DATA_DIR, "db.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(RESUMES_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

if (process.env.VERCEL && !fs.existsSync(DB_FILE) && fs.existsSync(path.join(BUNDLED_DATA_DIR, "db.json"))) {
  fs.copyFileSync(path.join(BUNDLED_DATA_DIR, "db.json"), DB_FILE);
  const bundledResumes = path.join(BUNDLED_DATA_DIR, "resumes");
  if (fs.existsSync(bundledResumes)) {
    fs.cpSync(bundledResumes, RESUMES_DIR, { recursive: true, force: false });
  }
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
  status: "Novo" | "Em Análise" | "Entrevista" | "Aprovado" | "Banco de Talentos";
  createdAt: string;
}

export type HomeSectionId =
  | "hero"
  | "offers"
  | "history"
  | "stores"
  | "services"
  | "community";

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

const DEFAULT_THEME_CONFIG: SiteThemeConfig = {
  navbarBg: "#0C2168",
  navbarText: "#FFFFFF",
  primaryBtnBg: "#E7353A",
  primaryBtnText: "#FFFFFF",
  secondaryBtnBg: "#0C2168",
  secondaryBtnText: "#FFFFFF",
};

const DEFAULT_LAYOUT_CONFIG: SiteLayoutConfig = {
  sectionOrder: ["hero", "offers", "history", "stores", "services", "community"],
  cardOrders: {},
};

interface StoreDB {
  jobs: JobPosting[];
  applications: JobApplication[];
  imageOverrides: Record<string, string | null>;
  textOverrides: Record<string, string>;
  themeConfig: SiteThemeConfig;
  layoutConfig: SiteLayoutConfig;
}

const INITIAL_JOBS: JobPosting[] = [
  {
    id: "vaga-01",
    title: "Operador(a) de Caixa",
    unit: "PB Augusto Montenegro",
    department: "Frente de Caixa",
    contractType: "CLT · Efetivo",
    schedule: "Escala 6x1 · Turno Tarde/Noite",
    description:
      "Realizar atendimento acolhedor aos clientes no checkout, registro ágil de mercadorias e operações de pagamento (Cartão PB, PIX, débito e crédito).",
    requirements: [
      "Ensino médio completo",
      "Simpatia, agilidade e atenção aos detalhes",
      "Desejável experiência prévia em supermercado ou atacarejo",
    ],
    benefits: [
      "Salário compatível com o mercado",
      "Vale-transporte e refeição no local",
      "Desconto em compras nas lojas do Grupo PB",
      "Plano de crescimento interno",
    ],
    active: true,
    createdAt: "2026-11-10T10:00:00.000Z",
  },
  {
    id: "vaga-02",
    title: "Repositor(a) de Mercearia e Hortifrúti",
    unit: "PB Cidade Nova",
    department: "Operação de Loja",
    contractType: "CLT · Efetivo",
    schedule: "Escala 6x1 · Manhã",
    description:
      "Organizar gôndolas, conferir datas de validade (PVPS), precificar produtos e apoiar os clientes nos corredores de mercearia e hortifrúti.",
    requirements: [
      "Ensino médio completo",
      "Disponibilidade para trabalho dinâmico em loja",
      "Comprometimento e trabalho em equipe",
    ],
    benefits: [
      "Vale-transporte",
      "Refeitório na unidade",
      "Cartão PB Colaborador",
      "Oportunidade de promoção",
    ],
    active: true,
    createdAt: "2026-11-12T14:30:00.000Z",
  },
  {
    id: "vaga-03",
    title: "Açougueiro(a) / Balconista de Carnes",
    unit: "PB Senador Lemos",
    department: "Açougue & Perecíveis",
    contractType: "CLT · Efetivo",
    schedule: "Escala 6x1 · Integral",
    description:
      "Preparar cortes bovinos, suínos e aves para a Quarta da Carne e atendimento diário no balcão, mantendo rigorosos padrões de higiene.",
    requirements: [
      "Experiência comprovada em açougue",
      "Conhecimento em cortes comerciais e desossa",
      "Zelo pelas normas de segurança alimentar",
    ],
    benefits: [
      "Salário + adicional de função",
      "Vale-transporte e alimentação",
      "Convênio farmácia PB Farma",
    ],
    active: true,
    createdAt: "2026-11-13T09:15:00.000Z",
  },
  {
    id: "vaga-04",
    title: "Atendente de Farmácia (Balconista)",
    unit: "PB Tapanã",
    department: "PB Farma",
    contractType: "CLT · Efetivo",
    schedule: "Escala 6x1 · Tarde",
    description:
      "Atendimento ao público na PB Farma, organização de dermocosméticos, perfumaria e apoio na dispensação sob supervisão farmacêutica.",
    requirements: [
      "Ensino médio completo",
      "Experiência em drogaria ou atendimento ao cliente",
      "Boa comunicação",
    ],
    benefits: [
      "Comissão sobre vendas de perfumaria",
      "Vale-transporte e refeição",
      "Descontos na rede PB Farma",
    ],
    active: true,
    createdAt: "2026-11-14T11:00:00.000Z",
  },
  {
    id: "vaga-05",
    title: "Jovem Aprendiz — Auxiliar Administrativo / Loja",
    unit: "Todas as Lojas",
    department: "Administrativo & Loja",
    contractType: "Jovem Aprendiz",
    schedule: "Meio período (Manhã ou Tarde)",
    description:
      "Programa de formação para jovens que buscam o primeiro emprego em rotinas administrativas, apoio ao atendimento e organização de loja.",
    requirements: [
      "Idade entre 16 e 22 anos",
      "Estar cursando ou ter concluído o Ensino Médio",
      "Vontade de aprender e crescer no varejo",
    ],
    benefits: [
      "Bolsa-auxílio + vale-transporte",
      "Curso de capacitação profissional",
      "Possibilidade de efetivação",
    ],
    active: true,
    createdAt: "2026-11-15T08:00:00.000Z",
  },
];

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "cand-01",
    protocol: "PB-2026-4108",
    jobId: "vaga-01",
    jobTitle: "Operador(a) de Caixa",
    unit: "PB Augusto Montenegro",
    fullName: "Mariana Silva Souza",
    cpf: "042.***.***-19",
    birthDate: "1999-05-14",
    phone: "(91) 98412-5501",
    email: "mariana.souza@exemplo.com",
    neighborhood: "Parque Verde, Belém - PA",
    education: "Ensino Médio Completo",
    availability: "Total (Manhã / Tarde / Noite)",
    lastExperience: "Supermercado Central — Operadora de Caixa (2 anos)",
    summary: "Experiência com frente de caixa, fechamento financeiro e atendimento ágil ao público.",
    status: "Em Análise",
    createdAt: "2026-11-15T15:20:00.000Z",
  },
  {
    id: "cand-02",
    protocol: "PB-2026-4112",
    jobId: "vaga-03",
    jobTitle: "Açougueiro(a) / Balconista de Carnes",
    unit: "PB Senador Lemos",
    fullName: "Carlos Eduardo Ferreira",
    cpf: "018.***.***-82",
    birthDate: "1991-09-22",
    phone: "(91) 98831-2094",
    email: "carlos.acougue@exemplo.com",
    neighborhood: "Sacramenta, Belém - PA",
    education: "Ensino Médio Completo",
    availability: "Integral",
    lastExperience: "Frigorífico Paraense — Açougueiro Líder (4 anos)",
    summary: "Especialista em cortes bovinos e suínos, desossa rápida e atendimento em balcão.",
    status: "Entrevista",
    createdAt: "2026-11-16T09:45:00.000Z",
  },
];

function createMinimalPdfBuffer(lines: string[]): Buffer {
  const safeLines = lines.map((line) =>
    line
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[()\\]/g, " ")
  );
  const textOps = safeLines
    .map((line, i) => `${i === 0 ? "" : "0 -18 Td "}(${line}) Tj`)
    .join("\n");
  const streamContent = `BT\n/F1 12 Tf\n50 750 Td\n${textOps}\nET`;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${Buffer.byteLength(streamContent, "utf8")} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += obj;
  }
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "utf8");
}

function ensureSampleResumes(db: StoreDB): StoreDB {
  let changed = false;
  const samples: Record<string, { stored: string; original: string; lines: string[] }> = {
    "cand-01": {
      stored: "sample-mariana-souza.pdf",
      original: "Curriculo_Mariana_Silva_Souza.pdf",
      lines: [
        "CURRICULO PROFISSIONAL - PRECO BAIXO ATACADISTA",
        "Candidata: Mariana Silva Souza",
        "Vaga: Operador(a) de Caixa - PB Augusto Montenegro",
        "Telefone: (91) 98412-5501 | Email: mariana.souza@exemplo.com",
        "Bairro: Parque Verde, Belem - PA",
        "Escolaridade: Ensino Medio Completo",
        "Experiencia: Supermercado Central - Operadora de Caixa (2 anos)",
        "Resumo: Atendimento agil no checkout, Cartao PB, PIX e fechamento de caixa.",
      ],
    },
    "cand-02": {
      stored: "sample-carlos-ferreira.pdf",
      original: "Curriculo_Carlos_Eduardo_Ferreira.pdf",
      lines: [
        "CURRICULO PROFISSIONAL - PRECO BAIXO ATACADISTA",
        "Candidato: Carlos Eduardo Ferreira",
        "Vaga: Acougueiro(a) / Balconista de Carnes - PB Senador Lemos",
        "Telefone: (91) 98831-2094 | Email: carlos.acougue@exemplo.com",
        "Bairro: Sacramenta, Belem - PA",
        "Escolaridade: Ensino Medio Completo",
        "Experiencia: Frigorifico Paraense - Acougueiro Lider (4 anos)",
        "Resumo: Cortes bovinos e suinos, desossa e atendimento em balcao.",
      ],
    },
  };

  for (let i = 0; i < db.applications.length; i++) {
    const appItem = db.applications[i];
    const sample = samples[appItem.id];
    if (sample) {
      const targetPath = path.join(RESUMES_DIR, sample.stored);
      if (!fs.existsSync(targetPath)) {
        fs.writeFileSync(targetPath, encryptBuffer(createMinimalPdfBuffer(sample.lines)));
      }
      if (!appItem.resumeStoredName) {
        appItem.resumeStoredName = sample.stored;
        appItem.resumeFileName = sample.original;
        changed = true;
      }
    }
    if (
      (appItem.cpf && !appItem.cpf.startsWith("enc:v1:")) ||
      (appItem.phone && !appItem.phone.startsWith("enc:v1:")) ||
      (appItem.email && !appItem.email.startsWith("enc:v1:"))
    ) {
      db.applications[i] = encryptApplicationSensitiveData(appItem);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }
  return db;
}

function readDB(): StoreDB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      const parsed = JSON.parse(raw) as Partial<StoreDB>;
      return ensureSampleResumes({
        jobs: Array.isArray(parsed.jobs) ? parsed.jobs : INITIAL_JOBS,
        applications: Array.isArray(parsed.applications) ? parsed.applications : INITIAL_APPLICATIONS,
        imageOverrides: parsed.imageOverrides || {},
        textOverrides: parsed.textOverrides || {},
        themeConfig: { ...DEFAULT_THEME_CONFIG, ...(parsed.themeConfig || {}) },
        layoutConfig: {
          sectionOrder:
            Array.isArray(parsed.layoutConfig?.sectionOrder) && parsed.layoutConfig.sectionOrder.length > 0
              ? parsed.layoutConfig.sectionOrder
              : DEFAULT_LAYOUT_CONFIG.sectionOrder,
          cardOrders: { ...(parsed.layoutConfig?.cardOrders || {}) },
        },
      });
    }
  } catch (err) {
    console.error("Failed reading DB, re-initializing:", err);
  }
  const initial: StoreDB = ensureSampleResumes({
    jobs: INITIAL_JOBS,
    applications: INITIAL_APPLICATIONS,
    imageOverrides: {},
    textOverrides: {},
    themeConfig: { ...DEFAULT_THEME_CONFIG },
    layoutConfig: { ...DEFAULT_LAYOUT_CONFIG },
  });
  fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
  return initial;
}

function writeDB(data: StoreDB) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

interface AuthenticatedRequest extends express.Request {
  adminAuth?: AuthenticatedTokenPayload;
}

function requireAdmin(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const payload = verifyEncryptedAdminToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Sessão administrativa inválida ou expirada. Faça login novamente." });
  }
  req.adminAuth = payload;
  next();
}

function requireSuperAdmin(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  if (req.adminAuth?.roleKey !== "super_admin") {
    return res.status(403).json({
      error: "Permissão negada: contas de RH não possuem acesso para alterar a página pública ou gerenciar acessos.",
    });
  }
  next();
}

// Bootstrap public + store data
app.get("/api/bootstrap", (_req, res) => {
  const db = readDB();
  res.json({
    jobs: db.jobs,
    imageOverrides: db.imageOverrides,
    textOverrides: db.textOverrides,
    themeConfig: db.themeConfig,
    layoutConfig: db.layoutConfig,
  });
});

// Admin Login (Autenticação com cofre AES-256-GCM + hash scrypt salvos no código/cofre cifrado)
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const result = authenticateAdmin(String(username || ""), String(password || ""));
  if (!result.ok || !result.user) {
    return res.status(401).json({ error: result.error || "Usuário ou senha inválidos." });
  }
  const normalizedUser = String(username || "").trim().toLowerCase();
  const token = issueEncryptedAdminToken({
    id: result.user.id,
    u: normalizedUser,
    roleKey: result.user.roleKey,
    name: result.user.name,
    email: result.user.email,
    role: result.user.role,
  });
  res.json({
    token,
    user: result.user,
  });
});

app.post("/api/admin/test-login", (_req, res) => {
  const result = authenticateMasterTestLogin();
  if (!result.ok || !result.user) {
    return res.status(401).json({ error: result.error || "Falha no login de teste." });
  }
  const token = issueEncryptedAdminToken({
    id: result.user.id,
    u: result.user.username,
    roleKey: result.user.roleKey,
    name: result.user.name,
    email: result.user.email,
    role: result.user.role,
  });
  res.json({
    token,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      roleKey: result.user.roleKey,
    },
  });
});

app.post("/api/admin/logout", (req, res) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (token) revokeAdminToken(token);
  res.json({ ok: true });
});

// Admin / RH: Change own password
app.post("/api/admin/security/change-password", requireAdmin, (req: AuthenticatedRequest, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!req.adminAuth?.id) {
    return res.status(401).json({ error: "Sessão inválida." });
  }
  const result = changeOwnPassword(
    req.adminAuth.id,
    String(currentPassword || ""),
    String(newPassword || "")
  );
  if (!result.ok) {
    return res.status(400).json({ error: result.error || "Não foi possível alterar a senha." });
  }
  res.json({ ok: true, message: "Senha alterada e criptografada com sucesso!" });
});

// Admin Security Posture & Encrypted Vault Generator
app.get("/api/admin/security/status", requireAdmin, (_req, res) => {
  const db = readDB();
  const encryptedApplicationsCount = db.applications.filter(
    (a) => a.email.startsWith("enc:v1:") || a.phone.startsWith("enc:v1:")
  ).length;
  res.json({
    ...getSecurityStatus(),
    encryptedApplicationsCount,
    totalApplicationsCount: db.applications.length,
  });
});

app.post("/api/admin/security/generate-vault", requireAdmin, requireSuperAdmin, (req, res) => {
  const { logins, newPassword, adminName, adminEmail } = req.body || {};
  const pass = String(newPassword || "");
  if (pass.length < 6) {
    return res.status(400).json({ error: "A nova senha deve ter pelo menos 6 caracteres." });
  }
  const loginList = Array.isArray(logins)
    ? logins.map((x: unknown) => String(x))
    : String(logins || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const generated = generateEncryptedCredentialsSnippet({
    logins: loginList,
    newPassword: pass,
    adminName: adminName ? String(adminName) : undefined,
    adminEmail: adminEmail ? String(adminEmail) : undefined,
  });

  res.json(generated);
});

// Super Admin: Manage RH Users (without access to public page editing)
app.get("/api/admin/users", requireAdmin, requireSuperAdmin, (_req, res) => {
  res.json({ users: listRhAndAdminUsers() });
});

app.post("/api/admin/users", requireAdmin, requireSuperAdmin, (req, res) => {
  const { name, username, email, password } = req.body || {};
  const result = createRhUser({
    name: String(name || ""),
    username: String(username || ""),
    email: String(email || ""),
    password: String(password || ""),
  });
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json({ user: result.user });
});

app.patch("/api/admin/users/:id", requireAdmin, requireSuperAdmin, (req, res) => {
  const { active, newPassword, name } = req.body || {};
  const result = updateRhUser(req.params.id, {
    active: typeof active === "boolean" ? active : undefined,
    newPassword: typeof newPassword === "string" ? newPassword : undefined,
    name: typeof name === "string" ? name : undefined,
  });
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }
  res.json({ user: result.user });
});

app.delete("/api/admin/users/:id", requireAdmin, requireSuperAdmin, (req, res) => {
  const result = deleteRhUser(req.params.id);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }
  res.json({ ok: true });
});

// Admin: Get all applications (decrypted only for authenticated RH/Admin)
app.get("/api/admin/applications", requireAdmin, (_req, res) => {
  const db = readDB();
  res.json({ applications: db.applications.map(decryptApplicationSensitiveData) });
});

// Admin: Download or preview encrypted resume with original filename
app.get("/api/admin/resumes/:filename", (req, res) => {
  const token = String(req.query.token || (req.headers.authorization || "").replace(/^Bearer\s+/i, "")).trim();
  if (!verifyEncryptedAdminToken(token)) {
    return res.status(401).send("Não autorizado");
  }
  const safeName = path.basename(req.params.filename);
  const fullPath = path.join(RESUMES_DIR, safeName);
  if (!fs.existsSync(fullPath)) {
    return res.status(404).send("Arquivo não encontrado");
  }
  const db = readDB();
  const matched = db.applications.find((a) => a.resumeStoredName === safeName);
  const downloadName = matched?.resumeFileName || safeName;
  const decryptedBuffer = decryptBuffer(fs.readFileSync(fullPath));
  const isPdf = downloadName.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    res.setHeader("Content-Type", "application/pdf");
  }
  if (req.query.inline === "1") {
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(downloadName)}"`);
  } else {
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadName)}"`);
  }
  return res.send(decryptedBuffer);
});

// Candidate: Submit application (Umentor-style integrated flow, encrypted at rest)
app.post("/api/applications", (req, res) => {
  try {
    const {
      jobId,
      jobTitle,
      unit,
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
    } = req.body || {};

    if (!fullName || !phone || !email) {
      return res.status(400).json({ error: "Nome, telefone e e-mail são obrigatórios." });
    }

    let resumeStoredName: string | undefined;
    if (resumeBase64 && resumeFileName) {
      const cleanBase64 = String(resumeBase64).replace(/^data:[^;]+;base64,/, "");
      const ext = path.extname(String(resumeFileName)).slice(0, 10) || ".pdf";
      resumeStoredName = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}${ext}`;
      const plainBuffer = Buffer.from(cleanBase64, "base64");
      fs.writeFileSync(path.join(RESUMES_DIR, resumeStoredName), encryptBuffer(plainBuffer));
    }

    const db = readDB();
    const protocol = `PB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: JobApplication = encryptApplicationSensitiveData({
      id: `cand-${Date.now()}`,
      protocol,
      jobId: jobId || "banco-talentos",
      jobTitle: jobTitle || "Banco de Talentos Geral",
      unit: unit || "Todas as Lojas",
      fullName: String(fullName).trim(),
      cpf: String(cpf || "").trim(),
      birthDate: String(birthDate || "").trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      neighborhood: String(neighborhood || "").trim(),
      education: String(education || "Ensino Médio Completo").trim(),
      availability: String(availability || "Integral").trim(),
      lastExperience: String(lastExperience || "").trim(),
      summary: String(summary || "").trim(),
      resumeFileName: resumeFileName ? String(resumeFileName) : undefined,
      resumeStoredName,
      status: "Novo",
      createdAt: new Date().toISOString(),
    });

    db.applications.unshift(newApp);
    writeDB(db);
    res.status(201).json({
      application: {
        id: newApp.id,
        protocol: newApp.protocol,
        status: newApp.status,
        createdAt: newApp.createdAt,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao salvar candidatura";
    res.status(500).json({ error: message });
  }
});

// Admin: Update candidate pipeline status
app.patch("/api/admin/applications/:id", requireAdmin, (req, res) => {
  const { status } = req.body || {};
  const db = readDB();
  const idx = db.applications.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Candidato não encontrado" });
  db.applications[idx].status = status;
  writeDB(db);
  res.json({ application: decryptApplicationSensitiveData(db.applications[idx]) });
});

app.delete("/api/admin/applications/:id", requireAdmin, (req, res) => {
  const db = readDB();
  db.applications = db.applications.filter((a) => a.id !== req.params.id);
  writeDB(db);
  res.json({ ok: true });
});

// Admin: Jobs CRUD
app.post("/api/admin/jobs", requireAdmin, (req, res) => {
  const body = req.body || {};
  if (!body.title || !body.unit) {
    return res.status(400).json({ error: "Título e unidade da vaga são obrigatórios." });
  }
  const db = readDB();
  const newJob: JobPosting = {
    id: `vaga-${Date.now()}`,
    title: String(body.title).trim(),
    unit: String(body.unit).trim(),
    department: String(body.department || "Operação de Loja").trim(),
    contractType: String(body.contractType || "CLT · Efetivo").trim(),
    schedule: String(body.schedule || "Escala 6x1").trim(),
    description: String(body.description || "").trim(),
    requirements: Array.isArray(body.requirements) ? body.requirements : [],
    benefits: Array.isArray(body.benefits) ? body.benefits : [],
    active: body.active !== false,
    createdAt: new Date().toISOString(),
  };
  db.jobs.unshift(newJob);
  writeDB(db);
  res.status(201).json({ job: newJob });
});

app.put("/api/admin/jobs/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.jobs.findIndex((j) => j.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Vaga não encontrada" });
  db.jobs[idx] = { ...db.jobs[idx], ...req.body, id: db.jobs[idx].id };
  writeDB(db);
  res.json({ job: db.jobs[idx] });
});

app.delete("/api/admin/jobs/:id", requireAdmin, (req, res) => {
  const db = readDB();
  db.jobs = db.jobs.filter((j) => j.id !== req.params.id);
  writeDB(db);
  res.json({ ok: true });
});

// Admin: Site Images Management (alter, remove, or restore default) — Super Admin only
app.post("/api/admin/images", requireAdmin, requireSuperAdmin, (req, res) => {
  const { key, url, action } = req.body || {};
  if (!key) return res.status(400).json({ error: "Chave da imagem obrigatória." });

  const db = readDB();
  if (action === "reset") {
    delete db.imageOverrides[key];
  } else if (action === "remove") {
    db.imageOverrides[key] = null;
  } else {
    db.imageOverrides[key] = String(url || "").trim() || null;
  }
  writeDB(db);
  res.json({ imageOverrides: db.imageOverrides });
});

app.post("/api/admin/upload-image", requireAdmin, requireSuperAdmin, (req, res) => {
  try {
    const { key, filename, base64Data } = req.body || {};
    if (!key || !base64Data) {
      return res.status(400).json({ error: "Imagem e chave são obrigatórias." });
    }
    const cleanBase64 = String(base64Data).replace(/^data:image\/[^;]+;base64,/, "");
    const ext = path.extname(String(filename || "img.png")).slice(0, 10) || ".png";
    const storedName = `${key.replace(/[^a-zA-Z0-9_-]/g, "_")}_${Date.now()}${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, storedName), Buffer.from(cleanBase64, "base64"));

    const publicUrl = `/pb-assets/uploads/${storedName}`;
    const db = readDB();
    db.imageOverrides[key] = publicUrl;
    writeDB(db);
    res.json({ url: publicUrl, imageOverrides: db.imageOverrides });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao enviar imagem";
    res.status(500).json({ error: message });
  }
});

// Admin: Theme Colors (Navbar + Primary/Secondary Buttons) — Super Admin only
app.post("/api/admin/theme", requireAdmin, requireSuperAdmin, (req, res) => {
  const { action, themeConfig } = req.body || {};
  const db = readDB();
  if (action === "reset") {
    db.themeConfig = { ...DEFAULT_THEME_CONFIG };
  } else if (themeConfig && typeof themeConfig === "object") {
    db.themeConfig = {
      navbarBg: String(themeConfig.navbarBg || db.themeConfig.navbarBg),
      navbarText: String(themeConfig.navbarText || db.themeConfig.navbarText),
      primaryBtnBg: String(themeConfig.primaryBtnBg || db.themeConfig.primaryBtnBg),
      primaryBtnText: String(themeConfig.primaryBtnText || db.themeConfig.primaryBtnText),
      secondaryBtnBg: String(themeConfig.secondaryBtnBg || db.themeConfig.secondaryBtnBg),
      secondaryBtnText: String(themeConfig.secondaryBtnText || db.themeConfig.secondaryBtnText),
    };
  }
  writeDB(db);
  res.json({ themeConfig: db.themeConfig });
});

// Admin: Drag-and-drop Public Layout Order — Super Admin only
app.post("/api/admin/layout", requireAdmin, requireSuperAdmin, (req, res) => {
  const { action, layoutConfig } = req.body || {};
  const db = readDB();
  if (action === "reset") {
    db.layoutConfig = {
      sectionOrder: [...DEFAULT_LAYOUT_CONFIG.sectionOrder],
      cardOrders: {},
    };
  } else if (layoutConfig && typeof layoutConfig === "object") {
    const validSections = new Set<HomeSectionId>([
      "hero",
      "offers",
      "history",
      "stores",
      "services",
      "community",
    ]);
    let nextOrder = db.layoutConfig.sectionOrder;
    if (Array.isArray(layoutConfig.sectionOrder)) {
      const filtered = layoutConfig.sectionOrder.filter((id: HomeSectionId) =>
        validSections.has(id)
      );
      for (const s of DEFAULT_LAYOUT_CONFIG.sectionOrder) {
        if (!filtered.includes(s)) filtered.push(s);
      }
      nextOrder = filtered;
    }
    db.layoutConfig = {
      sectionOrder: nextOrder,
      cardOrders:
        layoutConfig.cardOrders && typeof layoutConfig.cardOrders === "object"
          ? { ...db.layoutConfig.cardOrders, ...layoutConfig.cardOrders }
          : db.layoutConfig.cardOrders,
    };
  }
  writeDB(db);
  res.json({ layoutConfig: db.layoutConfig });
});

// Admin: Inline Text Overrides (edit or restore any site text) — Super Admin only
app.post("/api/admin/texts", requireAdmin, requireSuperAdmin, (req, res) => {
  const { key, value, action } = req.body || {};
  const db = readDB();
  if (action === "reset-all") {
    db.textOverrides = {};
  } else if (action === "reset") {
    if (key) delete db.textOverrides[String(key)];
  } else {
    if (!key) return res.status(400).json({ error: "Chave de texto obrigatória." });
    db.textOverrides[String(key)] = String(value ?? "");
  }
  writeDB(db);
  res.json({ textOverrides: db.textOverrides });
});

// AI Chef Route
app.post("/api/ai/recipe", async (req, res) => {
  try {
    const { ingredients, budget, people } = req.body;

    const prompt = `Você é o Chef PB do Preço Baixo Atacadista (Belém e Ananindeua - PA).
    O usuário tem os seguintes ingredientes comprados no atacarejo: ${ingredients || "itens básicos de mercado"}.
    Orçamento disponível: ${budget || "R$ 50,00"}.
    Número de pessoas: ${people || "4 pessoas"}.

    Crie uma receita deliciosa, econômica e prática usando esses ingredientes ou sugestões complementares baratas que podem ser encontradas nas lojas Preço Baixo Atacadista.
    Responda em formato JSON estruturado com os seguintes campos:
    {
      "recipeName": "Nome criativo e apetitoso",
      "prepTime": "Ex: 30 minutos",
      "costEstimate": "Ex: R$ 25,00",
      "description": "Breve introdução convidativa",
      "ingredientsList": ["Ingrediente 1", "Ingrediente 2"],
      "instructions": ["Passo 1", "Passo 2"],
      "wholesaleTip": "Dica de economia comprando em volume no Preço Baixo Atacadista"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    res.json(JSON.parse(jsonText));
  } catch (error: unknown) {
    console.error("Gemini Recipe API Error:", error);
    const message = error instanceof Error ? error.message : "Erro ao gerar receita com IA";
    res.status(500).json({ error: message });
  }
});

app.get("/robots.txt", (req, res) => {
  const proto = String(req.headers["x-forwarded-proto"] || req.protocol || "https");
  const host = String(req.headers["x-forwarded-host"] || req.get("host") || "");
  const baseUrl = process.env.APP_URL || (host ? `${proto}://${host}` : "");
  res.type("text/plain; charset=utf-8");
  res.send(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/admin/",
      "",
      baseUrl ? `Sitemap: ${baseUrl.replace(/\/$/, "")}/sitemap.xml` : "Sitemap: /sitemap.xml",
    ].join("\n")
  );
});

app.get("/sitemap.xml", (req, res) => {
  const proto = String(req.headers["x-forwarded-proto"] || req.protocol || "https");
  const host = String(req.headers["x-forwarded-host"] || req.get("host") || "");
  const baseUrl = (process.env.APP_URL || (host ? `${proto}://${host}` : "https://precobaixoatacadista.com.br")).replace(/\/$/, "");
  const lastMod = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${baseUrl}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${baseUrl}/#ofertas`, changefreq: "weekly", priority: "0.9" },
    { loc: `${baseUrl}/#lojas`, changefreq: "monthly", priority: "0.9" },
    { loc: `${baseUrl}/#servicos`, changefreq: "monthly", priority: "0.8" },
    { loc: `${baseUrl}/#historia`, changefreq: "monthly", priority: "0.7" },
  ];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    ),
    "</urlset>",
  ].join("\n");
  res.type("application/xml; charset=utf-8");
  res.send(xml);
});

app.use("/pb-assets/uploads", express.static(UPLOADS_DIR));

async function startServer() {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
