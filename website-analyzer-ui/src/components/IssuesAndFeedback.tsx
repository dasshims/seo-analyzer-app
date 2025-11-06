interface IssuesAndFeedbackProps {
  issues: string[];
  feedback: string;
}

export function IssuesAndFeedback({ issues, feedback }: IssuesAndFeedbackProps) {
  const hasIssues = issues.length > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-700 bg-slate-850 p-6 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Rule-Based Issues
        </h3>
        {hasIssues ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-200">
            {issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-emerald-300">No issues detected.</p>
        )}
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-850 p-6 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          AI Feedback
        </h3>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-200">
          {feedback || "No AI feedback available."}
        </p>
      </div>
    </div>
  );
}
