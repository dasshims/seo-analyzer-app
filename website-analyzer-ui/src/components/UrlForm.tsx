import { FormEvent, useEffect, useState } from "react";

interface UrlFormProps {
  defaultUrl?: string;
  onAnalyze: (url: string) => Promise<void> | void;
  loading?: boolean;
}

export function UrlForm({ defaultUrl = "", onAnalyze, loading = false }: UrlFormProps) {
  const [url, setUrl] = useState<string>(defaultUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUrl(defaultUrl);
  }, [defaultUrl]);

  const validateUrl = (value: string): boolean => /^https?:\/\/.+/i.test(value.trim());

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }
    if (!validateUrl(trimmed)) {
      setError("URL must start with http:// or https://");
      return;
    }
    setError(null);
    await onAnalyze(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-slate-800 p-6 shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="url-input" className="block text-sm font-medium text-slate-300">
            Website URL
          </label>
          <input
            id="url-input"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
    </form>
  );
}
