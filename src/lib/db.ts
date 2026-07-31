import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function isValidTursoUrl(value: string): boolean {
  if (!value || value === "undefined" || value === "null") return false;
  if (!value.startsWith("libsql://")) return false;
  try {
    const parsed = new URL(value);
    if (!parsed.hostname || parsed.hostname === "undefined" || parsed.hostname === "null") return false;
    return true;
  } catch { return false; }
}

function isValidTursoToken(value: string): boolean {
  return Boolean(value) && value !== "undefined" && value !== "null";
}

function createClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL ?? "";
  const tursoToken = process.env.TURSO_AUTH_TOKEN ?? "";

  if (isValidTursoUrl(tursoUrl) && isValidTursoToken(tursoToken)) {
    try {
      return new PrismaClient({
        adapter: new PrismaLibSql({ url: tursoUrl, authToken: tursoToken }),
      });
    } catch (error) {
      console.warn(
        "Turso client creation failed — falling back to local SQLite.",
        error instanceof Error ? error.message : error,
      );
    }
  }

  // Local SQLite file — URL is configured in prisma.config.ts
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./wakewyze-dev.db";
  }
  return new PrismaClient();
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    const client = getClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") return value.bind(client);
    return value;
  },
}) as PrismaClient;
