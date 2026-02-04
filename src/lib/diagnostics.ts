// Advanced Diagnostics Engine
// Captures console logs, network requests, component lifecycle, and performance metrics

import React from 'react';

export interface DiagnosticLog {
  id: string;
  timestamp: number;
  type: 'log' | 'warn' | 'error' | 'info' | 'debug' | 'network' | 'lifecycle' | 'performance' | 'mapbox';
  source: string;
  message: string;
  data?: unknown;
  stack?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface ComponentLifecycle {
  component: string;
  event: 'mount' | 'unmount' | 'update' | 'error';
  timestamp: number;
  props?: Record<string, unknown>;
}

export interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  status: number | null;
  startTime: number;
  endTime: number | null;
  duration: number | null;
  error?: string;
  requestHeaders?: Record<string, string>;
  requestBody?: string;
}

export interface ComponentCrash {
  component: string;
  error: string;
  stack: string;
  componentStack: string;
  timestamp: number;
}

export interface RenderMetric {
  component: string;
  renderCount: number;
  totalTime: number;
  avgTime: number;
  lastRenderTime: number;
  trend: 'up' | 'down' | 'stable';
}

class DiagnosticsEngine {
  private logs: DiagnosticLog[] = [];
  private metrics: PerformanceMetric[] = [];
  private lifecycle: ComponentLifecycle[] = [];
  private networkRequests: NetworkRequest[] = [];
  private componentCrashes: ComponentCrash[] = [];
  private renderMetrics: Map<string, RenderMetric> = new Map();
  private listeners: Set<() => void> = new Set();
  private maxLogs = 500;
  private originalConsole: Partial<Console> = {};
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Intercept console methods
    const methods = ['log', 'warn', 'error', 'info', 'debug'] as const;
    methods.forEach((method) => {
      this.originalConsole[method] = console[method].bind(console);
      console[method] = (...args: unknown[]) => {
        this.captureLog(method, args);
        (this.originalConsole[method] as (...a: unknown[]) => void)?.(...args);
      };
    });

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const id = crypto.randomUUID();
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const method = init?.method || 'GET';
      const startTime = performance.now();

      this.addNetworkRequest({ id, url, method, status: null, startTime, endTime: null, duration: null });

