import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type SecurityEvent = Tables<"security_events">;
export type IOC = Tables<"iocs">;

export const useSecurityEvents = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("security_events")
        .select("*")
        .order("detected_at", { ascending: false })
        .limit(100);

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("security-events-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "security_events" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setEvents((prev) => [payload.new as SecurityEvent, ...prev].slice(0, 100));
          } else if (payload.eventType === "DELETE") {
            setEvents((prev) => prev.filter((e) => e.id !== (payload.old as SecurityEvent).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addEvent = async (event: TablesInsert<"security_events">) => {
    const { data, error } = await supabase.from("security_events").insert([event]).select().single();
    return { data, error };
  };

  return { events, loading, addEvent };
};

export const useIOCs = () => {
  const [iocs, setIOCs] = useState<IOC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIOCs = async () => {
      const { data, error } = await supabase
        .from("iocs")
        .select("*")
        .order("last_seen", { ascending: false })
        .limit(200);

      if (!error && data) {
        setIOCs(data);
      }
      setLoading(false);
    };

    fetchIOCs();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("iocs-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "iocs" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setIOCs((prev) => [payload.new as IOC, ...prev].slice(0, 200));
          } else if (payload.eventType === "UPDATE") {
            setIOCs((prev) => prev.map((i) => (i.id === (payload.new as IOC).id ? (payload.new as IOC) : i)));
          } else if (payload.eventType === "DELETE") {
            setIOCs((prev) => prev.filter((i) => i.id !== (payload.old as IOC).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addIOC = async (ioc: TablesInsert<"iocs">) => {
    const { data, error } = await supabase.from("iocs").insert([ioc]).select().single();
    return { data, error };
  };

  const updateIOC = async (id: string, updates: TablesUpdate<"iocs">) => {
    const { data, error } = await supabase.from("iocs").update(updates).eq("id", id).select().single();
    return { data, error };
  };

  const deleteIOC = async (id: string) => {
    const { error } = await supabase.from("iocs").delete().eq("id", id);
    return { error };
  };

  return { iocs, loading, addIOC, updateIOC, deleteIOC };
};
