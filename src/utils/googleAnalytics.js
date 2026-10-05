/**
 * Google Analytics 4 (GA4) Integration Helper
 * Allows tracking page views and visitors seamlessly.
 * Measurement ID can be supplied via .env (VITE_GA_MEASUREMENT_ID)
 * or saved dynamically via the Admin Dashboard.
 */

const GA_STORAGE_KEY = "kk_ga_measurement_id";

export function getGAMeasurementId() {
  try {
    const saved = localStorage.getItem(GA_STORAGE_KEY);
    if (saved && saved.trim().startsWith("G-")) {
      return saved.trim();
    }
  } catch (e) {}

  const envId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (envId && envId.trim().startsWith("G-")) {
    return envId.trim();
  }

  return "G-9BREYJ24YW";
}

export function saveGAMeasurementId(id) {
  try {
    const cleaned = (id || "").trim();
    if (cleaned) {
      localStorage.setItem(GA_STORAGE_KEY, cleaned);
      initGA(cleaned);
    } else {
      localStorage.removeItem(GA_STORAGE_KEY);
    }
    return true;
  } catch (e) {
    console.error("Failed to save GA Measurement ID:", e);
    return false;
  }
}

let isInitialized = false;

export function initGA(customId) {
  const id = customId || getGAMeasurementId();
  if (!id || typeof window === "undefined") return false;

  // Check if already injected or gtag exists
  if (document.getElementById("ga-gtag-script") || window.gtag) {
    isInitialized = true;
    return true;
  }

  try {
    // 1. Inject script tag
    const script = document.createElement("script");
    script.id = "ga-gtag-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    // 2. Initialize dataLayer & gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", id, {
      send_page_view: false // Manual page view dispatching for SPA
    });

    isInitialized = true;
    return true;
  } catch (err) {
    console.warn("[Google Analytics] Failed to initialize:", err);
    return false;
  }
}

export function trackGAPageView(path = "/") {
  const id = getGAMeasurementId();
  if (!id || typeof window === "undefined") return;

  if (!isInitialized) {
    initGA(id);
  }

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  } catch (e) {
    console.warn("[Google Analytics] Page view tracking error:", e);
  }
}

export function isGAConfigured() {
  return Boolean(getGAMeasurementId());
}
