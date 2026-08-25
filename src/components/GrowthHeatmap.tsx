import React, { useState } from "react";
import {
  Calendar,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Info,
  ChevronRight,
  Activity,
  Layers,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
} from "recharts";

export interface AlgorithmUpdatePin {
  id: string;
  monthKey: string;
  date: string;
  name: string;
  type: "core" | "helpful_content" | "ai_overviews" | "spam_links";
  severity: "high" | "critical" | "moderate";
  impactOnBrand: string;
  brandOrganicTraffic: number;
  description: string;
  strategyAdjustment: string;
}

export interface MonthlyTrafficHeatmapCell {
  month: string;
  shortMonth: string;
  year: number;
  traffic: number;
  growthPct: number; // e.g. +14.2%
  aiOverviewSessions: number;
  eeatScore: number;
  intensity: number; // 1 to 5 scale
  algorithmUpdate?: AlgorithmUpdatePin;
}

export const ALGORITHM_UPDATE_PINS: AlgorithmUpdatePin[] = [
  {
    id: "algo-1",
    monthKey: "Oct 2025",
    date: "2025-10-18",
    name: "Spam & Link Graph Algorithmic Overhaul",
    type: "spam_links",
    severity: "high",
    impactOnBrand: "+18% Lift",
    brandOrganicTraffic: 48500,
    description: "Neutralized low-quality PBNs across competitors; high-authority citations surged.",
    strategyAdjustment: "Consolidated Tier-1 business profile directories and verified entity schema.",
  },
  {
    id: "algo-2",
    monthKey: "Dec 2025",
    date: "2025-12-14",
    name: "Helpful Content & First-Hand EEAT Update",
    type: "helpful_content",
    severity: "critical",
    impactOnBrand: "+22% Gain",
    brandOrganicTraffic: 61200,
    description: "Google algorithm began heavily rewarding explicit practitioner bylines and verified author credentials.",
    strategyAdjustment: "Introduced verified author schema markup and practitioner case studies.",
  },
  {
    id: "algo-3",
    monthKey: "Feb 2026",
    date: "2026-02-20",
    name: "Google SGE & Multimodal AI Search Rollout",
    type: "ai_overviews",
    severity: "critical",
    impactOnBrand: "+41% SGE Surge",
    brandOrganicTraffic: 76400,
    description: "AI Overviews expanded to 40%+ commercial and informational query terms.",
    strategyAdjustment: "Formatted all target blog posts with 45-word concise answer boxes.",
  },
  {
    id: "algo-4",
    monthKey: "May 2026",
    date: "2026-05-11",
    name: "May 2026 Broad Core Algorithm Update",
    type: "core",
    severity: "high",
    impactOnBrand: "+34% Surge",
    brandOrganicTraffic: 112000,
    description: "Holistic quality evaluation factoring site-wide page speed, CLS, and contextual topical authority.",
    strategyAdjustment: "Optimized server response times to <180ms and cleared all CWV bottlenecks.",
  },
  {
    id: "algo-5",
    monthKey: "Aug 2026",
    date: "2026-08-15",
    name: "August 2026 Search & Agent Grounding Core",
    type: "core",
    severity: "critical",
    impactOnBrand: "+26% Surge",
    brandOrganicTraffic: 148650,
    description: "Google's live grounding agent directly indexing semantic entity graphs and structured FAQ nodes.",
    strategyAdjustment: "Continuous A2A prompt benchmarking and real-time Google Trends synchronization.",
  },
];

