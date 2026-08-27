import React, { useState } from "react";
import {
  Link2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Network,
  Download,
  Filter,
  Check,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { InternalLinkOpportunity } from "../../types";

const INITIAL_OPPORTUNITIES: InternalLinkOpportunity[] = [
  {
    id: "link-1",
    sourcePage: "/blog/generative-engine-optimization-guide",
    targetPage: "/services/technical-seo",
    anchorText: "comprehensive technical SEO audit",
    reason: "Source article has high organic authority (DA 48) and mentions technical audits in paragraph 4 without linking to the primary service landing page.",
    cluster: "Technical SEO & Architecture",
    status: "New",
    impactScore: 94,
    targetPageAuth: 72,
  },
  {
    id: "link-2",
    sourcePage: "/case-studies/ecommerce-traffic-growth",
    targetPage: "/services/ecommerce-seo",
    anchorText: "e-commerce SEO strategies",
    reason: "Case study has 14 external inbound backlinks. Adding this contextual link passes PageRank equity directly to the commercial collection optimizer.",
    cluster: "E-commerce Optimization",
    status: "Approved",
    impactScore: 88,
    targetPageAuth: 68,
  },
  {
    id: "link-3",
    sourcePage: "/blog/local-seo-ranking-factors-2026",
    targetPage: "/services/local-seo",
    anchorText: "Google Business Profile management",
    reason: "Target page currently has only 2 inbound internal links (underlinked). Linking from high-ranking local blog resolves the authority bottleneck.",
    cluster: "Local Search & Maps",
    status: "New",
    impactScore: 91,
    targetPageAuth: 60,
  },
  {
    id: "link-4",
    sourcePage: "/resources/seo-glossary",
    targetPage: "/services/migration-seo",
    anchorText: "301 redirect mapping checklist",
    reason: "Glossary entry explains URL migration concepts; directs transactional traffic toward the website replatforming service.",
    cluster: "Migration & Replatforming",
    status: "New",
    impactScore: 78,
    targetPageAuth: 55,
  },
  {
    id: "link-5",
    sourcePage: "/blog/core-web-vitals-inp-breakdown",
    targetPage: "/services/technical-seo",
    anchorText: "Core Web Vitals remediation",
    reason: "Target page is the primary conversion hub for performance audits. Direct anchor text alignment reinforces entity topical authority.",
    cluster: "Technical SEO & Architecture",
    status: "Approved",
    impactScore: 96,
    targetPageAuth: 72,
  },
  {
    id: "link-6",
    sourcePage: "/about-us",
    targetPage: "/blog/enterprise-ai-seo-framework",
    anchorText: "our proprietary AI SEO framework",
    reason: "About page has high homepage PageRank distribution; linking to flagship research paper boosts its indexing authority.",
    cluster: "EEAT & Authority",
    status: "New",
    impactScore: 82,
    targetPageAuth: 64,
  },
];

export const InternalLinkingView: React.FC = () => {
  const [opportunities, setOpportunities] = useState<InternalLinkOpportunity[]>(INITIAL_OPPORTUNITIES);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const handleStatusChange = (id: string, newStatus: "Approved" | "Rejected" | "Implemented") => {
    setOpportunities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const filteredOpps = opportunities.filter((item) => {
    if (activeFilter === "All") return true;
    return item.status === activeFilter;
  });

  const handleExportCsv = () => {
    const headers = "ID,Source Page,Target Page,Anchor Text,Reason,Cluster,Impact Score,Status\n";
    const rows = opportunities
      .map(
        (o) =>
          `"${o.id}","${o.sourcePage}","${o.targetPage}","${o.anchorText}","${o.reason.replace(/"/g, '""')}","${o.cluster}",${o.impactScore},"${o.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `internal-linking-opportunities-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div id="internal-linking-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-[#ffa500]" />
              <span>Internal Linking Graph & Opportunity Engine</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Analyze PageRank authority flow, resolve orphan/underlinked pages, and approve contextual link insertions to amplify search rankings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] hover:bg-gray-100 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Graph Metrics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Opportunities</span>
            <span className="text-xl font-bold font-mono text-gray-900 dark:text-white">{opportunities.length} Detected</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Approved for Rollout</span>
            <span className="text-xl font-bold font-mono text-emerald-600">
              {opportunities.filter((o) => o.status === "Approved").length} Links
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950">
            <span className="text-[10px] uppercase font-bold text-amber-600 block">Underlinked Target Pages</span>
            <span className="text-xl font-bold font-mono text-amber-600">3 URLs</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">Orphan Risk Mitigation</span>
            <span className="text-xl font-bold font-mono text-blue-600">100% Protected</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          {["All", "New", "Approved", "Implemented", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFilter === status
                  ? "bg-[#004d00] text-white shadow-xs"
                  : "bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {filteredOpps.map((opp) => (
          <div
            key={opp.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm space-y-4"
          >
            {/* Header / Impact */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-green-950/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  {opp.cluster}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    opp.status === "Approved"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : opp.status === "Rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  Status: {opp.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-gray-500">
                  Estimated Authority Impact: <strong className="text-emerald-600 font-mono">+{opp.impactScore}/100</strong>
                </span>
              </div>
            </div>

            {/* Source -> Target -> Anchor Link Path */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
                <span className="text-[10px] uppercase font-bold text-gray-400 font-sans block">1. Source Page</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 break-all">{opp.sourcePage}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 font-sans block">
                  2. Suggested Anchor Text
                </span>
                <span className="font-black text-emerald-800 dark:text-emerald-300 underline">
                  "{opp.anchorText}"
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
                <span className="text-[10px] uppercase font-bold text-gray-400 font-sans block">3. Target Destination Page</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 break-all">{opp.targetPage}</span>
              </div>
            </div>

            {/* Strategic Rationale */}
            <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#060e06] p-3 rounded-xl border border-gray-100 dark:border-green-950/60">
              <strong className="text-gray-900 dark:text-white block font-sans mb-0.5">Strategic Rationale:</strong>
              <p className="leading-relaxed">{opp.reason}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => handleStatusChange(opp.id, "Rejected")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-green-950 text-gray-700 dark:text-gray-300 hover:bg-gray-100 text-xs font-semibold transition-colors"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
                <span>Reject</span>
              </button>

              <button
                onClick={() => handleStatusChange(opp.id, "Approved")}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#004d00] hover:bg-[#003800] text-white text-xs font-bold transition-all shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-[#ffa500]" />
                <span>Approve Recommendation</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
