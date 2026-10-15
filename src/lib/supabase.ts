/**
 * Compatibility Re-Export
 * Maps any legacy imports to the native MySQL database client in src/lib/db.ts
 */
export * from "./db";
import { db, isDatabaseConfigured } from "./db";

export const isSupabaseConfigured = isDatabaseConfigured;
export const supabase = db;
