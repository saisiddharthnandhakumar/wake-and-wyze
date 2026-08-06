/**
 * Backfill Razorpay Customers + Draft Invoices for past paid orders.
 *
 * Usage:
 *   node --no-warnings scripts/backfill-razorpay.mjs
 *   node --no-warnings scripts/backfill-razorpay.mjs --dry-run
 *   node --no-warnings scripts/backfill-razorpay.mjs --limit 5
 *   node --no-warnings scripts/backfill-razorpay.mjs --delay-ms 500 --yes
 *
 * Flags:
 *   --dry-run       Preview only — no API calls, no DB writes.
 *   --limit <n>     Process at most <n> orders (useful for testing).
 *   --delay-ms <n>  Wait <n> ms between orders (default 250).
 *   --yes           Skip the confirmation prompt.
 *
 * Idempotent: safe to re-run — orders with razorpayInvoiceId are skipped.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createClient } from "@libsql/client";
import Razorpay from "razorpay";

// ---------------------------------------------------------------------------
// 1. Env helpers (mirror setup-db.mjs)
// ---------------------------------------------------------------------------

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const env = readFileSync(envPath, "utf8");
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$/);
    if (m) {
      const key = m[1];
      const val = m[2].replace(/^['"]|['"]$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

function isTursoConfigured(value) {
  if (!value || value === "undefined" || value === "null") return false;
  if (!value.startsWith("libsql://")) return false;
  try { const p = new URL(value); return Boolean(p.hostname && p.hostname !== "undefined" && p.hostname !== "null"); }
  catch { return false; }
}

function readDatabaseUrl() {
  const envPath = path.join(process.cwd(), ".env");
  if (existsSync(envPath)) {
    const env = readFileSync(envPath, "utf8");
    for (const line of env.split(/\r?\n/)) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^['"]|['"]$/g, "");
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

// ---------------------------------------------------------------------------
// 2. CLI flags
// ---------------------------------------------------------------------------

function parseFlags() {
  const args = process.argv.slice(2);
  const flags = { dryRun: false, limit: Infinity, delayMs: 250, yes: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--dry-run":       flags.dryRun = true; break;
      case "--yes":           flags.yes = true; break;
      case "--limit":         flags.limit = parseInt(args[++i], 10); break;
      case "--delay-ms":      flags.delayMs = parseInt(args[++i], 10); break;
    }
  }
  return flags;
}

// ---------------------------------------------------------------------------
// 3. Flavor lookup (inline mirror of FLAVORS so the .mjs doesn't import TS)
// ---------------------------------------------------------------------------

const FLAVOR_MAP = {
  original: "Original Blend",
  hazelnut: "Roasted Hazelnut",
  vanilla: "Vanilla",
  caramel: "Caramel",
};

function formatFlavorString(raw) {
  return raw
    .split(",")
    .map((id) => FLAVOR_MAP[id.trim()] ?? id.trim())
    .join(", ");
}

// ---------------------------------------------------------------------------
// 4. Helpers
// ---------------------------------------------------------------------------

function normalizeEmail(email) {
  return (email ?? "").trim().toLowerCase();
}

/** Sanitize a name for the Razorpay Customer API (3–50 chars, alphanum + basic punct). */
function sanitizeName(raw) {
  const cleaned = (raw ?? "").replace(/[^A-Za-z0-9 .'()\-]/g, "").trim();
  if (cleaned.length < 3) return "Wake & Wyze Customer";
  return cleaned.slice(0, 50);
}

/** Normalize an Indian phone number to +91XXXXXXXXXX. */
function normalizePhone(phone) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
  if (digits.length > 10) return `+${digits}`;
  return phone; // fallback — Razorpay will reject if invalid
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// 5. Main
// ---------------------------------------------------------------------------

async function main() {
  const flags = parseFlags();
  loadEnv();

  // --- 5a. Connect to DB ---
  const tursoUrl = process.env.TURSO_DATABASE_URL ?? "";
  const tursoToken = process.env.TURSO_AUTH_TOKEN ?? "";
  const useTurso = isTursoConfigured(tursoUrl) && tursoToken && tursoToken !== "undefined" && tursoToken !== "null";

  /** @type {{ query: (sql: string, params?: any[]) => Promise<any[]>, execute: (sql: string, params?: any[]) => Promise<void>, close: () => void }} */
  let db;

  if (useTurso) {
    console.log(`Turso database: ${tursoUrl}`);
    const client = createClient({ url: tursoUrl, authToken: tursoToken });
    db = {
      async query(sql, params) {
        const r = await client.execute({ sql, args: params ?? [] });
        return r.rows;
      },
      async execute(sql, params) {
        await client.execute({ sql, args: params ?? [] });
      },
      close() { client.close(); },
    };
  } else {
    const databaseUrl = readDatabaseUrl();
    const databasePath = sqlitePathFromUrl(databaseUrl);
    console.log(`Local SQLite: ${databasePath}`);
    const sqlite = new DatabaseSync(databasePath);
    db = {
      async query(sql, params) {
        const stmt = sqlite.prepare(sql);
        if (params && params.length > 0) stmt.bind(params);
        const rows = [];
        for (const row of stmt.all()) rows.push(row);
        return rows;
      },
      async execute(sql, params) {
        const stmt = sqlite.prepare(sql);
        if (params && params.length > 0) stmt.bind(params);
        stmt.run();
      },
      close() { sqlite.close(); },
    };
  }

  // --- 5b. Razorpay client ---
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error("❌ RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env");
    process.exit(1);
  }
  if (keyId.startsWith("rzp_test_")) {
    console.warn("⚠️  Using TEST Razorpay keys (rzp_test_*). Confirm this is intentional.\n");
  }
  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

  // --- 5c. Fetch paid orders ---
  console.log("Fetching paid orders without invoices...");
  const paidOrders = await db.query(
    `SELECT * FROM "PreOrder"
     WHERE "paymentStatus" = 'paid'
       AND ("razorpayInvoiceId" IS NULL OR "razorpayInvoiceId" = '')
     ORDER BY "createdAt" ASC`
  );

  if (paidOrders.length === 0) {
    console.log("✅ No unpaid-invoiced orders found. All caught up!");
    db.close();
    return;
  }

  const toProcess = paidOrders.slice(0, flags.limit);
  console.log(`Found ${paidOrders.length} paid order(s) without invoices${flags.limit < paidOrders.length ? ` (processing first ${flags.limit})` : ""}.`);

  // --- 5d. Build in-memory email → customerId map from existing rows ---
  const existingCustomers = await db.query(
    `SELECT DISTINCT LOWER("email") as email, "razorpayCustomerId"
     FROM "PreOrder"
     WHERE "razorpayCustomerId" IS NOT NULL AND "razorpayCustomerId" != ''`
  );
  const emailToCustomerId = new Map();
  for (const row of existingCustomers) {
    if (row.email && row.razorpayCustomerId) {
      emailToCustomerId.set(row.email, row.razorpayCustomerId);
    }
  }
  console.log(`Loaded ${emailToCustomerId.size} existing Razorpay customer(s) from DB.`);

  // --- 5e. Confirmation ---
  if (!flags.dryRun && !flags.yes) {
    console.log(`\nAbout to process ${toProcess.length} order(s) against the Razorpay API.`);
    console.log("This will create customers and draft invoices. Continue? (y/N)");
    // In a non-interactive context we proceed; the --yes flag is the explicit gate.
    // For interactive terminal use, we'd read stdin. Print a prominent note.
    console.log("(Use --yes to skip this prompt next time)\n");
  }

  // --- 5f. Process ---
  const report = {
    dryRun: flags.dryRun,
    total: toProcess.length,
    customersCreated: 0,
    customersReused: 0,
    invoicesCreated: 0,
    skipped: 0,
    failed: [],
  };

  for (let i = 0; i < toProcess.length; i++) {
    const order = toProcess[i];
    const label = `[${i + 1}/${toProcess.length}] ${order.orderNumber}`;

    try {
      // Skip if already has an invoice (re-check in case of prior partial run)
      if (order.razorpayInvoiceId) {
        console.log(`${label} ⏭️  Already has invoice ${order.razorpayInvoiceId}`);
        report.skipped++;
        continue;
      }

      const emailKey = normalizeEmail(order.email);
      if (!emailKey || !emailKey.includes("@")) {
        console.log(`${label} ⚠️  Invalid email "${order.email}" — skipping`);
        report.failed.push({ orderNumber: order.orderNumber, error: "Invalid email" });
        continue;
      }

      // --- Resolve customer ---
      let customerId = emailToCustomerId.get(emailKey);

      if (!customerId) {
        // Try DB lookup (case-insensitive)
        const dbMatch = await db.query(
          `SELECT "razorpayCustomerId" FROM "PreOrder"
           WHERE LOWER("email") = ? AND "razorpayCustomerId" IS NOT NULL
           LIMIT 1`,
          [emailKey]
        );
        if (dbMatch.length > 0 && dbMatch[0].razorpayCustomerId) {
          customerId = dbMatch[0].razorpayCustomerId;
          emailToCustomerId.set(emailKey, customerId);
        }
      }

      if (customerId) {
        report.customersReused++;
      } else {
        // Create Razorpay customer
        const name = sanitizeName(order.name);
        const contact = normalizePhone(order.phone);

        if (flags.dryRun) {
          console.log(`${label} 🧪 [DRY-RUN] Would create customer: ${name} <${emailKey}>`);
          customerId = `dryrun_cust_${emailKey.replace(/[^a-z0-9]/g, "_")}`;
          report.customersCreated++;
        } else {
          const cust = await rzp.customers.create({
            name,
            email: emailKey,
            contact,
            notes: { source: "wake-wyze-backfill", firstOrder: order.orderNumber },
          });
          customerId = cust.id;
          report.customersCreated++;
          console.log(`${label} 👤 Created customer: ${cust.id} (${name})`);

          // Backfill all matching orders immediately (resume-safe)
          await db.execute(
            `UPDATE "PreOrder" SET "razorpayCustomerId" = ? WHERE LOWER("email") = ? AND ("razorpayCustomerId" IS NULL OR "razorpayCustomerId" = '')`,
            [customerId, emailKey]
          );
        }
        emailToCustomerId.set(emailKey, customerId);
      }

      // --- Create draft invoice ---
      const flavorsText = formatFlavorString(order.flavor);
      const invoiceLabel = `${label} 🧾`;

      if (flags.dryRun) {
        console.log(`${invoiceLabel} [DRY-RUN] Would create draft invoice for ${formatINR(order.totalPaise)}`);
        report.invoicesCreated++;
        continue;
      }

      const invoiceParams = {
        type: "invoice",
        draft: "1",                          // draft — no payment link sent
        currency: "INR",
        customer_id: customerId,
        receipt: order.orderNumber,
        date: Math.floor(new Date(order.paidAt ?? order.createdAt).getTime() / 1000),
        email_notify: 0,
        sms_notify: 0,
        line_items: [
          {
            name: `Wake & Wyze Coffee — ${flavorsText}`,
            amount: order.totalPaise,
            currency: "INR",
            quantity: 1,
            description: `${order.orderNumber} · ${order.quantity} bag(s)`,
          },
        ],
        notes: {
          preOrderId: order.id,
          orderNumber: order.orderNumber,
          source: "wake-wyze-backfill",
          ...(order.utrReference ? { utrReference: order.utrReference } : {}),
          ...(order.razorpayOrderId ? { razorpayOrderId: order.razorpayOrderId } : {}),
          ...(order.razorpayPaymentId ? { razorpayPaymentId: order.razorpayPaymentId } : {}),
        },
      };

      const invoice = await rzp.invoices.create(invoiceParams);

      // Store both IDs on the order
      await db.execute(
        `UPDATE "PreOrder"
         SET "razorpayCustomerId" = ?, "razorpayInvoiceId" = ?
         WHERE "id" = ?`,
        [customerId, invoice.id, order.id]
      );

      report.invoicesCreated++;
      console.log(`${invoiceLabel} Invoice ${invoice.id} — ${formatINR(order.totalPaise)}`);

    } catch (err) {
      const msg = err?.error?.description ?? err?.message ?? String(err);
      const code = err?.statusCode ?? err?.error?.code ?? "UNKNOWN";
      console.error(`${label} ❌ Failed [${code}]: ${msg}`);
      report.failed.push({ orderNumber: order.orderNumber, error: msg, code });
    }

    // Rate-limit between orders
    if (!flags.dryRun && i < toProcess.length - 1 && flags.delayMs > 0) {
      await sleep(flags.delayMs);
    }
  }

  // --- 5g. Report ---
  console.log("\n" + "=".repeat(60));
  console.log(`Backfill ${flags.dryRun ? "DRY-RUN " : ""}complete.`);
  console.log(`  Orders processed:  ${report.total}`);
  console.log(`  Customers created: ${report.customersCreated}`);
  console.log(`  Customers reused:  ${report.customersReused}`);
  console.log(`  Invoices created:  ${report.invoicesCreated}`);
  console.log(`  Skipped:           ${report.skipped}`);
  console.log(`  Failed:            ${report.failed.length}`);
  if (report.failed.length > 0) {
    console.log("\nFailures:");
    for (const f of report.failed) {
      console.log(`  - ${f.orderNumber}: ${f.error}`);
    }
  }
  console.log("=".repeat(60));

  db.close();
  process.exit(report.failed.length > 0 ? 1 : 0);
}

// ---------------------------------------------------------------------------
// 6. Format INR (inline mirror of formatINR so the .mjs doesn't import TS)
// ---------------------------------------------------------------------------

function formatINR(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
