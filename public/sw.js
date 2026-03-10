/**
 * TripWeave Service Worker v1.3.0
 *
 * Cache strategy summary
 * ──────────────────────
 * 1. STATIC assets  (/_next/static/**, /icons/**)
 *    → Cache-first.
 *      Next.js content-hashes every chunk/CSS filename, so a cached URL
 *      is guaranteed to be immutable. Misses fall back to network and
 *      populate the cache for next time.
 *
 * 2. NAVIGATE requests  (mode === "navigate", i.e. full-page HTML)
 *    → Stale-while-revalidate.
 *      The cached page is returned immediately so the UI appears instantly,
 *      while a background fetch updates the cache entry for the NEXT visit.
 *      Because TripWeave uses Server Actions (POST) rather than REST GET
 *      endpoints, trip data is embedded in the server-rendered HTML — so
 *      caching navigation responses effectively caches the last known state
 *      of each page.
 *      Network error + no page cache → serve /offline from OFFLINE_CACHE.
 *
 * 3. POST / Server Actions  (/api/**, RSC action POSTs)
 *    → Always network. POST responses are not cacheable by spec and must
 *      never be served stale (they mutate data).
 *
 * 4. OFFLINE page  (/offline)
 *    → Pre-cached at install in a dedicated cache. Served as last-resort
 *      fallback for failed navigations when the specific page is not in
 *      PAGE_CACHE.
 *
 * 5. PRE-CACHED routes  (/, /dashboard, /login, /offline)
 *    → Fetched and stored in PAGE_CACHE at install. These critical routes
 *      are available offline even if the user has never visited them.
 *
 * Priority on navigate offline
 * ────────────────────────────
 * 1. PAGE_CACHE match for the exact URL → return it (stale but useful data)
 * 2. OFFLINE_CACHE /offline → generic "You are offline" fallback
 * 3. Inline HTML response → absolute last resort
 */

const SW_VERSION = "1.3.0";

const OFFLINE_CACHE = "tw-offline-v1";   // /offline page only
const STATIC_CACHE  = "tw-static-v1";   // /_next/static/** + /icons/**
const PAGE_CACHE    = "tw-pages-v1";    // navigate responses (SWR + pre-cache)

const OFFLINE_URL   = "/offline";

/** Critical routes pre-cached at install so they work offline immediately. */
const PRECACHE_ROUTES = ["/", "/dashboard", "/login", "/offline"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** True for Next.js content-hashed bundles and public icons. Safe to cache forever. */
function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/")
  );
}

/** True for full-page navigations (browser address-bar requests). */
function isNavigate(request) {
  return request.mode === "navigate";
}

/** True for POST / Server Actions — must never be cached. */
function isMutating(request) {
  return request.method !== "GET" && request.method !== "HEAD";
}

// ─── Install ──────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  console.log("[SW] install v" + SW_VERSION);
  event.waitUntil(
    Promise.all([
      // 1. Dedicated offline fallback cache
      caches.open(OFFLINE_CACHE).then((cache) => cache.add(OFFLINE_URL)),
      // 2. Pre-cache critical routes into PAGE_CACHE
      caches.open(PAGE_CACHE).then((cache) =>
        Promise.all(
          PRECACHE_ROUTES.map((url) =>
            fetch(url)
              .then((res) => {
                if (res.ok) return cache.put(url, res);
              })
              .catch(() => {
                // Install may happen offline (e.g. SW update while offline);
                // silently skip routes we can't fetch right now.
              })
          )
        )
      ),
    ]).then(() => self.skipWaiting())
  );
});

// ─── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  console.log("[SW] activate v" + SW_VERSION);
  const KNOWN_CACHES = [OFFLINE_CACHE, STATIC_CACHE, PAGE_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !KNOWN_CACHES.includes(k))
            .map((k) => {
              console.log("[SW] deleting old cache:", k);
              return caches.delete(k);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ────────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. Non-GET (POST, Server Actions) → always network, never intercept.
  if (isMutating(event.request)) return;

  // 2. Cross-origin requests (Supabase, fonts, etc.) → transparent proxy.
  if (url.origin !== self.location.origin) return;

  // 3. Static assets → Cache-first.
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  // 4. Full-page navigation → Stale-while-revalidate, offline fallback.
  if (isNavigate(event.request)) {
    event.respondWith(staleWhileRevalidate(event));
    return;
  }

  // 5. Everything else (Next.js RSC payloads, internal GETs) → network only.
  // We intentionally do NOT cache RSC payloads (_rsc param) because they
  // are tightly coupled to the server state and go stale immediately.
});

// ─── Strategy: Cache-first ────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Asset unavailable offline", { status: 503 });
  }
}

// ─── Strategy: Stale-while-revalidate with offline fallback ──────────────────

async function staleWhileRevalidate(event) {
  const request = event.request;
  const cache = await caches.open(PAGE_CACHE);
  const cached = await cache.match(request);

  // Kick off a network fetch that updates the cache on success.
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  // Cache hit → return immediately; keep SW alive until background fetch completes.
  if (cached) {
    event.waitUntil(networkPromise);
    return cached;
  }

  // Cache miss → wait for network.
  const response = await networkPromise;
  if (response) return response;

  // Network failed and no page-level cache → serve generic /offline page.
  const offlineResponse = await caches.match(OFFLINE_URL);
  return (
    offlineResponse ||
    new Response(
      "<!DOCTYPE html><html><head><meta charset=utf-8><title>Offline</title></head>" +
        "<body style='font-family:system-ui;display:flex;align-items:center;" +
        "justify-content:center;min-height:100vh;margin:0'>" +
        "<div style='text-align:center'><h1>You are offline</h1>" +
        "<button onclick='location.reload()'>Retry</button></div></body></html>",
      { status: 200, headers: { "Content-Type": "text/html" } }
    )
  );
}
