import { RecentSite } from "../types";

interface RecentSitesProps {
  sites: RecentSite[];
  onSelect: (url: string) => void;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function RecentSites({ sites, onSelect }: RecentSitesProps) {
  return (
    <aside className="rounded-xl border border-slate-700 bg-slate-850 p-6 shadow-lg">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Recent Analyses
      </h3>
      {sites.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No sites analyzed yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {sites.map((site) => (
            <li key={site.url}>
              <button
                type="button"
                onClick={() => onSelect(site.url)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-left transition hover:border-brand/60 hover:bg-slate-900"
              >
                <p className="truncate text-sm font-semibold text-slate-100">{site.url}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatTimestamp(site.last_analyzed_at)}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Status:{" "}
                  <span className="text-slate-200">
                    {site.last_status_code ?? "—"}
                  </span>{" "}
                  • Load:{" "}
                  <span className="text-slate-200">
                    {site.last_load_time_ms !== null
                      ? `${Math.round(site.last_load_time_ms)} ms`
                      : "—"}
                  </span>
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
