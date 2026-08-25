import React, { useState, useMemo } from "react";
import {
  PackageCheck,
  CheckCircle2,
  Calculator,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  Percent,
  Layers,
  Award,
  Zap,
  Info,
  Clock,
  Briefcase,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { SEO_PACKAGES, INITIAL_KEYWORDS, INITIAL_COMPETITORS } from "../../data/initialData";
import { KeywordItem, CompetitorItem } from "../../types";
import { PredictiveGrowthModeler } from "../PredictiveGrowthModeler";

interface PackagesPricingViewProps {
  keywords?: KeywordItem[];
  competitors?: CompetitorItem[];
}

export const PackagesPricingView: React.FC<PackagesPricingViewProps> = ({
  keywords = INITIAL_KEYWORDS,
  competitors = INITIAL_COMPETITORS,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("AI Enterprise & SGE Domination");
  const [growthScenario, setGrowthScenario] = useState<"conservative" | "baseline" | "aggressive">("baseline");
  const [activeMetricView, setActiveMetricView] = useState<"revenue" | "traffic" | "roi">("revenue");
  const [avgDealValue, setAvgDealValue] = useState<number>(2500);
  const [conversionRate, setConversionRate] = useState<number>(3.2);
  const [leadCloseRate, setLeadCloseRate] = useState<number>(20); // 20% of leads turn into paying deals

  // Calculate live benchmark statistics from keywords and competitors
  const activeKeywords = useMemo(() => keywords.filter((k) => !k.archived), [keywords]);
  const activeCompetitors = useMemo(() => competitors.filter((c) => !c.archived), [competitors]);

  const totalKeywordVolume = useMemo(
    () => activeKeywords.reduce((sum, k) => sum + k.searchVolume, 0),
    [activeKeywords]
  );

  const highIntentVolume = useMemo(
    () =>
      activeKeywords
        .filter((k) => k.intent === "Commercial" || k.intent === "Transactional")
        .reduce((sum, k) => sum + k.searchVolume, 0),
    [activeKeywords]
  );

  const avgCompetitorTraffic = useMemo(() => {
    if (!activeCompetitors.length) return 120000;
    const totals = activeCompetitors.map((c) => {
      const match = c.estimatedTraffic.match(/(\d+(?:\.\d+)?)/);
      if (!match) return 50000;
      const num = parseFloat(match[1]);
      return c.estimatedTraffic.includes("M") ? num * 1000000 : num * 1000;
    });
    return Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
  }, [activeCompetitors]);

  const topCompetitorTraffic = useMemo(() => {
    if (!activeCompetitors.length) return 310000;
    const totals = activeCompetitors.map((c) => {
      const match = c.estimatedTraffic.match(/(\d+(?:\.\d+)?)/);
      if (!match) return 50000;
      const num = parseFloat(match[1]);
      return c.estimatedTraffic.includes("M") ? num * 1000000 : num * 1000;
    });
    return Math.round(Math.max(...totals));
  }, [activeCompetitors]);

  const planCost = selectedPlan.includes("Starter")
    ? 1499
    : selectedPlan.includes("Enterprise")
    ? 2999
    : 4999;

  // Scenario multipliers
  const scenarioConfig = {
    conservative: {
      name: "Conservative Ramp",
      trafficCaptureMonth6: 0.12, // 12% of total search volume
      aiOverviewBonus: 1.15,
      multiplierLabel: "3.4x Expected ROI",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    },
    baseline: {
      name: "Agency Target Baseline",
      trafficCaptureMonth6: 0.22, // 22% of total search volume
      aiOverviewBonus: 1.45,
      multiplierLabel: "6.8x Expected ROI",
      badgeColor: "bg-green-100 text-[#004d00] dark:bg-green-950 dark:text-green-300",
    },
    aggressive: {
      name: "Aggressive AI SGE Domination",
      trafficCaptureMonth6: 0.38, // 38% of total search volume + competitor gap capture
      aiOverviewBonus: 1.85,
      multiplierLabel: "11.2x Expected ROI",
      badgeColor: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
    },
  };

  const currentConfig = scenarioConfig[growthScenario];

  // Generate 6-Month Dynamic Projection Data
  const monthlyProjectionData = useMemo(() => {
    const months = [
      { month: "Month 1", label: "M1: Audit & Foundation", rampPct: 0.08, desc: "Technical schema & entity setup" },
      { month: "Month 2", label: "M2: 45-Word AI Blocks", rampPct: 0.20, desc: "First AI Overviews & Local Citations indexed" },
      { month: "Month 3", label: "M3: Break-Even Milestone", rampPct: 0.40, desc: "Commercial keywords climb to Top 10" },
      { month: "Month 4", label: "M4: EEAT Authority Snowball", rampPct: 0.65, desc: "60% of Matrix ranking on Page 1" },
      { month: "Month 5", label: "M5: Competitor Gap Capture", rampPct: 0.85, desc: "Outranking competitor content gaps" },
      { month: "Month 6", label: "M6: Market Dominance", rampPct: 1.00, desc: "Sustained #1-3 AI Overviews & Lead pipeline" },
    ];

    let cumulativeRetainerSpend = 0;
    let cumulativeGrossRevenue = 0;

    const baseTargetMonthlyTraffic = Math.max(
      totalKeywordVolume * currentConfig.trafficCaptureMonth6 * currentConfig.aiOverviewBonus,
      12000
    );

    return months.map((m, idx) => {
      cumulativeRetainerSpend += planCost;

      // Traffic calculation
      const monthlyTraffic = Math.round(baseTargetMonthlyTraffic * m.rampPct);
      // Inbound leads
      const leads = Math.round(monthlyTraffic * (conversionRate / 100));
      // Closed Deals
      const closedDeals = Math.round(leads * (leadCloseRate / 100));
      // Monthly Gross Revenue
      const monthlyRevenue = closedDeals * avgDealValue;
      cumulativeGrossRevenue += monthlyRevenue;

      // Net Cumulative Profit
      const cumulativeNetProfit = cumulativeGrossRevenue - cumulativeRetainerSpend;
      const monthlyNetRoiMultiple =
        Math.round((cumulativeGrossRevenue / cumulativeRetainerSpend) * 10) / 10;

      // Competitor benchmark parity (%)
      const competitorGapClosed = Math.min(
        100,
        Math.round((monthlyTraffic / (avgCompetitorTraffic * 0.45)) * 100)
      );

      // Cost per lead
      const costPerLead = leads > 0 ? Math.round(planCost / leads) : planCost;

      return {
        month: m.month,
        label: m.label,
        milestone: m.desc,
        traffic: monthlyTraffic,
        leads,
        closedDeals,
        monthlyRevenue,
        cumulativeRevenue: cumulativeGrossRevenue,
        cumulativeSpend: cumulativeRetainerSpend,
        cumulativeNetProfit,
        roiMultiple: monthlyNetRoiMultiple,
        competitorGapClosed,
        costPerLead,
      };
    });
  }, [
    totalKeywordVolume,
    currentConfig,
    planCost,
    conversionRate,
    leadCloseRate,
    avgDealValue,
    avgCompetitorTraffic,
  ]);

  const month6Data = monthlyProjectionData[5];
  const total6MonthRevenue = month6Data.cumulativeRevenue;
  const total6MonthSpend = month6Data.cumulativeSpend;
  const total6MonthNetProfit = month6Data.cumulativeNetProfit;
  const finalRoiMultiple = month6Data.roiMultiple;
  const breakEvenMonth =
    monthlyProjectionData.find((m) => m.cumulativeNetProfit > 0)?.month || "Month 3";

  return (
    <div id="packages-roi-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#004d00] rounded-xl p-6 text-white border border-[#003300] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#003300] text-[11px] text-[#ffa500] font-semibold">
            <PackageCheck className="w-3.5 h-3.5 text-[#ffa500]" />
            Organic SEO Retainer Packages & 6-Month Projected ROI Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI-Powered Organic SEO Packages & ROI Modeler
          </h1>
          <p className="text-xs text-green-100 max-w-2xl">
            Model exact 6-month financial return, traffic trajectory, and competitor market share capture grounded in your active {activeKeywords.length}-keyword search matrix and competitor benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#003300] px-4 py-2.5 rounded-lg border border-[#002800] text-right">
            <span className="text-[10px] text-green-200 uppercase font-mono block">Selected Retainer</span>
            <span className="text-sm font-bold text-[#ffa500]">${planCost.toLocaleString()} / month</span>
          </div>
        </div>
      </div>

      {/* 3 Tier Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SEO_PACKAGES.map((pkg) => {
          const isSelected = selectedPlan === pkg.name;
          const isFeatured = pkg.popular;
          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPlan(pkg.name)}
              className={`rounded-xl p-6 transition-all cursor-pointer flex flex-col justify-between border relative ${
                isSelected
                  ? "bg-[#004d00] text-white border-[#ffa500] shadow-lg ring-2 ring-[#ffa500]/40 scale-[1.01]"
                  : "bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white border-gray-200 dark:border-[#163016] shadow-sm hover:border-[#004d00] dark:hover:border-[#ffa500]"
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffa500] text-slate-950 text-[10px] font-bold uppercase px-3 py-0.5 rounded-full shadow">
                  Most Popular / Agency Standard
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-base font-bold ${isSelected ? "text-[#ffa500]" : "text-gray-900 dark:text-white"}`}>
                    {pkg.name}
                  </h3>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-[#ffa500] text-slate-950 text-[9px] font-extrabold uppercase">
                      Active Model
                    </span>
                  )}
                </div>
                <p className={`text-xs mb-3 line-clamp-2 ${isSelected ? "text-green-100" : "text-gray-500 dark:text-gray-400"}`}>
                  {pkg.subtitle}
                </p>

                <div className="flex items-baseline gap-1 my-3">
                  <span className={`text-3xl font-bold tracking-tight ${isSelected ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {pkg.price}
                  </span>
                  <span className={`text-xs ${isSelected ? "text-green-200" : "text-gray-500 dark:text-gray-400"}`}>
                    {pkg.billingPeriod}
                  </span>
                </div>

                {/* Deliverables summary */}
                <div
                  className={`p-2.5 rounded-lg text-[11px] mb-3 ${
                    isSelected
                      ? "bg-[#003300] border border-[#002800] text-green-100"
                      : "bg-gray-50 dark:bg-[#122412] border border-gray-200 dark:border-[#1e461e] text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <strong className="block text-[#ffa500] font-bold mb-1">Monthly Deliverables:</strong>
                  <div>• {pkg.deliverables.keywords}</div>
                  <div>• {pkg.deliverables.content}</div>
                  <div>• {pkg.deliverables.localCitations}</div>
                </div>

                <div className="space-y-1.5 text-xs my-3 pt-2 border-t border-gray-200/40 dark:border-gray-800">
                  {pkg.features.slice(0, 5).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                          isSelected ? "text-[#ffa500]" : "text-[#004d00] dark:text-[#ffa500]"
                        }`}
                      />
                      <span className={`text-[11px] ${isSelected ? "text-green-100" : "text-gray-700 dark:text-gray-300"}`}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-md font-bold text-xs transition-all shadow mt-4 ${
                  isSelected
                    ? "bg-[#ffa500] hover:brightness-110 text-slate-950"
                    : "bg-[#004d00] hover:bg-[#003800] text-white"
                }`}
              >
                {isSelected ? "Modeling This Plan Below" : "Select & Model Plan"}
              </button>
            </div>
          );
        })}
      </div>

      {/* 🚀 PREDICTIVE GROWTH & WHAT-IF SCENARIOS MODELER */}
      <PredictiveGrowthModeler
        keywords={keywords}
        competitors={competitors}
        basePlanCost={planCost}
        avgDealValue={avgDealValue}
        conversionRate={conversionRate}
        leadCloseRate={leadCloseRate}
      />

      {/* ========================================================================= */}
      {/* 🚀 PROJECTED ROI CARD (USES KEYWORD VOLUME & COMPETITOR BENCHMARKS) */}
      {/* ========================================================================= */}
      <div id="projected-roi-card" className="bg-white dark:bg-[#0b170b] rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm p-6 space-y-6 transition-colors">
        {/* Card Header & Benchmark Context Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#163016] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#004d00] text-[#ffa500]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                6-Month Projected ROI & Growth Forecast
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${currentConfig.badgeColor}`}>
                {currentConfig.multiplierLabel}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
              Calculated from <strong className="text-[#004d00] dark:text-[#ffa500]">{totalKeywordVolume.toLocaleString()} total monthly searches</strong> across your active keyword matrix, factoring <strong className="text-gray-800 dark:text-gray-200">{avgCompetitorTraffic.toLocaleString()} avg competitor traffic</strong> and Google AI Overview snippet capture curves.
            </p>
          </div>

          {/* Scenario Selector & Metric Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-gray-300 dark:border-[#1e461e] bg-gray-50 dark:bg-[#060e06] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setGrowthScenario("conservative")}
                className={`px-3 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                  growthScenario === "conservative"
                    ? "bg-blue-700 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                Conservative
              </button>
              <button
                type="button"
                onClick={() => setGrowthScenario("baseline")}
                className={`px-3 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                  growthScenario === "baseline"
                    ? "bg-[#004d00] text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                Target (Baseline)
              </button>
              <button
                type="button"
                onClick={() => setGrowthScenario("aggressive")}
                className={`px-3 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                  growthScenario === "aggressive"
                    ? "bg-[#ffa500] text-slate-950 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                Aggressive AI SGE
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Benchmark Data Inputs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8fafc] dark:bg-[#060e06] p-4 rounded-xl border border-gray-200 dark:border-[#163016]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
              <Target className="w-3 h-3 text-[#004d00] dark:text-[#ffa500]" />
              Active Keyword Pool
            </div>
            <div className="text-base font-bold text-gray-900 dark:text-white font-mono">
              {totalKeywordVolume.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">vol/mo</span>
            </div>
            <span className="text-[10px] text-gray-400">{activeKeywords.length} tracked queries ({highIntentVolume.toLocaleString()} commercial)</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
              <Users className="w-3 h-3 text-blue-600" />
              Competitor Benchmark
            </div>
            <div className="text-base font-bold text-gray-900 dark:text-white font-mono">
              {avgCompetitorTraffic.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">avg visits</span>
            </div>
            <span className="text-[10px] text-gray-400">Top rival: {topCompetitorTraffic.toLocaleString()}/mo</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
              <DollarSign className="w-3 h-3 text-[#ffa500]" />
              6-Month Net Profit
            </div>
            <div className="text-base font-bold text-[#004d00] dark:text-[#ffa500] font-mono">
              +${total6MonthNetProfit.toLocaleString()}
            </div>
            <span className="text-[10px] text-green-700 dark:text-green-400 font-semibold">{finalRoiMultiple}x Net ROI Return</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
              <Award className="w-3 h-3 text-emerald-600" />
              Break-Even Point
            </div>
            <div className="text-base font-bold text-gray-900 dark:text-white font-mono">
              {breakEvenMonth}
            </div>
            <span className="text-[10px] text-gray-400">Month 6: ${month6Data.monthlyRevenue.toLocaleString()}/mo</span>
          </div>
        </div>

        {/* Main Recharts Line Graph Container */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Graph Metric Display:</span>
              <div className="flex items-center rounded-lg border border-gray-200 dark:border-[#1e461e] p-0.5 bg-gray-50 dark:bg-[#060e06] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveMetricView("revenue")}
                  className={`px-2.5 py-1 rounded font-bold text-[10px] transition-colors ${
                    activeMetricView === "revenue"
                      ? "bg-[#004d00] text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Revenue & Net Profit ($)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetricView("traffic")}
                  className={`px-2.5 py-1 rounded font-bold text-[10px] transition-colors ${
                    activeMetricView === "traffic"
                      ? "bg-[#004d00] text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Organic Traffic & Inbound Leads
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetricView("roi")}
                  className={`px-2.5 py-1 rounded font-bold text-[10px] transition-colors ${
                    activeMetricView === "roi"
                      ? "bg-[#004d00] text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Cumulative ROI Multiple (x)
                </button>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#004d00]"></span>
              <span>Selected Retainer: <strong>${planCost.toLocaleString()}/mo</strong></span>
            </div>
          </div>

          {/* Recharts Render */}
          <div className="h-72 w-full bg-white dark:bg-[#060e06] p-3 rounded-xl border border-gray-100 dark:border-[#163016]">
            <ResponsiveContainer width="100%" height="100%">
              {activeMetricView === "revenue" ? (
                <LineChart data={monthlyProjectionData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
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
                      if (name === "Monthly Revenue") return [`$${Number(value).toLocaleString()}`, "Monthly Revenue"];
                      if (name === "Cumulative Revenue") return [`$${Number(value).toLocaleString()}`, "Gross Cumulative Revenue"];
                      if (name === "Cumulative Net Profit") return [`$${Number(value).toLocaleString()}`, "Net Profit"];
                      if (name === "Retainer Spend") return [`$${Number(value).toLocaleString()}`, "Retainer Investment"];
                      return [value, name];
                    }}
                    labelFormatter={(label) => {
                      const item = monthlyProjectionData.find((m) => m.month === label);
                      return `${label} — ${item?.label || ""}`;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  <Line
                    type="monotone"
                    dataKey="monthlyRevenue"
                    name="Monthly Revenue"
                    stroke="#ffa500"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#ffa500" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeRevenue"
                    name="Cumulative Revenue"
                    stroke="#004d00"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#004d00" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeNetProfit"
                    name="Cumulative Net Profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 2"
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeSpend"
                    name="Retainer Spend"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                  />
                </LineChart>
              ) : activeMetricView === "traffic" ? (
                <LineChart data={monthlyProjectionData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
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
                      if (name === "Organic Traffic") return [`${Number(value).toLocaleString()} visits`, "Monthly Organic Traffic"];
                      if (name === "Inbound Leads") return [`${Number(value).toLocaleString()} leads`, "Inbound Leads Generated"];
                      if (name === "Competitor Gap Closed %") return [`${value}%`, "Competitor Benchmark Parity"];
                      return [value, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  <Line
                    type="monotone"
                    dataKey="traffic"
                    name="Organic Traffic"
                    stroke="#004d00"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#004d00" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    name="Inbound Leads"
                    stroke="#ffa500"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#ffa500" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="competitorGapClosed"
                    name="Competitor Gap Closed %"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                  />
                </LineChart>
              ) : (
                <LineChart data={monthlyProjectionData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `${val}x`}
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
                    formatter={(value: any) => [`${value}x Net ROI Multiple`, "ROI Multiple"]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  <Line
                    type="monotone"
                    dataKey="roiMultiple"
                    name="Net ROI Multiple (x)"
                    stroke="#ffa500"
                    strokeWidth={3.5}
                    dot={{ r: 5, fill: "#004d00" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6-Month Roadmap Milestone Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {monthlyProjectionData.map((m, idx) => (
            <div
              key={m.month}
              className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
                idx === 2
                  ? "bg-green-50 dark:bg-green-950/40 border-[#004d00] dark:border-green-600 shadow-xs"
                  : idx === 5
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-xs"
                  : "bg-gray-50 dark:bg-[#122412] border-gray-200 dark:border-[#1e461e]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-gray-900 dark:text-white">{m.month}</span>
                {idx === 2 && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-[#004d00] text-white">
                    Break-Even
                  </span>
                )}
                {idx === 5 && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-[#ffa500] text-slate-950">
                    Maturity
                  </span>
                )}
              </div>
              <div className="font-mono font-bold text-gray-800 dark:text-gray-200 text-xs">
                ${m.monthlyRevenue.toLocaleString()} <span className="text-[9px] font-normal text-gray-400">/mo</span>
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-2">
                {m.milestone}
              </div>
              <div className="pt-1 flex items-center justify-between text-[10px] border-t border-gray-200/50 dark:border-gray-800">
                <span className="text-gray-400">{m.traffic.toLocaleString()} vis</span>
                <span className="font-bold text-[#004d00] dark:text-[#ffa500]">{m.roiMultiple}x</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Variable Sliders to customize calculations */}
        <div className="bg-[#f8fafc] dark:bg-[#060e06] p-4 rounded-xl border border-gray-200 dark:border-[#163016] space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#163016] pb-2">
            <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-[#004d00] dark:text-[#ffa500]" />
              Interactive Deal Size & Conversion Calibration
            </span>
            <span className="text-[10px] text-gray-500">Fine-tune assumptions to fit client business model</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-gray-700 dark:text-gray-300">
                <span>Average Deal / Customer Value:</span>
                <span className="font-mono text-[#004d00] dark:text-[#ffa500] font-bold">
                  ${avgDealValue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="15000"
                step="250"
                value={avgDealValue}
                onChange={(e) => setAvgDealValue(Number(e.target.value))}
                className="w-full accent-[#004d00]"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>$500 (B2C/Sub)</span>
                <span>$15,000+ (Enterprise)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-gray-700 dark:text-gray-300">
                <span>Website Conversion Rate:</span>
                <span className="font-mono text-[#004d00] dark:text-[#ffa500] font-bold">
                  {conversionRate}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-[#004d00]"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>0.5% (Low Intent)</span>
                <span>6.0% (Optimized SGE)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-gray-700 dark:text-gray-300">
                <span>Lead-to-Closed Deal Close Rate:</span>
                <span className="font-mono text-[#004d00] dark:text-[#ffa500] font-bold">
                  {leadCloseRate}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={leadCloseRate}
                onChange={(e) => setLeadCloseRate(Number(e.target.value))}
                className="w-full accent-[#004d00]"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>5% (Strict Pipeline)</span>
                <span>50% (High-Touch B2B)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
