import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Shield, AlertTriangle, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MapboxVisualization = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          toast.error("Failed to load map configuration");
          setLoading(false);
          return;
        }

        if (data?.token) {
          setMapboxToken(data.token);
        }
      } catch (err) {
        console.error('Exception fetching Mapbox token:', err);
        toast.error("Failed to initialize map");
        setLoading(false);
      }
    };

    getMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    setLoading(false);
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: { name: 'globe' },
      zoom: 1.5,
      center: [0, 20],
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(0, 0, 0)',
        'high-color': 'rgb(20, 20, 40)',
        'horizon-blend': 0.1,
      });
    });

    // Mock attack origin markers
    const attackLocations = [
      { coords: [-122.4194, 37.7749], name: "San Francisco", type: "Command Server" },
      { coords: [139.6503, 35.6762], name: "Tokyo", type: "Attack Origin" },
      { coords: [2.3522, 48.8566], name: "Paris", type: "Proxy Node" },
      { coords: [-0.1276, 51.5074], name: "London", type: "Target Network" },
      { coords: [13.4050, 52.5200], name: "Berlin", type: "Lateral Movement" },
    ];

    map.current.on('load', () => {
      attackLocations.forEach((location) => {
        const el = document.createElement('div');
        el.className = 'attack-marker';
        el.style.width = '12px';
        el.style.height = '12px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = location.type === "Target Network" ? '#ef4444' : '#f59e0b';
        el.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        el.style.boxShadow = `0 0 10px ${location.type === "Target Network" ? '#ef4444' : '#f59e0b'}`;
        el.style.cursor = 'pointer';

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="padding: 8px; background: #1a1a1a; color: #e5e5e5; border-radius: 4px;">
            <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px;">${location.name}</div>
            <div style="font-size: 10px; color: #a3a3a3;">${location.type}</div>
            <div style="font-size: 9px; color: #737373; margin-top: 4px;">Simulated Location</div>
          </div>`
        );

        new mapboxgl.Marker(el)
          .setLngLat(location.coords as [number, number])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface">
        <div className="text-center space-y-2">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" />
          <div className="text-xs text-text-muted">Loading map...</div>
        </div>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface p-4">
        <div className="text-center space-y-2 max-w-md">
          <AlertTriangle className="w-8 h-8 text-status-warning mx-auto" />
          <div className="text-sm text-text-primary">Map configuration unavailable</div>
          <div className="text-xs text-text-muted">Unable to load geographical visualization</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Safety Banner */}
      <div className="absolute top-3 left-3 z-10 bg-status-warning/10 border border-status-warning/30 rounded p-2 flex items-start gap-2 max-w-xs">
        <Shield className="w-4 h-4 text-status-warning flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-semibold text-status-warning mb-1">SIMULATION MODE</div>
          <div className="text-text-secondary">All geographical markers are simulated for training visualization only.</div>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-sidebar-bg border border-border rounded p-2 text-xs space-y-1.5 z-10">
        <div className="font-semibold text-text-primary mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          Attack Simulation
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
          <span className="text-text-muted">Target Network</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" />
          <span className="text-text-muted">Attack Infrastructure</span>
        </div>
        <div className="text-[10px] text-text-muted pt-1.5 border-t border-border">
          All locations are mock data
        </div>
      </div>
    </div>
  );
};

export default MapboxVisualization;
