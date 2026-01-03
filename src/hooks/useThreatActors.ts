import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type ThreatActor = Tables<"threat_actors">;
export type AttackCampaign = Tables<"attack_campaigns">;

export const useThreatActors = () => {
  const [actors, setActors] = useState<ThreatActor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActors = async () => {
      const { data, error } = await supabase
        .from("threat_actors")
        .select("*")
        .order("last_activity", { ascending: false });

      if (!error && data) {
        setActors(data);
      }
      setLoading(false);
    };

    fetchActors();

    const channel = supabase
      .channel("threat-actors-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "threat_actors" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setActors((prev) => [payload.new as ThreatActor, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setActors((prev) => prev.map((a) => (a.id === (payload.new as ThreatActor).id ? (payload.new as ThreatActor) : a)));
          } else if (payload.eventType === "DELETE") {
            setActors((prev) => prev.filter((a) => a.id !== (payload.old as ThreatActor).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addActor = async (actor: TablesInsert<"threat_actors">) => {
    const { data, error } = await supabase.from("threat_actors").insert([actor]).select().single();
    return { data, error };
  };

  const updateActor = async (id: string, updates: TablesUpdate<"threat_actors">) => {
    const { data, error } = await supabase.from("threat_actors").update(updates).eq("id", id).select().single();
    return { data, error };
  };

  const deleteActor = async (id: string) => {
    const { error } = await supabase.from("threat_actors").delete().eq("id", id);
    return { error };
  };

  return { actors, loading, addActor, updateActor, deleteActor };
};

export const useAttackCampaigns = () => {
  const [campaigns, setCampaigns] = useState<AttackCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from("attack_campaigns")
        .select("*")
        .order("start_time", { ascending: false });

      if (!error && data) {
        setCampaigns(data);
      }
      setLoading(false);
    };

    fetchCampaigns();

    const channel = supabase
      .channel("campaigns-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attack_campaigns" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCampaigns((prev) => [payload.new as AttackCampaign, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setCampaigns((prev) => prev.map((c) => (c.id === (payload.new as AttackCampaign).id ? (payload.new as AttackCampaign) : c)));
          } else if (payload.eventType === "DELETE") {
            setCampaigns((prev) => prev.filter((c) => c.id !== (payload.old as AttackCampaign).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addCampaign = async (campaign: TablesInsert<"attack_campaigns">) => {
    const { data, error } = await supabase.from("attack_campaigns").insert([campaign]).select().single();
    return { data, error };
  };

  const updateCampaign = async (id: string, updates: TablesUpdate<"attack_campaigns">) => {
    const { data, error } = await supabase.from("attack_campaigns").update(updates).eq("id", id).select().single();
    return { data, error };
  };

  return { campaigns, loading, addCampaign, updateCampaign };
};
