import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Code2,
  FileText,
  Share2,
  MapPin,
  Globe2,
  ShoppingCart,
  ShieldCheck,
  ArrowRightLeft,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { NavigationTab } from "../../types";

interface ServicesCatalogViewProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const ServicesCatalogView: React.FC<ServicesCatalogViewProps> = ({ onNavigate }) => {
  const [selectedService, setSelectedService] = useState<string>("technical-seo");

  const services = [
    {
      id: "technical-seo",
      title: "Technical SEO",
      tagline: "Crawlability, Core Web Vitals, and Engine Foundations",
      icon: Code2,
      badge: "Foundation Pillar",
      color: "border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20",
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950",
      description:
        "Optimize crawlability, indexability, site architecture, technical performance, metadata, structured data, internal linking, XML sitemaps, robots directives, canonicalization, redirects, and other technical foundations.",
      deliverables: [
        "Full 36-Signal Automated Discovery & Crawler Scan",
        "Core Web Vitals (LCP, INP, CLS, TTFB) Field & Lab optimization",
        "XML Sitemap & Robots.txt generation & real-time validator",
        "JSON-LD Schema Markup (16+ entity types)",
        "Canonical tags, Hreflang & indexability audit",
      ],
      targetTab: "onpage-tech" as NavigationTab,
    },
    {
      id: "on-page-seo",
      title: "On-Page SEO",
      tagline: "Content Precision, Search Intent, and Semantic Relevance",
      icon: FileText,
      badge: "Ranking Velocity",
      color: "border-blue-500/40 bg-blue-50/30 dark:bg-blue-950/20",
      iconColor: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950",
      description:
        "Optimize titles, descriptions, headings, URLs, content relevance, internal links, images, search intent, semantic relevance, and page-level SEO signals.",
      deliverables: [
        "Title Tag & Meta Description CTR optimization",
        "Heading Hierarchy (H1-H4) semantic alignment",
        "Keyword density & NLP term entity enrichment",
        "Image WebP compression & descriptive Alt text audit",
        "Intent-specific landing page optimization (Commercial / Info)",
      ],
      targetTab: "ai-search-eeat" as NavigationTab,
    },
    {
      id: "off-page-seo",
      title: "Off-Page SEO & Authority Building",
      tagline: "High-Equity Backlinks, Brand Citations, and Digital PR",
      icon: Share2,
      badge: "Authority Equity",
      color: "border-indigo-500/40 bg-indigo-50/30 dark:bg-indigo-950/20",
      iconColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950",
      description:
        "Develop authority through legitimate backlink opportunities, digital PR, brand mentions, partnerships, citations, and high-quality external references.",
      deliverables: [
        "Competitor Backlink Gap Matrix (10 competitors benchmarked)",
        "High-DA Link acquisition outreach strategies",
        "Digital PR distribution & editorial syndication",
        "Unlinked brand mention monitoring & reclamation",
        "Toxic backlink toxicity audit & Disavow generation",
      ],
      targetTab: "initial-audit" as NavigationTab,
    },
    {
      id: "local-seo",
      title: "Local SEO & Google Business Profile",
      tagline: "Hyper-Local Pack Dominance and Maps Visibility",
      icon: MapPin,
      badge: "Maps & 3-Pack",
      color: "border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/20",
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950",
      description:
        "Improve visibility across local search and Maps through accurate business information, categories, services, reviews, local content, citations, location pages, and hyper-local optimization.",
      deliverables: [
        "Google Business Profile (GBP) 100% verification & category tuning",
        "NAP Consistency tracking across 50+ tier-1 directories",
        "Local citation distribution & review velocity monitoring",
        "Geo-targeted location service landing pages",
        "Local intent keyword tracking with near-me triggers",
      ],
      targetTab: "content-marketing" as NavigationTab,
    },
    {
      id: "content-marketing",
      title: "SEO Content Marketing & Authority Blogging",
      tagline: "Strategic Topic Clusters, Pillar Pages, and EEAT Content",
      icon: TrendingUp,
      badge: "Inbound Engine",
      color: "border-purple-500/40 bg-purple-50/30 dark:bg-purple-950/20",
      iconColor: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950",
      description:
        "Build strategic content systems using topic clusters, SEO-optimized articles, authority resources, FAQs, case studies, guides, and conversion-focused content.",
      deliverables: [
        "AI-assisted Topic Clustering & Content Calendar Roadmap",
        "In-depth EEAT-certified editorial briefs & outlines",
        "Original research & conversion-focused guide production",
        "FAQPage & HowTo structured data integration",
        "Historical content refresh & decay revitalization",
      ],
      targetTab: "content-marketing" as NavigationTab,
    },
    {
      id: "international-seo",
      title: "International & Multilingual SEO",
      tagline: "Hreflang Implementation and Global Search Geo-Targeting",
      icon: Globe2,
      badge: "Global Growth",
      color: "border-teal-500/40 bg-teal-50/30 dark:bg-teal-950/20",
      iconColor: "text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-950",
      description:
        "Reach international audiences through localized content, regional search strategies, multilingual optimization, international architecture, and hreflang implementation.",
      deliverables: [
        "Bidirectional Hreflang tag architecture & XML sitemap generation",
        "Country-code top-level domain (ccTLD) vs subfolder strategy",
        "Regional search intent & colloquial language keyword mapping",
        "Search Console International Targeting configuration",
        "Cross-language canonical & indexability safeguards",
      ],
      targetTab: "website-discovery" as NavigationTab,
    },
    {
      id: "ecommerce-seo",
      title: "E-commerce SEO",
      tagline: "Product Visibility, Category Architecture, and Revenue Growth",
      icon: ShoppingCart,
      badge: "Direct Sales",
      color: "border-rose-500/40 bg-rose-50/30 dark:bg-rose-950/20",
      iconColor: "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950",
      description:
        "Optimize products, collections/categories, product descriptions, structured data, technical architecture, images, internal linking, and conversion opportunities.",
      deliverables: [
        "Product Schema (Price, Availability, AggregateRating, SKU)",
        "Category page facet navigation & canonical pagination fixes",
        "High-converting unique product description frameworks",
        "Out-of-stock product handling & 301 retention flows",
        "E-commerce revenue attribution & organic conversion tracking",
      ],
      targetTab: "platform-guides" as NavigationTab,
    },
    {
      id: "white-label-seo",
      title: "White-Label SEO Services",
      tagline: "Turnkey Agency Delivery Under Your Own Brand",
      icon: ShieldCheck,
      badge: "Agency Scaler",
      color: "border-orange-500/40 bg-orange-50/30 dark:bg-orange-950/20",
      iconColor: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950",
      description:
        "Provide scalable SEO execution, analysis, optimization, project management, and reporting under an agency's own brand.",
      deliverables: [
        "Custom branded client dashboard & custom domain mapping",
        "Automated monthly PDF/HTML Executive and Technical reports",
        "Client portal mode hiding sensitive internal workflows",
        "Agency team management & role-based access control",
        "Turnkey fulfillment without agency staffing overhead",
      ],
      targetTab: "white-label" as NavigationTab,
    },
    {
      id: "migration-seo",
      title: "Migration & Replatforming SEO",
      tagline: "Preserve Traffic & Organic Equity Through Platform Shifts",
      icon: ArrowRightLeft,
      badge: "Risk Mitigation",
      color: "border-cyan-500/40 bg-cyan-50/30 dark:bg-cyan-950/20",
      iconColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950",
      description:
        "Protect organic visibility during website migrations and platform changes through URL mapping, redirects, canonical validation, sitemap comparison, pre-launch audits, launch monitoring, and post-migration recovery workflows.",
      deliverables: [
        "1:1 URL Inventory & automated 301 Redirect Map CSV generator",
        "Pre-Launch staging server crawl & indexability verification",
        "Launch-Day live DNS switch audit & canonical parity checks",
        "Post-Launch traffic volatility & 404 error radar monitoring",
        "Platform support: WordPress, Shopify, Magento, Wix, Squarespace, PHP",
      ],
      targetTab: "migration-seo" as NavigationTab,
    },
  ];

