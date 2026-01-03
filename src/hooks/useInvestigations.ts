import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Investigation = Tables<"investigations">;

export const useInvestigations = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestigations = async () => {
      const { data, error } = await supabase
        .from("investigations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setInvestigations(data);
      }
      setLoading(false);
    };

    fetchInvestigations();

    const channel = supabase
      .channel("investigations-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "investigations" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setInvestigations((prev) => [payload.new as Investigation, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setInvestigations((prev) => prev.map((i) => (i.id === (payload.new as Investigation).id ? (payload.new as Investigation) : i)));
          } else if (payload.eventType === "DELETE") {
            setInvestigations((prev) => prev.filter((i) => i.id !== (payload.old as Investigation).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addInvestigation = async (investigation: TablesInsert<"investigations">) => {
    const { data, error } = await supabase.from("investigations").insert([investigation]).select().single();
    return { data, error };
  };

  const updateInvestigation = async (id: string, updates: TablesUpdate<"investigations">) => {
    const { data, error } = await supabase.from("investigations").update(updates).eq("id", id).select().single();
    return { data, error };
  };

  const deleteInvestigation = async (id: string) => {
    const { error } = await supabase.from("investigations").delete().eq("id", id);
    return { error };
  };

  const addTimelineEvent = async (id: string, event: { timestamp: string; action: string; user: string; details?: string }) => {
    const investigation = investigations.find((i) => i.id === id);
    const currentTimeline = (investigation?.timeline as any[]) || [];
    const newTimeline = [...currentTimeline, event];
    
    const { data, error } = await supabase
      .from("investigations")
      .update({ timeline: newTimeline })
      .eq("id", id)
      .select()
      .single();
    
    return { data, error };
  };

  const linkEvidence = async (id: string, type: "ioc" | "event", evidenceId: string) => {
    const investigation = investigations.find((i) => i.id === id);
    if (!investigation) return { error: new Error("Investigation not found") };

    if (type === "ioc") {
      const currentIOCs = investigation.related_iocs || [];
      if (!currentIOCs.includes(evidenceId)) {
        const { data, error } = await supabase
          .from("investigations")
          .update({ related_iocs: [...currentIOCs, evidenceId] })
          .eq("id", id)
          .select()
          .single();
        return { data, error };
      }
    } else {
      const currentEvents = investigation.related_events || [];
      if (!currentEvents.includes(evidenceId)) {
        const { data, error } = await supabase
          .from("investigations")
          .update({ related_events: [...currentEvents, evidenceId] })
          .eq("id", id)
          .select()
          .single();
        return { data, error };
      }
    }
    return { data: investigation, error: null };
  };

  return { 
    investigations, 
    loading, 
    addInvestigation, 
    updateInvestigation, 
    deleteInvestigation,
    addTimelineEvent,
    linkEvidence
  };
};
