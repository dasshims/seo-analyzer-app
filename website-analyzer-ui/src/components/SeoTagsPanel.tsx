import { SEOTags } from "../types";

interface SeoTagsPanelProps {
  tags: SEOTags;
}

const tagEntries: Array<{ key: keyof SEOTags; label: string }> = [
  { key: "title", label: "Title" },
  { key: "meta_description", label: "Meta Description" },
  { key: "canonical_url", label: "Canonical URL" },
  { key: "og_title", label: "OG Title" },
  { key: "og_description", label: "OG Description" },
  { key: "og_url", label: "OG URL" },
  { key: "og_image", label: "OG Image" },
  { key: "twitter_card", label: "Twitter Card" },
  { key: "twitter_title", label: "Twitter Title" },
  { key: "twitter_description", label: "Twitter Description" },
  { key: "twitter_image", label: "Twitter Image" }
];

export function SeoTagsPanel({ tags }: SeoTagsPanelProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-850 p-6 shadow-lg">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        SEO Tags
      </h3>
      <dl className="mt-4 grid gap-4 md:grid-cols-2">
        {tagEntries.map(({ key, label }) => {
          const value = tags[key];
          return (
            <div key={key} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </dt>
              <dd className="mt-1 text-sm text-slate-200">
                {value ? (
                  value
                ) : (
                  <span className="text-slate-500">Not set</span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
