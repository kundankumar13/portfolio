import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/config";

const LOCAL_ANALYTICS_KEY = "kk_portfolio_analytics_backup";
const VISITOR_TOKEN_KEY = "kk_visitor_token";
const SESSION_HIT_KEY = "kk_session_hit_timestamp";

// Device & Client Information Detectors
export function detectDeviceInfo() {
  if (typeof window === "undefined" || !navigator) {
    return { device: "Desktop", browser: "Other", os: "Unknown", referrer: "Direct" };
  }

  const ua = navigator.userAgent || "";

  // Device Detection
  let device = "Desktop";
  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua)) {
    device = "Tablet";
  } else if (/(mobi|iphone|ipod|android|blackberry|opera mini|windows phone)/i.test(ua)) {
    device = "Mobile";
  }

  // OS Detection
  let os = "Other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  // Browser Detection
  let browser = "Other";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera\//i.test(ua)) browser = "Opera";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";

  // Referrer Categorization
  let referrer = "Direct";
  const ref = document.referrer ? document.referrer.toLowerCase() : "";
  if (ref) {
    if (ref.includes("google")) referrer = "Google";
    else if (ref.includes("linkedin")) referrer = "LinkedIn";
    else if (ref.includes("github")) referrer = "GitHub";
    else if (ref.includes("youtube")) referrer = "YouTube";
    else if (ref.includes("twitter") || ref.includes("t.co") || ref.includes("x.com")) referrer = "X (Twitter)";
    else if (ref.includes("instagram")) referrer = "Instagram";
    else referrer = "Other Website";
  }

  return { device, browser, os, referrer };
}

// Get default empty state
function getDefaultAnalytics() {
  const todayStr = new Date().toISOString().split("T")[0];
  return {
    totalViews: 0,
    uniqueVisitors: 0,
    dailyVisits: { [todayStr]: 0 },
    devices: { desktop: 0, mobile: 0, tablet: 0 },
    browsers: { chrome: 0, safari: 0, firefox: 0, edge: 0, other: 0 },
    referrers: { direct: 0, google: 0, linkedin: 0, github: 0, other: 0 },
    recentVisits: [],
    lastUpdated: new Date().toISOString()
  };
}

// Read from LocalStorage Cache
export function getLocalAnalytics() {
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return getDefaultAnalytics();
}

// Save to LocalStorage Cache
export function saveLocalAnalytics(data) {
  try {
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(data));
  } catch (e) {}
}

/**
 * Record a visitor hit when user visits the site.
 * Skips tracking if visiting Admin panel or if admin is logged in.
 */
