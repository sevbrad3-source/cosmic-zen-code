import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertTriangle, Crosshair, Wifi, Server, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

type Phase = 'token' | 'initializing' | 'ready' | 'error';

interface AttackLocation {
  coords: [number, number];
  name: string;
  type: string;
  status: string;
  threat: 'critical' | 'high' | 'medium' | 'low';
}

const ATTACK_LOCATIONS: AttackLocation[] = [
  { coords: [-122.4194, 37.7749], name: 'San Francisco', type: 'C2 Server', status: 'active', threat: 'critical' },
  { coords: [139.6503, 35.6762], name: 'Tokyo', type: 'Attack Origin', status: 'active', threat: 'high' },
  { coords: [2.3522, 48.8566], name: 'Paris', type: 'Proxy Node', status: 'active', threat: 'medium' },
  { coords: [-0.1276, 51.5074], name: 'London', type: 'Target Network', status: 'compromised', threat: 'critical' },
  { coords: [13.4050, 52.5200], name: 'Berlin', type: 'Lateral Movement', status: 'active', threat: 'high' },
  { coords: [121.4737, 31.2304], name: 'Shanghai', type: 'Exfil Point', status: 'active', threat: 'critical' },
  { coords: [-73.9857, 40.7484], name: 'New York', type: 'Target Network', status: 'scanning', threat: 'medium' },
  { coords: [37.6173, 55.7558], name: 'Moscow', type: 'C2 Server', status: 'active', threat: 'critical' },
  { coords: [-43.1729, -22.9068], name: 'Rio de Janeiro', type: 'Proxy Node', status: 'standby', threat: 'low' },
  { coords: [77.2090, 28.6139], name: 'New Delhi', type: 'Attack Origin', status: 'active', threat: 'high' },
];

const CONNECTIONS: Array<[[number, number], [number, number]]> = [
  [[-122.4194, 37.7749], [-0.1276, 51.5074]],
  [[37.6173, 55.7558], [13.4050, 52.5200]],
  [[139.6503, 35.6762], [121.4737, 31.2304]],
  [[121.4737, 31.2304], [-73.9857, 40.7484]],
];

const threatColor = (t: string) =>
  t === 'critical' ? '#ff3860' : t === 'high' ? '#ff8c42' : t === 'medium' ? '#ffd23f' : '#7dd87d';

