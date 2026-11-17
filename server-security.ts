import crypto from "crypto";
import fs from "fs";
import path from "path";

/**
 * Módulo de Criptografia, Cofre Administrativo & Controle de Acesso (RBAC)
 * - Sem necessidade de banco de dados SQL para autenticação
 * - Senhas protegidas com hash scrypt (sal aleatório + timingSafeEqual)
 * - Logins, contas RH e sessões cifradas com AES-256-GCM
 * - Conta Principal (super_admin): controle total + edição da página pública
 * - Contas de RH (rh): acesso apenas a Vagas, Currículos e troca da própria senha (SEM edição da página pública)
 */

const BASE_SECRET =
  process.env.PB_VAULT_SECRET ||
  process.env.ADMIN_TOKEN_SECRET ||
  "pb-atacadista::vault::v1::hmac-aes256gcm";

const VAULT_KEY = crypto.scryptSync(BASE_SECRET, "pb-salt-2026", 32);
const DATA_KEY = crypto.scryptSync(BASE_SECRET, "pb-data-pii-salt-2026", 32);
const TOKEN_KEY = crypto.scryptSync(BASE_SECRET, "pb-session-token-salt-2026", 32);

const DATA_DIR = path.resolve(process.cwd(), "server-data");
const AUTH_VAULT_FILE = path.join(DATA_DIR, "auth-vault.enc");
fs.mkdirSync(DATA_DIR, { recursive: true });

const REVOKED_TOKENS = new Set<string>();
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas
const FILE_MAGIC = Buffer.from("PBENC1", "ascii");

export type AdminRoleKey = "super_admin" | "rh";

export interface AdminProfileVault {
  allowedLogins: string[];
  profile: {
    name: string;
    email: string;
    role: string;
  };
}

export interface VaultAccountRecord {
  id: string;
  username: string;
  name: string;
  email: string;
  roleKey: AdminRoleKey;
  roleLabel: string;
  passwordHash: string;
  active: boolean;
  createdAt: string;
  isMaster?: boolean;
}

export interface AuthenticatedTokenPayload {
  id: string;
  u: string;
  roleKey: AdminRoleKey;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  jti: string;
}

/**
 * Credenciais mestras iniciais criptografadas e salvas diretamente no código
 * (dispensa banco de dados para o primeiro acesso do Administrador Principal).
 */
const ENCRYPTED_ADMIN_VAULT =
  process.env.ADMIN_VAULT_ENCRYPTED ||
  "enc:v1:JCEbBHzoOV0KciB3:CsgCYw83SnjkLqB8xrzkJQ:2pgggT3cbaXURdy8wPe8QRVXv3VsTy68C7QQDlrwn5amfkAJh2yX_PZMpoqenYQXfzTsoa0yZwmwOvjiVokA_M2uKh-zVgjotLl7relh94I8D2XDRQ4pQ3Bisg7SOcN0WAvmBUuJG8o7_clOds61LCADMn_8vbmqWPYavvyvlJkxEO_PofiZjslfOMp8oKIivkY7vlv0x3jWZG6VEebpfslp8jf7j1qD3RntBoOrkkq-rg9otip0E78c06q5wgPeiWHgbYls-Rmu-xLd3IUyccLsKuif6iBD-O8";

const ENCRYPTED_ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  "scrypt:16384:8:1:ae91f11f7f05968ee4c43eab4062b1b5:1dd31f48a277c4a520c07893d5aaf01e33f991abaf2a782802955be297ef07f91f56cc4a9e67db721d1f2000b74d68119a5556eedb977f5789c3ec42d64eb3bb";

