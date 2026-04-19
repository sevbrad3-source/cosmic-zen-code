import { useEffect, useRef } from "react";

/**
 * Cinematic animated holo-globe. Pure canvas, no deps.
 * Renders a wireframe sphere with rotating threat arcs and pulse impacts.
 */
interface ThreatPing { lat: number; lon: number; intensity: number; t: number; }

export const HoloGlobe = ({ pings = [] as ThreatPing[], className = "" }: { pings?: ThreatPing[]; className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let rot = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const project = (lat: number, lon: number, R: number, cx: number, cy: number) => {
      const phi = (lat * Math.PI) / 180;
      const theta = ((lon + rot) * Math.PI) / 180;
      const x = R * Math.cos(phi) * Math.sin(theta);
      const y = R * Math.sin(phi);
      const z = R * Math.cos(phi) * Math.cos(theta);
      return { x: cx + x, y: cy - y, z };
    };

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.42;
      ctx.clearRect(0, 0, w, h);

      // Outer glow
      const grad = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.4);
      grad.addColorStop(0, "rgba(0, 220, 255, 0.08)");
      grad.addColorStop(1, "rgba(0, 220, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sphere outline
      ctx.strokeStyle = "rgba(0, 220, 255, 0.45)";
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Latitude lines
      ctx.strokeStyle = "rgba(0, 220, 255, 0.18)";
      ctx.lineWidth = 1 * dpr;
      for (let lat = -75; lat <= 75; lat += 15) {
        ctx.beginPath();
        for (let lon = 0; lon <= 360; lon += 4) {
          const p = project(lat, lon, R, cx, cy);
          if (lon === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      // Longitude lines
      for (let lon = 0; lon < 360; lon += 20) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(lat, lon, R, cx, cy);
          if (p.z < 0) continue;
          if (lat === -90) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Pings
      const now = performance.now();
      for (const ping of pings) {
        const age = (now - ping.t) / 2000;
        if (age < 0 || age > 1) continue;
        const p = project(ping.lat, ping.lon, R, cx, cy);
        if (p.z < 0) continue;
        const radius = (10 + age * 40) * dpr * (0.5 + ping.intensity);
        const alpha = (1 - age) * 0.9;
        ctx.strokeStyle = `rgba(255, 60, 160, ${alpha})`;
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(255, 60, 160, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      rot += 0.12;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [pings]);

  return <canvas ref={ref} className={className} />;
};

export default HoloGlobe;
