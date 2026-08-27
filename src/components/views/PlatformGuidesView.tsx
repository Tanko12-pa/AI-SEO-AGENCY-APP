import React, { useState } from "react";
import {
  Code,
  Globe,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Layers,
  FileText,
  Zap,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface PlatformGuide {
  id: string;
  name: string;
  category: "Open Source CMS" | "E-Commerce" | "SaaS Website Builder" | "Custom Framework";
  logoBg: string;
  badge: string;
  tagline: string;
  overview: string;
  officialLinks: { title: string; url: string; note: string }[];
  pluginsAndTools: { name: string; url: string; purpose: string }[];
  checklist: string[];
  bestPractices: string[];
}

export const PlatformGuidesView: React.FC = () => {
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>("wordpress");

  const platforms: PlatformGuide[] = [
    {
      id: "wordpress",
      name: "WordPress / WooCommerce",
      category: "Open Source CMS",
      logoBg: "bg-blue-600 text-white",
      badge: "Market Leader (43% Web Share)",
      tagline: "Unrivaled Plugin Ecosystem & Custom Taxonomies",
      overview:
        "WordPress powers millions of commercial websites. Effective WordPress SEO requires optimal permalink architecture, automated XML sitemaps, caching mechanisms (Redis/WP Rocket), and robust plugin configuration.",
      officialLinks: [
        {
          title: "WordPress / Yoast SEO Help Portal",
          url: "https://yoast.com/help/",
          note: "Comprehensive step-by-step guides for meta tags, readability, and schema setup.",
        },
        {
          title: "Google Search Central SEO Starter Guide",
          url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide/",
          note: "Foundational search optimization guidelines directly from Google engineers.",
        },
      ],
      pluginsAndTools: [
        {
          name: "Yoast SEO",
          url: "https://yoast.com/wordpress/plugins/seo/",
          purpose: "XML sitemap generation, content readability analysis, and canonical controls.",
        },
        {
          name: "Rank Math SEO",
          url: "https://rankmath.com/",
          purpose: "Built-in 16+ Schema markup generator, keyword rank tracker, and 404 monitor.",
        },
        {
          name: "All in One SEO (AIOSEO)",
          url: "https://aioseo.com/",
          purpose: "Smart XML sitemaps, local SEO module, and TruSEO on-page scoring.",
        },
      ],
      checklist: [
        "Set clean permalinks structure to /%postname%/ in Settings > Permalinks.",
        "Ensure 'Discourage search engines from indexing this site' is UNCHECKED.",
        "Install and configure a reputable SEO plugin (Rank Math, Yoast, or AIOSEO).",
        "Enable automated XML sitemap generation and submit sitemap_index.xml to GSC.",
        "Configure Redis or FastCGI server-side object caching for <150ms TTFB.",
      ],
      bestPractices: [
        "Disable archive pages for authors and dates to prevent thin duplicate content.",
        "Optimize WooCommerce category facets to self-canonicalize.",
        "Leverage WebP Express to convert media uploads automatically.",
      ],
    },
    {
      id: "shopify",
      name: "Shopify / Shopify Plus",
      category: "E-Commerce",
      logoBg: "bg-emerald-600 text-white",
      badge: "E-Commerce Enterprise",
      tagline: "High-Volume Product Catalog & Structured Data Optimization",
      overview:
        "Shopify offers high performance out of the box. However, managing collection URL duplication (e.g. /collections/all/products vs /products), structured Product schema, and facet indexation requires tailored configuration.",
      officialLinks: [
        {
          title: "Official Shopify SEO Guide",
          url: "https://help.shopify.com/en/manual/promoting-marketing/seo",
          note: "Official documentation covering sitemaps, robots.txt customization, and metadata.",
        },
        {
          title: "Yoast SEO for Shopify Developer Docs",
          url: "https://developer.yoast.com/shopify/",
          note: "Advanced headless and liquid template SEO configuration for Shopify stores.",
        },
      ],
      pluginsAndTools: [
        {
          name: "SEO Manager",
          url: "https://apps.shopify.com/seo-manager",
          purpose: "Automated 404 error repair, Google result simulator, and JSON-LD markup.",
        },
        {
          name: "Plug in SEO",
          url: "https://apps.shopify.com/plug-in-seo",
          purpose: "Fix broken links, meta tag templating, and rich snippets for products.",
        },
        {
          name: "Smart SEO",
          url: "https://apps.shopify.com/smart-seo",
          purpose: "Instant JSON-LD schema generation and multi-language meta optimization.",
        },
      ],
      checklist: [
        "Modify product grid liquid templates to point directly to root /products/ URLs.",
        "Customized robots.txt.liquid to disallow query parameters and internal search /search?q=.",
        "Inject valid Product schema (Price, Availability, SKU, AggregateRating).",
        "Compress product hero assets under 150KB in WebP format.",
        "Set 301 redirects for discontinued products to closest category collections.",
      ],
      bestPractices: [
        "Create dedicated high-intent collections with custom editorial introductory copy.",
        "Prevent infinite tag duplication through canonical tags.",
        "Use Shopify's native blog engine to build topic clusters supporting money collections.",
      ],
    },
    {
      id: "magento",
      name: "Magento 2 / Adobe Commerce",
      category: "E-Commerce",
      logoBg: "bg-orange-600 text-white",
      badge: "Complex Enterprise Catalogs",
      tagline: "Large-Scale Category Architectures & Layered Navigation",
      overview:
        "Adobe Commerce / Magento provides extreme catalog flexibility. Managing faceted navigation canonicals, multi-store Hreflang setups, and Varnish caching is critical to preventing index bloat.",
      officialLinks: [
        {
          title: "Adobe Commerce SEO Overview & Documentation",
          url: "https://experienceleague.adobe.com/en/docs/commerce-admin/marketing/seo/seo-overview/",
          note: "Official guide on URL rewrites, sitemaps, and rich snippet configuration.",
        },
        {
          title: "Magento Marketing SEO Guide",
          url: "https://experienceleague.adobe.com/docs/commerce-admin/marketing/seo/seo.html",
          note: "Configuring canonical link meta-tags for categories and products.",
        },
      ],
      pluginsAndTools: [
        {
          name: "MageWorx SEO Suite Ultimate",
          url: "https://mageworx.com/seo-suite",
          purpose: "Faceted navigation canonical controls, cross-domain Hreflang, and rich schema.",
        },
        {
          name: "Amasty SEO Toolkit",
          url: "https://amasty.com/magento-seo-suite.html",
          purpose: "Automated meta tag templates, dynamic XML/HTML sitemaps, and redirect manager.",
        },
      ],
      checklist: [
        "Enable 'Use Canonical Link Meta Tag For Categories' in Stores > Configuration > Catalog > SEO.",
        "Enable 'Use Canonical Link Meta Tag For Products' to point to top-level URL.",
        "Configure layered navigation filters to add noindex, follow to multi-attribute states.",
        "Enable Full Page Caching (FPC) with Varnish 7.",
        "Configure automated daily XML sitemap regeneration with priority weighting.",
      ],
      bestPractices: [
        "Audit robots.txt to disallow /catalogsearch/ and /checkout/ paths.",
        "Structure multi-store views with explicit bidirectional Hreflang references.",
      ],
    },
    {
      id: "php-custom",
      name: "Custom PHP & Node.js Web Applications",
      category: "Custom Framework",
      logoBg: "bg-indigo-600 text-white",
      badge: "Maximum Technical Control",
      tagline: "Raw Performance, Server-Side Rendering & Dynamic Headers",
      overview:
        "Custom-built PHP, Laravel, and Node.js applications offer full control over HTTP headers, HTML payload generation, and server response times. Ensuring dynamic sitemap scripts and correct HTTP status codes is paramount.",
      officialLinks: [
        {
          title: "PHP Documentation & Architecture",
          url: "https://www.php.net/manual/en/",
          note: "Header manipulation, output buffering, and secure server-side scripting.",
        },
        {
          title: "Google Search Central SEO Guide",
          url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
          note: "Technical foundations for bespoke and server-rendered web architectures.",
        },
      ],
      pluginsAndTools: [
        {
          name: "Screaming Frog SEO Spider",
          url: "https://www.screamingfrog.co.uk/seo-spider/user-guide/",
          purpose: "Perform automated local crawls against staging and production builds.",
        },
        {
          name: "Schema.org Official Validator",
          url: "https://schema.org/docs/developers.html",
          purpose: "Validate bespoke JSON-LD payloads generated via PHP backend templates.",
        },
      ],
      checklist: [
        "Enforce strict 301 redirects from non-canonical protocols (HTTP to HTTPS) in .htaccess or Nginx.",
        "Generate dynamic XML sitemaps with proper Last-Modified headers from the database.",
        "Send correct HTTP status codes (404 for missing pages, 410 for permanently deleted records).",
        "Implement OPcache and Redis caching layers for sub-100ms server response times.",
        "Inject Open Graph, Twitter Cards, and canonical tags in the global layout template.",
      ],
      bestPractices: [
        "Always escape user inputs in meta generation to prevent XSS vulnerabilities.",
        "Ensure server-side rendering (SSR) delivers the complete DOM without requiring client-side JS evaluation.",
      ],
    },
    {
      id: "squarespace",
      name: "Squarespace 7.1",
      category: "SaaS Website Builder",
      logoBg: "bg-slate-900 text-white",
      badge: "Design-Centric SaaS",
      tagline: "Clean Visual Layouts & Built-In Accelerated Mobile Styles",
      overview:
        "Squarespace handles hosting and SSL automatically. Key areas of focus include customizing page-level SEO titles/descriptions, adding descriptive image alt text, and structuring heading tags.",
      officialLinks: [
        {
          title: "Official Squarespace SEO Basics Guide",
          url: "https://support.squarespace.com/hc/en-us/articles/360001386507-SEO-basics",
          note: "Core guide on site titles, page descriptions, and search preview customization.",
        },
        {
          title: "Squarespace Visibility & Search Engine Optimization",
          url: "https://support.squarespace.com/hc/en-us/articles/205814568-Increasing-your-site-s-visibility-to-search-engines/",
          note: "Step-by-step checklist to increase organic visibility for Squarespace websites.",
        },
      ],
      pluginsAndTools: [
        {
          name: "Google Search Console Integration",
          url: "https://support.google.com/webmasters/answer/",
          purpose: "Connect verified domain directly via Squarespace Settings > Connected Accounts.",
        },
      ],
      checklist: [
        "Fill out unique SEO Title and SEO Description for every page in Page Settings > SEO.",
        "Set site-wide SEO Title Format to '%p | %s' in Marketing > SEO.",
        "Add descriptive Alt Text to all gallery and banner image blocks.",
        "Use URL Mapping in Settings > Advanced > URL Mappings for any renamed slugs.",
        "Connect domain to Google Search Console directly via Squarespace panel.",
      ],
      bestPractices: [
        "Avoid using multiple H1 tags within individual page sections.",
        "Ensure location info is formatted with Schema.org LocalBusiness markup in footer code injection.",
      ],
    },
    {
      id: "wix",
      name: "Wix / Wix Studio",
      category: "SaaS Website Builder",
      logoBg: "bg-sky-600 text-white",
      badge: "Rapid Visual Prototyping",
      tagline: "Wix SEO Wiz, Custom Canonical URLs, and Structured Data",
      overview:
        "Modern Wix Studio provides advanced SEO capabilities including URL redirect managers, customizable canonicals, structured data injection, and automated sitemap updates.",
      officialLinks: [
        {
          title: "Official Wix SEO Tools Guide",
          url: "https://support.wix.com/en/article/seo-tools",
          note: "Overview of SEO Wiz, URL Redirect Manager, and custom meta tags.",
        },
        {
          title: "Wix Search Engine Optimization (SEO) Knowledge Base",
          url: "https://support.wix.com/en/article/search-engine-optimization-seo/",
          note: "Best practices for mobile responsiveness, speed, and indexing on Wix.",
        },
      ],
      pluginsAndTools: [
        {
          name: "Wix SEO Wiz",
          url: "https://support.wix.com/en/article/search-engine-optimization-seo/",
          purpose: "Personalized SEO plan and automated Google Search Console domain verification.",
        },
      ],
      checklist: [
        "Complete the step-by-step Wix SEO Wiz checklist to verify ownership on Google.",
        "Customize URL slugs to avoid auto-generated parameters.",
        "Add structured data JSON-LD in Page Settings > Advanced SEO > Structured Data.",
        "Configure custom canonical tags where duplicate variants exist.",
        "Enable automatic WebP image conversion and responsive image sizing.",
      ],
      bestPractices: [
        "Organize blog categories into clean thematic silos.",
        "Use Wix URL Redirect Manager to set 301 rules when changing page URLs.",
      ],
    },
  ];

  const activePlatform = platforms.find((p) => p.id === selectedPlatformId) || platforms[0];

  return (
    <div id="platform-guides-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#ffa500]" />
              <span>Platform-Specific SEO Guides & Documentation Hub</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Curated official documentation, setup guides, and top plugin references for WordPress, Shopify, Magento, Custom PHP, Squarespace, and Wix.
            </p>
          </div>
        </div>

        {/* Platform Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {platforms.map((p) => {
            const isSelected = selectedPlatformId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatformId(p.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-[#004d00] dark:border-[#ffa500] bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-[#004d00]/20"
                    : "border-gray-200 dark:border-green-950 bg-white dark:bg-[#060e06] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-3 h-3 rounded-full ${p.logoBg}`} />
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{p.name}</h4>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate">{p.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Guide Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checklist & Official Links */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Header & Checklist */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-green-950/60 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{activePlatform.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {activePlatform.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                  {activePlatform.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {activePlatform.overview}
            </p>

            {/* Implementation Checklist */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tailored SEO Implementation Checklist</span>
              </h4>

              <div className="space-y-2">
                {activePlatform.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950 text-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Official Documentation Cards */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-[#ffa500]" />
              <span>Official Documentation & Authoritative Resources</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activePlatform.officialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl border border-gray-200 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] hover:border-emerald-500 transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                        {link.title}
                      </h5>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      {link.note}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 truncate block">
                    {link.url}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Plugins & Recommended Tools */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Recommended Extensions & Plugins</span>
            </h4>

            <div className="space-y-3">
              {activePlatform.pluginsAndTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-gray-900 dark:text-white font-bold">{tool.name}</strong>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#004d00] dark:text-[#ffa500] hover:underline flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <span>Install / View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
                    {tool.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Agency Pro-Tips for {activePlatform.name}</span>
            </h4>
            <ul className="space-y-2 text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed">
              {activePlatform.bestPractices.map((bp, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{bp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