export const MONTHLY_HEATMAP_DATA: MonthlyTrafficHeatmapCell[] = [
  {
    month: "Sep 2025",
    shortMonth: "Sep '25",
    year: 2025,
    traffic: 39500,
    growthPct: 6.4,
    aiOverviewSessions: 3200,
    eeatScore: 78,
    intensity: 1,
  },
  {
    month: "Oct 2025",
    shortMonth: "Oct '25",
    year: 2025,
    traffic: 48500,
    growthPct: 22.8,
    aiOverviewSessions: 5800,
    eeatScore: 82,
    intensity: 2,
    algorithmUpdate: ALGORITHM_UPDATE_PINS[0],
  },
  {
    month: "Nov 2025",
    shortMonth: "Nov '25",
    year: 2025,
    traffic: 53400,
    growthPct: 10.1,
    aiOverviewSessions: 7900,
    eeatScore: 84,
    intensity: 2,
  },
  {
    month: "Dec 2025",
    shortMonth: "Dec '25",
    year: 2025,
    traffic: 61200,
    growthPct: 14.6,
    aiOverviewSessions: 9800,
    eeatScore: 87,
    intensity: 3,
    algorithmUpdate: ALGORITHM_UPDATE_PINS[1],
  },
  {
    month: "Jan 2026",
    shortMonth: "Jan '26",
    year: 2026,
    traffic: 68900,
    growthPct: 12.5,
    aiOverviewSessions: 11400,
    eeatScore: 89,
    intensity: 3,
  },
  {
    month: "Feb 2026",
    shortMonth: "Feb '26",
    year: 2026,
    traffic: 76400,
    growthPct: 10.9,
    aiOverviewSessions: 18600,
    eeatScore: 91,
    intensity: 4,
    algorithmUpdate: ALGORITHM_UPDATE_PINS[2],
  },
  {
    month: "Mar 2026",
    shortMonth: "Mar '26",
    year: 2026,
    traffic: 82000,
    growthPct: 7.3,
    aiOverviewSessions: 22400,
    eeatScore: 92,
    intensity: 4,
  },
  {
    month: "Apr 2026",
    shortMonth: "Apr '26",
    year: 2026,
    traffic: 96000,
    growthPct: 17.1,
    aiOverviewSessions: 34000,
    eeatScore: 94,
    intensity: 4,
  },
  {
    month: "May 2026",
    shortMonth: "May '26",
    year: 2026,
    traffic: 112000,
    growthPct: 16.7,
    aiOverviewSessions: 51000,
    eeatScore: 95,
    intensity: 5,
    algorithmUpdate: ALGORITHM_UPDATE_PINS[3],
  },
  {
    month: "Jun 2026",
    shortMonth: "Jun '26",
    year: 2026,
    traffic: 124000,
    growthPct: 10.7,
    aiOverviewSessions: 68000,
    eeatScore: 96,
    intensity: 5,
  },
  {
    month: "Jul 2026",
    shortMonth: "Jul '26",
    year: 2026,
    traffic: 135000,
    growthPct: 8.9,
    aiOverviewSessions: 92000,
    eeatScore: 97,
    intensity: 5,
  },
  {
    month: "Aug 2026",
    shortMonth: "Aug '26",
    year: 2026,
    traffic: 148650,
    growthPct: 10.1,
    aiOverviewSessions: 118400,
    eeatScore: 98,
    intensity: 5,
    algorithmUpdate: ALGORITHM_UPDATE_PINS[4],
  },
];

