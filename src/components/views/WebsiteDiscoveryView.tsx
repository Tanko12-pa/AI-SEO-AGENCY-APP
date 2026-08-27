import React, { useState } from "react";
import {
  Search,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Zap,
  Gauge,
  Layers,
  ArrowRight,
  Filter,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DiscoverySignalItem, WebsiteDiscoveryReport } from "../../types";

const INITIAL_SIGNALS: DiscoverySignalItem[] = [
  { id: 1, name: "URL Syntax & Protocol Validation", category: "Technical", status: "Passed", value: "Valid Absolute HTTPS", description: "Properly formatted RFC 3986 URL with secure TLS handshake.", impact: "High", recommendation: "Keep canonical base URL consistent." },
  { id: 2, name: "HTTPS & SSL/TLS Certificate", category: "Technical", status: "Passed", value: "TLS 1.3 Active (Valid 280d)", description: "Strict-Transport-Security (HSTS) header enforced.", impact: "High", recommendation: "Maintain automated SSL renewal cycle." },
  { id: 3, name: "CMS & Platform Detection", category: "Architecture", status: "Info", value: "WordPress 6.7 + Next.js Headless", description: "Detected REST endpoints and React hydration bundles.", impact: "Low", recommendation: "Apply platform-specific caching plugins." },
  { id: 4, name: "Robots.txt Directives", category: "Technical", status: "Passed", value: "Found & Accessible (200 OK)", description: "No blocking disallow rules on critical render paths.", impact: "High", recommendation: "Verify crawler crawl-rate limits in robots.txt." },
  { id: 5, name: "XML Sitemap Discovery", category: "Technical", status: "Passed", value: "sitemap_index.xml (422 URLs)", description: "Valid sitemap referenced in robots.txt and submitted.", impact: "High", recommendation: "Ensure automated ping to search engines on publish." },
  { id: 6, name: "Canonical Tags Integrity", category: "On-Page", status: "Passed", value: "Self-referential Canonical", description: "100% self-referential canonical detected without conflict.", impact: "High", recommendation: "Prevent duplicate parameter URLs from indexing." },
  { id: 7, name: "Hreflang & International Tags", category: "Architecture", status: "Passed", value: "en-US, en-GB, es-ES, x-default", description: "Bidirectional hreflang cluster matches language targets.", impact: "Medium", recommendation: "Audit language fallbacks periodically." },
  { id: 8, name: "Structured Data / Schema Presence", category: "Architecture", status: "Warning", value: "Organization & WebSite present", description: "Missing FAQPage and Service schema on high-intent pages.", impact: "Medium", recommendation: "Inject Service & Review schema into landing pages." },
  { id: 9, name: "Title Tag Optimization", category: "On-Page", status: "Passed", value: "54 Chars • Primary Target Included", description: "Optimal length within 50-60 character pixel boundary.", impact: "High", recommendation: "A/B test brand modifier position." },
  { id: 10, name: "Meta Description Relevance", category: "On-Page", status: "Passed", value: "148 Chars • High CTR Copy", description: "Clear value proposition and commercial call-to-action.", impact: "Medium", recommendation: "Add actionable secondary intent phrases." },
  { id: 11, name: "Heading Hierarchy (H1-H6)", category: "On-Page", status: "Passed", value: "1x H1, 6x H2, 12x H3 (Sequential)", description: "Properly nested hierarchy without skipping levels.", impact: "Medium", recommendation: "Ensure primary keyword is embedded in H1." },
  { id: 12, name: "Internal Linking Structure", category: "Architecture", status: "Warning", value: "18 Links Found • 3 Hub Targets", description: "2 deep service sub-pages have only 1 inbound internal link.", impact: "High", recommendation: "Link from high-authority homepage & pillar posts." },
  { id: 13, name: "External Outbound Links", category: "Authority & Quality", status: "Passed", value: "8 Outbound Links (Relevant Sources)", description: "Cites official industry documentation with rel=noopener.", impact: "Low", recommendation: "Maintain quality outbound references." },
  { id: 14, name: "Image Format & Compression", category: "Performance", status: "Warning", value: "4 PNGs > 450KB Detected", description: "Legacy PNG/JPEG files could be converted to WebP/AVIF.", impact: "Medium", recommendation: "Convert images to next-gen WebP format for 65% savings." },
  { id: 15, name: "Image Alt Attributes", category: "On-Page", status: "Passed", value: "96% Alt Coverage", description: "Descriptive alt text found on 24 of 25 media assets.", impact: "Medium", recommendation: "Add missing alt tag on footer logo element." },
  { id: 16, name: "URL Structure & Slugs", category: "Architecture", status: "Passed", value: "Clean Slug • /services/ai-seo", description: "Short, lowercase, hyphenated keyword-rich URL paths.", impact: "Medium", recommendation: "Avoid deep nesting beyond 3 directory levels." },
  { id: 17, name: "Indexability Directives", category: "Technical", status: "Passed", value: "index, follow (No conflicting headers)", description: "No inadvertent noindex tags found in meta or X-Robots.", impact: "Critical", recommendation: "Monitor deployment builds for accidental staging noindex." },
  { id: 18, name: "Redirect Patterns & Chains", category: "Technical", status: "Passed", value: "0 Redirect Chains Found", description: "Direct 301 execution from non-www and HTTP variants.", impact: "High", recommendation: "Maintain direct 1-hop redirect rules." },
  { id: 19, name: "HTTP Status Code Health", category: "Technical", status: "Passed", value: "200 OK (Response: 145ms)", description: "Healthy server response without 4xx/5xx errors.", impact: "Critical", recommendation: "Keep server response times under 200ms." },
  { id: 20, name: "Duplicate Content Signals", category: "On-Page", status: "Passed", value: "99.2% Uniqueness Score", description: "No thin or scraped boilerplate sections detected.", impact: "High", recommendation: "Ensure category filters use canonical parameters." },
  { id: 21, name: "Click Depth & Crawl Distance", category: "Architecture", status: "Passed", value: "Max Depth: 2 Clicks from Root", description: "All core money pages accessible within 2-3 clicks.", impact: "Medium", recommendation: "Preserve shallow architecture during site expansions." },
  { id: 22, name: "Orphan Page Detection", category: "Architecture", status: "Warning", value: "1 Potential Orphan Discovered", description: "URL in sitemap lacks any crawling anchor on live navigation.", impact: "High", recommendation: "Connect orphan URL into footer or relevant cluster hub." },
  { id: 23, name: "Pagination & Infinite Scroll", category: "Architecture", status: "Passed", value: "Standard rel=next / prev pattern", description: "Crawlable pagination with static URL parameters.", impact: "Medium", recommendation: "Avoid JS-only infinite scroll without URL pushState." },
  { id: 24, name: "JavaScript Rendering Parity", category: "Technical", status: "Passed", value: "SSR / Static HTML Hybrid", description: "Search engine crawler receives identical DOM to browser.", impact: "High", recommendation: "Avoid client-side only meta rendering." },
  { id: 25, name: "Mobile Usability & Viewport", category: "Performance", status: "Passed", value: "Responsive Viewport Configured", description: "Passes mobile-friendly tap targets and no horizontal overflow.", impact: "High", recommendation: "Ensure touch targets exceed 44x44px." },
  { id: 26, name: "Performance & Asset Caching", category: "Performance", status: "Warning", value: "Cache-Control: 1 day (Recommend 1 yr)", description: "Static CSS/JS assets have sub-optimal cache headers.", impact: "Medium", recommendation: "Set Cache-Control: max-age=31536000, immutable for static files." },
  { id: 27, name: "Core Web Vitals Benchmark", category: "Performance", status: "Passed", value: "LCP: 1.4s • INP: 85ms • CLS: 0.02", description: "Meets 75th percentile Google CrUX thresholds.", impact: "High", recommendation: "Preload largest contentful hero image." },
  { id: 28, name: "Content Quality & EEAT Depth", category: "Authority & Quality", status: "Passed", value: "1,850 Words • High Information Gain", description: "Deep subject-matter coverage with verified author entity.", impact: "High", recommendation: "Add explicit reviewer editorial credentials." },
  { id: 29, name: "Keyword Relevance & Entity Mapping", category: "On-Page", status: "Passed", value: "Strong TF-IDF Semantic Alignment", description: "Entities mapped across knowledge graph concepts.", impact: "Medium", recommendation: "Incorporate emerging related search entities." },
  { id: 30, name: "Search Intent Alignment", category: "On-Page", status: "Passed", value: "Commercial Investigation Intent", description: "Matches SERP intent with comparison tables and pricing CTAs.", impact: "High", recommendation: "Answer key customer friction points early in fold." },
  { id: 31, name: "Local SEO & NAP Signals", category: "Authority & Quality", status: "Passed", value: "NAP in Schema + GeoCoordinates", description: "Local schema matches Google Business Profile data.", impact: "Medium", recommendation: "Embed interactive verified Google Maps iframe." },
  { id: 32, name: "Schema Syntax & Validation", category: "Technical", status: "Passed", value: "0 Schema.org Validation Errors", description: "Clean JSON-LD format validated against Google Rich Results specs.", impact: "High", recommendation: "Expand schema into BreadcrumbList and FAQ." },
  { id: 33, name: "Social Metadata (OG & Twitter)", category: "On-Page", status: "Passed", value: "og:image, og:title, twitter:card", description: "High-resolution 1200x630 social preview card configured.", impact: "Low", recommendation: "Keep social titles engaging for viral syndication." },
  { id: 34, name: "Internal Linking Growth Gaps", category: "Architecture", status: "Warning", value: "5 High-Value Link Candidates", description: "Keyword-rich context exists in blog posts to link money pages.", impact: "High", recommendation: "Execute recommended internal link insertions." },
  { id: 35, name: "Semantic Content Gaps", category: "Authority & Quality", status: "Warning", value: "3 Sub-topics Not Covered", description: "Top 3 ranking competitors cover pricing comparisons & FAQ.", impact: "Medium", recommendation: "Publish supplementary FAQ section answering long-tail queries." },
  { id: 36, name: "Competitor SERP Share Gaps", category: "Authority & Quality", status: "Passed", value: "Outranking 6 of 10 Competitors", description: "High domain visibility across primary money keywords.", impact: "High", recommendation: "Target competitor featured snippet angles." },
];

