import React, { useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  ShieldCheck,
  BarChart3,
  Zap,
  Globe,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { CompetitorItem } from "../../types";

interface InitialAuditViewProps {
  competitors: CompetitorItem[];
  onAddCompetitor: (comp: CompetitorItem) => void;
  onDeleteCompetitor: (id: string) => void;
  onToggleArchiveCompetitor?: (id: string) => void;
  onOpenAddModal: () => void;
}

export const InitialAuditView: React.FC<InitialAuditViewProps> = ({
  competitors,
  onDeleteCompetitor,
  onToggleArchiveCompetitor,
  onOpenAddModal,
}) => {
  const [activeAuditTab, setActiveAuditTab] = useState<"competitors" | "website" | "backlinks" | "analytics">("competitors");
  const [archiveFilter, setArchiveFilter] = useState<"active" | "archived" | "all">("active");

  const activeCount = competitors.filter((c) => !c.archived).length;
  const archivedCount = competitors.filter((c) => !!c.archived).length;

  const filteredCompetitors = competitors.filter((c) => {
    const isArchived = !!c.archived;
    if (archiveFilter === "active" && isArchived) return false;
    if (archiveFilter === "archived" && !isArchived) return false;
    return true;
  });

  return (
    <div id="initial-audit-view" className="space-y-6">
      {/* Header */}
      <div className="bg-[#004d00] rounded-xl p-6 text-white border border-[#003300] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#003300] text-[11px] text-[#ffa500] font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#ffa500]" />
            Pillar 1: Initial Setup & Discovery
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Website Audit, 10-Competitor Matrix & GA4 Setup
          </h1>
          <p className="text-xs text-green-100 max-w-2xl">
            Complete technical baseline analysis, competitor market share benchmarking, backlink profile equity, and conversion measurement tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#003300] p-1.5 rounded-lg border border-[#002800] text-xs">
          <button
            onClick={() => setActiveAuditTab("competitors")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeAuditTab === "competitors"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            10-Competitor Matrix
          </button>
          <button
            onClick={() => setActiveAuditTab("website")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeAuditTab === "website"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            Website Analysis
          </button>
          <button
            onClick={() => setActiveAuditTab("backlinks")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeAuditTab === "backlinks"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            Backlink Health
          </button>
          <button
            onClick={() => setActiveAuditTab("analytics")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeAuditTab === "analytics"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            GA4 & Conversions
          </button>
        </div>
      </div>

      {/* Tab 1: 10 Competitors Benchmark Matrix */}
      {activeAuditTab === "competitors" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#004d00]" />
                10-Competitor Strategic Intelligence Matrix ({activeCount} Active / {archivedCount} Archived)
              </h3>
              <p className="text-xs text-gray-500">
                Benchmarking domain authority, organic keyword footprint, and AI Overview capture rate.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Archived Items Filter Toggle */}
              <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setArchiveFilter("active")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                    archiveFilter === "active"
                      ? "bg-[#004d00] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  type="button"
                  onClick={() => setArchiveFilter("archived")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors ${
                    archiveFilter === "archived"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-amber-700"
                  }`}
                >
                  <Archive className="w-3 h-3" />
                  <span>Archived ({archivedCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setArchiveFilter("all")}
                  className={`px-2 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                    archiveFilter === "all"
                      ? "bg-gray-800 text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  All ({competitors.length})
                </button>
              </div>

              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>+ Add Competitor (2026-08-24)</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">Competitor Brand</th>
                    <th className="p-3.5">Domain URL</th>
                    <th className="p-3.5">Domain Authority</th>
                    <th className="p-3.5">Organic Keywords</th>
                    <th className="p-3.5">Est. Traffic</th>
                    <th className="p-3.5">AI Overview %</th>
                    <th className="p-3.5">Backlinks</th>
                    <th className="p-3.5">Date Added</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredCompetitors.map((c) => (
                    <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${c.archived ? "bg-amber-50/40" : ""}`}>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900">{c.name}</span>
                          {c.archived && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900">
                              Archived
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-[#004d00]">{c.domain}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          DA {c.domainAuthority}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-gray-800">
                        {c.organicKeywords.toLocaleString()}
                      </td>
                      <td className="p-3.5 font-semibold text-gray-900">{c.estimatedTraffic}</td>
                      <td className="p-3.5 font-bold text-orange-600">{c.aiOverviewPresence}%</td>
                      <td className="p-3.5 font-mono text-gray-600">
                        {c.backlinksCount.toLocaleString()}
                      </td>
                      <td className="p-3.5 font-mono text-gray-500 text-[11px] whitespace-nowrap">
                        {c.dateAdded}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onToggleArchiveCompetitor && (
                            <button
                              onClick={() => onToggleArchiveCompetitor(c.id)}
                              className={`p-1.5 rounded transition-colors ${
                                c.archived
                                  ? "text-green-700 hover:bg-green-100"
                                  : "text-gray-400 hover:text-amber-700 hover:bg-amber-50"
                              }`}
                              title={c.archived ? "Restore to active benchmarking" : "Archive competitor record"}
                            >
                              {c.archived ? (
                                <ArchiveRestore className="w-3.5 h-3.5" />
                              ) : (
                                <Archive className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteCompetitor(c.id)}
                            className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete competitor record permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Website Analysis */}
      {activeAuditTab === "website" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#004d00]" />
              Website Health & Architecture Checklist
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 flex items-center justify-between">
                <span>SSL / HTTPS Encryption Verification</span>
                <span className="text-[#004d00] font-bold">100% Secure</span>
              </div>
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 flex items-center justify-between">
                <span>Robots.txt & XML Sitemap Indexing</span>
                <span className="text-[#004d00] font-bold">Valid & Live</span>
              </div>
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 flex items-center justify-between">
                <span>Mobile Responsive Breakpoint Scaling</span>
                <span className="text-[#004d00] font-bold">Pass (Score 98)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 flex items-center justify-between">
                <span>404 Error & Broken Link Audit</span>
                <span className="text-[#004d00] font-bold">0 Broken Links</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ffa500]" />
              Crawl Budget & Indexation Efficiency
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span>Total Indexed URLs</span>
                <span className="font-bold text-gray-900 font-mono">1,420 URLs</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span>Server Response Time (TTFB)</span>
                <span className="font-bold text-[#004d00] font-mono">180ms</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span>Canonical Tag Integrity</span>
                <span className="font-bold text-[#004d00]">100% Unique</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Backlinks Analysis */}
      {activeAuditTab === "backlinks" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="text-xs text-gray-500 font-semibold">Total Active Backlinks</div>
            <div className="text-3xl font-bold text-[#004d00] mt-1">42,850</div>
            <div className="text-[10px] text-green-700 font-bold mt-0.5">+1,240 this quarter</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="text-xs text-gray-500 font-semibold">Referring Domains</div>
            <div className="text-3xl font-bold text-orange-600 mt-1">840</div>
            <div className="text-[10px] text-amber-800 font-bold mt-0.5">High Topical Authority</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="text-xs text-gray-500 font-semibold">Spam Score Rating</div>
            <div className="text-3xl font-bold text-[#004d00] mt-1">1% (Clean)</div>
            <div className="text-[10px] text-green-700 font-bold mt-0.5">Zero Penalties</div>
          </div>
        </div>
      )}

      {/* Tab 4: GA4 Setup & Conversion Tracking */}
      {activeAuditTab === "analytics" && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#004d00]" />
            Google Analytics 4 & Custom Conversion Tracking Status
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 space-y-1">
              <div className="font-bold text-green-950 flex items-center justify-between">
                <span>GA4 Measurement Stream: G-AISEO2026</span>
                <span className="text-[#004d00] font-bold">Active & Streaming</span>
              </div>
              <p className="text-gray-600 text-[11px]">
                Tracks real-time scroll depth, button clicks, video plays, and form completions.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-green-50 border border-green-200 space-y-1">
              <div className="font-bold text-green-950 flex items-center justify-between">
                <span>Custom High-Intent Conversions</span>
                <span className="text-[#004d00] font-bold">4 Goals Configured</span>
              </div>
              <p className="text-gray-600 text-[11px]">
                Calculates customer acquisition cost, conversion value, and multi-touch organic attribution.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
