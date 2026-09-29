import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Activity,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Filter,
  Plus,
  ArrowUpRight,
  Sparkles,
  Loader2,
  Bot,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CampaignLogItem } from "../types";
import {
  executeCampaignOptimizer,
  CampaignOptimizerResponse,
} from "../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
  ReferenceLine,
  Brush,
} from "recharts";

interface CampaignImpactTrendChartProps {
  campaignLogs: CampaignLogItem[];
  onOpenAddModal?: () => void;
}

// Parse string impact score into numeric point value
export function parseImpactScore(scoreStr: string | undefined): number {
  if (!scoreStr) return 2.0;
  const cleaned = scoreStr.trim().replace("+", "").replace("%", "");
  const num = parseFloat(cleaned);
  if (!isNaN(num)) return num;

  const lower = scoreStr.toLowerCase();
  if (lower.includes("audit") || lower.includes("verified")) return 4.0;
  if (lower.includes("optim") || lower.includes("pass")) return 5.5;
  if (lower.includes("critical") || lower.includes("major")) return 8.0;
  return 3.0;
}

export const CampaignImpactTrendChart: React.FC<CampaignImpactTrendChartProps> = ({
  campaignLogs,
  onOpenAddModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMetric, setViewMetric] = useState<"both" | "event" | "cumulative">("both");
  const [hoveredEventIndex, setHoveredEventIndex] = useState<number | null>(null);

  // AI Strategic Campaign Forecast States
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiForecast, setAiForecast] = useState<CampaignOptimizerResponse | null>(null);
  const [showAiForecast, setShowAiForecast] = useState(false);

  const handleRunAiOptimizer = async () => {
    if (aiForecast) {
      setShowAiForecast(!showAiForecast);
      return;
    }
    setIsAnalyzingAi(true);
    try {
      const res = await executeCampaignOptimizer(campaignLogs, "~148k visits/mo", "+25% organic growth");
      if (res) {
        setAiForecast(res);
        setShowAiForecast(true);
      }
    } catch (err) {
      console.error("AI campaign forecast error:", err);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Extract all categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    campaignLogs.forEach((l) => {
      if (l.category) set.add(l.category);
    });
    return ["All", ...Array.from(set)];
  }, [campaignLogs]);

  // Compute chronologically sorted and cumulative aggregate growth
  const chartData = useMemo(() => {
    // Clone and sort chronologically (oldest to newest)
    const sorted = [...campaignLogs].sort((a, b) => {
      const timeA = new Date(a.timestamp ? a.timestamp.replace(" ", "T") : "").getTime();
      const timeB = new Date(b.timestamp ? b.timestamp.replace(" ", "T") : "").getTime();
      if (!isNaN(timeA) && !isNaN(timeB)) return timeA - timeB;
      return a.id.localeCompare(b.id);
    });

    let runningAggregate = 0;
    return sorted.map((log, index) => {
      const incrementalImpact = parseImpactScore(log.impactScore);
      runningAggregate += incrementalImpact;

      // Extract short readable time/date label
      let dateLabel = log.timestamp;
      try {
        const iso = log.timestamp ? log.timestamp.replace(" ", "T") : "";
        const d = new Date(iso);
        if (!isNaN(d.getTime())) {
          dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
      } catch {
        dateLabel = `Event ${index + 1}`;
      }

      return {
        id: log.id,
        index: index + 1,
        fullTimestamp: log.timestamp,
        dateLabel,
        category: log.category,
        event: log.event,
        rawImpact: log.impactScore,
        incrementalImpact,
        cumulativeImpact: parseFloat(runningAggregate.toFixed(2)),
        user: log.user,
      };
    });
  }, [campaignLogs]);

  // Filtered timeline data
  const filteredData = useMemo(() => {
    if (selectedCategory === "All") return chartData;
    return chartData.filter((d) => d.category === selectedCategory);
  }, [chartData, selectedCategory]);

  // Key KPI stats
  const totalAggregateScore = chartData.length > 0 ? chartData[chartData.length - 1].cumulativeImpact : 0;
  const avgLiftPerEvent = chartData.length > 0 ? (totalAggregateScore / chartData.length).toFixed(1) : "0";
  const highestEvent = chartData.reduce(
    (max, cur) => (cur.incrementalImpact > max.incrementalImpact ? cur : max),
    chartData[0] || { incrementalImpact: 0, event: "None" }
  );

  // Category breakdown totals
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    chartData.forEach((d) => {
      map[d.category] = (map[d.category] || 0) + d.incrementalImpact;
    });
    return Object.entries(map).map(([cat, total]) => ({
      category: cat,
      total: parseFloat(total.toFixed(1)),
      pct: totalAggregateScore > 0 ? Math.round((total / totalAggregateScore) * 100) : 0,
    }));
  }, [chartData, totalAggregateScore]);

  // Category color mapping
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "algorithm":
        return "#004d00"; // Primary Forest Green
      case "on-page":
        return "#059669"; // Emerald
      case "link-building":
        return "#2563eb"; // Blue
      case "content":
        return "#7c3aed"; // Purple
      case "a2a":
        return "#ffa500"; // Amber Accent
      case "audit":
      default:
        return "#0d9488"; // Teal
    }
  };

  return (
    <div
      id="campaign-impact-trend-chart-container"
      className="bg-white dark:bg-[#0b170b] rounded-2xl p-5 md:p-6 border border-gray-200 dark:border-[#163016] shadow-sm space-y-5 transition-colors"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-green-950/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#004d00]/40 text-[#004d00] dark:text-[#ffa500] border border-emerald-100 dark:border-green-900/50">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Campaign Progress: Historical Aggregate Impact Score Growth
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                Cumulative ROI
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Chronological trajectory of compound SEO optimizations, algorithm adaptations, and link milestones.
            </p>
          </div>
        </div>

        {/* Action & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Metric View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 dark:border-green-950/80 bg-gray-50 dark:bg-[#060e06] p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMetric("both")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMetric === "both"
                  ? "bg-[#004d00] text-white shadow-xs font-bold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
              title="Visualize both Event Impact Scores and Cumulative Aggregate trajectory"
            >
              Dual Trends
            </button>
            <button
              type="button"
              onClick={() => setViewMetric("event")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMetric === "event"
                  ? "bg-[#ffa500] text-slate-950 shadow-xs font-bold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
              title="Show individual Event Impact Scores over time"
            >
              Event Impact
            </button>
            <button
              type="button"
              onClick={() => setViewMetric("cumulative")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMetric === "cumulative"
                  ? "bg-[#004d00] text-white shadow-xs font-bold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
              title="Show cumulative total growth trajectory"
            >
              Cumulative
            </button>
          </div>

          <div className="relative">
            <select
              id="impact-category-filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter campaign impact trend by category"
              className="text-xs bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950/80 rounded-lg px-3 py-1.5 font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Categories" : `${c} Events`}
                </option>
              ))}
            </select>
          </div>

          <button
            id="ai-campaign-forecast-btn"
            type="button"
            onClick={handleRunAiOptimizer}
            disabled={isAnalyzingAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004d00] hover:bg-[#003d00] text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Analyze Impact Score trends and generate next-action forecast using Gemini 3.8 Flash"
          >
            {isAnalyzingAi ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffa500]" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#ffa500]" />
            )}
            <span>{isAnalyzingAi ? "Analyzing..." : showAiForecast ? "Hide AI Forecast" : "AI Strategic Forecast"}</span>
          </button>

          {onOpenAddModal && (
            <button
              id="impact-chart-add-event-btn"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Event</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Strategic Forecast & Next-Best Action Panel */}
      {showAiForecast && aiForecast && (
        <div
          id="ai-campaign-forecast-panel"
          className="bg-gradient-to-br from-emerald-950 via-[#002b00] to-slate-950 text-white rounded-2xl p-5 border border-emerald-500/40 shadow-xl space-y-4 animate-in slide-in-from-top-3 duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-900/60 text-[#ffa500] border border-emerald-700/50">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Gemini 3.8 Flash Strategic Impact Forecast</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-400/20 text-[#ffa500] font-bold border border-amber-400/30">
                    Velocity Score: {aiForecast.velocityScore}/100
                  </span>
                </h4>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  {aiForecast.performanceSummary}
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
                Predicted 45-Day Compound Lift
              </span>
              <span className="text-lg font-black text-[#ffa500] font-mono">
                {aiForecast.predictedCompoundLift}
              </span>
            </div>
          </div>

          {/* Recommended Next Actions Grid */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center justify-between">
              <span>Top 3 Prioritized Next Actions (Ranked by Historical Impact ROI)</span>
              <span className="text-[10px] text-gray-400 font-normal">Primary Pillar: <strong>{aiForecast.topPillar}</strong></span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiForecast.recommendedNextActions.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-900/30 rounded-xl p-3.5 border border-emerald-700/40 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#004d00] text-emerald-200 border border-emerald-600/50">
                      {rec.category} • {rec.priority}
                    </span>
                    <span className="font-mono font-black text-[#ffa500]">
                      Est. {rec.expectedImpactScore}
                    </span>
                  </div>
                  <p className="font-bold text-white text-xs leading-snug">
                    {rec.action}
                  </p>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed border-t border-emerald-800/40 pt-1.5">
                    {rec.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-emerald-50/70 to-white dark:from-[#002b00]/40 dark:to-[#060e06] p-3.5 rounded-xl border border-emerald-200/60 dark:border-green-950/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
            Total Aggregate Impact
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-gray-900 dark:text-white font-mono">
              +{totalAggregateScore.toFixed(1)}%
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Compound Lift
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#060e06] p-3.5 rounded-xl border border-gray-100 dark:border-green-950/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Logged SEO Events
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-gray-900 dark:text-white font-mono">
              {campaignLogs.length}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">milestones</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#060e06] p-3.5 rounded-xl border border-gray-100 dark:border-green-950/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Avg Lift Per Event
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-[#ffa500] font-mono">
              +{avgLiftPerEvent}%
            </span>
            <span className="text-[10px] text-gray-500 font-medium">per sprint</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#060e06] p-3.5 rounded-xl border border-gray-100 dark:border-green-950/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Top Single Optimization
          </span>
          <div className="text-xs font-bold text-gray-900 dark:text-white truncate mt-1" title={highestEvent.event}>
            {highestEvent.category ? `[${highestEvent.category}] ` : ""}+{highestEvent.incrementalImpact}%
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
            {highestEvent.event}
          </p>
        </div>
      </div>

      {/* Main Recharts Cumulative Line Chart */}
      <div className="bg-gray-50/60 dark:bg-[#060e06]/60 p-4 md:p-5 rounded-xl border border-gray-200 dark:border-[#163016] space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-[#004d00] dark:text-[#ffa500]">
              <span className="w-3 h-3 rounded-full bg-[#004d00] dark:bg-[#ffa500] inline-block" />
              Cumulative Impact Growth Curve
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-gray-400">
              <span>(Hover any node to inspect execution details)</span>
            </span>
          </div>
          <div className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
            Target Pace: +15.0% / month
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
              onMouseMove={(state) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  setHoveredEventIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredEventIndex(null)}
            >
              <defs>
                <linearGradient id="impactLineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004d00" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#004d00" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 10, fill: "#64748b" }}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                domain={[0, "auto"]}
                tickFormatter={(val) => `+${val}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#002b00] text-white p-3.5 rounded-xl shadow-2xl border border-emerald-600/50 text-xs space-y-2 max-w-xs animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-emerald-800 pb-1.5">
                          <span className="font-bold text-[#ffa500] flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" />
                            {data.category} Event
                          </span>
                          <span className="text-[10px] font-mono bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300">
                            {data.dateLabel}
                          </span>
                        </div>

                        <p className="text-gray-200 text-xs leading-snug">
                          {data.event}
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-800/60 text-[11px]">
                          <div>
                            <span className="text-emerald-300/80 block">Event Lift:</span>
                            <strong className="text-[#ffa500] font-mono text-xs">
                              +{data.incrementalImpact}%
                            </strong>
                          </div>
                          <div>
                            <span className="text-emerald-300/80 block">Cumulative Score:</span>
                            <strong className="text-emerald-300 font-mono text-xs">
                              +{data.cumulativeImpact}%
                            </strong>
                          </div>
                        </div>

                        <div className="text-[10px] text-gray-400 pt-0.5">
                          Executor: <span className="text-gray-300">{data.user}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={20} stroke="#ffa500" strokeDasharray="3 3" label={{ value: "Milestone: +20% Lift", fill: "#ffa500", fontSize: 10, position: "insideTopRight" }} />
              
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: "11px", paddingBottom: "8px" }}
              />

              {/* Event Impact Score Line */}
              {(viewMetric === "both" || viewMetric === "event") && (
                <Line
                  type="monotone"
                  dataKey="incrementalImpact"
                  name="Event Impact Score (% Lift)"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  dot={{
                    r: 4.5,
                    fill: "#d97706",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#ea580c",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              )}

              {/* Cumulative Compound Impact Score Line */}
              {(viewMetric === "both" || viewMetric === "cumulative") && (
                <Line
                  type="monotone"
                  dataKey="cumulativeImpact"
                  name="Cumulative Impact Score (%)"
                  stroke="#004d00"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#004d00",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#ffa500",
                    stroke: "#ffffff",
                    strokeWidth: 3,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown & Distribution Pills */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Impact Contribution by Strategy Pillar
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {categoryTotals.map((item) => (
            <div
              key={item.category}
              onClick={() => setSelectedCategory(selectedCategory === item.category ? "All" : item.category)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedCategory === item.category
                  ? "bg-[#004d00]/10 dark:bg-[#004d00]/30 border-[#004d00] dark:border-[#ffa500] ring-1 ring-[#004d00] dark:ring-[#ffa500]"
                  : "bg-gray-50 dark:bg-[#060e06] border-gray-200 dark:border-green-950/60 hover:bg-gray-100 dark:hover:bg-[#163016]"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 dark:text-gray-200">
                <span className="truncate">{item.category}</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-[#ffa500]">
                  {item.pct}%
                </span>
              </div>
              <div className="text-sm font-black text-gray-900 dark:text-white font-mono mt-0.5">
                +{item.total}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
