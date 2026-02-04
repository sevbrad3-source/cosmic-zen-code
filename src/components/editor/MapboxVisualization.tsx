import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Shield, AlertTriangle, MapPin, Crosshair, Wifi, Server } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { diagnostics, useProfiler } from '@/lib/diagnostics';

const MapboxVisualization = () => {
  const profiler = useProfiler("MapboxVisualization");
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [initAttempt, setInitAttempt] = useState(0);
  const [stats, setStats] = useState({
    activeTargets: 5,
    c2Servers: 3,
    proxyNodes: 8,
    dataExfil: '2.4 GB'
  });

  // Track render performance
  useEffect(() => {
    profiler.endRender();
  });

  useEffect(() => {
    diagnostics.logMapbox('Component mounted');
    const getMapboxToken = async () => {
      diagnostics.logMapbox('Fetching token from edge function...');
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');

        if (error) {
          diagnostics.logMapbox('Token fetch error', error);
          console.error('[Mapbox] Error fetching Mapbox token:', error);
          setMapError("Failed to load map configuration");
          toast.error("Failed to load map configuration");
          setLoading(false);
          return;
        }

        if (data?.token) {
          diagnostics.logMapbox('Token received', { tokenLength: data.token.length, prefix: data.token.slice(0, 10) });
          setMapError(null);
          setLoading(true);
          setMapboxToken(data.token);
        } else {
          diagnostics.logMapbox('Token missing in response', data);
          setMapError("Map token missing");
          setLoading(false);
        }
      } catch (err) {
        diagnostics.logMapbox('Token fetch exception', err);
        console.error('[Mapbox] Exception fetching Mapbox token:', err);
        setMapError("Failed to initialize map");
        toast.error("Failed to initialize map");
        setLoading(false);
      }
    };

    getMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) {
      diagnostics.logMapbox('Skipping init', { hasContainer: !!mapContainer.current, hasToken: !!mapboxToken });
      return;
    }

    const container = mapContainer.current;
    const rect = container.getBoundingClientRect();
    diagnostics.logMapbox('Container dimensions', { width: rect.width, height: rect.height, visible: rect.width > 0 && rect.height > 0 });

    // ensure we don't keep a half-initialized instance around
    if (map.current) {
      try {
        map.current.remove();
        diagnostics.logMapbox('Removed previous map instance');
      } catch {
        // ignore
      }
      map.current = null;
    }

    setMapError(null);
    setLoading(true);

    // Small delay to ensure container is sized
    const initTimeout = setTimeout(() => {
      const finalRect = container.getBoundingClientRect();
      diagnostics.logMapbox('Initializing map', { containerWidth: finalRect.width, containerHeight: finalRect.height });

      if (finalRect.width === 0 || finalRect.height === 0) {
        diagnostics.logMapbox('Container has zero dimensions - map will fail');
        setMapError('Map container has zero dimensions');
        setLoading(false);
        return;
      }

      try {
        mapboxgl.accessToken = mapboxToken;

        map.current = new mapboxgl.Map({
          container,
          style: 'mapbox://styles/mapbox/dark-v11',
          projection: 'globe',
          zoom: 1.8,
          center: [20, 30],
          pitch: 45,
        });

        diagnostics.logMapbox('Map instance created, waiting for load event...');

        // If we never reach 'load', don't leave the UI stuck forever
        const failSafe = window.setTimeout(() => {
          if (loading) {
            diagnostics.logMapbox('Load timeout - map stuck initializing', { elapsed: '12s' });
            console.error('[Mapbox] load timeout: map stuck initializing');
            setMapError('Map failed to load (timeout).');
            setLoading(false);
            try {
              map.current?.remove();
            } catch {
              // ignore
            }
            map.current = null;
          }
        }, 12000);

        map.current.on('error', (e) => {
          diagnostics.logMapbox('Error event fired', { error: e?.error?.message || e });
          console.error('[Mapbox] error event', e?.error || e);
          window.clearTimeout(failSafe);
          setMapError('Map failed to load (error).');
          setLoading(false);
          try {
            map.current?.remove();
          } catch {
            // ignore
          }
          map.current = null;
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'bottom-right'
        );

        map.current.on('style.load', () => {
          diagnostics.logMapbox('Style loaded');
          map.current?.setFog({
            color: 'rgb(5, 5, 8)',
            'high-color': 'rgb(20, 5, 10)',
            'horizon-blend': 0.15,
            'star-intensity': 0.2,
            'space-color': 'rgb(5, 5, 8)',
          });
        });

        const attackLocations = [
          { coords: [-122.4194, 37.7749], name: "San Francisco", type: "C2 Server", status: "active", threat: "critical" },
          { coords: [139.6503, 35.6762], name: "Tokyo", type: "Attack Origin", status: "active", threat: "high" },
          { coords: [2.3522, 48.8566], name: "Paris", type: "Proxy Node", status: "active", threat: "medium" },
          { coords: [-0.1276, 51.5074], name: "London", type: "Target Network", status: "compromised", threat: "critical" },
          { coords: [13.4050, 52.5200], name: "Berlin", type: "Lateral Movement", status: "active", threat: "high" },
          { coords: [121.4737, 31.2304], name: "Shanghai", type: "Exfil Point", status: "active", threat: "critical" },
          { coords: [-73.9857, 40.7484], name: "New York", type: "Target Network", status: "scanning", threat: "medium" },
          { coords: [37.6173, 55.7558], name: "Moscow", type: "C2 Server", status: "active", threat: "critical" },
          { coords: [-43.1729, -22.9068], name: "Rio de Janeiro", type: "Proxy Node", status: "standby", threat: "low" },
          { coords: [77.2090, 28.6139], name: "New Delhi", type: "Attack Origin", status: "active", threat: "high" },
        ];

        const getMarkerColor = (threat: string) => {
          switch (threat) {
            case 'critical': return '#dc2626';
            case 'high': return '#ea580c';
            case 'medium': return '#ca8a04';
            default: return '#65a30d';
          }
        };

        const getMarkerSize = (type: string) => {
          switch (type) {
            case 'C2 Server': return 16;
            case 'Target Network': return 14;
            default: return 10;
          }
        };

        map.current.on('load', () => {
          window.clearTimeout(failSafe);
          diagnostics.logMapbox('Map load event fired - SUCCESS');

          // Force a resize after mount/layout to avoid permanent blank canvas
          try {
            map.current?.resize();
            window.setTimeout(() => map.current?.resize(), 250);
            diagnostics.logMapbox('Map resized');
          } catch {
            // ignore
          }

          setLoading(false);

          attackLocations.forEach((location) => {
            const color = getMarkerColor(location.threat);
            const size = getMarkerSize(location.type);

            const el = document.createElement('div');
            el.className = 'attack-marker';
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.borderRadius = '50%';
            el.style.backgroundColor = color;
            el.style.border = `2px solid ${color}`;
            el.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}40`;
            el.style.cursor = 'pointer';
            el.style.animation = location.threat === 'critical' ? 'pulse 2s infinite' : 'none';

            const popup = new mapboxgl.Popup({
              offset: 25,
              className: 'threat-popup'
            }).setHTML(
              `<div style="padding: 12px; background: linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 100%); color: #e5e5e5; border-radius: 8px; border: 1px solid ${color}40; min-width: 180px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; box-shadow: 0 0 8px ${color};"></div>
                  <div style="font-size: 13px; font-weight: 600; color: #fff;">${location.name}</div>
                </div>
                <div style="font-size: 11px; color: ${color}; font-weight: 500; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">${location.type}</div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; color: #a3a3a3; padding-top: 8px; border-top: 1px solid #333;">
                  <span>Status: <span style="color: ${location.status === 'compromised' ? '#dc2626' : '#22c55e'};">${location.status}</span></span>
                  <span>Threat: <span style="color: ${color};">${location.threat}</span></span>
                </div>
                <div style="font-size: 9px; color: #525252; margin-top: 6px; font-style: italic;">⚠ Simulated target</div>
              </div>`
            );

            new mapboxgl.Marker(el)
              .setLngLat(location.coords as [number, number])
              .setPopup(popup)
              .addTo(map.current!);
          });

          const connections = [
            { from: [-122.4194, 37.7749], to: [-0.1276, 51.5074] },
            { from: [37.6173, 55.7558], to: [13.4050, 52.5200] },
            { from: [139.6503, 35.6762], to: [121.4737, 31.2304] },
          ];

          map.current?.addSource('connections', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: connections.map(conn => ({
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [conn.from, conn.to]
                }
              }))
            }
          });

          map.current?.addLayer({
            id: 'connection-lines',
            type: 'line',
            source: 'connections',
            paint: {
              'line-color': '#dc2626',
              'line-width': 1.5,
              'line-opacity': 0.4,
              'line-dasharray': [2, 2]
            }
          });

          // Slow rotation
          const secondsPerRevolution = 360;
          let userInteracting = false;

          function spinGlobe() {
            if (!map.current || userInteracting) return;
            const zoom = map.current.getZoom();
            if (zoom < 4) {
              const distancePerSecond = 360 / secondsPerRevolution;
              const center = map.current.getCenter();
              center.lng -= distancePerSecond / 60;
              map.current.easeTo({ center, duration: 1000, easing: (n) => n });
            }
          }

          map.current.on('mousedown', () => { userInteracting = true; });
          map.current.on('mouseup', () => { userInteracting = false; });
          map.current.on('moveend', spinGlobe);

          const spinInterval = window.setInterval(spinGlobe, 1000);

          // cleanup rotation timer if the map gets removed
          map.current.once('remove', () => {
            window.clearInterval(spinInterval);
          });
        });
      } catch (err) {
        console.error('Error initializing map:', err);
        setMapError('Map failed to initialize.');
        setLoading(false);
        try {
          map.current?.remove();
        } catch {
          // ignore
        }
        map.current = null;
      }
    }, 150);

    return () => {
      clearTimeout(initTimeout);
      try {
        map.current?.remove();
      } catch {
        // ignore
      }
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapboxToken, initAttempt]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center space-y-3">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-2 border-red-500/30 rounded-full animate-ping" />
            <div className="absolute inset-2 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-xs text-red-500/70 font-mono">INITIALIZING GLOBAL THREAT MAP...</div>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black p-4">
        <div className="text-center space-y-3 max-w-md">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-sm text-red-400 font-semibold">MAP INITIALIZATION FAILED</div>
          <div className="text-xs text-neutral-500">{mapError}</div>
          <div className="pt-2 flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setInitAttempt((v) => v + 1);
              }}
            >
              Retry
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLoading(true);
                setMapError(null);
                setMapboxToken("");
                supabase.functions.invoke('get-mapbox-token').then(({ data, error }) => {
                  if (error || !data?.token) {
                    setMapError('Failed to refresh token.');
                    setLoading(false);
                    return;
                  }
                  setMapboxToken(data.token);
                }).catch(() => {
                  setMapError('Failed to refresh token.');
                  setLoading(false);
                });
              }}
            >
              Refresh Token
            </Button>
          </div>
          <div className="text-[10px] text-neutral-600">Open the browser console and look for a “Mapbox error event” for the exact cause.</div>
        </div>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black p-4">
        <div className="text-center space-y-3 max-w-md">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-sm text-red-400 font-semibold">SATELLITE LINK OFFLINE</div>
          <div className="text-xs text-neutral-500">Unable to establish connection to global threat visualization network</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] bg-black overflow-hidden" style={{ minHeight: '400px' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
      `}</style>

      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black via-black/80 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">Live Threat Map</span>
            </div>
            <div className="h-4 w-px bg-neutral-700" />
            <span className="text-[10px] font-mono text-neutral-500">SIMULATION MODE</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-red-400">
              <Crosshair className="w-3 h-3" />
              <span>{stats.activeTargets} Targets</span>
            </div>
            <div className="flex items-center gap-1.5 text-orange-400">
              <Server className="w-3 h-3" />
              <span>{stats.c2Servers} C2</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-400">
              <Wifi className="w-3 h-3" />
              <span>{stats.proxyNodes} Proxies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="absolute top-14 left-3 z-10 bg-black/80 border border-red-500/20 rounded px-3 py-2 flex items-start gap-2 max-w-xs backdrop-blur-sm">
        <Shield className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="text-[10px]">
          <div className="font-semibold text-red-400 mb-0.5">SIMULATION ENVIRONMENT</div>
          <div className="text-neutral-500">All markers represent simulated threat actors for training purposes only.</div>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%', minHeight: '400px' }} />

      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-black/90 border border-red-500/20 rounded-lg p-3 text-xs space-y-2 z-10 backdrop-blur-sm min-w-[160px]">
        <div className="font-semibold text-neutral-300 mb-2 flex items-center gap-2 pb-2 border-b border-neutral-800">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span>Threat Classification</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626]" />
            <span className="text-neutral-400">Critical Threat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_6px_#ea580c]" />
            <span className="text-neutral-400">High Threat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_6px_#ca8a04]" />
            <span className="text-neutral-400">Medium Threat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_6px_#65a30d]" />
            <span className="text-neutral-400">Low Threat</span>
          </div>
        </div>
        <div className="text-[9px] text-neutral-600 pt-2 border-t border-neutral-800 italic">
          Mock data for visualization
        </div>
      </div>

      {/* Stats Panel */}
      <div className="absolute bottom-3 left-3 bg-black/90 border border-red-500/20 rounded-lg p-3 z-10 backdrop-blur-sm">
        <div className="text-[10px] font-mono text-neutral-500 mb-2">DATA EXFILTRATION</div>
        <div className="text-xl font-bold text-red-500">{stats.dataExfil}</div>
        <div className="text-[9px] text-neutral-600 mt-1">simulated transfer volume</div>
      </div>
    </div>
  );
};

export default MapboxVisualization;
