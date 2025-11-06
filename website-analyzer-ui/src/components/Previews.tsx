import { AnalyzeResponse } from "../types";

interface PreviewsProps {
  data: AnalyzeResponse;
}

export function Previews({ data }: PreviewsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-700 bg-slate-850 p-6 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Google Preview
        </h3>
        <div className="mt-4 space-y-2 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-lg font-semibold text-blue-300">
            {data.google_preview.title}
          </p>
          <p className="text-xs uppercase text-slate-500">{data.url}</p>
          <p className="text-sm text-slate-300">{data.google_preview.snippet}</p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-850 p-6 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Social Preview
        </h3>
        <div className="mt-4 space-y-2 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-lg font-semibold text-slate-100">
            {data.social_preview.title}
          </p>
          <p className="text-sm text-slate-300">{data.social_preview.description}</p>
        </div>
      </div>
    </div>
  );
}
