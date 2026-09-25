import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createServiceClient } from "./supabase/service";

/**
 * Giriş denemesi sınırlaması.
 * Birincil: Postgres'te `rate_limit_hit` fonksiyonu (serverless örnekler arasında paylaşılır).
 * Yedek: Supabase service role tanımlı değilse süreç-içi bellek (tek örnek için yeterli, Vercel'de zayıf).
 */

const memory = new Map<string, { count: number; resetAt: number }>();

export function hashKey(...parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const service = createServiceClient();
  if (service) {
    const { data, error } = await service.rpc("rate_limit_hit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (!error && typeof data === "boolean") return data;
  }
  return memoryLimit(key, limit, windowSeconds);
}

function memoryLimit(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();
  if (memory.size > 5000) {
    for (const [k, v] of memory) if (v.resetAt < now) memory.delete(k);
  }
  const entry = memory.get(key);
  if (!entry || entry.resetAt < now) {
    memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}