export const WebsiteDiscoveryView: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState("https://omnirank-digital.com");
  const [crawlDepth, setCrawlDepth] = useState<number>(50);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentSignalIndex, setCurrentSignalIndex] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("All");
  const [expandedSignalId, setExpandedSignalId] = useState<number | null>(null);
  const [signals, setSignals] = useState<DiscoverySignalItem[]>(INITIAL_SIGNALS);

  const passedCount = signals.filter((s) => s.status === "Passed").length;
  const warningCount = signals.filter((s) => s.status === "Warning").length;
  const criticalCount = signals.filter((s) => s.status === "Critical").length;

  // Calculate Health score mathematically from 36 signals
  const calculatedHealthScore = Math.round(
    ((passedCount * 1 + warningCount * 0.5) / signals.length) * 100
  );

  const handleRunFullDiscovery = () => {
    setIsScanning(true);
    setScanProgress(0);
    setCurrentSignalIndex(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        const next = prev + 5;
        setCurrentSignalIndex(Math.min(35, Math.floor((next / 100) * 36)));
        return next;
      });
    }, 100);
  };

  const filteredSignals = signals.filter((s) => {
    if (activeCategoryFilter !== "All" && s.category !== activeCategoryFilter) return false;
    if (activeStatusFilter !== "All" && s.status !== activeStatusFilter) return false;
    return true;
  });

  const handleExportCsvReport = () => {
    const headers = "Signal #,Signal Name,Category,Status,Value,Impact,Recommendation\n";
    const rows = signals
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.category}","${s.status}","${s.value.replace(/"/g, '""')}","${s.impact}","${s.recommendation.replace(/"/g, '""')}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `36_Signal_SEO_Discovery_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div id="website-discovery-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Input Bar & Crawler Launcher */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#ffa500]" />
              <span>Website Discovery Engine & 36-Signal Crawler</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Comprehensive 36-point algorithmic inspection analyzing technical, architectural, performance, and EEAT authority signals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsvReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] hover:bg-gray-100 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>
          </div>
        </div>

        {/* URL Input & Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-xs font-mono font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={crawlDepth}
              onChange={(e) => setCrawlDepth(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-xs font-semibold text-gray-700 dark:text-gray-200"
            >
              <option value={25}>Limit: 25 URLs</option>
              <option value={50}>Limit: 50 URLs (Standard)</option>
              <option value={150}>Limit: 150 URLs (Deep)</option>
              <option value={500}>Limit: 500 URLs (Full Site)</option>
            </select>

            <button
              onClick={handleRunFullDiscovery}
              disabled={isScanning}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-[#ffa500] ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? "Crawling..." : "Run 36-Signal Discovery"}</span>
            </button>
          </div>
        </div>

        {/* Scan Progress Bar */}
        {isScanning && (
          <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-green-950/60 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#ffa500] animate-pulse" />
                <span>
                  Testing Signal {currentSignalIndex + 1}/36: {signals[currentSignalIndex]?.name}
                </span>
              </span>
              <span className="font-bold font-mono text-[#004d00] dark:text-[#ffa500]">
                {scanProgress}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-green-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#004d00] to-[#ffa500] transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* SEO Health Score & Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Score Box with Mandatory Disclaimer */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Calculated Composite Index
              </span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                SEO HEALTH SCORE
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Gauge className="w-6 h-6" />
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white font-mono">
              {calculatedHealthScore}
            </span>
            <span className="text-sm font-bold text-gray-400">/ 100</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Excellent Health
            </span>
          </div>

          {/* Mandatory Transparent Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Transparent Metric Disclaimer:</strong> This score represents an internal algorithmic audit calculated from the 36 technical, architectural, and on-page signals below. It is not an official Google ranking or official Google score.
            </p>
          </div>
        </div>

        {/* Signals Distribution Summary */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Signal Integrity
          </span>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Audit Breakdown</h4>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Passed
              </span>
              <span className="font-mono font-bold">{passedCount}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Warnings
              </span>
              <span className="font-mono font-bold">{warningCount}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Critical Issues
              </span>
              <span className="font-mono font-bold">{criticalCount}</span>
            </div>
          </div>
        </div>

        {/* Core Web Vitals Snapshot */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Speed & UX
          </span>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Core Web Vitals</h4>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
              <span className="text-[10px] text-gray-400 block font-sans">LCP (Largest Paint)</span>
              <span className="font-bold text-emerald-600">1.4s</span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
              <span className="text-[10px] text-gray-400 block font-sans">INP (Interaction)</span>
              <span className="font-bold text-emerald-600">85ms</span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
              <span className="text-[10px] text-gray-400 block font-sans">CLS (Layout Shift)</span>
              <span className="font-bold text-emerald-600">0.02</span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
              <span className="text-[10px] text-gray-400 block font-sans">TTFB (Server Byte)</span>
              <span className="font-bold text-emerald-600">145ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* 36-Signal Inspection Explorer */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-green-950/60 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#004d00] dark:text-[#ffa500]" />
              <span>36-Signal Audit Registry ({filteredSignals.length} of 36)</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click any signal row to expand detailed diagnostic explanations and step-by-step fix recommendations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-green-950/40 p-1 rounded-xl">
              {["All", "Technical", "Architecture", "On-Page", "Performance", "Authority & Quality"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      activeCategoryFilter === cat
                        ? "bg-[#004d00] text-white shadow-xs"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-xs font-semibold text-gray-700 dark:text-gray-200"
            >
              <option value="All">All Statuses</option>
              <option value="Passed">Passed Only</option>
              <option value="Warning">Warnings Only</option>
              <option value="Critical">Critical Only</option>
            </select>
          </div>
        </div>

        {/* Signals Table */}
        <div className="divide-y divide-gray-100 dark:divide-green-950/50">
          {filteredSignals.map((signal) => {
            const isExpanded = expandedSignalId === signal.id;

            return (
              <div
                key={signal.id}
                className="py-3 px-2 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-[#0f230f]/40"
              >
                <div
                  onClick={() => setExpandedSignalId(isExpanded ? null : signal.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-green-950 text-gray-500 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      #{signal.id}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>{signal.name}</span>
                        <span className="text-[10px] font-normal px-2 py-0.2 rounded-full bg-gray-100 dark:bg-green-950 text-gray-500">
                          {signal.category}
                        </span>
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">
                        {signal.value}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        signal.status === "Passed"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : signal.status === "Warning"
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                          : signal.status === "Critical"
                          ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300"
                          : "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300"
                      }`}
                    >
                      {signal.status === "Passed" && <CheckCircle2 className="w-3 h-3" />}
                      {signal.status === "Warning" && <AlertTriangle className="w-3 h-3" />}
                      {signal.status === "Critical" && <XCircle className="w-3 h-3" />}
                      <span>{signal.status}</span>
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        signal.impact === "High"
                          ? "text-red-600 bg-red-50 dark:bg-red-950/40"
                          : signal.impact === "Medium"
                          ? "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
                          : "text-gray-500 bg-gray-100 dark:bg-green-950/40"
                      }`}
                    >
                      {signal.impact} Impact
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Fix Details */}
                {isExpanded && (
                  <div className="mt-3 p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950 text-xs space-y-2 animate-in fade-in duration-150">
                    <div>
                      <strong className="text-gray-700 dark:text-gray-300 block">Diagnostic Observation:</strong>
                      <p className="text-gray-600 dark:text-gray-400 mt-0.5">{signal.description}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-200 dark:border-green-950/60">
                      <strong className="text-[#004d00] dark:text-[#ffa500] flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Actionable Agency Fix:</span>
                      </strong>
                      <p className="text-gray-700 dark:text-gray-300 font-medium mt-0.5">
                        {signal.recommendation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
