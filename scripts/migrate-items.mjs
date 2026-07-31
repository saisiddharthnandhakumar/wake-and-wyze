/**
 * One-time, idempotent migration: backfills PreOrderItem rows for any
 * existing PreOrder rows that don't have items yet.
 *
 * Usage:  node scripts/migrate-items.mjs
 *
 * Safe to run multiple times — skips orders that already have items.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

function isTursoConfigured(value) {
  if (!value || value === "undefined" || value === "null") return false;
  if (!value.startsWith("libsql://")) return false;
  try {
    const parsed = new URL(value);
    return Boolean(parsed.hostname && parsed.hostname !== "undefined" && parsed.hostname !== "null");
  } catch {
    return false;
  }
}

function readDatabaseUrl() {
  if (isTursoConfigured(process.env.TURSO_DATABASE_URL)) {
    console.log("Turso configured — run migration against Turso via Prisma client instead.");
    console.log("Skipping local SQLite migration.");
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

const databaseUrl = readDatabaseUrl();
if (databaseUrl === null) process.exit(0);

const databasePath = databaseUrl.startsWith("file:")
  ? path.resolve(process.cwd(), databaseUrl.slice("file:".length))
  : databaseUrl;
mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);
db.exec("PRAGMA foreign_keys = ON;");

// Create table if missing (defensive)
db.exec(`
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

// Backfill: for every PreOrder that has no items, insert one item from legacy columns
const backfill = db.prepare(`
INSERT INTO "PreOrderItem" ("id", "orderId", "flavor", "quantity", "unitPricePaise")
SELECT
  lower(hex(randomblob(16))),
  po."id",
  po."flavor",
  po."quantity",
  po."unitPricePaise"
FROM "PreOrder" po
WHERE NOT EXISTS (
  SELECT 1 FROM "PreOrderItem" pi WHERE pi."orderId" = po."id"
)
`);

const result = backfill.run();
console.log(`Backfilled ${result.changes} PreOrder row(s) with items.`);

db.close();
console.log("Migration complete.");
