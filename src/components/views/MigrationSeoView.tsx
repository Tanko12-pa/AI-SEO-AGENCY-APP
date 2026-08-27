import React, { useState } from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Zap,
  Plus,
  Trash2,
  Check,
  Layers,
  ArrowRight,
  RefreshCw,
  FileText,
} from "lucide-react";
import { RedirectMappingItem, MigrationAuditTask } from "../../types";

const INITIAL_MAPPINGS: RedirectMappingItem[] = [
  {
    id: "red-1",
    oldUrl: "https://old-store.com/products/seo-audit-suite.php",
    newUrl: "https://new-omnirank.com/products/ai-seo-suite",
    statusCode: 301,
    category: "Product Detail",
    status: "Mapped",
    trafficWeight: "High",
    sourcePlatform: "Custom PHP",
    targetPlatform: "Shopify Plus",
  },
  {
    id: "red-2",
    oldUrl: "https://old-store.com/category/tech-seo/?p=2",
    newUrl: "https://new-omnirank.com/collections/technical-seo",
    statusCode: 301,
    category: "Category Archive",
    status: "Mapped",
    trafficWeight: "Medium",
    sourcePlatform: "WordPress / WooCommerce",
    targetPlatform: "Shopify Plus",
  },
  {
    id: "red-3",
    oldUrl: "https://old-store.com/blog/2024/05/local-seo-tricks",
    newUrl: "https://new-omnirank.com/insights/local-seo-strategy",
    statusCode: 301,
    category: "Editorial Blog",
    status: "Mapped",
    trafficWeight: "High",
    sourcePlatform: "WordPress",
    targetPlatform: "Next.js Custom",
  },
  {
    id: "red-4",
    oldUrl: "https://old-store.com/about_company.html",
    newUrl: "https://new-omnirank.com/about",
    statusCode: 301,
    category: "Corporate Page",
    status: "Mapped",
    trafficWeight: "Low",
    sourcePlatform: "Static HTML",
    targetPlatform: "Next.js Custom",
  },
  {
    id: "red-5",
    oldUrl: "https://old-store.com/services/old-schema-tool",
    newUrl: "https://new-omnirank.com/services/schema-generator",
    statusCode: 301,
    category: "Service Landing",
    status: "Mapped",
    trafficWeight: "High",
    sourcePlatform: "Magento 2",
    targetPlatform: "Shopify Plus",
  },
];

const INITIAL_CHECKLIST: MigrationAuditTask[] = [
  { id: "task-1", phase: "Pre-Launch", title: "Complete 1:1 Old URL Inventory Extraction", status: "Completed", priority: "Critical", details: "Scraped 420 legacy URLs from old sitemaps and Search Console top landing pages." },
  { id: "task-2", phase: "Pre-Launch", title: "Generate 301 Redirect Mapping Matrix", status: "Completed", priority: "Critical", details: "Mapped all 420 legacy URLs to new responsive paths without redirect loops." },
  { id: "task-3", phase: "Pre-Launch", title: "Staging Server Canonical & Hreflang Validation", status: "In Progress", priority: "High", details: "Ensure staging URLs self-canonicalize and noindex is removed before DNS switch." },
  { id: "task-4", phase: "Launch-Day", title: "Execute Live DNS Switch & SSL Verification", status: "Pending", priority: "Critical", details: "Monitor TTL propagation and confirm HTTPS certificate validity on root domain." },
  { id: "task-5", phase: "Launch-Day", title: "Submit New XML Sitemap to Google Search Console", status: "Pending", priority: "High", details: "Submit new sitemap_index.xml and trigger URL inspection on top 20 landing pages." },
  { id: "task-6", phase: "Post-Launch Monitoring", title: "Real-time 404 & SERP Churn Radar Tracking", status: "Pending", priority: "Critical", details: "Continuous automated monitoring of crawl errors, server response times, and ranking shifts." },
];

