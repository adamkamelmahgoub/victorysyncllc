
export function toIntId(value: unknown, field = "id"): number {
  const n = Number(String(value ?? "").trim());
  if (!Number.isInteger(n) || n <= 0) throw new Error(`Invalid ${field}: "${value}"`);
  return n;
}
