import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface LoadTimeChartProps {
  loadTimeMs: number;
}

const thresholds = [
  { label: "Fast (<500ms)", max: 500, color: "#34d399" },
  { label: "Moderate (500-1500ms)", max: 1500, color: "#fbbf24" },
  { label: "Slow (>1500ms)", max: Infinity, color: "#f97316" }
];

export function LoadTimeChart({ loadTimeMs }: LoadTimeChartProps) {
  const segment = thresholds.find((item) => loadTimeMs <= item.max) ?? thresholds.at(-1)!;
  const data = [
    {
      name: "Load Time",
      ms: Number(loadTimeMs.toFixed(2))
    }
  ];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-850 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Load Time
        </h3>
        <span className="text-xs text-slate-400">{segment.label}</span>
      </div>
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" unit="ms" />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#e2e8f0" }}
            />
            <Bar dataKey="ms" radius={[6, 6, 0, 0]} fill={segment.color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