  const activeServiceData = services.find((s) => s.id === selectedService) || services[0];

  return (
    <div id="services-catalog-view" className="space-y-8 animate-in fade-in duration-300">
      {/* Required Official Master Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003800] via-[#004d00] to-[#0b280b] text-white p-6 sm:p-8 border border-green-800/80 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#ffa500]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002800] border border-[#ffa500]/40 text-[#ffa500] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official SEO Service Catalog & Agency Capabilities</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
            Put your business in front of people actively searching for your products and services.
          </h1>

          <p className="text-xs sm:text-sm text-green-100 leading-relaxed text-justify">
            AI-POWERED SEO AGENCY combines technical SEO, content optimization, local SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) to improve online visibility, attract qualified organic traffic, strengthen digital authority, and generate measurable business opportunities.
            Our platform brings together AI-powered analysis, SEO intelligence, content strategy, technical optimization, local search management, e-commerce SEO, international SEO, analytics, and continuous performance monitoring to create a complete data-driven search growth system.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate?.("website-discovery")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>Launch 36-Signal URL Discovery Scan</span>
            </button>
            <button
              onClick={() => onNavigate?.("ai-consultant")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#ffa500]" />
              <span>Ask AI SEO Consultant</span>
            </button>
          </div>
        </div>
      </div>

      {/* 9 Core Service Pillars Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>9 Dedicated SEO Service Modules</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#004d00] text-[#ffa500] font-bold">
                Production Ready
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select any core service to inspect deliverables, automated tools, and integrated workflows.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => {
            const IconComp = srv.icon;
            const isSelected = selectedService === srv.id;

            return (
              <div
                key={srv.id}
                onClick={() => setSelectedService(srv.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-[#004d00] dark:border-[#ffa500] bg-white dark:bg-[#0f230f] shadow-lg ring-2 ring-[#004d00]/20 dark:ring-[#ffa500]/20"
                    : "border-gray-200 dark:border-green-950/80 bg-white dark:bg-[#0b170b] hover:border-gray-300 dark:hover:border-green-900 shadow-xs"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${srv.iconColor}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 dark:bg-green-950 text-gray-700 dark:text-green-300">
                      {srv.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {srv.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                      {srv.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-green-950/60 mt-4 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500 dark:text-gray-400 text-[11px]">
                    {srv.deliverables.length} Deliverables
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigate) onNavigate(srv.targetTab);
                    }}
                    className="flex items-center gap-1 font-bold text-[#004d00] dark:text-[#ffa500] hover:underline"
                  >
                    <span>Open Module</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Inspection Panel for Active Service */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 dark:border-green-950/60 pb-5">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${activeServiceData.iconColor}`}>
              <activeServiceData.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {activeServiceData.title} Detailed Specifications
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {activeServiceData.badge}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {activeServiceData.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate?.(activeServiceData.targetTab)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow transition-all"
            >
              <span>Launch {activeServiceData.title} Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ffa500]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ffa500]" />
              <span>Full Service Scope & Capabilities</span>
            </h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {activeServiceData.description}
            </p>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950 space-y-2">
              <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Agency Value Proposition</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px]">
                Every action item generated through this module links directly into the centralized Agency Task Manager, provides audit verification upon completion, and formats automatically into Client-Ready white-label monthly reports.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Included Standard Deliverables & Automation</span>
            </h4>

            <ul className="space-y-2.5">
              {activeServiceData.deliverables.map((del, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950/60"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {del}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
