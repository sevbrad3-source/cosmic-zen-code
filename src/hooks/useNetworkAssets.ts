import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type NetworkAsset = Tables<"network_assets">;

export const useNetworkAssets = () => {
  const [assets, setAssets] = useState<NetworkAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase
        .from("network_assets")
        .select("*")
        .order("risk_score", { ascending: false });

      if (!error && data) {
        setAssets(data);
      }
      setLoading(false);
    };

    fetchAssets();

    const channel = supabase
      .channel("network-assets-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "network_assets" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setAssets((prev) => [payload.new as NetworkAsset, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setAssets((prev) => prev.map((a) => (a.id === (payload.new as NetworkAsset).id ? (payload.new as NetworkAsset) : a)));
          } else if (payload.eventType === "DELETE") {
            setAssets((prev) => prev.filter((a) => a.id !== (payload.old as NetworkAsset).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addAsset = async (asset: TablesInsert<"network_assets">) => {
    const { data, error } = await supabase.from("network_assets").insert([asset]).select().single();
    return { data, error };
  };

  const updateAsset = async (id: string, updates: TablesUpdate<"network_assets">) => {
    const { data, error } = await supabase.from("network_assets").update(updates).eq("id", id).select().single();
    return { data, error };
  };

  const deleteAsset = async (id: string) => {
    const { error } = await supabase.from("network_assets").delete().eq("id", id);
    return { error };
  };

  const discoverAsset = async (ipAddress: string, hostname?: string) => {
    // Simulate network discovery with vulnerability scanning
    const assetTypes = ["server", "workstation", "router", "switch", "firewall", "iot"];
    const operatingSystems = ["Windows Server 2022", "Ubuntu 22.04", "CentOS 8", "macOS Sonoma", "Cisco IOS", "FortiOS"];
    const zones = ["DMZ", "Internal", "Production", "Development", "Management"];

    const vulnerabilities = [
      { cve: "CVE-2024-0001", severity: "critical", description: "Remote code execution" },
      { cve: "CVE-2024-0002", severity: "high", description: "SQL injection vulnerability" },
      { cve: "CVE-2024-0003", severity: "medium", description: "Cross-site scripting (XSS)" },
      { cve: "CVE-2024-0004", severity: "low", description: "Information disclosure" },
    ];

    const selectedVulns = vulnerabilities.filter(() => Math.random() > 0.5);
    const riskScore = selectedVulns.reduce((acc, v) => {
      const scores = { critical: 40, high: 25, medium: 10, low: 5 };
      return acc + (scores[v.severity as keyof typeof scores] || 0);
    }, 0);

    const services = [
      { port: 22, name: "SSH", version: "OpenSSH 8.9" },
      { port: 80, name: "HTTP", version: "nginx 1.24" },
      { port: 443, name: "HTTPS", version: "nginx 1.24" },
      { port: 3389, name: "RDP", version: "Microsoft RDP" },
    ].filter(() => Math.random() > 0.5);

    const newAsset: TablesInsert<"network_assets"> = {
      ip_address: ipAddress,
      hostname: hostname || `host-${ipAddress.split(".").pop()}`,
      asset_type: assetTypes[Math.floor(Math.random() * assetTypes.length)],
      operating_system: operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
      zone: zones[Math.floor(Math.random() * zones.length)],
      services: services,
      vulnerabilities: selectedVulns,
      risk_score: Math.min(riskScore, 100),
      is_compromised: Math.random() > 0.9,
      last_scan: new Date().toISOString(),
      mac_address: Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join(":"),
    };

    return addAsset(newAsset);
  };

  const correlateVulnerabilities = useMemo(() => {
    const vulnMap = new Map<string, { count: number; assets: string[]; severity: string }>();

    assets.forEach((asset) => {
      const vulns = (asset.vulnerabilities as any[]) || [];
      vulns.forEach((vuln) => {
        if (vuln.cve) {
          const existing = vulnMap.get(vuln.cve);
          if (existing) {
            existing.count++;
            existing.assets.push(asset.hostname || asset.ip_address);
          } else {
            vulnMap.set(vuln.cve, {
              count: 1,
              assets: [asset.hostname || asset.ip_address],
              severity: vuln.severity,
            });
          }
        }
      });
    });

    return Array.from(vulnMap.entries())
      .map(([cve, data]) => ({ cve, ...data }))
      .sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (severityOrder[a.severity as keyof typeof severityOrder] || 4) - (severityOrder[b.severity as keyof typeof severityOrder] || 4);
      });
  }, [assets]);

  const assetsByZone = useMemo(() => {
    const zoneMap = new Map<string, NetworkAsset[]>();
    assets.forEach((asset) => {
      const zone = asset.zone || "Unknown";
      const existing = zoneMap.get(zone) || [];
      zoneMap.set(zone, [...existing, asset]);
    });
    return zoneMap;
  }, [assets]);

  const compromisedAssets = useMemo(() => assets.filter((a) => a.is_compromised), [assets]);

  return { 
    assets, 
    loading, 
    addAsset, 
    updateAsset, 
    deleteAsset, 
    discoverAsset,
    correlateVulnerabilities,
    assetsByZone,
    compromisedAssets
  };
};
