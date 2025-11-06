import { AnalyzeResponse } from "../types";

interface SummaryCardsProps {
  data: AnalyzeResponse;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const issueCount = data.issues.length;
  const issueLabel = issueCount > 0 ? "Needs attention" : "Looks good";
  const issueColor = issueCount > 0 ? "text-amber-300" : "text-emerald-300";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-700 bg-slate-850 p-5 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Performance
        </h3>
        <div className="mt-3 text-3xl font-semibold text-slate-100">
          {Math.round(data.load_time_ms)} ms
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Status code: <span className="text-slate-100">{data.status_code}</span>
        </p>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-850 p-5 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          SEO Issues
        </h3>
        <div className="mt-3 text-3xl font-semibold text-slate-100">{issueCount}</div>
        <p className={`mt-2 text-sm font-medium ${issueColor}`}>{issueLabel}</p>
      </div>
    </div>
  );
}

