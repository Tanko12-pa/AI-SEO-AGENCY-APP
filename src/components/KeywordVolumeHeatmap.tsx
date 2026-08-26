import React, { useState, useMemo } from "react";
import {
  Flame,
  TrendingUp,
  Calendar,
  Sparkles,
  BarChart3,
  Search,
  Filter,
  ArrowUpRight,
  Info,
  ChevronRight,
  Zap,
} from "lucide-react";
import { KeywordItem } from "../types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
  Line,
  ComposedChart,
} from "recharts";

interface KeywordVolumeHeatmapProps {
  keywords: KeywordItem[];
  onNavigateToKeywords?: () => void;
}

// Generate realistic deterministic 30-day search volume and traffic trends for each keyword
export function generate30DayTrend(keyword: KeywordItem) {
  const baseVol = keyword.searchVolume || 3000;
  const days: {
    day: number;
    date: string;
    label: string;
    volume: number;
    traffic: number;
    aiOverviews: number;
    intensity: number; // 1 to 5
    changePct: number;
  }[] = [];

  // Seed with deterministic pseudo-random variation based on keyword id hash
  let seed = 0;
  for (let i = 0; i < keyword.id.length; i++) {
    seed += keyword.id.charCodeAt(i);
  }

  const now = new Date("2026-08-26T12:00:00Z");

  for (let d = 29; d >= 0; d--) {
    const dateObj = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const dateStr = dateObj.toISOString().split("T")[0];
    const dayLabel = `Day ${30 - d} (${dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })})`;
    
    // Simulate natural weekday/weekend oscillation and growth trend
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const wave = Math.sin((30 - d + seed) * 0.45) * 0.18;
    const trendLift = ((30 - d) / 30) * 0.22; // overall upward trend
    const noise = Math.sin((30 - d) * 1.7 + seed) * 0.08;
    const weekendDampener = isWeekend ? 0.85 : 1.05;

    const dailyMultiplier = Math.max(0.6, (1 + wave + trendLift + noise) * weekendDampener);
    const dailyVolume = Math.round((baseVol / 30) * dailyMultiplier);
    
    // Rank factor on traffic capture
    const rankFactor = keyword.currentRank <= 3 ? 0.42 : keyword.currentRank <= 10 ? 0.22 : 0.08;
    const dailyTraffic = Math.round(dailyVolume * rankFactor * 1.4);
    
    // AI Overview capture
    const aiShare = (keyword.aiOverviewProbability || 75) / 100;
    const dailyAiTraffic = Math.round(dailyTraffic * (aiShare * 0.55));

    // Calculate intensity 1-5
    const baseDailyAvg = baseVol / 30;
    const ratio = dailyVolume / baseDailyAvg;
    let intensity = 3;
    if (ratio < 0.8) intensity = 1;
    else if (ratio < 0.95) intensity = 2;
    else if (ratio < 1.15) intensity = 3;
    else if (ratio < 1.3) intensity = 4;
    else intensity = 5;

    const changePct = Math.round((dailyMultiplier - 1) * 100);

    days.push({
      day: 30 - d,
      date: dateStr,
      label: dayLabel,
      volume: dailyVolume,
      traffic: dailyTraffic,
      aiOverviews: dailyAiTraffic,
      intensity,
      changePct,
    });
  }

  return days;
}

