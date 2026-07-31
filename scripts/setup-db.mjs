import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

function isTursoConfigured(value) {
  if (!value || value === "undefined" || value === "null") return false;
  if (!value.startsWith("libsql://")) return false;
  try {
    const parsed = new URL(value);
    return Boolean(parsed.hostname && parsed.hostname !== "undefined" && parsed.hostname !== "null");
  } catch { return false; }
}

function readDatabaseUrl() {
  if (isTursoConfigured(process.env.TURSO_DATABASE_URL)) {
    console.log("Turso configured — skipping local SQLite setup.");
    return null;
  }
  const envPath = path.join(process.cwd(), ".env");
  if (existsSync(envPath)) {
    const env = readFileSync(envPath, "utf8");
    for (const line of env.split(/\r?\n/)) {
      const match = line.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/);
      if (match) return match[1].replace(/^['"]|['"]$/g, "");
    }
  }
  return process.env.DATABASE_URL ?? "file:./wakewyze-dev.db";
}

function sqlitePathFromUrl(databaseUrl) {
  if (!databaseUrl.startsWith("file:")) throw new Error("DATABASE_URL must be a SQLite file: URL.");
  const rawPath = databaseUrl.slice("file:".length);
  if (path.win32.isAbsolute(rawPath) || path.posix.isAbsolute(rawPath)) return rawPath;
  return path.resolve(process.cwd(), rawPath);
}

const databaseUrl = readDatabaseUrl();
if (databaseUrl === null) process.exit(0);

const databasePath = sqlitePathFromUrl(databaseUrl);
mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);
db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "PreOrder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderNumber" TEXT NOT NULL UNIQUE,
  "flavor" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPricePaise" INTEGER NOT NULL DEFAULT 129900,
  "subtotalPaise" INTEGER NOT NULL,
  "discountPaise" INTEGER NOT NULL DEFAULT 0,
  "totalPaise" INTEGER NOT NULL,
  "couponCode" TEXT,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "pincode" TEXT NOT NULL,
  "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
  "utrReference" TEXT,
  "statusLogJson" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidAt" DATETIME,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "PreOrder_paymentStatus_idx" ON "PreOrder"("paymentStatus");
CREATE INDEX IF NOT EXISTS "PreOrder_createdAt_idx" ON "PreOrder"("createdAt");
CREATE INDEX IF NOT EXISTS "PreOrder_phone_idx" ON "PreOrder"("phone");

CREATE TABLE IF NOT EXISTS "PreOrderItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "flavor" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPricePaise" INTEGER NOT NULL DEFAULT 129900,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "PreOrder"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "PreOrderItem_orderId_idx" ON "PreOrderItem"("orderId");
`);

db.close();
console.log(`SQLite database ready at ${databasePath}`);