const MapboxVisualization = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const tokenRef = useRef<string>('');
  const [phase, setPhase] = useState<Phase>('token');
  const [errMsg, setErrMsg] = useState<string>('');
  const [attempt, setAttempt] = useState(0);
  const stats = { activeTargets: ATTACK_LOCATIONS.length, c2Servers: 3, proxyNodes: 8, dataExfil: '2.4 GB' };

  const teardown = useCallback(() => {
    if (mapRef.current) {
      try { mapRef.current.remove(); } catch { /* ignore */ }
      mapRef.current = null;
    }
  }, []);

  // Fetch token + initialize. Container is ALWAYS mounted, so ref is reliable.
  useEffect(() => {
    let cancelled = false;
    let failSafe: number | undefined;

    const run = async () => {
      setPhase('token');
      setErrMsg('');

      // 1. Token
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (cancelled) return;
        if (error || !data?.token) {
          setErrMsg(error?.message || 'Token unavailable');
          setPhase('error');
          return;
        }
        tokenRef.current = data.token;
      } catch (e) {
        if (cancelled) return;
        setErrMsg(e instanceof Error ? e.message : 'Token fetch failed');
        setPhase('error');
        return;
      }

      if (cancelled) return;
      setPhase('initializing');

      // Wait one frame so the container is laid out
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      if (cancelled) return;

      const container = mapContainer.current;
      if (!container) {
        setErrMsg('Map container missing');
        setPhase('error');
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // Try again next frame — layout sometimes settles late
        await new Promise((r) => setTimeout(r, 80));
        if (cancelled) return;
      }

      teardown();
      mapboxgl.accessToken = tokenRef.current;

      let map: mapboxgl.Map;
      try {
        map = new mapboxgl.Map({
          container,
          style: 'mapbox://styles/mapbox/dark-v11',
          projection: 'globe',
          zoom: 1.6,
          center: [20, 25],
          pitch: 30,
          attributionControl: false,
        });
      } catch (e) {
        setErrMsg(e instanceof Error ? e.message : 'Init failed');
        setPhase('error');
        return;
      }

      mapRef.current = map;

      failSafe = window.setTimeout(() => {
        if (!cancelled && phase !== 'ready') {
          setErrMsg('Load timeout (15s). Check network connectivity to api.mapbox.com.');
          setPhase('error');
          teardown();
        }
      }, 15000);

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');

      map.on('error', (e) => {
        const msg = e?.error?.message || 'Map render error';
        // Style/tile errors after load are non-fatal — only error out before ready
        if (mapRef.current && phase !== 'ready') {
          window.clearTimeout(failSafe);
          setErrMsg(msg);
          setPhase('error');
          teardown();
        } else {
          console.warn('[Mapbox] non-fatal:', msg);
        }
      });

      map.on('style.load', () => {
        try {
          map.setFog({
            color: 'rgb(8, 10, 18)',
            'high-color': 'rgb(30, 10, 25)',
            'horizon-blend': 0.18,
            'star-intensity': 0.4,
            'space-color': 'rgb(2, 3, 6)',
          });
        } catch { /* ignore */ }
      });

      map.on('load', () => {
        if (cancelled) return;
        window.clearTimeout(failSafe);

        // Markers
        for (const loc of ATTACK_LOCATIONS) {
          const color = threatColor(loc.threat);
          const size = loc.type === 'C2 Server' ? 16 : loc.type === 'Target Network' ? 14 : 11;

          const wrapper = document.createElement('div');
          wrapper.style.position = 'relative';
          wrapper.style.width = `${size}px`;
          wrapper.style.height = `${size}px`;
          wrapper.style.cursor = 'pointer';

          const ring = document.createElement('div');
          ring.style.position = 'absolute';
          ring.style.inset = '0';
          ring.style.borderRadius = '50%';
          ring.style.border = `2px solid ${color}`;
          ring.style.boxShadow = `0 0 12px ${color}, 0 0 24px ${color}80`;
          ring.style.background = `radial-gradient(circle, ${color}cc, ${color}33)`;
          if (loc.threat === 'critical' || loc.threat === 'high') {
            ring.style.animation = 'mb-pulse 2s ease-in-out infinite';
          }
          wrapper.appendChild(ring);

          const popup = new mapboxgl.Popup({ offset: 18, className: 'mb-popup', closeButton: false }).setHTML(`
            <div style="padding:10px 12px;background:linear-gradient(135deg,#0a0c14,#1a0a18);color:#e5e7eb;border-radius:6px;border:1px solid ${color}66;min-width:180px;font-family:ui-monospace,monospace;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                <div style="width:6px;height:6px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};"></div>
                <div style="font-size:12px;font-weight:600;">${loc.name}</div>
              </div>
              <div style="font-size:10px;color:${color};text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px;">${loc.type}</div>
              <div style="display:flex;justify-content:space-between;font-size:9px;color:#9ca3af;padding-top:6px;border-top:1px solid #2a2a3a;">
                <span>${loc.status.toUpperCase()}</span><span style="color:${color};">${loc.threat.toUpperCase()}</span>
              </div>
            </div>`);

          new mapboxgl.Marker(wrapper).setLngLat(loc.coords).setPopup(popup).addTo(map);
        }

        // Connection arcs
        try {
          map.addSource('connections', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: CONNECTIONS.map(([from, to]) => ({
                type: 'Feature',
                properties: {},
                geometry: { type: 'LineString', coordinates: [from, to] },
              })),
            },
          });
          map.addLayer({
            id: 'connection-lines',
            type: 'line',
            source: 'connections',
            paint: {
              'line-color': '#ff3860',
              'line-width': 1.4,
              'line-opacity': 0.55,
              'line-dasharray': [2, 3],
            },
          });
        } catch { /* ignore */ }

        // Force resize after layout settle
        requestAnimationFrame(() => map.resize());
        window.setTimeout(() => map.resize(), 300);

        // Slow auto-rotation
        let userInteracting = false;
        const spin = () => {
          if (!mapRef.current || userInteracting) return;
          if (map.getZoom() < 4) {
            const c = map.getCenter();
            c.lng -= 0.12;
            map.easeTo({ center: c, duration: 1000, easing: (n) => n });
          }
        };
        map.on('mousedown', () => { userInteracting = true; });
        map.on('mouseup', () => { userInteracting = false; });
        map.on('dragstart', () => { userInteracting = true; });
        map.on('moveend', spin);
        const spinInt = window.setInterval(spin, 1500);
        map.once('remove', () => window.clearInterval(spinInt));

        setPhase('ready');
      });
    };

    run();

    return () => {
      cancelled = true;
      if (failSafe) window.clearTimeout(failSafe);
      teardown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  // Resize on container resize (panels resize often)
  useEffect(() => {
    const el = mapContainer.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-background overflow-hidden">
      <style>{`
        @keyframes mb-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.45); opacity: 0.55; }
        }
        .mb-popup .mapboxgl-popup-content { background: transparent !important; padding: 0 !important; box-shadow: none !important; border-radius: 6px !important; }
        .mb-popup .mapboxgl-popup-tip { display: none !important; }
        .mapboxgl-ctrl-bottom-right { bottom: 56px !important; }
        .mapboxgl-ctrl-group { background: hsl(var(--card) / 0.85) !important; border: 1px solid hsl(var(--border)) !important; }
        .mapboxgl-ctrl-group button { background-color: transparent !important; }
        .mapboxgl-ctrl-group button span { filter: invert(0.85); }
      `}</style>

      {/* Map container — ALWAYS mounted so the ref is stable */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Loading / error overlays */}
      {(phase === 'token' || phase === 'initializing') && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/85 backdrop-blur-sm">
          <div className="text-center space-y-3">
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-ping" />
              <div className="absolute inset-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="text-[10px] tracking-[0.3em] font-mono text-primary/80 uppercase">
              {phase === 'token' ? 'Acquiring satellite link' : 'Rendering globe'}
            </div>
          </div>
        </div>
      )}

      {phase === 'error' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
          <div className="text-center space-y-3 max-w-md">
            <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/40">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-sm font-semibold text-destructive uppercase tracking-wider">Map Offline</div>
            <div className="text-xs text-muted-foreground break-words">{errMsg || 'Unknown error'}</div>
            <Button size="sm" variant="secondary" onClick={() => setAttempt((v) => v + 1)} className="gap-2">
              <RefreshCw className="w-3 h-3" /> Retry
            </Button>
          </div>
        </div>
      )}

      {/* HUD overlay */}
      {phase === 'ready' && (
        <>
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background via-background/70 to-transparent p-3 pointer-events-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 border border-destructive/40 rounded">
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-[10px] font-mono text-destructive uppercase tracking-[0.2em]">Live Threat Map</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">GLOBAL OPERATIONS</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-destructive"><Crosshair className="w-3 h-3" />{stats.activeTargets} TGT</div>
                <div className="flex items-center gap-1.5 text-orange-400"><Server className="w-3 h-3" />{stats.c2Servers} C2</div>
                <div className="flex items-center gap-1.5 text-yellow-400"><Wifi className="w-3 h-3" />{stats.proxyNodes} PRX</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 left-3 z-20 bg-card/85 border border-border rounded px-3 py-2 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-1">Exfiltration</div>
            <div className="text-sm font-mono font-bold text-destructive">{stats.dataExfil}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapboxVisualization;
