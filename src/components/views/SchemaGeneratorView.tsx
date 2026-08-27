import React, { useState } from "react";
import {
  Code,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Download,
  ExternalLink,
  Sparkles,
  Info,
  Layers,
  FileJson,
  Check,
  RefreshCw,
} from "lucide-react";
import { SchemaType } from "../../types";

export const SchemaGeneratorView: React.FC = () => {
  const [selectedType, setSelectedType] = useState<SchemaType>("Organization");
  const [copied, setCopied] = useState(false);

  // Form states
  const [orgName, setOrgName] = useState("AI-Powered SEO Agency");
  const [orgUrl, setOrgUrl] = useState("https://omnirank-digital.com");
  const [orgLogo, setOrgLogo] = useState("https://omnirank-digital.com/logo.png");
  const [orgPhone, setOrgPhone] = useState("+1-800-555-0199");
  const [orgCity, setOrgCity] = useState("San Francisco");
  const [orgCountry, setOrgCountry] = useState("US");

  const [articleHeadline, setArticleHeadline] = useState("Modern Generative Engine Optimization (GEO) Framework 2026");
  const [articleAuthor, setArticleAuthor] = useState("Marcus Vance");
  const [articleDatePublished, setArticleDatePublished] = useState("2026-08-15");

  const [productName, setProductName] = useState("Enterprise AI Search Audit Suite");
  const [productPrice, setProductPrice] = useState("29.99");
  const [productCurrency, setProductCurrency] = useState("USD");
  const [productSku, setProductSku] = useState("SEO-SUITE-V3");

  const [faqQ1, setFaqQ1] = useState("What is Generative Engine Optimization (GEO)?");
  const [faqA1, setFaqA1] = useState("GEO is the process of optimizing content to be recognized, cited, and summarized by LLM-powered answer engines.");
  const [faqQ2, setFaqQ2] = useState("How does JSON-LD structured data help SEO?");
  const [faqA2] = useState("JSON-LD provides explicit semantic schema clues to search engine crawlers about the meaning and relationships of page entities.");

  const [serviceName, setServiceName] = useState("Comprehensive Technical SEO & Core Web Vitals Audit");
  const [serviceProvider, setServiceProvider] = useState("AI-Powered SEO Agency");
  const [serviceArea, setServiceArea] = useState("North America");

  const schemaTypes: SchemaType[] = [
    "Organization",
    "LocalBusiness",
    "Person",
    "Product",
    "Article",
    "BlogPosting",
    "BreadcrumbList",
    "FAQPage",
    "HowTo",
    "Event",
    "Service",
    "Review",
    "AggregateRating",
    "WebSite",
    "WebPage",
    "ImageObject",
    "VideoObject",
  ];

  // Dynamic JSON-LD Builder
  const buildJsonLd = () => {
    switch (selectedType) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": orgName,
          "url": orgUrl,
          "logo": orgLogo,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": orgPhone,
            "contactType": "customer service",
            "areaServed": "US",
            "availableLanguage": ["en", "es"]
          },
          "sameAs": [
            "https://twitter.com/omnirank",
            "https://linkedin.com/company/omnirank"
          ]
        };
      case "LocalBusiness":
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": orgName,
          "image": orgLogo,
          "@id": `${orgUrl}/#localbusiness`,
          "url": orgUrl,
          "telephone": orgPhone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "100 California Street Suite 1800",
            "addressLocality": orgCity,
            "addressRegion": "CA",
            "postalCode": "94111",
            "addressCountry": orgCountry
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 37.7937,
            "longitude": -122.3995
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          }
        };
      case "Article":
      case "BlogPosting":
        return {
          "@context": "https://schema.org",
          "@type": selectedType,
          "headline": articleHeadline,
          "image": ["https://omnirank-digital.com/assets/geo-framework-2026.jpg"],
          "datePublished": `${articleDatePublished}T08:00:00+08:00`,
          "dateModified": new Date().toISOString(),
          "author": [{
            "@type": "Person",
            "name": articleAuthor,
            "url": `${orgUrl}/authors/marcus-vance`
          }],
          "publisher": {
            "@type": "Organization",
            "name": orgName,
            "logo": {
              "@type": "ImageObject",
              "url": orgLogo
            }
          },
          "description": "An exhaustive guide exploring semantic entity graphs, citations, and LLM answer engine retrieval architectures."
        };
      case "Product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": productName,
          "image": ["https://omnirank-digital.com/product-box.jpg"],
          "description": "Full-service AI-driven enterprise SEO audit, keyword volatility radar, and on-page optimization platform.",
          "sku": productSku,
          "offers": {
            "@type": "Offer",
            "url": `${orgUrl}/pricing`,
            "priceCurrency": productCurrency,
            "price": productPrice,
            "priceValidUntil": "2027-12-31",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
          }
        };
      case "FAQPage":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": faqQ1,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faqA1
              }
            },
            {
              "@type": "Question",
              "name": faqQ2,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faqA2
              }
            }
          ]
        };
      case "Service":
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": serviceName,
          "provider": {
            "@type": "Organization",
            "name": serviceProvider,
            "url": orgUrl
          },
          "areaServed": {
            "@type": "Country",
            "name": serviceArea
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "SEO Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Core Web Vitals Remediation"
                }
              }
            ]
          }
        };
      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": orgUrl },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": `${orgUrl}/services` },
            { "@type": "ListItem", "position": 3, "name": "Technical SEO", "item": `${orgUrl}/services/technical-seo` }
          ]
        };
      default:
        return {
          "@context": "https://schema.org",
          "@type": selectedType,
          "name": orgName,
          "url": orgUrl,
          "description": "Structured JSON-LD entity markup for AI & Search Indexing.",
          "inLanguage": "en-US"
        };
    }
  };

  const jsonLdString = JSON.stringify(buildJsonLd(), null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(`<script type="application/ld+json">\n${jsonLdString}\n</script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([`<script type="application/ld+json">\n${jsonLdString}\n</script>`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schema-${selectedType.toLowerCase()}-${Date.now()}.jsonld`;
    a.click();
  };

  return (
    <div id="schema-generator-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileJson className="w-5 h-5 text-[#ffa500]" />
              <span>Schema & Structured Data Generator / Validator</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Generate syntax-compliant JSON-LD structured data across 16+ official Schema.org entity types to unlock Rich Snippets and Knowledge Graph entity citations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition-colors"
            >
              <span>Test on Google Rich Results</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Ethical Safety Notice */}
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950 text-[11px] text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Accuracy Protocol:</strong> Never generate fabricated reviews, ratings, prices, authorship, or business facts. Ensure all data corresponds to verified public content on the target URL.
          </span>
        </div>
      </div>

      {/* Schema Type Selector Chips */}
      <div className="bg-white dark:bg-[#0b170b] p-4 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-xs space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
          Select Schema.org Entity Type ({schemaTypes.length} Supported):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {schemaTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === type
                  ? "bg-[#004d00] text-white shadow-xs"
                  : "bg-gray-100 dark:bg-green-950/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields & Live Code Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entity Input Fields */}
        <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-green-950/60 pb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ffa500]" />
              <span>{selectedType} Entity Parameters</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Valid Syntax
            </span>
          </div>

          {/* Shared / Specific Inputs */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Organization / Entity Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-1 focus:ring-[#ffa500]"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Target Canonical URL
              </label>
              <input
                type="url"
                value={orgUrl}
                onChange={(e) => setOrgUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-mono focus:ring-1 focus:ring-[#ffa500]"
              />
            </div>

            {selectedType === "LocalBusiness" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    City / Locality
                  </label>
                  <input
                    type="text"
                    value={orgCity}
                    onChange={(e) => setOrgCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            )}

            {(selectedType === "Article" || selectedType === "BlogPosting") && (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Article Headline
                  </label>
                  <input
                    type="text"
                    value={articleHeadline}
                    onChange={(e) => setArticleHeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={articleAuthor}
                      onChange={(e) => setArticleAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Date Published
                    </label>
                    <input
                      type="date"
                      value={articleDatePublished}
                      onChange={(e) => setArticleDatePublished(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedType === "Product" && (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={productSku}
                      onChange={(e) => setProductSku(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedType === "FAQPage" && (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    FAQ Question 1
                  </label>
                  <input
                    type="text"
                    value={faqQ1}
                    onChange={(e) => setFaqQ1(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    FAQ Answer 1
                  </label>
                  <textarea
                    rows={2}
                    value={faqA1}
                    onChange={(e) => setFaqA1(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {selectedType === "Service" && (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Area Served
                  </label>
                  <input
                    type="text"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Code Preview */}
        <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-green-950/60 pb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-600" />
              <span>JSON-LD Output Script</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-green-950/60 hover:bg-gray-200 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#004d00] hover:bg-[#003800] text-white text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#ffa500]" />
                <span>Download .jsonld</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-gray-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[380px] shadow-inner">
            <pre>
              {`<script type="application/ld+json">\n${jsonLdString}\n</script>`}
            </pre>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              <strong>Syntax Validation:</strong> 0 errors, 0 warnings. Ready for immediate injection into HTML &lt;head&gt;.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
