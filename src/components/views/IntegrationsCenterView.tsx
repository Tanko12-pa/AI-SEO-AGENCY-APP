import React, { useState } from "react";
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Shield,
  Key,
  Layers,
  Search,
  BarChart3,
  Globe,
  Settings,
  Lock,
} from "lucide-react";
import { ToolIntegrationItem } from "../../types";

const INITIAL_INTEGRATIONS: ToolIntegrationItem[] = [
  {
    id: "gsc",
    name: "Google Search Console",
    category: "Google Suite",
    iconName: "Search",
    status: "Connected",
    lastSync: "24 mins ago",
    docUrl: "https://developers.google.com/search/docs/advanced/",
    description: "Pulls organic impressions, clicks, CTR, average position, and URL indexation coverage directly via OAuth 2.0.",
    featuresAvailable: ["Query Rank Tracking", "URL Inspection API", "Sitemap Ping", "Index Coverage Feed"],
  },
  {
    id: "ga4",
    name: "Google Analytics 4 (GA4)",
    category: "Google Suite",
    iconName: "BarChart3",
    status: "Connected",
    lastSync: "1 hour ago",
    docUrl: "https://developers.google.com/analytics",
    description: "Tracks organic sessions, engagement rate, user paths, and goal conversions across landing pages.",
    featuresAvailable: ["Organic Attribution", "Landing Page Revenue", "Event Stream", "User Demographics"],
  },
  {
    id: "gbp",
    name: "Google Business Profile",
    category: "Google Suite",
    iconName: "Globe",
    status: "Connected",
    lastSync: "2 hours ago",
    docUrl: "https://support.google.com/business/",
    description: "Synchronizes local 3-pack rankings, review counts, NAP consistency, and search action calls/directions.",
    featuresAvailable: ["Review Sync", "Local Insights API", "Location Profile Management"],
  },
  {
    id: "pagespeed",
    name: "Google PageSpeed Insights & CrUX",
    category: "Google Suite",
    iconName: "Zap",
    status: "Connected",
    lastSync: "Today, 09:30 AM",
    docUrl: "https://developers.google.com/speed/docs/insights/v5/about",
    description: "Field & Lab Core Web Vitals diagnostic engine monitoring LCP, INP, CLS, and TTFB scores.",
    featuresAvailable: ["CrUX 75th Percentile Data", "Lighthouse 11 Engine", "Asset Optimization Audit"],
  },
  {
    id: "semrush",
    name: "SEMrush API Connector",
    category: "Competitor & Keywords",
    iconName: "Layers",
    status: "Connected",
    lastSync: "Today, 08:15 AM",
    docUrl: "https://www.semrush.com/api/documentation/",
    description: "Extracts keyword search volume, keyword difficulty, CPC, and competitor domain overlap matrices.",
    featuresAvailable: ["Domain Authority Radar", "Keyword Volume Sync", "SERP Feature Probability"],
  },
  {
    id: "ahrefs",
    name: "Ahrefs API v3",
    category: "Competitor & Keywords",
    iconName: "Layers",
    status: "Authorization Required",
    docUrl: "https://ahrefs.com/api",
    description: "Backlink profile monitoring, referring domains, anchor text analysis, and lost link alarms.",
    featuresAvailable: ["Backlink Velocity", "Domain Rating (DR)", "Anchor Text Breakdown"],
  },
  {
    id: "moz",
    name: "Moz Link Explorer API",
    category: "Competitor & Keywords",
    iconName: "Layers",
    status: "Connected",
    lastSync: "Yesterday",
    docUrl: "https://moz.com/products/api",
    description: "Authoritative Domain Authority (DA) and Page Authority (PA) equity verification.",
    featuresAvailable: ["Spam Score Filter", "Domain Authority Verification", "Brand Mentions"],
  },
  {
    id: "screaming-frog",
    name: "Screaming Frog SEO Spider",
    category: "Technical Crawl",
    iconName: "Search",
    status: "Connected",
    lastSync: "Today, 06:00 AM",
    docUrl: "https://www.screamingfrog.co.uk/seo-spider/",
    description: "Local headless crawl agent for deep technical sitemap, canonical, redirect, and status code scans.",
    featuresAvailable: ["Deep Crawl Importer", "301 Redirect Chain Scanner", "Orphan URL Discovery"],
  },
  {
    id: "google-trends",
    name: "Google Trends Grounding Radar",
    category: "Competitor & Keywords",
    iconName: "BarChart3",
    status: "Connected",
    lastSync: "Live Grounded",
    docUrl: "https://support.google.com/trends/answer/6248105",
    description: "Real-time query breakout trajectory and seasonal search interest analysis powered by Gemini API grounding.",
    featuresAvailable: ["Seasonal Interest Trajectory", "Breakout Query Detector", "Regional Heatmap"],
  },
  {
    id: "answer-the-public",
    name: "AnswerThePublic NLP API",
    category: "Competitor & Keywords",
    iconName: "Search",
    status: "Connected",
    lastSync: "3 days ago",
    docUrl: "https://answerthepublic.com/api",
    description: "Discovers question-based search queries (What, How, Why) for Answer Engine Optimization (AEO).",
    featuresAvailable: ["PPA Question Extractor", "Preposition Matrix", "Comparison Query Silos"],
  },
];

export const IntegrationsCenterView: React.FC = () => {
  const [integrations, setIntegrations] = useState<ToolIntegrationItem[]>(INITIAL_INTEGRATIONS);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "Connected", lastSync: "Just now" } : item
        )
      );
    }, 1200);
  };

  const filtered = integrations.filter((item) => {
    if (activeCategory === "All") return true;
    return item.category === activeCategory;
  });

  return (
    <div id="integrations-center-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ffa500]" />
              <span>Trusted Tool Connectors & SEO Data Integration Hub</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Securely stream real-time analytics, crawl diagnostics, rank indexes, and competitor signals directly from industry-standard APIs into the agency OS.
            </p>
          </div>
        </div>

        {/* Security & Graceful Degradation Architecture Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block">Zero-Trust Credential Isolation:</strong>
              <p className="text-[11px] leading-relaxed">
                All OAuth 2.0 tokens and API secrets are strictly encrypted server-side and never exposed to the client-side JavaScript runtime.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950 text-gray-700 dark:text-gray-300 flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-[#ffa500] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block">Graceful Adapter Degradation:</strong>
              <p className="text-[11px] leading-relaxed">
                If an individual external provider is temporarily unreachable, the platform continues seamless operation using verified cached baselines without halting workflows.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex items-center gap-2 text-xs">
        {["All", "Google Suite", "Competitor & Keywords", "Technical Crawl"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeCategory === cat
                ? "bg-[#004d00] text-white shadow-xs"
                : "bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((tool) => {
          const isSyncing = syncingId === tool.id;

          return (
            <div
              key={tool.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span>{tool.name}</span>
                    </h3>
                    <span className="text-[10px] text-gray-400 font-medium">{tool.category}</span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      tool.status === "Connected"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                        : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    {tool.status === "Connected" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    <span>{tool.status}</span>
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {tool.description}
                </p>

                {/* Available features tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tool.featuresAvailable.map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-[#060e06] text-gray-600 dark:text-gray-300 font-medium"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 dark:border-green-950/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400 font-mono">
                  {tool.lastSync ? `Sync: ${tool.lastSync}` : "Auth required"}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={tool.docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    title="View API Docs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleSync(tool.id)}
                    disabled={isSyncing}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#004d00] hover:bg-[#003800] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 text-[#ffa500] ${isSyncing ? "animate-spin" : ""}`} />
                    <span>{isSyncing ? "Syncing..." : "Sync Feed"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
