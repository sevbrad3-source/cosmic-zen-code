// Geo-IP lookup — returns lat/lon/country for a list of IPs.
// Uses ip-api.com batch endpoint (no key required, free tier).
// Caches negative + positive lookups in-memory per cold start.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const cache = new Map<string, { lat: number; lon: number; country: string } | null>();

function isPrivate(ip: string): boolean {
  if (!ip) return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip === "127.0.0.1" || ip === "::1") return true;
  if (ip.startsWith("172.")) {
    const second = parseInt(ip.split(".")[1] ?? "0", 10);
    if (second >= 16 && second <= 31) return true;
  }
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { ips } = await req.json() as { ips: string[] };
    if (!Array.isArray(ips)) {
      return new Response(JSON.stringify({ error: "ips array required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const unique = Array.from(new Set(ips.filter((ip) => ip && !isPrivate(ip))));
    const need = unique.filter((ip) => !cache.has(ip));

    if (need.length > 0) {
      // ip-api.com batch — up to 100 per call, free
      const batch = need.slice(0, 100).map((q) => ({ query: q, fields: "status,lat,lon,country,query" }));
      try {
        const resp = await fetch("http://ip-api.com/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(batch),
        });
        if (resp.ok) {
          const arr = await resp.json() as Array<{ status: string; lat?: number; lon?: number; country?: string; query: string }>;
          for (const row of arr) {
            if (row.status === "success" && typeof row.lat === "number" && typeof row.lon === "number") {
              cache.set(row.query, { lat: row.lat, lon: row.lon, country: row.country ?? "" });
            } else {
              cache.set(row.query, null);
            }
          }
        } else {
          for (const ip of need) cache.set(ip, null);
        }
      } catch {
        for (const ip of need) cache.set(ip, null);
      }
    }

    const result: Record<string, { lat: number; lon: number; country: string } | null> = {};
    for (const ip of unique) result[ip] = cache.get(ip) ?? null;

    return new Response(JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
