export interface SEOTags {
  title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_url: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
}

export interface GooglePreview {
  title: string;
  snippet: string;
}

export interface SocialPreview {
  title: string;
  description: string;
}

export interface AnalyzeResponse {
  url: string;
  status_code: number;
  load_time_ms: number;
  seo_tags: SEOTags;
  issues: string[];
  ai_feedback: string;
  google_preview: GooglePreview;
  social_preview: SocialPreview;
}

export interface RecentSite {
  url: string;
  last_analyzed_at: string;
  last_status_code: number | null;
  last_load_time_ms: number | null;
}

export interface HealthStatus {
  status: string;
}

export interface TracerouteHop {
  hop: number;
  details: string;
}

export interface TracerouteResponse {
  target: string;
  hops: TracerouteHop[];
  raw_output: string;
}
