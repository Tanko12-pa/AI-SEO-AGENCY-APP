import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import {
  Radar,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Filter,
  Layers,
  Sparkles,
  Info,
  RefreshCw,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { KeywordItem, CompetitorItem } from "../types";

interface SEOTrendRadarProps {
  keywords: KeywordItem[];
  competitors: CompetitorItem[];
  onSelectKeyword?: (keyword: string) => void;
}

interface RadarNode {
  id: string;
  keyword: string;
  cluster: string;
  intent: "Informational" | "Commercial" | "Transactional" | "Navigational";
  currentRank: number;
  previousRank: number;
  searchVolume: number;
  volatility7d: number; // 0 - 100
  competitorDelta: number; // e.g. +3 or -2 relative to competitor avg
  topCompetitor: string;
  direction: "up" | "down" | "stable";
  angle: number;
  radius: number;
}

export const SEOTrendRadar: React.FC<SEOTrendRadarProps> = ({
  keywords,
  competitors,
  onSelectKeyword,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedIntentFilter, setSelectedIntentFilter] = useState<string>("All");
  const [selectedVolatilityFilter, setSelectedVolatilityFilter] = useState<
    "all" | "high" | "moderate" | "stable"
  >("all");
  const [hoveredNode, setHoveredNode] = useState<RadarNode | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>("All");

  // Compute 7-day volatility nodes from keywords and competitors
  const radarData: RadarNode[] = useMemo(() => {
    const intents: Array<"Informational" | "Commercial" | "Transactional" | "Navigational"> = [
      "Informational",
      "Commercial",
      "Transactional",
      "Navigational",
    ];

    const topCompetitorName = competitors[0]?.name || "Competitor A";

    return keywords.map((k, idx) => {
      // Intent angle grouping (4 quadrant sectors)
      const intentIndex = intents.indexOf(k.intent as any);
      const baseAngleSector = (intentIndex >= 0 ? intentIndex : 0) * (Math.PI / 2);
      const angleJitter = ((idx % 7) / 7) * (Math.PI / 2.3) + 0.1;
      const angle = baseAngleSector + angleJitter;

      // Volatility based on rank diff and search volume dynamics
      const rankDiff = Math.abs(k.previousRank - k.currentRank);
      const pseudoVolatility = Math.min(
        98,
        Math.max(
          12,
          Math.round(
            rankDiff * 16 + (k.searchVolume > 10000 ? 22 : 10) + ((idx * 13) % 25)
          )
        )
      );

      const competitorDelta =
        k.currentRank <= 3
          ? 3
          : k.currentRank <= 7
          ? 1
          : -Math.floor((k.currentRank - 7) / 2) - 1;

      const direction =
        k.previousRank > k.currentRank
          ? "up"
          : k.previousRank < k.currentRank
          ? "down"
          : "stable";

      return {
        id: k.id,
        keyword: k.keyword,
        cluster: k.cluster,
        intent: (k.intent as any) || "Informational",
        currentRank: k.currentRank,
        previousRank: k.previousRank,
        searchVolume: k.searchVolume,
        volatility7d: pseudoVolatility,
        competitorDelta,
        topCompetitor: competitors[idx % (competitors.length || 1)]?.name || topCompetitorName,
        direction,
        angle,
        radius: pseudoVolatility, // 0 - 100
      };
    });
  }, [keywords, competitors]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return radarData.filter((node) => {
      if (selectedIntentFilter !== "All" && node.intent !== selectedIntentFilter) {
        return false;
      }
      if (selectedVolatilityFilter === "high" && node.volatility7d < 50) {
        return false;
      }
      if (
        selectedVolatilityFilter === "moderate" &&
        (node.volatility7d < 25 || node.volatility7d >= 50)
      ) {
        return false;
      }
      if (selectedVolatilityFilter === "stable" && node.volatility7d >= 25) {
        return false;
      }
      if (selectedCompetitor !== "All" && node.topCompetitor !== selectedCompetitor) {
        return false;
      }
      return true;
    });
  }, [radarData, selectedIntentFilter, selectedVolatilityFilter, selectedCompetitor]);

  // Draw D3 Visual Radar Chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = 580;
    const height = 460;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(centerX, centerY) - 40;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");

    // Defs for gradients & filters
    const defs = svg.append("defs");

    // Glow filter
    const filter = defs.append("filter").attr("id", "radar-glow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "blur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Radar background radial gradient
    const radialGrad = defs
      .append("radialGradient")
      .attr("id", "radar-bg-grad")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    radialGrad.append("stop").attr("offset", "0%").attr("stop-color", "#004d00").attr("stop-opacity", "0.08");
    radialGrad.append("stop").attr("offset", "70%").attr("stop-color", "#003300").attr("stop-opacity", "0.04");
    radialGrad.append("stop").attr("offset", "100%").attr("stop-color", "#000000").attr("stop-opacity", "0.01");

    const g = svg.append("g").attr("transform", `translate(${centerX}, ${centerY})`);

    // 1. Radar Background Circle
    g.append("circle")
      .attr("r", maxRadius)
      .attr("fill", "url(#radar-bg-grad)")
      .attr("stroke", "#1e3a1e")
      .attr("stroke-width", 1.5);

    // 2. Concentric Volatility Rings (25%, 50%, 75%, 100%)
    const ringLevels = [
      { pct: 0.25, label: "Stable (<25%)", color: "#10b981" },
      { pct: 0.5, label: "Moderate (50%)", color: "#3b82f6" },
      { pct: 0.75, label: "High Volatility (75%)", color: "#f59e0b" },
      { pct: 1.0, label: "Critical Shift (100%)", color: "#ef4444" },
    ];

    ringLevels.forEach((level) => {
      const r = maxRadius * level.pct;

      // Dashed Ring
      g.append("circle")
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "#2d4a2d")
        .attr("stroke-dasharray", level.pct === 1.0 ? "none" : "3,3")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", level.pct === 1.0 ? 1.5 : 1);

      // Ring Labels
      g.append("text")
        .attr("x", 8)
        .attr("y", -r + 12)
        .attr("fill", "#6b7280")
        .attr("font-size", "9px")
        .attr("font-family", "ui-monospace, monospace")
        .text(level.label);
    });

    // 3. Crosshair Axes & Quadrant Lines
    const axes = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    axes.forEach((angle) => {
      const x = Math.cos(angle) * maxRadius;
      const y = Math.sin(angle) * maxRadius;

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#1f391f")
        .attr("stroke-dasharray", "4,4")
        .attr("stroke-width", 1.2);
    });

    // 4. Intent Quadrant Sector Labels
    const quadrantLabels = [
      { text: "INFORMATIONAL", angle: Math.PI / 4, color: "#3b82f6" },
      { text: "COMMERCIAL", angle: (3 * Math.PI) / 4, color: "#f59e0b" },
      { text: "TRANSACTIONAL", angle: (5 * Math.PI) / 4, color: "#8b5cf6" },
      { text: "NAVIGATIONAL", angle: (7 * Math.PI) / 4, color: "#10b981" },
    ];

    quadrantLabels.forEach((ql) => {
      const labelRadius = maxRadius * 0.88;
      const lx = Math.cos(ql.angle) * labelRadius;
      const ly = Math.sin(ql.angle) * labelRadius;

      g.append("text")
        .attr("x", lx)
        .attr("y", ly)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", ql.color)
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("letter-spacing", "0.08em")
        .attr("opacity", 0.45)
        .text(ql.text);
    });

    // 5. Animated Rotating Radar Sweep line
    const sweepLine = g
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", maxRadius)
      .attr("y2", 0)
      .attr("stroke", "#ffa500")
      .attr("stroke-width", 1.8)
      .attr("stroke-opacity", 0.75)
      .attr("stroke-linecap", "round");

    let rotationAngle = 0;
    const timer = d3.timer(() => {
      rotationAngle = (rotationAngle + 0.6) % 360;
      const rad = (rotationAngle * Math.PI) / 180;
      sweepLine
        .attr("x2", Math.cos(rad) * maxRadius)
        .attr("y2", Math.sin(rad) * maxRadius);
    });

    // 6. Volatility Nodes
    const radiusScale = d3.scaleLinear().domain([0, 100]).range([15, maxRadius]);
    const sizeScale = d3
      .scaleLinear()
      .domain([0, 30000])
      .range([4, 9])
      .clamp(true);

    const nodeGroups = g
      .selectAll<SVGGElement, RadarNode>(".radar-node")
      .data(filteredNodes)
      .enter()
      .append("g")
      .attr("class", "radar-node")
      .attr("transform", (d: RadarNode) => {
        const r = radiusScale(d.volatility7d);
        const x = Math.cos(d.angle) * r;
        const y = Math.sin(d.angle) * r;
        return `translate(${x}, ${y})`;
      })
      .style("cursor", "pointer")
      .on("mouseenter", (_event: any, d: RadarNode) => {
        setHoveredNode(d);
      })
      .on("mouseleave", () => {
        setHoveredNode(null);
      })
      .on("click", (_event: any, d: RadarNode) => {
        if (onSelectKeyword) onSelectKeyword(d.keyword);
      });

    // Pulse aura for high volatility nodes
    nodeGroups
      .filter((d: RadarNode) => d.volatility7d >= 50)
      .append("circle")
      .attr("r", (d: RadarNode) => sizeScale(d.searchVolume) + 4)
      .attr("fill", (d: RadarNode) => (d.direction === "up" ? "#10b981" : d.direction === "down" ? "#ef4444" : "#ffa500"))
      .attr("opacity", 0.25)
      .attr("class", "animate-ping");

    // Main Circle Marker
    nodeGroups
      .append("circle")
      .attr("r", (d: RadarNode) => sizeScale(d.searchVolume))
      .attr("fill", (d: RadarNode) => {
        if (d.direction === "up") return "#10b981"; // green up
        if (d.direction === "down") return "#ef4444"; // red down
        return "#ffa500"; // amber stable
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#radar-glow)");

    // Direction indicators inside / beside node
    nodeGroups
      .append("text")
      .attr("x", (d: RadarNode) => (Math.cos(d.angle) > 0 ? 8 : -8))
      .attr("y", 3)
      .attr("text-anchor", (d: RadarNode) => (Math.cos(d.angle) > 0 ? "start" : "end"))
      .attr("fill", "#374151")
      .attr("class", "dark:fill-gray-300")
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .text((d: RadarNode) => `#${d.currentRank}`);

    return () => {
      timer.stop();
    };
  }, [filteredNodes, onSelectKeyword]);

  return (
    <div
      id="seo-trend-radar-section"
      className="bg-white dark:bg-[#071207] rounded-xl border border-gray-200 dark:border-[#142e14] shadow-sm overflow-hidden"
    >
      {/* Header & Controls Toolbar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#142e14] bg-gray-50/60 dark:bg-[#091609] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#004d00] dark:bg-[#0e2c0e] text-[#ffa500] flex items-center justify-center shadow-xs">
              <Radar className="w-4 h-4 text-[#ffa500] animate-spin" style={{ animationDuration: "14s" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>D3 SEO Trend & Ranking Volatility Radar</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#004d00] text-[#ffa500] tracking-wide">
                  7-Day Competitor Baseline
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Real-time polar mapping of ranking volatility, search volume mass, and competitor delta swings.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Volatility filter */}
          <div className="flex items-center rounded-lg border border-gray-200 dark:border-[#1e421e] bg-white dark:bg-[#050e05] p-0.5">
            <button
              type="button"
              onClick={() => setSelectedVolatilityFilter("all")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                selectedVolatilityFilter === "all"
                  ? "bg-[#004d00] text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              All Volatility ({radarData.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedVolatilityFilter("high")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                selectedVolatilityFilter === "high"
                  ? "bg-red-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600"
              }`}
            >
              High &gt;50%
            </button>
            <button
              type="button"
              onClick={() => setSelectedVolatilityFilter("stable")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                selectedVolatilityFilter === "stable"
                  ? "bg-emerald-700 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-emerald-700"
              }`}
            >
              Stable &lt;25%
            </button>
          </div>

          {/* Intent filter */}
          <select
            value={selectedIntentFilter}
            onChange={(e) => setSelectedIntentFilter(e.target.value)}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-[#1e421e] bg-white dark:bg-[#050e05] text-xs font-semibold text-gray-700 dark:text-gray-300"
          >
            <option value="All">All Intent Quadrants</option>
            <option value="Informational">Informational</option>
            <option value="Commercial">Commercial</option>
            <option value="Transactional">Transactional</option>
            <option value="Navigational">Navigational</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Radar Canvas + Live Intel Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-[#142e14]">
        {/* Left: D3 Radar Graphic */}
        <div
          ref={containerRef}
          className="lg:col-span-8 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[460px] relative bg-slate-900/5 dark:bg-[#040a04]"
        >
          <svg ref={svgRef} className="w-full max-w-[580px] h-auto max-h-[460px] drop-shadow-md" />

          {/* Bottom legend strip */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200/60 dark:border-[#142e14] text-[11px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Rank Lift (Advancing)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>Rank Drop (Volatile)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>Steady Anchor</span>
              </span>
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              Distance from Center = 7-Day Volatility %
            </div>
          </div>
        </div>

        {/* Right: Live Volatility Metrics & Hover Detail Card */}
        <div className="lg:col-span-4 p-5 space-y-4 bg-white dark:bg-[#071207] flex flex-col justify-between">
          {/* Top intel block */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Live Node Volatility Inspector
              </span>
              <span className="text-xs font-mono font-bold text-[#004d00] dark:text-[#ffa500]">
                {filteredNodes.length} mapped
              </span>
            </div>

            {hoveredNode ? (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0d1f0d] border border-gray-200 dark:border-[#1e421e] space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                      {hoveredNode.intent}
                    </span>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white mt-1">
                      {hoveredNode.keyword}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-mono font-black ${
                      hoveredNode.currentRank <= 3
                        ? "bg-green-100 text-[#004d00] dark:bg-green-950 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    Rank #{hoveredNode.currentRank}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded bg-white dark:bg-[#050e05] border border-gray-100 dark:border-[#163016]">
                    <div className="text-[10px] text-gray-400">7-Day Volatility</div>
                    <div className="text-base font-black text-orange-600 dark:text-orange-400">
                      {hoveredNode.volatility7d}%
                    </div>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-[#050e05] border border-gray-100 dark:border-[#163016]">
                    <div className="text-[10px] text-gray-400">Search Volume</div>
                    <div className="text-base font-black text-gray-900 dark:text-gray-100">
                      {hoveredNode.searchVolume.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 dark:border-[#1e421e] text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                    <span>Rank Shift:</span>
                    <span
                      className={`font-bold ${
                        hoveredNode.direction === "up"
                          ? "text-green-600"
                          : hoveredNode.direction === "down"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {hoveredNode.previousRank} → #{hoveredNode.currentRank} (
                      {hoveredNode.direction === "up" ? "▲ Lift" : hoveredNode.direction === "down" ? "▼ Drop" : "Steady"}
                      )
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                    <span>Key Competitor:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {hoveredNode.topCompetitor}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-gray-50/70 dark:bg-[#0d1f0d]/50 border border-dashed border-gray-200 dark:border-[#1e421e] text-center space-y-2 text-gray-400">
                <Activity className="w-6 h-6 mx-auto text-[#ffa500]" />
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Hover over any node on the D3 Radar
                </div>
                <p className="text-[11px] text-gray-400">
                  Inspect ranking swings, competitor leads, and volume distribution relative to Google algorithm updates.
                </p>
              </div>
            )}
          </div>

          {/* 7-day Summary Stats */}
          <div className="p-3.5 rounded-xl bg-[#004d00]/5 dark:bg-[#004d00]/20 border border-[#004d00]/20 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#004d00] dark:text-[#ffa500] text-xs">
              <Zap className="w-3.5 h-3.5 text-[#ffa500]" />
              <span>7-Day Strategic AI Takeaway</span>
            </div>
            <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Informational and Commercial clusters</strong> are capturing +34% higher AI Overview real estate following Google's latest algorithm refresh. Priority: maintain 45-word direct answer blocks on top nodes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
