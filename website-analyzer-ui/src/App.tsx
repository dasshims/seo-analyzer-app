import { useCallback, useEffect, useState } from "react";
import { UrlForm } from "./components/UrlForm";
import { SummaryCards } from "./components/SummaryCards";
import { LoadTimeChart } from "./components/LoadTimeChart";
import { SeoTagsPanel } from "./components/SeoTagsPanel";
import { IssuesAndFeedback } from "./components/IssuesAndFeedback";
import { Previews } from "./components/Previews";
import { RecentSites } from "./components/RecentSites";
import { HealthStatus } from "./components/HealthStatus";
import { TraceroutePanel } from "./components/TraceroutePanel";
import { analyzeUrl, getRecentSites, runTraceroute } from "./lib/api";
import type { AnalyzeResponse, RecentSite, TracerouteResponse } from "./types";

export default function App() {
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [recentSites, setRecentSites] = useState<RecentSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [traceroute, setTraceroute] = useState<TracerouteResponse | null>(null);
  const [tracerouteLoading, setTracerouteLoading] = useState(false);
  const [tracerouteError, setTracerouteError] = useState<string | null>(null);

  const refreshRecentSites = useCallback(async () => {
    try {
      const sites = await getRecentSites();
      setRecentSites(sites);
    } catch (error) {
      console.error("Failed to load recent sites", error);
    }
  }, []);

  useEffect(() => {
    void refreshRecentSites();
  }, [refreshRecentSites]);

  const handleAnalyze = useCallback(async (url: string) => {
    setLoading(true);
    setBackendError(null);
    setSelectedUrl(url);
    setTraceroute(null);
    setTracerouteError(null);
    try {
      const response = await analyzeUrl(url);
      setAnalysis(response);
      await refreshRecentSites();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze URL.";
      setBackendError(message);
    } finally {
      setLoading(false);
    }
  }, [refreshRecentSites]);

  const handleSelectRecent = useCallback(
    (url: string) => {
      void handleAnalyze(url);
    },
    [handleAnalyze]
  );

  const handleTraceroute = useCallback(async () => {
    const targetUrl = analysis?.url ?? selectedUrl;
    if (!targetUrl) {
      setTracerouteError("Enter a URL before running traceroute.");
      return;
    }
    setTracerouteLoading(true);
    setTracerouteError(null);
    try {
      const result = await runTraceroute(targetUrl);
      setTraceroute(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Traceroute failed.";
      setTracerouteError(message);
    } finally {
      setTracerouteLoading(false);
    }
  }, [analysis, selectedUrl]);

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Website Analyzer</h1>
            <p className="text-sm text-slate-400">
              SEO &amp; preview insights for any URL
            </p>
          </div>
          <HealthStatus pollIntervalMs={60000} />
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <UrlForm
            defaultUrl={selectedUrl}
            onAnalyze={(url) => handleAnalyze(url)}
            loading={loading}
          />
          {backendError && (
            <div className="rounded-lg border border-rose-700 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
              {backendError}
            </div>
          )}

          {analysis ? (
            <div className="space-y-6">
              <SummaryCards data={analysis} />
              <LoadTimeChart loadTimeMs={analysis.load_time_ms} />
              <SeoTagsPanel tags={analysis.seo_tags} />
              <IssuesAndFeedback issues={analysis.issues} feedback={analysis.ai_feedback} />
              <Previews data={analysis} />
              <TraceroutePanel
                data={traceroute}
                loading={tracerouteLoading}
                error={tracerouteError}
                onRun={handleTraceroute}
                disabled={loading}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-sm text-slate-400">
              Enter a URL to see SEO insights and previews.
            </div>
          )}
        </div>

        <div>
          <RecentSites sites={recentSites} onSelect={handleSelectRecent} />
        </div>
      </main>
    </div>
  );
}