export const GrowthHeatmap: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<MonthlyTrafficHeatmapCell>(
    MONTHLY_HEATMAP_DATA[MONTHLY_HEATMAP_DATA.length - 1]
  );
  const [activeViewMode, setActiveViewMode] = useState<"heatmap" | "chart">("heatmap");

  // Intensity color mapper (Deep forest green palette matching brand)
  const getIntensityColor = (intensity: number, hasUpdate: boolean) => {
    switch (intensity) {
      case 5:
        return "bg-[#004d00] text-white border-green-800";
      case 4:
        return "bg-[#0a660a] text-white border-green-700";
      case 3:
        return "bg-[#168516] text-white border-green-600";
      case 2:
        return "bg-[#2ea32e] text-white border-green-500";
      default:
        return "bg-[#64b864] text-slate-900 border-green-400";
    }
  };

  return (
    <div id="growth-heatmap-module" className="bg-white dark:bg-[#0b170b] rounded-xl p-5 border border-gray-200 dark:border-[#163016] shadow-sm space-y-5">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#163016] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#004d00] dark:text-[#ffa500]" />
              Historical Organic Traffic Growth Heatmap & Google Algorithm Impact Matrix
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-[#004d00] dark:text-green-300 font-extrabold text-[10px]">
              12-Month Historical
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Color-intensity mapped monthly organic sessions correlated directly against verified Google Core, EEAT, and SGE update milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-gray-100 dark:bg-[#122412] p-0.5 rounded-lg border border-gray-200 dark:border-[#1e461e] text-xs">
            <button
              onClick={() => setActiveViewMode("heatmap")}
              className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeViewMode === "heatmap"
                  ? "bg-[#004d00] text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grid Heatmap</span>
            </button>
            <button
              onClick={() => setActiveViewMode("chart")}
              className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeViewMode === "chart"
                  ? "bg-[#004d00] text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Timeline Overlay</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016]">
          <span className="text-[10px] uppercase font-bold text-gray-400 block font-mono">12-Mo Net Growth</span>
          <span className="text-base font-extrabold text-[#004d00] dark:text-[#ffa500] font-mono">+276.3%</span>
          <span className="text-[10px] text-green-600 dark:text-green-400 block mt-0.5">39.5k → 148.6k sessions</span>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016]">
          <span className="text-[10px] uppercase font-bold text-gray-400 block font-mono">Algorithm Resilience</span>
          <span className="text-base font-extrabold text-green-600 font-mono">100% Positive</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">5/5 updates yielded gains</span>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016]">
          <span className="text-[10px] uppercase font-bold text-gray-400 block font-mono">AI Overviews Capture</span>
          <span className="text-base font-extrabold text-[#ffa500] font-mono">118,400 / mo</span>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-0.5">79.6% of total traffic</span>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016]">
          <span className="text-[10px] uppercase font-bold text-gray-400 block font-mono">Current EEAT Score</span>
          <span className="text-base font-extrabold text-gray-900 dark:text-white font-mono">98 / 100</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">High Author Integrity</span>
        </div>
      </div>

      {activeViewMode === "heatmap" ? (
        /* Heatmap Grid View */
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {MONTHLY_HEATMAP_DATA.map((item) => {
              const isSelected = selectedMonth.month === item.month;
              const hasUpdate = !!item.algorithmUpdate;

              return (
                <div
                  key={item.month}
                  onClick={() => setSelectedMonth(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "ring-2 ring-[#ffa500] shadow-md border-[#004d00] scale-[1.02] bg-white dark:bg-[#122412]"
                      : "hover:border-[#004d00] bg-white dark:bg-[#060e06] border-gray-200 dark:border-[#163016]"
                  }`}
                >
                  {/* Top Heat Badge */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-bold text-xs text-gray-900 dark:text-white">{item.shortMonth}</span>
                    {hasUpdate && (
                      <span
                        className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-0.5 shadow-xs"
                        title={item.algorithmUpdate?.name}
                      >
                        <Flame className="w-2.5 h-2.5" />
                        Algo Update
                      </span>
                    )}
                  </div>

                  {/* Visual Heat Block */}
                  <div
                    className={`h-10 rounded-lg flex items-center justify-center p-2 mb-2 font-mono font-bold text-xs shadow-inner ${getIntensityColor(
                      item.intensity,
                      hasUpdate
                    )}`}
                  >
                    <span>{(item.traffic / 1000).toFixed(1)}k</span>
                  </div>

                  {/* Growth & AI info */}
                  <div className="space-y-0.5 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Growth:</span>
                      <span className="font-bold text-green-600">+{item.growthPct}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">AI SGE:</span>
                      <span className="font-mono text-[#004d00] dark:text-[#ffa500]">
                        {(item.aiOverviewSessions / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>

                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ffa500]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Heatmap Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500 dark:text-gray-400 p-2.5 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">Traffic Density:</span>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-[#64b864] text-[8px] text-center font-bold text-white leading-4">L1</span>
                <span className="w-4 h-4 rounded bg-[#2ea32e] text-[8px] text-center font-bold text-white leading-4">L2</span>
                <span className="w-4 h-4 rounded bg-[#168516] text-[8px] text-center font-bold text-white leading-4">L3</span>
                <span className="w-4 h-4 rounded bg-[#0a660a] text-[8px] text-center font-bold text-white leading-4">L4</span>
                <span className="w-4 h-4 rounded bg-[#004d00] text-[8px] text-center font-bold text-white leading-4">L5</span>
              </div>
              <span className="text-[10px] text-gray-400">(Low to Peak Volume)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Verified Google Update Pin</span>
              </span>
              <span className="text-[10px] font-mono">Click any month cell for deep-dive briefing</span>
            </div>
          </div>
        </div>
      ) : (
        /* Recharts Timeline Overlay with Algorithm Reference Pins */
        <div className="space-y-4">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MONTHLY_HEATMAP_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="heatmapOrganicGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004d00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#004d00" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="heatmapAiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffa500" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ffa500" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                <XAxis dataKey="shortMonth" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b170b",
                    border: "1px solid #163016",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: any) => {
                    if (name === "Total Organic") return [`${Number(value).toLocaleString()} visits`, "Monthly Organic Traffic"];
                    if (name === "AI Overviews SGE") return [`${Number(value).toLocaleString()} sessions`, "AI Overviews Citations"];
                    return [value, name];
                  }}
                />

                {/* Algorithm reference lines */}
                <ReferenceLine x="Oct '25" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Spam Overhaul", fill: "#d97706", fontSize: 10 }} />
                <ReferenceLine x="Dec '25" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "EEAT Update", fill: "#d97706", fontSize: 10 }} />
                <ReferenceLine x="Feb '26" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "SGE Rollout", fill: "#d97706", fontSize: 10 }} />
                <ReferenceLine x="May '26" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "May Core", fill: "#d97706", fontSize: 10 }} />
                <ReferenceLine x="Aug '26" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Aug Core", fill: "#d97706", fontSize: 10 }} />

                <Area
                  type="monotone"
                  dataKey="traffic"
                  name="Total Organic"
                  stroke="#004d00"
                  strokeWidth={2.5}
                  fill="url(#heatmapOrganicGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="aiOverviewSessions"
                  name="AI Overviews SGE"
                  stroke="#ffa500"
                  strokeWidth={2.5}
                  fill="url(#heatmapAiGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="eeatScore"
                  name="EEAT Index"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  dot={{ r: 3, fill: "#10b981" }}
                  yAxisId="right"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[60, 100]}
                  stroke="#10b981"
                  fontSize={10}
                  tickFormatter={(v) => `${v}%`}
                  tickLine={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Deep-Dive Briefing Box for Selected Month / Algorithm Milestone */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 dark:border-[#163016] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#004d00] text-[#ffa500] font-bold text-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                  {selectedMonth.month} Performance & Algorithm Telemetry
                </h4>
                <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-950 text-[#004d00] dark:text-green-300 font-bold text-[10px]">
                  +{selectedMonth.growthPct}% Month-over-Month
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {selectedMonth.algorithmUpdate
                  ? `Correlated with Google's "${selectedMonth.algorithmUpdate.name}"`
                  : "Stable organic optimization baseline period"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <div>
              <span className="text-gray-400 block text-[9px] uppercase font-sans">Organic Traffic</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {selectedMonth.traffic.toLocaleString()} visits
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase font-sans">AI Overviews</span>
              <span className="font-bold text-[#ffa500]">
                {selectedMonth.aiOverviewSessions.toLocaleString()} ({Math.round((selectedMonth.aiOverviewSessions / selectedMonth.traffic) * 100)}%)
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase font-sans">EEAT Score</span>
              <span className="font-bold text-green-600">{selectedMonth.eeatScore} / 100</span>
            </div>
          </div>
        </div>

        {/* Algorithm update detail if present */}
        {selectedMonth.algorithmUpdate ? (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-[#122412] border border-amber-200 dark:border-[#ffa500]/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  {selectedMonth.algorithmUpdate.name}
                </span>
                <span className="font-bold text-xs text-green-700 dark:text-green-400 font-mono">
                  {selectedMonth.algorithmUpdate.impactOnBrand}
                </span>
              </div>
              <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedMonth.algorithmUpdate.description}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-green-50/70 dark:bg-[#0e240e] border border-green-200 dark:border-[#1e461e] space-y-1">
              <span className="font-bold text-[#004d00] dark:text-[#ffa500] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                Proactive Tactical Adjustment Executed
              </span>
              <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedMonth.algorithmUpdate.strategyAdjustment}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#004d00] dark:text-[#ffa500]" />
            <span>Topical authority compound growth achieved through continuous 45-word snippet refinement and backlink citation outreach.</span>
          </div>
        )}
      </div>
    </div>
  );
};