export const KeywordVolumeHeatmap: React.FC<KeywordVolumeHeatmapProps> = ({
  keywords,
  onNavigateToKeywords,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedKeywordId, setSelectedKeywordId] = useState<string>(
    keywords.length > 0 ? keywords[0].id : "kw-1"
  );
  const [viewMetric, setViewMetric] = useState<"volume" | "traffic" | "aiOverviews">("volume");

  // Extract unique clusters
  const clusters = useMemo(() => {
    const set = new Set<string>();
    keywords.forEach((k) => {
      if (k.cluster) set.add(k.cluster);
    });
    return ["All", ...Array.from(set)];
  }, [keywords]);

  // Filtered keywords
  const filteredKeywords = useMemo(() => {
    return keywords.filter((k) => {
      const matchesCluster = selectedCluster === "All" || k.cluster === selectedCluster;
      const matchesSearch =
        k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (k.cluster && k.cluster.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCluster && matchesSearch;
    });
  }, [keywords, selectedCluster, searchQuery]);

  // Selected keyword object
  const selectedKeyword = useMemo(() => {
    return (
      filteredKeywords.find((k) => k.id === selectedKeywordId) ||
      filteredKeywords[0] ||
      keywords[0]
    );
  }, [filteredKeywords, selectedKeywordId, keywords]);

  // 30-day timeline for selected keyword
  const selected30DayData = useMemo(() => {
    if (!selectedKeyword) return [];
    return generate30DayTrend(selectedKeyword);
  }, [selectedKeyword]);

  // Aggregate stats across filtered keywords
  const aggregateStats = useMemo(() => {
    const totalMonthlyVol = filteredKeywords.reduce((acc, k) => acc + (k.searchVolume || 0), 0);
    const topVolKeyword = [...filteredKeywords].sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0))[0];
    const avgDifficulty = filteredKeywords.length
      ? Math.round(filteredKeywords.reduce((acc, k) => acc + (k.difficulty || 0), 0) / filteredKeywords.length)
      : 0;
    const avgAiProb = filteredKeywords.length
      ? Math.round(filteredKeywords.reduce((acc, k) => acc + (k.aiOverviewProbability || 0), 0) / filteredKeywords.length)
      : 0;

    return {
      totalMonthlyVol,
      topVolKeyword,
      avgDifficulty,
      avgAiProb,
    };
  }, [filteredKeywords]);

  // Heatmap rows for top 12 keywords in filtered list
  const heatmapRows = useMemo(() => {
    const list = filteredKeywords.slice(0, 12);
    return list.map((kw) => {
      const days = generate30DayTrend(kw);
      const totalVol30d = days.reduce((sum, d) => sum + d.volume, 0);
      const totalTraffic30d = days.reduce((sum, d) => sum + d.traffic, 0);
      const totalAi30d = days.reduce((sum, d) => sum + d.aiOverviews, 0);
      return {
        keyword: kw,
        days,
        totalVol30d,
        totalTraffic30d,
        totalAi30d,
      };
    });
  }, [filteredKeywords]);

  // Color mapper for intensity 1 to 5
  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 5:
        return "bg-[#004d00] text-emerald-100 hover:ring-2 hover:ring-[#ffa500]";
      case 4:
        return "bg-[#007000] text-emerald-100 hover:ring-2 hover:ring-[#ffa500]";
      case 3:
        return "bg-emerald-600/80 text-white hover:ring-2 hover:ring-[#ffa500]";
      case 2:
        return "bg-emerald-500/50 text-slate-900 hover:ring-2 hover:ring-[#ffa500]";
      case 1:
      default:
        return "bg-emerald-100 dark:bg-emerald-950/40 text-gray-700 dark:text-emerald-300 hover:ring-2 hover:ring-[#ffa500]";
    }
  };

  return (
    <div
      id="recharts-keyword-volume-heatmap-container"
      className="bg-white dark:bg-[#0b170b] rounded-2xl p-5 md:p-6 border border-gray-200 dark:border-[#163016] shadow-sm space-y-6 transition-colors"
    >
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 dark:border-green-950/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#004d00]/10 dark:bg-[#004d00]/40 text-[#004d00] dark:text-[#ffa500]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Keyword Search Volume Heatmap & 30-Day Traffic Trajectory</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#ffa500]/20 text-amber-800 dark:text-[#ffa500] border border-[#ffa500]/30">
                  Recharts Powered
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                30-day temporal heatmap matrix tracking daily search volume fluctuations, ranking momentum, and AI Overview capture.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Cluster Filter */}
          <div className="relative">
            <select
              id="heatmap-cluster-select"
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              aria-label="Filter keywords by topic cluster"
              className="text-xs bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950/80 rounded-lg px-3 py-1.5 font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
            >
              {clusters.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Topic Clusters" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="heatmap-keyword-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword..."
              className="text-xs bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950/80 rounded-lg pl-8 pr-3 py-1.5 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
            />
          </div>

          {onNavigateToKeywords && (
            <button
              id="heatmap-view-all-kw-btn"
              onClick={onNavigateToKeywords}
              className="flex items-center gap-1 text-xs font-bold text-[#004d00] dark:text-[#ffa500] hover:underline px-2 py-1.5"
            >
              <span>35 Matrix View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Summary Stat Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-50 dark:bg-[#060e06] p-3 rounded-xl border border-gray-100 dark:border-green-950/40">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Filtered Total Volume
          </span>
          <span className="text-lg font-black text-gray-900 dark:text-white font-mono">
            {aggregateStats.totalMonthlyVol.toLocaleString()}
            <span className="text-[11px] font-normal text-gray-500 ml-1">/mo</span>
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-[#060e06] p-3 rounded-xl border border-gray-100 dark:border-green-950/40">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Top Demand Target
          </span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 truncate block mt-1" title={aggregateStats.topVolKeyword?.keyword}>
            {aggregateStats.topVolKeyword?.keyword || "N/A"}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-[#060e06] p-3 rounded-xl border border-gray-100 dark:border-green-950/40">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Avg AI Overview Prob
          </span>
          <span className="text-lg font-black text-[#ffa500] font-mono">
            {aggregateStats.avgAiProb}%
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-[#060e06] p-3 rounded-xl border border-gray-100 dark:border-green-950/40">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Avg SEO Difficulty
          </span>
          <span className="text-lg font-black text-gray-700 dark:text-gray-300 font-mono">
            {aggregateStats.avgDifficulty}
            <span className="text-[11px] font-normal text-gray-500"> / 100</span>
          </span>
        </div>
      </div>

      {/* Main 30-Day Recharts Keyword Search Volume & Traffic Chart */}
      {selectedKeyword && (
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#060e06] dark:to-[#0b170b] p-4 md:p-5 rounded-xl border border-gray-200 dark:border-[#163016] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#004d00] text-white font-mono">
                  Rank #{selectedKeyword.currentRank}
                </span>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  "{selectedKeyword.keyword}"
                </h4>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                  • Cluster: {selectedKeyword.cluster}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Daily traffic trajectory across the last 30 days (showing organic sessions, SGE answer citations & volume lift).
              </p>
            </div>

            {/* Metric Toggle Buttons */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-gray-200/70 dark:bg-[#163016] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMetric("volume")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  viewMetric === "volume"
                    ? "bg-[#004d00] text-white shadow-xs"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900"
                }`}
              >
                Daily Volume
              </button>
              <button
                type="button"
                onClick={() => setViewMetric("traffic")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  viewMetric === "traffic"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900"
                }`}
              >
                Organic Traffic
              </button>
              <button
                type="button"
                onClick={() => setViewMetric("aiOverviews")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  viewMetric === "aiOverviews"
                    ? "bg-[#ffa500] text-slate-950 shadow-xs"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900"
                }`}
              >
                AI Overviews
              </button>
            </div>
          </div>

          {/* Recharts Area / Bar Combined Trend */}
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={selected30DayData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="heatmapTrafficGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004d00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#004d00" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="heatmapAiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffa500" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ffa500" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis
                  dataKey="day"
                  tickFormatter={(val) => `D${val}`}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  interval={2}
                />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#002b00] text-white p-3 rounded-xl shadow-xl border border-emerald-600/40 text-xs space-y-1.5 min-w-[180px]">
                          <div className="font-bold text-[#ffa500] border-b border-emerald-800/60 pb-1 flex items-center justify-between">
                            <span>{data.label}</span>
                            <span className="text-[10px] font-mono bg-emerald-950 px-1 rounded">
                              Day {data.day}/30
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-emerald-200">
                            <span>Est. Daily Volume:</span>
                            <strong className="font-mono text-white">{data.volume}</strong>
                          </div>
                          <div className="flex justify-between items-center text-emerald-200">
                            <span>Organic Clicks:</span>
                            <strong className="font-mono text-emerald-300">+{data.traffic}</strong>
                          </div>
                          <div className="flex justify-between items-center text-amber-300">
                            <span>AI Overviews SGE:</span>
                            <strong className="font-mono">+{data.aiOverviews}</strong>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-emerald-400/80 pt-1 border-t border-emerald-800/40">
                            <span>Daily Variation:</span>
                            <span className={data.changePct >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                              {data.changePct >= 0 ? `+${data.changePct}%` : `${data.changePct}%`}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {viewMetric === "volume" && (
                  <Bar dataKey="volume" radius={[4, 4, 0, 0]} maxBarSize={24}>
                    {selected30DayData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.intensity === 5
                            ? "#004d00"
                            : entry.intensity === 4
                            ? "#007000"
                            : entry.intensity === 3
                            ? "#059669"
                            : entry.intensity === 2
                            ? "#34d399"
                            : "#6ee7b7"
                        }
                      />
                    ))}
                  </Bar>
                )}
                {viewMetric === "traffic" && (
                  <Area
                    type="monotone"
                    dataKey="traffic"
                    stroke="#004d00"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#heatmapTrafficGrad)"
                  />
                )}
                {viewMetric === "aiOverviews" && (
                  <Area
                    type="monotone"
                    dataKey="aiOverviews"
                    stroke="#ffa500"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#heatmapAiGrad)"
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="traffic"
                  stroke="#ffa500"
                  strokeWidth={2}
                  dot={{ r: 2, fill: "#ffa500" }}
                  activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 30-Day Keyword Multi-Row Heatmap Matrix Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#004d00] dark:text-[#ffa500]" />
            <span>30-Day Keyword Intensity Matrix (Click any row to graph)</span>
          </h4>

          {/* Intensity Legend */}
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
            <span>Low Volume</span>
            <span className="w-3 h-3 rounded-xs bg-emerald-100 dark:bg-emerald-950/40 inline-block" />
            <span className="w-3 h-3 rounded-xs bg-emerald-500/50 inline-block" />
            <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
            <span className="w-3 h-3 rounded-xs bg-[#007000] inline-block" />
            <span className="w-3 h-3 rounded-xs bg-[#004d00] inline-block" />
            <span>Peak Demand</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 dark:border-green-950/60 rounded-xl">
          <div className="min-w-[760px] divide-y divide-gray-100 dark:divide-green-950/40">
            {/* Header Day Numbers 1 to 30 */}
            <div className="flex items-center p-2.5 bg-gray-50 dark:bg-[#060e06] text-[10px] font-bold text-gray-400 uppercase">
              <div className="w-56 shrink-0 pl-2">Target Keyword Phrase</div>
              <div className="w-16 shrink-0 text-center">Rank</div>
              <div className="flex-1 grid grid-cols-30 gap-0.5 text-center px-1 font-mono">
                {Array.from({ length: 30 }, (_, i) => (
                  <span key={i} className="text-[8px] opacity-70">
                    {i + 1}
                  </span>
                ))}
              </div>
              <div className="w-20 shrink-0 text-right pr-2">30d Vol</div>
            </div>

            {/* Keyword Rows */}
            {heatmapRows.map((row) => {
              const isSelected = selectedKeyword?.id === row.keyword.id;
              return (
                <div
                  key={row.keyword.id}
                  onClick={() => setSelectedKeywordId(row.keyword.id)}
                  className={`flex items-center p-2 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#004d00]/10 dark:bg-[#004d00]/30 ring-1 ring-[#004d00] dark:ring-[#ffa500]"
                      : "hover:bg-gray-50 dark:hover:bg-[#060e06]"
                  }`}
                >
                  {/* Keyword Title & Cluster */}
                  <div className="w-56 shrink-0 pl-2 pr-2">
                    <div className="text-xs font-bold text-gray-900 dark:text-white truncate" title={row.keyword.keyword}>
                      {row.keyword.keyword}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      {row.keyword.cluster}
                    </div>
                  </div>

                  {/* Rank Badge */}
                  <div className="w-16 shrink-0 text-center">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        row.keyword.currentRank <= 3
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      #{row.keyword.currentRank}
                    </span>
                  </div>

                  {/* 30 Day Heatmap Blocks */}
                  <div className="flex-1 grid grid-cols-30 gap-0.5 px-1">
                    {row.days.map((d) => (
                      <div
                        key={d.day}
                        title={`${d.label}: ${d.volume} queries (${d.changePct >= 0 ? "+" : ""}${d.changePct}%)`}
                        className={`h-6 rounded-xs transition-all flex items-center justify-center text-[7px] font-mono select-none ${getIntensityColor(
                          d.intensity
                        )}`}
                      >
                        {d.intensity === 5 ? "★" : ""}
                      </div>
                    ))}
                  </div>

                  {/* Total 30-Day Aggregate Volume */}
                  <div className="w-20 shrink-0 text-right pr-2 font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                    {row.totalVol30d.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
