import { useEffect, useState } from "react";
import { getHealth } from "../lib/api";
import type { HealthStatus as HealthStatusType } from "../types";

interface HealthStatusProps {
  pollIntervalMs?: number;
}

export function HealthStatus({ pollIntervalMs = 60000 }: HealthStatusProps) {
  const [status, setStatus] = useState<HealthStatusType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number;

    const fetchStatus = async () => {
      try {
        const result = await getHealth();
        if (isMounted) {
          setStatus(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          timeoutId = window.setTimeout(fetchStatus, pollIntervalMs);
        }
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [pollIntervalMs]);

  const healthy = status?.status === "ok" && !error;
  const color = healthy ? "bg-emerald-500" : "bg-rose-500";
  const label = healthy ? "Backend: Online" : "Backend: Offline";

  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{error ? `${label} (${error})` : label}</span>
    </div>
  );
}
