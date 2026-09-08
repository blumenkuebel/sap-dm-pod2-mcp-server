import { LOG_LEVEL, type LogLevel } from "./config.js";

// ─── Log Level Hierarchy ─────────────────────────────────────────────

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[LOG_LEVEL];
}

// ─── Public API ──────────────────────────────────────────────────────

export function timestamp(): string {
  return new Date().toLocaleTimeString("de-DE", { hour12: false });
}

export function debug(...args: unknown[]): void {
  if (shouldLog("debug")) console.log(`[${timestamp()}] [DEBUG]`, ...args);
}

export function info(...args: unknown[]): void {
  if (shouldLog("info")) console.log(`[${timestamp()}] [INFO]`, ...args);
}

export function warn(...args: unknown[]): void {
  if (shouldLog("warn")) console.warn(`[${timestamp()}] [WARN]`, ...args);
}

export function error(...args: unknown[]): void {
  if (shouldLog("error")) console.error(`[${timestamp()}] [ERROR]`, ...args);
}