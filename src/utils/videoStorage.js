// IndexedDB Storage Engine for Large Media (Welcome Videos, Audio, etc.)
// Overcomes the 5MB browser localStorage limit and allows smooth multi-MB video persistence.

const DB_NAME = "kundan_portfolio_media";
const DB_VERSION = 1;
const STORE_NAME = "videos";
const KEY = "welcome_video";

function openDB() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return resolve(null);
    }
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => {
        console.warn("[VideoStorage] IndexedDB open error:", req.error);
        resolve(null);
      };
    } catch (err) {
      console.warn("[VideoStorage] Failed to init IndexedDB:", err);
      resolve(null);
    }
  });
}

/**
 * Save video file, blob, or URL string into IndexedDB
 */
export async function saveWelcomeVideo(data) {
  const db = await openDB();
  if (!db) {
    // Fallback: if data is a small string, save to localStorage
    if (typeof data === "string" && data.length < 2000000) {
      try {
        localStorage.setItem(KEY, data);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, KEY);
      req.onsuccess = () => resolve(true);
      req.onerror = () => {
        console.warn("[VideoStorage] Save error:", req.error);
        resolve(false);
      };
    } catch (e) {
      console.warn("[VideoStorage] Transaction error on save:", e);
      resolve(false);
    }
  });
}

/**
 * Retrieve saved video from IndexedDB as a playable URL string
 */
export async function getWelcomeVideo() {
  const db = await openDB();
  if (!db) {
    try {
      return localStorage.getItem(KEY) || null;
    } catch (e) {
      return null;
    }
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY);
      req.onsuccess = () => {
        const val = req.result;
        if (!val) {
          try {
            return resolve(localStorage.getItem(KEY) || null);
          } catch (e) {
            return resolve(null);
          }
        }
        if (val instanceof Blob || val instanceof File) {
          resolve(URL.createObjectURL(val));
        } else {
          resolve(val); // string URL or base64
        }
      };
      req.onerror = () => {
        try {
          resolve(localStorage.getItem(KEY) || null);
        } catch (e) {
          resolve(null);
        }
      };
    } catch (e) {
      resolve(null);
    }
  });
}

/**
 * Remove stored video from IndexedDB and localStorage
 */
export async function removeWelcomeVideo() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {}

  const db = await openDB();
  if (!db) return true;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(KEY);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
}
