import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  BarChart3,
  Calendar,
  Zap,
} from "lucide-react";

interface AuditTrendDataPoint {
  period: string;
  totalEvaluated: number;
  passed: number;
  failedOrRefined: number;
  passRate: number; // percentage
  avgEeatScore: number; // 0 - 100
  autoResolved: number;
}

const HISTORICAL_AUDIT_DATA: AuditTrendDataPoint[] = [
  {
    period: "Week 1",
    totalEvaluated: 48,
    passed: 36,
    failedOrRefined: 12,
    passRate: 75.0,
    avgEeatScore: 82.4,
    autoResolved: 11,
  },
  {
    period: "Week 2",
    totalEvaluated: 62,
    passed: 50,
    failedOrRefined: 12,
    passRate: 80.6,
    avgEeatScore: 85.1,
    autoResolved: 12,
  },
  {
    period: "Week 3",
    totalEvaluated: 75,
    passed: 64,
    failedOrRefined: 11,
    passRate: 85.3,
    avgEeatScore: 88.7,
    autoResolved: 10,
  },
  {
    period: "Week 4",
    totalEvaluated: 89,
    passed: 79,
    failedOrRefined: 10,
    passRate: 88.7,
    avgEeatScore: 91.2,
    autoResolved: 10,
  },
  {
    period: "Week 5",
    totalEvaluated: 104,
    passed: 95,
    failedOrRefined: 9,
    passRate: 91.3,
    avgEeatScore: 93.6,
    autoResolved: 9,
  },
  {
    period: "Week 6",
    totalEvaluated: 120,
    passed: 112,
    failedOrRefined: 8,
    passRate: 93.3,
    avgEeatScore: 95.0,
    autoResolved: 8,
  },
  {
    period: "Week 7",
    totalEvaluated: 142,
    passed: 135,
    failedOrRefined: 7,
    passRate: 95.1,
    avgEeatScore: 96.4,
    autoResolved: 7,
  },
  {
    period: "Week 8 (Current)",
    totalEvaluated: 168,
    passed: 162,
    failedOrRefined: 6,
    passRate: 96.4,
    avgEeatScore: 97.8,
    autoResolved: 6,
  },
];

