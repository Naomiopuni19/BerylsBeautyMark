// Supabase Storage rejects file paths with spaces, accented characters, or
// punctuation like curly quotes. This strips a real filename down to
// something safe to use as a storage key, while keeping the extension.
export function sanitizeFileName(name) {
  const dot = name.lastIndexOf(".");
  const ext = dot > -1 ? name.slice(dot) : "";
  const base = (dot > -1 ? name.slice(0, dot) : name)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "file"}${ext}`;
}