      try {
        const response = await originalFetch(input, init);
        const endTime = performance.now();
        this.updateNetworkRequest(id, {
          status: response.status,
          endTime,
          duration: Math.round(endTime - startTime),
        });
        return response;
      } catch (error) {
        const endTime = performance.now();
        this.updateNetworkRequest(id, {
          status: 0,
          endTime,
          duration: Math.round(endTime - startTime),
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    };

    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.addLog({
        type: 'error',
        source: 'window',
        message: event.message,
        stack: event.error?.stack,
        data: { filename: event.filename, lineno: event.lineno, colno: event.colno },
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.addLog({
        type: 'error',
        source: 'promise',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
      });
    });

    // Performance observer
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint' || entry.entryType === 'first-input') {
              this.addMetric({
                name: entry.entryType,
                value: Math.round(entry.startTime),
                unit: 'ms',
                timestamp: Date.now(),
              });
            }
          });
        });
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch {
        // Some entry types may not be supported
      }
    }

    this.addLog({ type: 'info', source: 'diagnostics', message: 'Diagnostics engine initialized' });
  }

  private captureLog(type: DiagnosticLog['type'], args: unknown[]) {
    const message = args
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      })
      .join(' ');

    // Detect Mapbox-specific logs
    const isMapbox = message.toLowerCase().includes('mapbox') || message.includes('[Mapbox]');

    this.addLog({
      type: isMapbox ? 'mapbox' : type,
      source: 'console',
      message,
      data: args.length > 1 ? args : args[0],
    });
  }

  addLog(log: Omit<DiagnosticLog, 'id' | 'timestamp'>) {
    const entry: DiagnosticLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...log,
    };
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    this.notify();
  }

  addMetric(metric: PerformanceMetric) {
    this.metrics.unshift(metric);
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(0, 100);
    }
    this.notify();
  }

  addLifecycle(event: ComponentLifecycle) {
    this.lifecycle.unshift(event);
    if (this.lifecycle.length > 200) {
      this.lifecycle = this.lifecycle.slice(0, 200);
    }
    this.notify();
  }

  addNetworkRequest(request: NetworkRequest) {
    this.networkRequests.unshift(request);
    if (this.networkRequests.length > 100) {
      this.networkRequests = this.networkRequests.slice(0, 100);
    }
    this.notify();
  }

  updateNetworkRequest(id: string, updates: Partial<NetworkRequest>) {
    const index = this.networkRequests.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.networkRequests[index] = { ...this.networkRequests[index], ...updates };
      this.notify();
    }
  }

  // Mapbox-specific diagnostics
  logMapbox(event: string, data?: unknown) {
    this.addLog({
      type: 'mapbox',
      source: 'mapbox',
      message: `[Mapbox] ${event}`,
      data,
    });
  }

  getLogs() {
    return this.logs;
  }

  getMetrics() {
    return this.metrics;
  }

  getLifecycle() {
    return this.lifecycle;
  }

  getNetworkRequests() {
    return this.networkRequests;
  }

  getSystemInfo() {
    const nav = navigator as any;
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: nav.deviceMemory || 'N/A',
      connection: nav.connection
        ? {
            effectiveType: nav.connection.effectiveType,
            downlink: nav.connection.downlink,
            rtt: nav.connection.rtt,
          }
        : null,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      performance: {
        memory: (performance as any).memory
          ? {
              usedJSHeapSize: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
              totalJSHeapSize: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
              jsHeapSizeLimit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024),
            }
          : null,
        timing: performance.timing
          ? {
              loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
              domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
              firstPaint: performance.getEntriesByType('paint').find((e) => e.name === 'first-paint')?.startTime,
            }
          : null,
      },
    };
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Component crash tracking
  addComponentCrash(crash: ComponentCrash) {
    this.componentCrashes.unshift(crash);
    if (this.componentCrashes.length > 50) {
      this.componentCrashes = this.componentCrashes.slice(0, 50);
    }
    this.notify();
  }

  getComponentCrashes() {
    return this.componentCrashes;
  }

  // Render metrics tracking
  trackRender(component: string, renderTime: number) {
    const existing = this.renderMetrics.get(component);
    if (existing) {
      const previousAvg = existing.avgTime;
      existing.renderCount++;
      existing.totalTime += renderTime;
      existing.avgTime = existing.totalTime / existing.renderCount;
      existing.lastRenderTime = renderTime;
      existing.trend = existing.avgTime > previousAvg * 1.1 ? 'up' : 
                       existing.avgTime < previousAvg * 0.9 ? 'down' : 'stable';
    } else {
      this.renderMetrics.set(component, {
        component,
        renderCount: 1,
        totalTime: renderTime,
        avgTime: renderTime,
        lastRenderTime: renderTime,
        trend: 'stable',
      });
    }
    this.notify();
  }

  getRenderMetrics(): RenderMetric[] {
    return Array.from(this.renderMetrics.values()).sort((a, b) => b.renderCount - a.renderCount);
  }

  clearRenderMetrics() {
    this.renderMetrics.clear();
    this.notify();
  }

  clear() {
    this.logs = [];
    this.metrics = [];
    this.lifecycle = [];
    this.networkRequests = [];
    this.componentCrashes = [];
    this.renderMetrics.clear();
    this.notify();
  }

  exportLogs() {
    return {
      exportedAt: new Date().toISOString(),
      systemInfo: this.getSystemInfo(),
      logs: this.logs,
      metrics: this.metrics,
      lifecycle: this.lifecycle,
      networkRequests: this.networkRequests,
      componentCrashes: this.componentCrashes,
      renderMetrics: this.getRenderMetrics(),
    };
  }
}

export const diagnostics = new DiagnosticsEngine();

// React hook for tracking component lifecycle
export function useComponentDiagnostics(componentName: string) {
  const trackMount = () => {
    diagnostics.addLifecycle({ component: componentName, event: 'mount', timestamp: Date.now() });
  };

  const trackUnmount = () => {
    diagnostics.addLifecycle({ component: componentName, event: 'unmount', timestamp: Date.now() });
  };

  const trackError = (error: Error) => {
    diagnostics.addLifecycle({
      component: componentName,
      event: 'error',
      timestamp: Date.now(),
      props: { message: error.message, stack: error.stack },
    });
  };

  return { trackMount, trackUnmount, trackError };
}

// React hook for performance profiling
export function useProfiler(componentName: string) {
  const startTime = performance.now();

  return {
    endRender: () => {
      const renderTime = performance.now() - startTime;
      diagnostics.trackRender(componentName, renderTime);
    },
  };
}

// HOC for automatic render tracking
export function withProfiler<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function ProfiledComponent(props: P) {
    const profiler = useProfiler(componentName);
    
    // Track render on each render
    profiler.endRender();

    return React.createElement(WrappedComponent, props);
  };
}
