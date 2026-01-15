import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Cursor {
  id: string;
  userId: string;
  username: string;
  color: string;
  x: number;
  y: number;
  panelId: string;
  lastSeen: string;
}

interface CollaborationCursorsProps {
  panelId: string;
  username?: string;
}

const CURSOR_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", 
  "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#14b8a6"
];

export const CollaborationCursors = ({ panelId, username = "Analyst" }: CollaborationCursorsProps) => {
  const [cursors, setCursors] = useState<Map<string, Cursor>>(new Map());
  const [userId] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);
  const [userColor] = useState(() => CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)]);
  const [myPosition, setMyPosition] = useState({ x: 0, y: 0 });

  // Track mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = document.body.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMyPosition({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Initialize presence channel
  useEffect(() => {
    const channel = supabase.channel(`panel-${panelId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const newCursors = new Map<string, Cursor>();
        
        Object.entries(state).forEach(([key, presences]) => {
          if (key !== userId && presences.length > 0) {
            const presence = presences[0] as any;
            newCursors.set(key, {
              id: key,
              userId: presence.userId,
              username: presence.username,
              color: presence.color,
              x: presence.x || 0,
              y: presence.y || 0,
              panelId: presence.panelId,
              lastSeen: new Date().toISOString()
            });
          }
        });
        
        setCursors(newCursors);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        if (key !== userId && newPresences.length > 0) {
          const presence = newPresences[0] as any;
          setCursors(prev => {
            const next = new Map(prev);
            next.set(key, {
              id: key,
              userId: presence.userId,
              username: presence.username,
              color: presence.color,
              x: presence.x || 0,
              y: presence.y || 0,
              panelId: presence.panelId,
              lastSeen: new Date().toISOString()
            });
            return next;
          });
        }
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        setCursors(prev => {
          const next = new Map(prev);
          next.delete(key);
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId,
            username,
            color: userColor,
            x: myPosition.x,
            y: myPosition.y,
            panelId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [panelId, userId, username, userColor]);

  // Update position periodically
  useEffect(() => {
    const channel = supabase.channel(`panel-${panelId}`);
    
    const interval = setInterval(async () => {
      try {
        await channel.track({
          userId,
          username,
          color: userColor,
          x: myPosition.x,
          y: myPosition.y,
          panelId,
          online_at: new Date().toISOString(),
        });
      } catch (error) {
        // Channel may not be ready
      }
    }, 100);

    return () => clearInterval(interval);
  }, [myPosition, panelId, userId, username, userColor]);

  return (
    <>
      {/* Render other users' cursors */}
      {Array.from(cursors.values()).map(cursor => (
        <div
          key={cursor.id}
          className="fixed pointer-events-none z-50 transition-all duration-75"
          style={{
            left: `${cursor.x}%`,
            top: `${cursor.y}%`,
            transform: "translate(-2px, -2px)"
          }}
        >
          {/* Cursor arrow */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
          >
            <path
              d="M5.65376 12.4561L5.65376 3.00005L15.1078 12.4561L10.4576 12.4541L10.4576 12.4561L10.4536 12.4561L5.65376 12.4561Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          
          {/* Username label */}
          <Badge
            className="absolute left-4 top-4 text-xs whitespace-nowrap shadow-lg"
            style={{ 
              backgroundColor: cursor.color,
              color: "white",
              border: "none"
            }}
          >
            {cursor.username}
          </Badge>
        </div>
      ))}

      {/* Online users indicator */}
      {cursors.size > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            {cursors.size + 1} analyst{cursors.size > 0 ? "s" : ""} online
          </Badge>
        </div>
      )}
    </>
  );
};

export default CollaborationCursors;
