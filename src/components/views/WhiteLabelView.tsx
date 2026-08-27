import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Globe,
  Palette,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Printer,
  FileSpreadsheet,
  FileCode,
  Layers,
  Lock,
} from "lucide-react";
import { WhiteLabelConfig } from "../../types";

export const WhiteLabelView: React.FC = () => {
  const [config, setConfig] = useState<WhiteLabelConfig>({
    isEnabled: true,
    agencyName: "Apex Growth SEO Agency",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60",
    primaryColor: "#004d00",
    secondaryColor: "#ffa500",
    customDomain: "portal.apexgrowth-seo.com",
    supportEmail: "client-support@apexgrowth-seo.com",
    phone: "+1 (888) 555-APEX",
    address: "500 Howard Street, Suite 400, San Francisco, CA 94105",
    hidePlatformBranding: true,
    clientPortalEnabled: true,
  });

  const [clientPortalPreviewMode, setClientPortalPreviewMode] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<
    "Executive Report" | "Technical SEO Report" | "Content Report" | "Local SEO Report" | "E-commerce SEO Report"
  >("Executive Report");

  const handleDownloadReport = (format: "pdf" | "csv" | "json") => {
    const reportData = {
      agency: config.agencyName,
      reportType: selectedReportType,
      generatedDate: new Date().toISOString(),
      seoHealthScore: 94,
      organicTrafficGrowth: "+28.4%",
      leadConversionRate: "4.8%",
      topKeywordsRanking: 35,
      brandColors: { primary: config.primaryColor, secondary: config.secondaryColor },
    };

    if (format === "json") {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${config.agencyName.replace(/\s+/g, "_")}_${selectedReportType.replace(/\s+/g, "_")}.json`;
      a.click();
    } else if (format === "csv") {
      const csv = `Metric,Value\nAgency,"${config.agencyName}"\nReport,"${selectedReportType}"\nSEO Health Score,94\nTraffic Growth,+28.4%\nKeywords Ranking Top 10,35\n`;
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${config.agencyName.replace(/\s+/g, "_")}_${selectedReportType.replace(/\s+/g, "_")}.csv`;
      a.click();
    } else {
      window.print();
    }
  };

  return (
    <div id="white-label-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#ffa500]" />
              <span>White-Label Agency Mode & Client Portal Suite</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Deliver turnkey enterprise SEO dashboards, custom-branded PDF reports, and client-safe portals under your agency's domain and identity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setClientPortalPreviewMode(!clientPortalPreviewMode)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                clientPortalPreviewMode
                  ? "bg-[#ffa500] text-slate-950 ring-2 ring-[#ffa500]/50"
                  : "bg-[#004d00] hover:bg-[#003800] text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{clientPortalPreviewMode ? "Exit Client View" : "Preview Client Portal"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CLIENT PORTAL PREVIEW SIMULATOR */}
      {clientPortalPreviewMode ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b170b] border-2 border-dashed border-[#ffa500] shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-green-950 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#004d00] text-white font-black flex items-center justify-center text-base shadow">
                {config.agencyName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{config.agencyName}</h3>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Client Portal • Powered by {config.customDomain}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              Client View Active (Platform Branding Hidden)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
              <span className="text-xs text-gray-500 block">SEO Health Score</span>
              <span className="text-3xl font-black text-emerald-600 font-mono">94 / 100</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
              <span className="text-xs text-gray-500 block">Organic Traffic Momentum</span>
              <span className="text-3xl font-black text-gray-900 dark:text-white font-mono">+28.4% YoY</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
              <span className="text-xs text-gray-500 block">Completed Optimizations</span>
              <span className="text-3xl font-black text-[#004d00] dark:text-[#ffa500] font-mono">24 Tasks</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300">
            <strong>Client Privacy Guarantee:</strong> Internal team comments, contractor margins, and internal agency workflow details are completely stripped from client access.
          </div>
        </div>
      ) : (
        /* WHITE-LABEL AGENCY CONFIGURATION FORM & REPORT GENERATOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col: Brand Settings (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-green-950/60 pb-3">
              <Building2 className="w-4 h-4 text-[#ffa500]" />
              <span>Agency Brand & Domain Profile</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Agency Commercial Name
                </label>
                <input
                  type="text"
                  value={config.agencyName}
                  onChange={(e) => setConfig({ ...config, agencyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <span className="font-mono text-gray-700 dark:text-gray-300">{config.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <span className="font-mono text-gray-700 dark:text-gray-300">{config.secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Custom Client Domain / Subdomain
                </label>
                <input
                  type="text"
                  value={config.customDomain}
                  onChange={(e) => setConfig({ ...config, customDomain: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Client Support Email
                  </label>
                  <input
                    type="email"
                    value={config.supportEmail}
                    onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Support Phone Number
                  </label>
                  <input
                    type="text"
                    value={config.phone}
                    onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-2 border-t border-gray-100 dark:border-green-950/60">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.hidePlatformBranding}
                    onChange={(e) => setConfig({ ...config, hidePlatformBranding: e.target.checked })}
                    className="rounded border-gray-300 text-[#004d00] focus:ring-[#004d00]"
                  />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Strip all AI-POWERED SEO AGENCY platform tags from client reports
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.clientPortalEnabled}
                    onChange={(e) => setConfig({ ...config, clientPortalEnabled: e.target.checked })}
                    className="rounded border-gray-300 text-[#004d00] focus:ring-[#004d00]"
                  />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Enable secure Client Portal web access with individual client logins
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Col: Automated Report Generator (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-green-950/60 pb-3">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Automated Branded Report Generator</span>
              </h3>

              {/* Report Type Selector */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300 text-xs block">
                  Select Report Template:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    "Executive Report",
                    "Technical SEO Report",
                    "Content Report",
                    "Local SEO Report",
                    "E-commerce SEO Report",
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedReportType(type as any)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        selectedReportType === type
                          ? "border-[#004d00] dark:border-[#ffa500] bg-emerald-50/50 dark:bg-emerald-950/30 text-gray-900 dark:text-white"
                          : "border-gray-200 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-600 dark:text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Report Preview Summary */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-gray-900 dark:text-white">{selectedReportType} Details:</strong>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">Branded PDF Ready</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">
                  Includes executive summary, organic traffic graphs, keyword rankings, SEO health index, completed milestones, and prioritized next-month initiatives formatted with <strong>{config.agencyName}</strong> branding.
                </p>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="pt-4 border-t border-gray-100 dark:border-green-950/60 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleDownloadReport("pdf")}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white text-xs font-bold transition-all shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#ffa500]" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={() => handleDownloadReport("csv")}
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] hover:bg-gray-100 text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              <button
                onClick={() => handleDownloadReport("json")}
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] hover:bg-gray-100 text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
