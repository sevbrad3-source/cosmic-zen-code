import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GeoPoint { lat: number; lon: number; country: string }

/**
 * Resolves IPv4 addresses to lat/lon via the geo-ip-lookup edge function.
 * Caches results per-session. Batches to one request per call.
 */
export function useGeoLookup() {
  const cache = useRef<Map<string, GeoPoint | null>>(new Map());
  const inflight = useRef<Promise<void> | null>(null);
  const [version, setVersion] = useState(0); // bump to notify subscribers

  const resolve = useCallback(async (ips: string[]): Promise<Record<string, GeoPoint | null>> => {
    const need = ips.filter((ip) => ip && !cache.current.has(ip));
    if (need.length > 0) {
      // serialize concurrent calls
      if (inflight.current) await inflight.current;
      inflight.current = (async () => {
        try {
          const { data } = await supabase.functions.invoke("geo-ip-lookup", { body: { ips: need } });
          const map = (data?.result ?? {}) as Record<string, GeoPoint | null>;
          for (const ip of need) cache.current.set(ip, map[ip] ?? null);
          setVersion((v) => v + 1);
        } catch {
          for (const ip of need) cache.current.set(ip, null);
        } finally {
          inflight.current = null;
        }
      })();
      await inflight.current;
    }
    const out: Record<string, GeoPoint | null> = {};
    for (const ip of ips) out[ip] = cache.current.get(ip) ?? null;
    return out;
  }, []);

  const get = useCallback((ip: string | null | undefined): GeoPoint | null => {
    if (!ip) return null;
    return cache.current.get(ip) ?? null;
  }, []);

  return { resolve, get, version };
}