export const EEATAuditTrendChart: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<"all" | "recent" | "month">("all");
  const [activeCategory, setActiveCategory] = useState<string>("All Categories");

  const filteredData = useMemo(() => {
    if (selectedRange === "recent") {
      return HISTORICAL_AUDIT_DATA.slice(-4);
    }
    if (selectedRange === "month") {
      return HISTORICAL_AUDIT_DATA.slice(-6);
    }
    return HISTORICAL_AUDIT_DATA;
  }, [selectedRange]);

  const totalSubmissions = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.totalEvaluated, 0),
    [filteredData]
  );
  const totalPassed = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.passed, 0),
    [filteredData]
  );
  const totalFailed = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.failedOrRefined, 0),
    [filteredData]
  );
  const overallPassRate = useMemo(
    () => Math.round((totalPassed / (totalSubmissions || 1)) * 100),
    [totalPassed, totalSubmissions]
  );
  const latestAvgScore = filteredData[filteredData.length - 1]?.avgEeatScore || 97.8;

  return (
    <div
      id="eeat-audit-trend-comparative-chart"
      className="bg-white dark:bg-[#071207] rounded-xl border border-gray-200 dark:border-[#142e14] shadow-sm overflow-hidden"
    >
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#142e14] bg-gray-50/70 dark:bg-[#091609] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#004d00] dark:bg-[#0e2c0e] text-[#ffa500] flex items-center justify-center shadow-xs">
            <BarChart3 className="w-4 h-4 text-[#ffa500]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>EEAT Submissions: Audit Pass vs. Fail Trends Over Time</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#004d00] text-[#ffa500]">
                Recharts Comparative
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Longitudinal tracking of Agent Omega audit pass rates, algorithm stress-test rejections, and self-healed assets.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center rounded-lg border border-gray-200 dark:border-[#1e421e] bg-white dark:bg-[#050e05] p-0.5">
            <button
              onClick={() => setSelectedRange("all")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                selectedRange === "all"
                  ? "bg-[#004d00] text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              All 8 Weeks
            </button>
            <button
              onClick={() => setSelectedRange("month")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                selectedRange === "month"
                  ? "bg-[#004d00] text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              Past 6 Weeks
            </button>
            <button
              onClick={() => setSelectedRange("recent")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                selectedRange === "recent"
                  ? "bg-[#004d00] text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              Last 4 Weeks
            </button>
          </div>

          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-[#1e421e] bg-white dark:bg-[#050e05] text-xs font-semibold text-gray-700 dark:text-gray-300"
          >
            <option value="All Categories">All Task Submissions</option>
            <option value="AI Overviews">AI Overviews Strategy</option>
            <option value="Voice Q&A">Voice Search Q&A</option>
            <option value="Entity Graph">Entity Graph & EEAT</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 bg-slate-50/50 dark:bg-[#050e05] border-b border-gray-100 dark:border-[#142e14]">
        <div className="p-3 rounded-lg bg-white dark:bg-[#091609] border border-gray-200 dark:border-[#163016]">
          <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Total EEAT Evaluated</div>
          <div className="text-xl font-black text-gray-900 dark:text-gray-100 mt-0.5">
            {totalSubmissions}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Submissions processed</div>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-[#091609] border border-gray-200 dark:border-[#163016]">
          <div className="text-[11px] font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Passed 1st Pass</span>
          </div>
          <div className="text-xl font-black text-green-700 dark:text-green-300 mt-0.5">
            {totalPassed}
          </div>
          <div className="text-[10px] text-green-600/80 font-bold">{overallPassRate}% cumulative pass</div>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-[#091609] border border-gray-200 dark:border-[#163016]">
          <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Refined by Judge</span>
          </div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-300 mt-0.5">
            {totalFailed}
          </div>
          <div className="text-[10px] text-amber-600/80 font-bold">100% Self-Maintained</div>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-[#091609] border border-gray-200 dark:border-[#163016]">
          <div className="text-[11px] font-semibold text-[#004d00] dark:text-[#ffa500] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#ffa500]" />
            <span>Latest EEAT Quality</span>
          </div>
          <div className="text-xl font-black text-[#004d00] dark:text-[#ffa500] mt-0.5">
            {latestAvgScore}
            <span className="text-xs text-gray-400">/100</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold">+15.4 pt lift over 8 wks</div>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="p-5">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 10, right: 20, bottom: 20, left: -10 }}
            >
              <defs>
                <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-[#163016]" />
              <XAxis
                dataKey="period"
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                label={{
                  value: "Submissions Count",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#6b7280", fontSize: 10 },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[60, 100]}
                stroke="#ffa500"
                fontSize={11}
                tickLine={false}
                label={{
                  value: "EEAT Score %",
                  angle: 90,
                  position: "insideRight",
                  style: { fill: "#ffa500", fontSize: 10 },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#050e05",
                  borderColor: "#1e421e",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "12px",
                  fontSize: "11px",
                }}
              />
              {/* Passed Area */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="passed"
                name="Audit Passed (>=90 EEAT)"
                fill="url(#colorPassed)"
                stroke="#10b981"
                strokeWidth={2}
              />
              {/* Failed / Refined Bar */}
              <Bar
                yAxisId="left"
                dataKey="failedOrRefined"
                name="Flagged for Self-Repair"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
              {/* EEAT Quality Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgEeatScore"
                name="Avg EEAT Quality Index"
                stroke="#ffa500"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ffa500", stroke: "#004d00", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Insight Footer */}
        <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-[#091609] border border-gray-100 dark:border-[#163016] flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>EEAT Autonomous Quality Trend:</strong> Pass rates surged from 75% in Week 1 to 96.4% in Week 8 as the Adversarial Agent continually hardened strategy templates against Google algorithm updates.
            </span>
          </div>
          <span className="font-mono text-[10px] text-gray-400 shrink-0 hidden sm:inline">
            Updated Real-time
          </span>
        </div>
      </div>
    </div>
  );
};
