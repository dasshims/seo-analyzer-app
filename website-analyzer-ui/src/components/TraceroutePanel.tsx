import { TracerouteResponse } from "../types";

interface TraceroutePanelProps {
  data: TracerouteResponse | null;
  loading: boolean;
  error: string | null;
  onRun: () => void;
  disabled?: boolean;
}

export function TraceroutePanel({
  data,
  loading,
  error,
  onRun,
  disabled = false
}: TraceroutePanelProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-850 p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Traceroute
          </h3>
          <p className="text-xs text-slate-500">
            Runs a network trace to analyse routing hops to the target host.
          </p>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={loading || disabled}
          className="rounded-lg border border-brand/60 bg-brand/80 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:border-transparent disabled:bg-slate-600"
        >
          {loading ? "Tracing…" : "Run Traceroute"}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-rose-700 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {data && (
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-slate-300">
            Target: <span className="font-semibold text-slate-100">{data.target}</span>
          </p>
          {data.hops.length > 0 ? (
            <ul className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              {data.hops.map((hop) => (
                <li key={hop.hop} className="flex gap-3">
                  <span className="w-6 text-right font-semibold text-slate-400">
                    {hop.hop}.
                  </span>
                  <span className="flex-1 text-slate-200">{hop.details}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">
              No hop data parsed. See raw output for details.
            </p>
          )}
          <details className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
            <summary className="cursor-pointer font-semibold text-slate-300">
              Raw Output
            </summary>
            <pre className="mt-3 whitespace-pre-wrap text-[11px] text-slate-300">
              {data.raw_output}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