function encryptWithKey(plainText: string, key: Buffer, prefix = "enc:v1"): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${prefix}:${iv.toString("base64url")}:${tag.toString("base64url")}:${encrypted.toString("base64url")}`;
}

function decryptWithKey(payload: string, key: Buffer, prefix = "enc:v1"): string | null {
  if (!payload || !payload.startsWith(`${prefix}:`)) return null;
  const parts = payload.slice(prefix.length + 1).split(":");
  if (parts.length !== 3) return null;
  const [ivB64, tagB64, dataB64] = parts;
  const iv = Buffer.from(ivB64, "base64url");
  const tag = Buffer.from(tagB64, "base64url");
  const data = Buffer.from(dataB64, "base64url");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const N = 16384;
  const r = 8;
  const p = 1;
  const derived = crypto.scryptSync(password, salt, 64, { N, r, p }).toString("hex");
  return `scrypt:${N}:${r}:${p}:${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = parts[4];
  const expectedHex = parts[5];
  if (!N || !r || !p || !salt || !expectedHex) return false;

  const expectedBuf = Buffer.from(expectedHex, "hex");
  const actualBuf = crypto.scryptSync(password, salt, expectedBuf.length, { N, r, p });
  if (actualBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(actualBuf, expectedBuf);
}

function constantTimeEquals(aStr: string, bStr: string): boolean {
  const a = Buffer.from(aStr, "utf8");
  const b = Buffer.from(bStr, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function readDecryptedMasterVault(): AdminProfileVault | null {
  try {
    const raw = decryptWithKey(ENCRYPTED_ADMIN_VAULT, VAULT_KEY, "enc:v1");
    if (!raw) return null;
    return JSON.parse(raw) as AdminProfileVault;
  } catch {
    return null;
  }
}

function buildDefaultMasterAccount(): VaultAccountRecord {
  const master = readDecryptedMasterVault();
  return {
    id: "master-admin",
    username: "admin",
    name: master?.profile.name || "Administrador Principal · Preço Baixo",
    email: master?.profile.email || "rh@precobaixoatacadista.com.br",
    roleKey: "super_admin",
    roleLabel: "Administrador Principal",
    passwordHash: ENCRYPTED_ADMIN_PASSWORD_HASH,
    active: true,
    createdAt: "2026-11-10T08:00:00.000Z",
    isMaster: true,
  };
}

function readAccountsVault(): VaultAccountRecord[] {
  try {
    if (fs.existsSync(AUTH_VAULT_FILE)) {
      const cipherContent = fs.readFileSync(AUTH_VAULT_FILE, "utf8").trim();
      const plainJson = decryptWithKey(cipherContent, VAULT_KEY, "enc:v1");
      if (plainJson) {
        const parsed = JSON.parse(plainJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as VaultAccountRecord[];
        }
      }
    }
  } catch (err) {
    console.error("Erro ao ler cofre criptografado de usuários, restaurando mestre:", err);
  }
  const initial = [buildDefaultMasterAccount()];
  writeAccountsVault(initial);
  return initial;
}

function writeAccountsVault(accounts: VaultAccountRecord[]) {
  const encrypted = encryptWithKey(JSON.stringify(accounts), VAULT_KEY, "enc:v1");
  fs.writeFileSync(AUTH_VAULT_FILE, encrypted, "utf8");
}

function matchesAccountLogin(acc: VaultAccountRecord, normalizedInput: string): boolean {
  if (constantTimeEquals(acc.username.toLowerCase(), normalizedInput)) return true;
  if (constantTimeEquals(acc.email.toLowerCase(), normalizedInput)) return true;
  if (acc.isMaster) {
    const master = readDecryptedMasterVault();
    if (master?.allowedLogins.some((entry) => constantTimeEquals(entry.toLowerCase(), normalizedInput))) {
      return true;
    }
  }
  return false;
}

export function authenticateAdmin(
  username: string,
  password: string
): {
  ok: boolean;
  error?: string;
  user?: { id: string; name: string; email: string; role: string; roleKey: AdminRoleKey };
} {
  const normalizedInput = String(username || "").trim().toLowerCase();
  if (!normalizedInput || !password) {
    return { ok: false, error: "Informe login e senha." };
  }

  const accounts = readAccountsVault();
  const matched = accounts.find((acc) => matchesAccountLogin(acc, normalizedInput));

  if (!matched) {
    return { ok: false, error: "Usuário ou senha inválidos." };
  }

  if (!matched.active) {
    return { ok: false, error: "Este acesso de RH está temporariamente desativado." };
  }

  if (!verifyPassword(String(password), matched.passwordHash)) {
    return { ok: false, error: "Usuário ou senha inválidos." };
  }

  return {
    ok: true,
    user: {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      role: matched.roleLabel,
      roleKey: matched.roleKey,
    },
  };
}

export function authenticateMasterTestLogin(): {
  ok: boolean;
  error?: string;
  user?: { id: string; username: string; name: string; email: string; role: string; roleKey: AdminRoleKey };
} {
  const accounts = readAccountsVault();
  const master = accounts.find((acc) => acc.isMaster && acc.active) || accounts.find((acc) => acc.roleKey === "super_admin" && acc.active);
  if (!master) {
    return { ok: false, error: "Conta administrativa de teste indisponível." };
  }
  return {
    ok: true,
    user: {
      id: master.id,
      username: master.username,
      name: master.name,
      email: master.email,
      role: master.roleLabel,
      roleKey: master.roleKey,
    },
  };
}

export function issueEncryptedAdminToken(user: {
  id: string;
  u: string;
  roleKey: AdminRoleKey;
  name: string;
  email: string;
  role: string;
}): string {
  const payload: AuthenticatedTokenPayload = {
    id: user.id,
    u: user.u,
    roleKey: user.roleKey,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
    jti: crypto.randomBytes(8).toString("hex"),
  };
  return encryptWithKey(JSON.stringify(payload), TOKEN_KEY, "tok:v1");
}

export function verifyEncryptedAdminToken(token: string): AuthenticatedTokenPayload | null {
  if (!token || REVOKED_TOKENS.has(token)) return null;
  try {
    const raw = decryptWithKey(token, TOKEN_KEY, "tok:v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthenticatedTokenPayload>;
    if (!parsed.exp || Date.now() > parsed.exp) return null;
    if (!parsed.id || !parsed.roleKey) return null;

    const accounts = readAccountsVault();
    const account = accounts.find((a) => a.id === parsed.id);
    if (!account || !account.active) return null;

    return {
      id: account.id,
      u: parsed.u || account.username,
      roleKey: account.roleKey,
      name: account.name,
      email: account.email,
      role: account.roleLabel,
      iat: parsed.iat || Date.now(),
      exp: parsed.exp,
      jti: parsed.jti || "",
    };
  } catch {
    return null;
  }
}

export function revokeAdminToken(token: string) {
  if (token) REVOKED_TOKENS.add(token);
}

export function changeOwnPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): { ok: boolean; error?: string } {
  if (!newPassword || newPassword.length < 6) {
    return { ok: false, error: "A nova senha deve ter no mínimo 6 caracteres." };
  }
  const accounts = readAccountsVault();
  const idx = accounts.findIndex((a) => a.id === userId);
  if (idx === -1) {
    return { ok: false, error: "Usuário não encontrado no cofre." };
  }
  if (!verifyPassword(currentPassword, accounts[idx].passwordHash)) {
    return { ok: false, error: "A senha atual informada está incorreta." };
  }
  accounts[idx].passwordHash = hashPassword(newPassword);
  writeAccountsVault(accounts);
  return { ok: true };
}

export function listRhAndAdminUsers() {
  const accounts = readAccountsVault();
  return accounts.map((acc) => ({
    id: acc.id,
    username: acc.username,
    name: acc.name,
    email: acc.email,
    roleKey: acc.roleKey,
    roleLabel: acc.roleLabel,
    active: acc.active,
    createdAt: acc.createdAt,
    isMaster: Boolean(acc.isMaster),
  }));
}

export function createRhUser(params: {
  name: string;
  username: string;
  email: string;
  password: string;
}) {
  const cleanName = params.name.trim();
  const cleanUser = params.username.trim().toLowerCase();
  const cleanEmail = params.email.trim().toLowerCase();
  const pass = String(params.password || "");

  if (!cleanName || (!cleanUser && !cleanEmail) || pass.length < 6) {
    return {
      ok: false as const,
      error: "Informe nome, login/e-mail e uma senha de pelo menos 6 caracteres.",
    };
  }

  const finalUsername = cleanUser || cleanEmail;
  const finalEmail = cleanEmail || finalUsername;

  const accounts = readAccountsVault();
  const master = readDecryptedMasterVault();
  const duplicate = accounts.some(
    (a) =>
      a.username.toLowerCase() === finalUsername ||
      a.email.toLowerCase() === finalEmail ||
      a.username.toLowerCase() === finalEmail ||
      a.email.toLowerCase() === finalUsername
  );
  const collidesMaster = Boolean(
    master?.allowedLogins.some(
      (l) => l.toLowerCase() === finalUsername || l.toLowerCase() === finalEmail
    )
  );

  if (duplicate || collidesMaster) {
    return {
      ok: false as const,
      error: "Já existe um acesso cadastrado com este login ou e-mail.",
    };
  }

  const newAccount: VaultAccountRecord = {
    id: `rh-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
    username: finalUsername,
    name: cleanName,
    email: finalEmail,
    roleKey: "rh",
    roleLabel: "RH (Vagas & Currículos)",
    passwordHash: hashPassword(pass),
    active: true,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  writeAccountsVault(accounts);

  return {
    ok: true as const,
    user: {
      id: newAccount.id,
      username: newAccount.username,
      name: newAccount.name,
      email: newAccount.email,
      roleKey: newAccount.roleKey,
      roleLabel: newAccount.roleLabel,
      active: newAccount.active,
      createdAt: newAccount.createdAt,
      isMaster: false,
    },
  };
}

export function updateRhUser(
  userId: string,
  patch: { active?: boolean; newPassword?: string; name?: string }
) {
  const accounts = readAccountsVault();
  const idx = accounts.findIndex((a) => a.id === userId);
  if (idx === -1) {
    return { ok: false as const, error: "Usuário não encontrado." };
  }
  const target = accounts[idx];

  if (target.isMaster && patch.active === false) {
    return { ok: false as const, error: "O Administrador Principal não pode ser desativado." };
  }

  if (typeof patch.active === "boolean" && !target.isMaster) {
    target.active = patch.active;
  }
  if (typeof patch.name === "string" && patch.name.trim()) {
    target.name = patch.name.trim();
  }
  if (typeof patch.newPassword === "string" && patch.newPassword.length > 0) {
    if (patch.newPassword.length < 6) {
      return { ok: false as const, error: "A nova senha deve ter no mínimo 6 caracteres." };
    }
    target.passwordHash = hashPassword(patch.newPassword);
  }

  accounts[idx] = target;
  writeAccountsVault(accounts);

  return {
    ok: true as const,
    user: {
      id: target.id,
      username: target.username,
      name: target.name,
      email: target.email,
      roleKey: target.roleKey,
      roleLabel: target.roleLabel,
      active: target.active,
      createdAt: target.createdAt,
      isMaster: Boolean(target.isMaster),
    },
  };
}

export function deleteRhUser(userId: string) {
  const accounts = readAccountsVault();
  const target = accounts.find((a) => a.id === userId);
  if (!target) {
    return { ok: false as const, error: "Usuário não encontrado." };
  }
  if (target.isMaster) {
    return { ok: false as const, error: "O Administrador Principal não pode ser excluído." };
  }
  const filtered = accounts.filter((a) => a.id !== userId);
  writeAccountsVault(filtered);
  return { ok: true as const };
}

export function encryptSensitiveText(plain: string): string {
  const value = String(plain || "");
  if (!value) return "";
  if (value.startsWith("enc:v1:")) return value;
  return encryptWithKey(value, DATA_KEY, "enc:v1");
}

export function decryptSensitiveText(stored: string): string {
  const value = String(stored || "");
  if (!value) return "";
  if (!value.startsWith("enc:v1:")) return value;
  try {
    return decryptWithKey(value, DATA_KEY, "enc:v1") ?? "";
  } catch {
    return "[Dado criptografado com outra chave]";
  }
}

export function encryptBuffer(plainBuf: Buffer): Buffer {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", DATA_KEY, iv);
  const enc = Buffer.concat([cipher.update(plainBuf), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([FILE_MAGIC, iv, tag, enc]);
}

export function decryptBuffer(storedBuf: Buffer): Buffer {
  if (storedBuf.length < FILE_MAGIC.length + 28) return storedBuf;
  if (!storedBuf.subarray(0, FILE_MAGIC.length).equals(FILE_MAGIC)) {
    return storedBuf;
  }
  const ivStart = FILE_MAGIC.length;
  const tagStart = ivStart + 12;
  const dataStart = tagStart + 16;
  const iv = storedBuf.subarray(ivStart, tagStart);
  const tag = storedBuf.subarray(tagStart, dataStart);
  const data = storedBuf.subarray(dataStart);
  const decipher = crypto.createDecipheriv("aes-256-gcm", DATA_KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

export function encryptApplicationSensitiveData<
  T extends { cpf: string; birthDate: string; phone: string; email: string; neighborhood: string }
>(appItem: T): T {
  return {
    ...appItem,
    cpf: encryptSensitiveText(appItem.cpf),
    birthDate: encryptSensitiveText(appItem.birthDate),
    phone: encryptSensitiveText(appItem.phone),
    email: encryptSensitiveText(appItem.email),
    neighborhood: encryptSensitiveText(appItem.neighborhood),
  };
}

export function decryptApplicationSensitiveData<
  T extends { cpf: string; birthDate: string; phone: string; email: string; neighborhood: string }
>(appItem: T): T {
  return {
    ...appItem,
    cpf: decryptSensitiveText(appItem.cpf),
    birthDate: decryptSensitiveText(appItem.birthDate),
    phone: decryptSensitiveText(appItem.phone),
    email: decryptSensitiveText(appItem.email),
    neighborhood: decryptSensitiveText(appItem.neighborhood),
  };
}

export function generateEncryptedCredentialsSnippet(params: {
  logins: string[];
  newPassword: string;
  adminName?: string;
  adminEmail?: string;
}) {
  const cleanLogins = params.logins
    .map((l) => l.trim().toLowerCase())
    .filter(Boolean);
  const primaryEmail =
    params.adminEmail?.trim() ||
    cleanLogins.find((l) => l.includes("@")) ||
    "rh@precobaixoatacadista.com.br";
  const vaultObj: AdminProfileVault = {
    allowedLogins: cleanLogins.length > 0 ? cleanLogins : ["admin", primaryEmail],
    profile: {
      name: params.adminName?.trim() || "RH / Administração Preço Baixo",
      email: primaryEmail,
      role: "Administrador Principal",
    },
  };

  const encryptedVault = encryptWithKey(JSON.stringify(vaultObj), VAULT_KEY, "enc:v1");
  const passwordHash = hashPassword(params.newPassword);

  const codeSnippet = `const ENCRYPTED_ADMIN_VAULT =\n  process.env.ADMIN_VAULT_ENCRYPTED ||\n  "${encryptedVault}";\n\nconst ENCRYPTED_ADMIN_PASSWORD_HASH =\n  process.env.ADMIN_PASSWORD_HASH ||\n  "${passwordHash}";`;

  return {
    encryptedVault,
    passwordHash,
    codeSnippet,
  };
}

export function getSecurityStatus() {
  const accounts = readAccountsVault();
  const master = accounts.find((a) => a.isMaster) || accounts[0];
  return {
    passwordAlgorithm: "scrypt (N=16384, r=8, p=1) + Sal aleatório 128 bits",
    vaultAlgorithm: "AES-256-GCM (Cofre em código + auth-vault.enc)",
    sessionTokenAlgorithm: "Token cifrado AES-256-GCM (validade 12h + revogação)",
    piiAtRestAlgorithm: "AES-256-GCM (CPF, telefone, e-mail, nasc., endereço e PDFs)",
    passwordHashPreview: `${(master?.passwordHash || ENCRYPTED_ADMIN_PASSWORD_HASH).slice(0, 32)}••••••••`,
    vaultPreview: `${ENCRYPTED_ADMIN_VAULT.slice(0, 28)}••••••••`,
    allowedLoginsCount: accounts.filter((a) => a.active).length,
    rhUsersCount: accounts.filter((a) => a.roleKey === "rh").length,
    customEnvSecretActive: Boolean(process.env.PB_VAULT_SECRET || process.env.ADMIN_TOKEN_SECRET),
  };
}
