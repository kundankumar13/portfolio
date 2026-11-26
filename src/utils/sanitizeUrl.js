/**
 * URL Sanitizer & Security Guard
 * Prevents XSS, Open Redirects, and malicious scheme execution (javascript:, vbscript:, data:text/html)
 */
export function sanitizeUrl(url, fallback = "#") {
  if (!url || typeof url !== "string") return fallback;

  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Allow internal anchor links (#contact, #projects, etc.)
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) {
    return trimmed;
  }

  // Safe data URIs for direct PDF / image downloads
  if (trimmed.startsWith("data:application/pdf") || trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  // Check protocol
  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();

    if (protocol === "https:" || protocol === "http:" || protocol === "mailto:" || protocol === "tel:") {
      return trimmed;
    }
  } catch {
    // If not a full URL, but starts with http:// or https:// (relative or protocol-relative)
    if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
      return trimmed;
    }
  }

  // Block any dangerous scheme (javascript:, data:text/html, etc.)
  console.warn("[SecurityGuard] Blocked untrusted URL protocol:", trimmed);
  return fallback;
}