export const MigrationSeoView: React.FC = () => {
  const [mappings, setMappings] = useState<RedirectMappingItem[]>(INITIAL_MAPPINGS);
  const [checklist, setChecklist] = useState<MigrationAuditTask[]>(INITIAL_CHECKLIST);
  const [sourcePlatform, setSourcePlatform] = useState("WordPress");
  const [targetPlatform, setTargetPlatform] = useState("Shopify");
  const [newOldUrl, setNewOldUrl] = useState("");
  const [newNewUrl, setNewNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("Product Page");

  const handleAddMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOldUrl || !newNewUrl) return;

    const newItem: RedirectMappingItem = {
      id: `red-${Date.now()}`,
      oldUrl: newOldUrl,
      newUrl: newNewUrl,
      statusCode: 301,
      category: newCategory,
      status: "Mapped",
      trafficWeight: "Medium",
      sourcePlatform,
      targetPlatform,
    };

    setMappings([newItem, ...mappings]);
    setNewOldUrl("");
    setNewNewUrl("");
  };

  const handleDeleteMapping = (id: string) => {
    setMappings(mappings.filter((m) => m.id !== id));
  };

  const handleExportRedirectCsv = () => {
    const headers = "Old URL,New URL,Status Code,Category,Traffic Weight,Source Platform,Target Platform\n";
    const rows = mappings
      .map(
        (m) =>
          `"${m.oldUrl}","${m.newUrl}",${m.statusCode},"${m.category}","${m.trafficWeight}","${m.sourcePlatform}","${m.targetPlatform}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `redirect-mapping-matrix-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div id="migration-seo-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-[#ffa500]" />
              <span>Migration & Replatforming SEO Manager</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Protect search traffic, PageRank equity, and keyword rankings during CMS migrations, domain shifts, and platform replatforming.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportRedirectCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] hover:bg-gray-100 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download 301 Redirect CSV</span>
            </button>
          </div>
        </div>

        {/* Platform Selector Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950 text-xs">
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Source CMS / Platform
            </label>
            <select
              value={sourcePlatform}
              onChange={(e) => setSourcePlatform(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-green-950 bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white font-medium"
            >
              <option value="WordPress">WordPress / WooCommerce</option>
              <option value="Shopify">Shopify / Shopify Plus</option>
              <option value="Magento">Magento 2 / Adobe Commerce</option>
              <option value="Wix">Wix / Wix Studio</option>
              <option value="Squarespace">Squarespace 7.1</option>
              <option value="Custom PHP">Custom PHP / Legacy App</option>
              <option value="Other">Other Custom Stack</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Target CMS / Platform
            </label>
            <select
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-green-950 bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white font-medium"
            >
              <option value="Shopify">Shopify / Shopify Plus</option>
              <option value="WordPress">WordPress / Headless WP</option>
              <option value="Magento">Adobe Commerce / Magento</option>
              <option value="Next.js">Next.js / Custom React Stack</option>
              <option value="Wix">Wix Studio</option>
              <option value="Squarespace">Squarespace</option>
            </select>
          </div>
        </div>
      </div>

      {/* Migration Risk Report & Readiness Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Migration Risk Index</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-600 font-mono">Low Risk (8%)</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
              Ready for Launch
            </span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            0 redirect loops detected; 100% of high-traffic URLs have valid 301 mappings.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Mapped URL Inventory</span>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{mappings.length} URLs Mapped</div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            All legacy canonicals matched with appropriate new responsive routes.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Post-Launch Radar</span>
          <div className="text-2xl font-bold text-[#004d00] dark:text-[#ffa500] font-mono">Active (24/7)</div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Real-time ping alerts scheduled for 404 spikes and canonical conflicts.
          </p>
        </div>
      </div>

      {/* Migration Checklist Breakdown */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Pre-Launch, Launch-Day, & Post-Launch SEO Protocol</span>
        </h3>

        <div className="divide-y divide-gray-100 dark:divide-green-950/60">
          {checklist.map((task) => (
            <div key={task.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-green-950 text-gray-600 dark:text-gray-300">
                    {task.phase}
                  </span>
                  <h4 className="font-bold text-gray-900 dark:text-white">{task.title}</h4>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-[11px]">{task.details}</p>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-center shrink-0 ${
                  task.status === "Completed"
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                    : task.status === "In Progress"
                    ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                    : "bg-gray-100 dark:bg-green-950 text-gray-600 dark:text-gray-300"
                }`}
              >
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Redirect Mapping Table & Creator */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#ffa500]" />
          <span>Active 301 Redirect Mapping Matrix</span>
        </h3>

        {/* Quick Add URL Pair Form */}
        <form onSubmit={handleAddMapping} className="p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <input
            type="url"
            placeholder="Old URL (e.g. /old-product.php)"
            value={newOldUrl}
            onChange={(e) => setNewOldUrl(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-green-950 bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white"
          />
          <input
            type="url"
            placeholder="New URL (e.g. /products/new-product)"
            value={newNewUrl}
            onChange={(e) => setNewNewUrl(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-green-950 bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Category (e.g. Product)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-green-950 bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#004d00] hover:bg-[#003800] text-white font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#ffa500]" />
            <span>Add 301 Mapping</span>
          </button>
        </form>

        {/* Mappings List */}
        <div className="divide-y divide-gray-100 dark:divide-green-950/60 overflow-x-auto">
          {mappings.map((map) => (
            <div key={map.id} className="py-3 flex items-center justify-between gap-4 text-xs font-mono">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    301
                  </span>
                  <span className="text-gray-500 line-through truncate max-w-xs sm:max-w-md">{map.oldUrl}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold pl-8">
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-xs sm:max-w-md">{map.newUrl}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-sans">
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-green-950 text-gray-600 dark:text-gray-300">
                  {map.category}
                </span>
                <button
                  onClick={() => handleDeleteMapping(map.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
