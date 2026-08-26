import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createClient } from "@libsql/client";

function isTursoConfigured(value) {
  if (!value || value === "undefined" || value === "null") return false;
  if (!value.startsWith("libsql://")) return false;
  try {
    const parsed = new URL(value);
    return Boolean(parsed.hostname && parsed.hostname !== "undefined" && parsed.hostname !== "null");
  } catch { return false; }
}

function readDatabaseUrl() {
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

const DDL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "PreOrder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderNumber" TEXT NOT NULL UNIQUE,
  "flavor" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPricePaise" INTEGER NOT NULL DEFAULT 139900,
  "subtotalPaise" INTEGER NOT NULL,
  "discountPaise" INTEGER NOT NULL DEFAULT 0,
  "shippingPaise" INTEGER NOT NULL DEFAULT 0,
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
  "razorpayOrderId" TEXT,
  "razorpayPaymentId" TEXT,
  "razorpaySignature" TEXT,
  "paymentMethod" TEXT,
  "paymentErrorJson" TEXT,
  "razorpayCustomerId" TEXT,
  "razorpayInvoiceId" TEXT,
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
  "sku" TEXT,
  "quantity" INTEGER NOT NULL,
  "unitPricePaise" INTEGER NOT NULL DEFAULT 139900,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "PreOrder"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "PreOrderItem_orderId_idx" ON "PreOrderItem"("orderId");
`;

// Migration statements for existing databases that already have the table
// but not the new columns. Each is idempotent — errors for "duplicate column"
// or "already exists" are swallowed.
const MIGRATIONS = [
  `ALTER TABLE "PreOrder" ADD COLUMN "razorpayOrderId" TEXT`,
  `ALTER TABLE "PreOrder" ADD COLUMN "razorpayPaymentId" TEXT`,
  `ALTER TABLE "PreOrder" ADD COLUMN "razorpaySignature" TEXT`,
  `ALTER TABLE "PreOrder" ADD COLUMN "paymentMethod" TEXT`,
  `ALTER TABLE "PreOrder" ADD COLUMN "paymentErrorJson" TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "PreOrder_razorpayOrderId_key" ON "PreOrder"("razorpayOrderId")`,
  `ALTER TABLE "PreOrder" ADD COLUMN "razorpayCustomerId" TEXT`,
  `ALTER TABLE "PreOrder" ADD COLUMN "razorpayInvoiceId" TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "PreOrder_razorpayInvoiceId_key" ON "PreOrder"("razorpayInvoiceId")`,
  `CREATE INDEX IF NOT EXISTS "PreOrder_razorpayCustomerId_idx" ON "PreOrder"("razorpayCustomerId")`,
  `ALTER TABLE "PreOrder" ADD COLUMN "shippingPaise" INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE "PreOrderItem" ADD COLUMN "sku" TEXT`,
];

// ---- Turso (production) ----
const tursoUrl = process.env.TURSO_DATABASE_URL ?? "";
const tursoToken = process.env.TURSO_AUTH_TOKEN ?? "";

if (isTursoConfigured(tursoUrl) && tursoToken && tursoToken !== "undefined" && tursoToken !== "null") {
  console.log(`Setting up Turso database at ${tursoUrl}...`);
  const client = createClient({ url: tursoUrl, authToken: tursoToken });
  try {
    // Execute each statement individually (libsql client doesn't support multi-statement exec)
    for (const stmt of DDL.split(";").map(s => s.trim()).filter(Boolean)) {
      await client.execute(stmt + ";");
    }
    console.log("Turso database tables created/verified.");

    // Run idempotent migrations (safe to run multiple times)
    for (const sql of MIGRATIONS) {
      try {
        await client.execute(sql + ";");
      } catch (err) {
        const msg = err.message ?? String(err);
        if (!msg.includes("duplicate column") && !msg.includes("already exists")) {
          console.error(`Migration failed: ${sql} — ${msg}`);
        }
      }
    }
    console.log("Turso migrations complete.");
  } catch (err) {
    console.error("Turso setup failed:", err.message ?? err);
    process.exit(1);
  } finally {
    client.close();
  }
  process.exit(0);
}

// ---- Local SQLite (dev) ----
const databaseUrl = readDatabaseUrl();
const databasePath = sqlitePathFromUrl(databaseUrl);
mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);
db.exec(DDL);

// Run idempotent migrations (safe to run multiple times)
for (const sql of MIGRATIONS) {
  try {
    db.exec(sql);
  } catch (err) {
    const msg = err.message ?? String(err);
    if (!msg.includes("duplicate column") && !msg.includes("already exists")) {
      console.error(`Migration failed: ${sql} — ${msg}`);
    }
  }
}

db.close();
console.log(`SQLite database ready at ${databasePath}`);
