import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Sliders,
  Calculator,
  Layers,
  FileText,
  Target,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Flame,
  BarChart3,
  Users,
  DollarSign,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { KeywordItem, CompetitorItem } from "../types";

interface PredictiveGrowthModelerProps {
  keywords: KeywordItem[];
  competitors: CompetitorItem[];
  basePlanCost: number;
  avgDealValue: number;
  conversionRate: number;
  leadCloseRate: number;
}

export const PredictiveGrowthModeler: React.FC<PredictiveGrowthModelerProps> = ({
  keywords,
  competitors,
  basePlanCost,
  avgDealValue,
  conversionRate,
  leadCloseRate,
}) => {
  // What-if Scenario Variables
  const [contentVelocity, setContentVelocity] = useState<number>(8); // Pieces of content / month (4 to 24)
  const [keywordDensityTier, setKeywordDensityTier] = useState<number>(50); // Tracked keywords / semantic density (35 to 100)
  const [aiOverviewOptimization, setAiOverviewOptimization] = useState<number>(85); // % of content optimized for 45-word direct answer blocks (40% to 100%)
  const [prBacklinkPace, setPrBacklinkPace] = useState<number>(4); // PR distributions / month (1 to 8)
  const [presetActive, setPresetActive] = useState<string>("custom");

  const totalBaseKeywordVolume = useMemo(() => {
    return keywords.filter((k) => !k.archived).reduce((acc, k) => acc + k.searchVolume, 0) || 85000;
  }, [keywords]);

  // Compute what-if multiplier based on variable combinations
  const {
    velocityMultiplier,
    densityMultiplier,
    aiOverviewMultiplier,
    prMultiplier,
    compositeGrowthMultiplier,
  } = useMemo(() => {
    // Content velocity multiplier (base 4 pieces = 1.0x)
    const vMult = 1 + ((contentVelocity - 4) / 4) * 0.35; // e.g. 8 pieces => 1.35x, 16 pieces => 2.05x

    // Keyword density & cluster breadth (base 35 keywords = 1.0x)
    const dMult = 1 + ((keywordDensityTier - 35) / 35) * 0.42; // e.g. 50 => 1.18x, 75 => 1.48x

    // AI Overview direct snippet engineering (base 50% = 1.0x)
    const aiMult = 1 + ((aiOverviewOptimization - 50) / 50) * 0.38; // e.g. 85% => 1.266x

    // PR outreach & tier-1 backlink citations (base 2 PRs = 1.0x)
    const pMult = 1 + ((prBacklinkPace - 2) / 2) * 0.25;

    const comp = Math.round(vMult * dMult * aiMult * pMult * 100) / 100;

    return {
      velocityMultiplier: Math.round(vMult * 100) / 100,
      densityMultiplier: Math.round(dMult * 100) / 100,
      aiOverviewMultiplier: Math.round(aiMult * 100) / 100,
      prMultiplier: Math.round(pMult * 100) / 100,
      compositeGrowthMultiplier: comp,
    };
  }, [contentVelocity, keywordDensityTier, aiOverviewOptimization, prBacklinkPace]);

  // 6-Month Projected Monthly Trajectory: Baseline vs What-If Scenario
  const trajectoryData = useMemo(() => {
    const months = [
      { name: "Month 1", baseFactor: 0.04, label: "Foundation & Entities" },
      { name: "Month 2", baseFactor: 0.08, label: "Indexation & Citations" },
      { name: "Month 3", baseFactor: 0.13, label: "Initial SGE Breakouts" },
      { name: "Month 4", baseFactor: 0.18, label: "Top 3 Cluster Moves" },
      { name: "Month 5", baseFactor: 0.23, label: "High Intent Dominance" },
      { name: "Month 6", baseFactor: 0.28, label: "Market Maturity" },
    ];

    return months.map((m, idx) => {
      // Baseline 6-month growth
      const baseTraffic = Math.round(totalBaseKeywordVolume * m.baseFactor * 1.8);
      const baseLeads = Math.round(baseTraffic * (conversionRate / 100));
      const baseDeals = Math.round(baseLeads * (leadCloseRate / 100));
      const baseRevenue = baseDeals * avgDealValue;

      // Accelerated What-If growth (compounding acceleration over time)
      const timeCompound = 1 + idx * 0.12;
      const whatIfFactor = m.baseFactor * compositeGrowthMultiplier * timeCompound;
      const whatIfTraffic = Math.round(totalBaseKeywordVolume * whatIfFactor * 1.8);
      const whatIfLeads = Math.round(whatIfTraffic * (conversionRate / 100));
      const whatIfDeals = Math.round(whatIfLeads * (leadCloseRate / 100));
      const whatIfRevenue = whatIfDeals * avgDealValue;

      return {
        month: m.name,
        label: m.label,
        baselineTraffic: baseTraffic,
        whatIfTraffic: whatIfTraffic,
        baselineRevenue: baseRevenue,
        whatIfRevenue: whatIfRevenue,
        incrementalTraffic: whatIfTraffic - baseTraffic,
        incrementalRevenue: whatIfRevenue - baseRevenue,
      };
    });
  }, [
    totalBaseKeywordVolume,
    conversionRate,
    leadCloseRate,
    avgDealValue,
    compositeGrowthMultiplier,
  ]);

  const month6Trajectory = trajectoryData[5];
  const baseline6MoTotalRev = trajectoryData.reduce((acc, t) => acc + t.baselineRevenue, 0);
  const whatIf6MoTotalRev = trajectoryData.reduce((acc, t) => acc + t.whatIfRevenue, 0);
  const incrementalTotalPipeline = whatIf6MoTotalRev - baseline6MoTotalRev;

  // Preset Scenario Handlers
  const applyPreset = (preset: string) => {
    setPresetActive(preset);
    if (preset === "conservative") {
      setContentVelocity(4);
      setKeywordDensityTier(35);
      setAiOverviewOptimization(60);
      setPrBacklinkPace(2);
    } else if (preset === "velocity") {
      setContentVelocity(16);
      setKeywordDensityTier(50);
      setAiOverviewOptimization(80);
      setPrBacklinkPace(4);
    } else if (preset === "density") {
      setContentVelocity(8);
      setKeywordDensityTier(85);
      setAiOverviewOptimization(90);
      setPrBacklinkPace(4);
    } else if (preset === "blitz") {
      setContentVelocity(20);
      setKeywordDensityTier(100);
      setAiOverviewOptimization(98);
      setPrBacklinkPace(6);
    }
  };

  return (
    <div
      id="predictive-growth-section"
      className="bg-white dark:bg-[#0b170b] rounded-xl p-6 border border-gray-200 dark:border-[#163016] shadow-sm space-y-6"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#163016] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#004d00] text-[#ffa500] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#ffa500]" />
              Predictive Growth & Scenario Modeler
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-[10px]">
              What-If Engine Active
            </span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            Predictive 6-Month Organic Growth & Multiplier Calibration
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Dynamically evaluate how scaling content velocity, expanding keyword semantic density, and optimizing for Google AI Overviews directly impacts traffic capture and pipeline revenue.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 dark:bg-[#060e06] p-1.5 rounded-xl border border-gray-200 dark:border-[#163016]">
          <span className="text-[10px] font-bold text-gray-400 px-1 uppercase">Presets:</span>
          <button
            onClick={() => applyPreset("conservative")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              presetActive === "conservative"
                ? "bg-[#004d00] text-white shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#122412]"
            }`}
          >
            Baseline
          </button>
          <button
            onClick={() => applyPreset("velocity")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              presetActive === "velocity"
                ? "bg-[#004d00] text-white shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#122412]"
            }`}
          >
            Content Velocity 2x
          </button>
          <button
            onClick={() => applyPreset("density")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              presetActive === "density"
                ? "bg-[#004d00] text-white shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#122412]"
            }`}
          >
            Cluster Density 85+
          </button>
          <button
            onClick={() => applyPreset("blitz")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              presetActive === "blitz"
                ? "bg-[#ffa500] text-slate-950 shadow-xs"
                : "text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-[#122412]"
            }`}
          >
            <Flame className="w-3 h-3 text-orange-500" />
            <span>SGE Blitz (Max)</span>
          </button>
        </div>
      </div>

      {/* Interactive Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 dark:bg-[#060e06] p-4 rounded-xl border border-gray-200 dark:border-[#163016]">
        {/* 1. Content Velocity Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#004d00] dark:text-[#ffa500]" />
              Content Velocity:
            </span>
            <span className="font-mono font-bold text-[#004d00] dark:text-[#ffa500]">
              {contentVelocity} posts / mo
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="24"
            step="2"
            value={contentVelocity}
            onChange={(e) => {
              setContentVelocity(Number(e.target.value));
              setPresetActive("custom");
            }}
            className="w-full accent-[#004d00]"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>4 (Standard)</span>
            <span className="font-semibold text-green-700 dark:text-green-400">
              +{Math.round((velocityMultiplier - 1) * 100)}% Lift
            </span>
            <span>24 (Hyper-Scale)</span>
          </div>
        </div>

        {/* 2. Keyword Density & Cluster Breadth */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-[#004d00] dark:text-[#ffa500]" />
              Keyword Cluster Density:
            </span>
            <span className="font-mono font-bold text-[#004d00] dark:text-[#ffa500]">
              {keywordDensityTier} keywords
            </span>
          </div>
          <input
            type="range"
            min="35"
            max="100"
            step="5"
            value={keywordDensityTier}
            onChange={(e) => {
              setKeywordDensityTier(Number(e.target.value));
              setPresetActive("custom");
            }}
            className="w-full accent-[#004d00]"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>35 (Core)</span>
            <span className="font-semibold text-green-700 dark:text-green-400">
              +{Math.round((densityMultiplier - 1) * 100)}% Lift
            </span>
            <span>100+ (Multi-Intent)</span>
          </div>
        </div>

        {/* 3. AI Overview Direct Answer Rate */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ffa500]" />
              AI Overview SGE Tuning:
            </span>
            <span className="font-mono font-bold text-[#004d00] dark:text-[#ffa500]">
              {aiOverviewOptimization}% density
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            step="5"
            value={aiOverviewOptimization}
            onChange={(e) => {
              setAiOverviewOptimization(Number(e.target.value));
              setPresetActive("custom");
            }}
            className="w-full accent-[#004d00]"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>40% (Basic)</span>
            <span className="font-semibold text-green-700 dark:text-green-400">
              +{Math.round((aiOverviewMultiplier - 1) * 100)}% Lift
            </span>
            <span>100% (Strict 45w)</span>
          </div>
        </div>

        {/* 4. PR & Citation Distribution Pace */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#004d00] dark:text-[#ffa500]" />
              PR & Tier-1 Backlinks:
            </span>
            <span className="font-mono font-bold text-[#004d00] dark:text-[#ffa500]">
              {prBacklinkPace} PRs / mo
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={prBacklinkPace}
            onChange={(e) => {
              setPrBacklinkPace(Number(e.target.value));
              setPresetActive("custom");
            }}
            className="w-full accent-[#004d00]"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>1 PR</span>
            <span className="font-semibold text-green-700 dark:text-green-400">
              +{Math.round((prMultiplier - 1) * 100)}% Lift
            </span>
            <span>8 PRs (Broad Authority)</span>
          </div>
        </div>
      </div>

      {/* Dynamic What-If KPI Outcomes Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Month 6 Organic Traffic */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-white dark:from-[#122412] dark:to-[#0b170b] border border-green-200 dark:border-[#1e461e] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Month 6 Traffic Output
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#004d00] text-white">
              {compositeGrowthMultiplier}x Multiplier
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#004d00] dark:text-[#ffa500] font-mono">
              {month6Trajectory.whatIfTraffic.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 line-through font-mono">
              {month6Trajectory.baselineTraffic.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-green-700 dark:text-green-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{month6Trajectory.incrementalTraffic.toLocaleString()} incremental visits/mo</span>
          </p>
        </div>

        {/* KPI 2: Month 6 Monthly Revenue */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white dark:from-[#1b250d] dark:to-[#0b170b] border border-amber-200 dark:border-[#ffa500]/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Month 6 Run-Rate Revenue
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#ffa500] text-slate-950">
              Run-Rate
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">
              ${month6Trajectory.whatIfRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 line-through font-mono">
              ${month6Trajectory.baselineRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>+${month6Trajectory.incrementalRevenue.toLocaleString()} / mo extra gross</span>
          </p>
        </div>

        {/* KPI 3: 6-Month Cumulative Pipeline */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            6-Month Total Gross Pipeline
          </span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">
            ${whatIf6MoTotalRev.toLocaleString()}
          </div>
          <p className="text-[11px] text-green-600 font-semibold">
            +${incrementalTotalPipeline.toLocaleString()} vs standard retainer
          </p>
        </div>

        {/* KPI 4: Time-to-Competitor Parity */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Competitor Parity Velocity
          </span>
          <div className="text-2xl font-extrabold text-green-600 font-mono">
            Month {Math.max(2, Math.min(5, Math.round(6 / Math.sqrt(compositeGrowthMultiplier))))}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {compositeGrowthMultiplier >= 2 ? "Achieves parity 2 months faster" : "Accelerated market share capture"}
          </p>
        </div>
      </div>

      {/* Trajectory Comparison Chart */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#004d00] dark:text-[#ffa500]" />
              6-Month Trajectory Simulation: Baseline Retainer vs What-If Optimized Velocity
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Interactive visual modeling showing cumulative monthly traffic scaling.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-3 h-0.5 bg-gray-400 inline-block" /> Baseline Retainer
            </span>
            <span className="flex items-center gap-1.5 text-[#004d00] dark:text-[#ffa500]">
              <span className="w-3 h-3 rounded-full bg-[#ffa500] inline-block" /> What-If Accelerated Growth
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trajectoryData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="whatIfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffa500" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#004d00" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
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
                  if (name === "What-If Accelerated") return [`${Number(value).toLocaleString()} visits`, "What-If Projected Traffic"];
                  if (name === "Baseline Retainer") return [`${Number(value).toLocaleString()} visits`, "Baseline Retainer Traffic"];
                  return [value, name];
                }}
                labelFormatter={(label) => {
                  const item = trajectoryData.find((t) => t.month === label);
                  return `${label} — ${item?.label || ""}`;
                }}
              />
              <Line
                type="monotone"
                dataKey="baselineTraffic"
                name="Baseline Retainer"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: "#94a3b8" }}
              />
              <Area
                type="monotone"
                dataKey="whatIfTraffic"
                name="What-If Accelerated"
                stroke="#ffa500"
                strokeWidth={3}
                fill="url(#whatIfGradient)"
                dot={{ r: 4, fill: "#004d00" }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