export async function recordVisitorHit() {
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname || "";
  // 1. Guard: Ignore secret admin route or admin sessions
  if (pathname.includes("/kundan-secret-portal") || pathname.includes("/admin")) {
    return;
  }

  // 2. Guard: Don't track if the logged-in admin is browsing
  try {
    const adminAuth = localStorage.getItem("kundan_portfolio_auth");
    if (adminAuth) {
      const parsed = JSON.parse(adminAuth);
      if (parsed && parsed.token) return; // Admin browsing their own site
    }
  } catch (e) {}

  // 3. Debounce rapid refreshes in the same session (e.g. within 30 seconds)
  const now = Date.now();
  const lastSessionHit = sessionStorage.getItem(SESSION_HIT_KEY);
  if (lastSessionHit && now - Number(lastSessionHit) < 30000) {
    return; // Don't spam hits on fast page reloads
  }
  sessionStorage.setItem(SESSION_HIT_KEY, String(now));

  // 4. Check Unique Visitor
  let isUnique = false;
  let visitorId = "";
  try {
    visitorId = localStorage.getItem(VISITOR_TOKEN_KEY);
    if (!visitorId) {
      isUnique = true;
      visitorId = "vis_" + now + "_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(VISITOR_TOKEN_KEY, visitorId);
    }
  } catch (e) {
    visitorId = "vis_anon_" + now;
  }

  const { device, browser, os, referrer } = detectDeviceInfo();
  const todayStr = new Date().toISOString().split("T")[0];

  const visitRecord = {
    id: "v_" + now,
    timestamp: new Date().toISOString(),
    device,
    browser,
    os,
    referrer,
    path: pathname || "/"
  };

  // 5. Update local cache first (for instant feedback & offline capability)
  const localData = getLocalAnalytics();
  const updatedDaily = { ...(localData.dailyVisits || {}) };
  updatedDaily[todayStr] = (updatedDaily[todayStr] || 0) + 1;

  const deviceKey = device.toLowerCase();
  const browserKey = browser.toLowerCase();
  const referrerKey = referrer.toLowerCase().includes("direct")
    ? "direct"
    : referrer.toLowerCase().includes("google")
    ? "google"
    : referrer.toLowerCase().includes("linkedin")
    ? "linkedin"
    : referrer.toLowerCase().includes("github")
    ? "github"
    : "other";

  const updatedDevices = {
    ...(localData.devices || { desktop: 0, mobile: 0, tablet: 0 }),
    [deviceKey]: ((localData.devices || {})[deviceKey] || 0) + 1
  };

  const updatedBrowsers = {
    ...(localData.browsers || { chrome: 0, safari: 0, firefox: 0, edge: 0, other: 0 }),
    [browserKey]: ((localData.browsers || {})[browserKey] || 0) + 1
  };

  const updatedReferrers = {
    ...(localData.referrers || { direct: 0, google: 0, linkedin: 0, github: 0, other: 0 }),
    [referrerKey]: ((localData.referrers || {})[referrerKey] || 0) + 1
  };

  const updatedRecent = [visitRecord, ...(localData.recentVisits || [])].slice(0, 30);

  const updatedData = {
    ...localData,
    totalViews: (localData.totalViews || 0) + 1,
    uniqueVisitors: (localData.uniqueVisitors || 0) + (isUnique ? 1 : 0),
    dailyVisits: updatedDaily,
    devices: updatedDevices,
    browsers: updatedBrowsers,
    referrers: updatedReferrers,
    recentVisits: updatedRecent,
    lastUpdated: new Date().toISOString()
  };

  saveLocalAnalytics(updatedData);

  // 6. Sync with Firestore Cloud Database
  if (!isFirebaseConfigured || !db) return;

  try {
    const docRef = doc(db, "portfolio_analytics", "visitors");
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      // First time initialization in Firestore
      await setDoc(docRef, updatedData);
    } else {
      const remote = snap.data();
      const remoteDaily = { ...(remote.dailyVisits || {}) };
      remoteDaily[todayStr] = (remoteDaily[todayStr] || 0) + 1;

      const remoteRecent = [visitRecord, ...(remote.recentVisits || [])].slice(0, 30);

      await updateDoc(docRef, {
        totalViews: increment(1),
        uniqueVisitors: isUnique ? increment(1) : remote.uniqueVisitors || 1,
        [`devices.${deviceKey}`]: increment(1),
        [`browsers.${browserKey}`]: increment(1),
        [`referrers.${referrerKey}`]: increment(1),
        dailyVisits: remoteDaily,
        recentVisits: remoteRecent,
        lastVisitedAt: serverTimestamp(),
        lastUpdated: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn("[VisitorTracker] Firestore hit recording sync skipped:", err);
  }
}

/**
 * Fetch visitor analytics for the Admin Dashboard.
 * Tries Firestore first, falls back to localStorage.
 */
export async function getVisitorAnalytics() {
  const local = getLocalAnalytics();
  const todayStr = new Date().toISOString().split("T")[0];

  if (!isFirebaseConfigured || !db) {
    return {
      ...local,
      todayViews: (local.dailyVisits && local.dailyVisits[todayStr]) || 0
    };
  }

  try {
    const docRef = doc(db, "portfolio_analytics", "visitors");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const merged = {
        totalViews: data.totalViews || local.totalViews || 0,
        uniqueVisitors: data.uniqueVisitors || local.uniqueVisitors || 0,
        dailyVisits: data.dailyVisits || local.dailyVisits || { [todayStr]: 0 },
        devices: data.devices || local.devices || { desktop: 0, mobile: 0, tablet: 0 },
        browsers: data.browsers || local.browsers || { chrome: 0, safari: 0, firefox: 0, edge: 0, other: 0 },
        referrers: data.referrers || local.referrers || { direct: 0, google: 0, linkedin: 0, github: 0, other: 0 },
        recentVisits: Array.isArray(data.recentVisits) ? data.recentVisits : local.recentVisits || [],
        lastUpdated: data.lastUpdated || new Date().toISOString()
      };
      saveLocalAnalytics(merged);
      return {
        ...merged,
        todayViews: (merged.dailyVisits && merged.dailyVisits[todayStr]) || 0
      };
    }
  } catch (e) {
    console.warn("[VisitorTracker] Error loading analytics from Firestore, using local:", e);
  }

  return {
    ...local,
    todayViews: (local.dailyVisits && local.dailyVisits[todayStr]) || 0
  };
}

/**
 * Reset visitor stats (Private Admin tool)
 */
export async function resetVisitorAnalytics() {
  const resetData = getDefaultAnalytics();
  saveLocalAnalytics(resetData);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "portfolio_analytics", "visitors");
      await setDoc(docRef, resetData);
    } catch (e) {
      console.error("[VisitorTracker] Failed to reset Firestore analytics:", e);
    }
  }
}
