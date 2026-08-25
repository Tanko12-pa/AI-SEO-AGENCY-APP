import React from "react";
import { X, Printer, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { KeywordItem, CompetitorItem, ContentPieceItem, LocalCitationItem } from "../types";

interface PrintableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  keywords: KeywordItem[];
  competitors: CompetitorItem[];
  contentPieces: ContentPieceItem[];
  citations: LocalCitationItem[];
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  isOpen,
  onClose,
  keywords,
  competitors,
  contentPieces,
  citations,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="printable-report-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="printable-report-modal"
        className="bg-white w-full max-w-4xl rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Action Header (Hidden in Print mode via CSS) */}
        <div className="bg-[#004d00] text-white px-6 py-4 flex items-center justify-between border-b border-[#003300] print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ffa500]" />
            <div>
              <h3 className="text-sm font-bold">Executive PDF Report & Print Snapshot</h3>
              <p className="text-[11px] text-green-100">
                Formatted printable document containing the current snapshot of all dashboard metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs transition-all shadow"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md bg-[#003300] hover:bg-[#002800] text-green-100 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div
          id="formatted-printable-document"
          className="p-8 overflow-y-auto space-y-6 text-gray-900 bg-white"
        >
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-[#004d00] pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#004d00] font-black text-xl tracking-tight">
                <span className="w-7 h-7 rounded bg-[#004d00] text-[#ffa500] flex items-center justify-center text-xs font-bold">
                  AI
                </span>
                AI-POWERED SEO AGENCY
              </div>
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-widest mt-1">
                Official Client Performance & Algorithm Intelligence Report
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Prepared For: <strong className="text-gray-800">Apex HealthTech & Enterprise SaaS</strong>
              </div>
            </div>

            <div className="text-right text-xs text-gray-500 space-y-1">
              <div><strong>Report Date:</strong> August 24, 2026</div>
              <div><strong>Audit Cycle:</strong> 2026 Q3 SGE & AI Overviews Sync</div>
              <div><strong>Status:</strong> <span className="text-[#004d00] font-bold">Verified & Active</span></div>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#004d00] mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#ffa500]" />
              1. Core Search Performance Metrics
            </h4>
            <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div>
                <div className="text-xs text-gray-500 font-medium">Monthly Organic Traffic</div>
                <div className="text-xl font-bold text-[#004d00] mt-1">148,650</div>
                <div className="text-[10px] text-green-700 font-bold">+34.2% YoY</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">35 Target Keywords</div>
                <div className="text-xl font-bold text-[#004d00] mt-1">28 in Top 3</div>
                <div className="text-[10px] text-amber-800 font-bold">100% in Top 10</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Google AI Overviews Rate</div>
                <div className="text-xl font-bold text-orange-600 mt-1">94.2%</div>
                <div className="text-[10px] text-green-700 font-bold">Snippet Citation #1</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">EEAT Trust Index</div>
                <div className="text-xl font-bold text-[#004d00] mt-1">96 / 100</div>
                <div className="text-[10px] text-green-700 font-bold">Grade A+ (Verified)</div>
              </div>
            </div>
          </div>

          {/* Top 10 Target Keywords Snapshot */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#004d00] mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#ffa500]" />
              2. Target Keywords Ranking Snapshot (Sample of 35 Total)
            </h4>
            <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-[11px] border-b border-gray-200">
                <tr>
                  <th className="p-2.5 font-semibold">Keyword</th>
                  <th className="p-2.5 font-semibold">Monthly Volume</th>
                  <th className="p-2.5 font-semibold">Search Intent</th>
                  <th className="p-2.5 font-semibold">Current Rank</th>
                  <th className="p-2.5 font-semibold">AI Overview %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {keywords.slice(0, 8).map((k) => (
                  <tr key={k.id}>
                    <td className="p-2.5 font-semibold text-gray-900">{k.keyword}</td>
                    <td className="p-2.5 font-mono">{k.searchVolume.toLocaleString()}</td>
                    <td className="p-2.5">{k.intent}</td>
                    <td className="p-2.5 font-bold text-[#004d00]">#{k.currentRank}</td>
                    <td className="p-2.5 font-mono text-amber-700">{k.aiOverviewProbability}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 10 Competitors Benchmark Snapshot */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#004d00] mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#ffa500]" />
              3. 10-Competitor Domain Authority & Overlap Matrix
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {competitors.slice(0, 10).map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg border border-gray-200 text-center text-xs bg-gray-50">
                  <div className="font-bold text-gray-900 truncate">{c.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{c.domain}</div>
                  <div className="mt-1 font-bold text-[#004d00]">DA {c.domainAuthority}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Overview (18 Content Pieces & 7 Citations) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
              <h5 className="text-xs font-bold text-[#004d00] uppercase">18 Content Deliverables</h5>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• 4 Comprehensive Blog Posts (100% indexed)</div>
                <div>• 4 High-Authority Guest Blogs (Acquired)</div>
                <div>• 8 Informational Pieces with 45-word SGE blocks</div>
                <div>• 2 National Press Releases (Distributed)</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
              <h5 className="text-xs font-bold text-[#004d00] uppercase">7 Profiles & Citations</h5>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• Google Business Profile (Map Pack Rank #1)</div>
                <div>• 7 Industry Directory Authority Citations</div>
                <div>• 100% NAP Consistency Verified</div>
                <div>• Community Q&A Seed Campaign Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
