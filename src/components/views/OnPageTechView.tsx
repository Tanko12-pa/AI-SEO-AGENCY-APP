import React, { useState } from "react";
import {
  FileCode,
  Sparkles,
  Cpu,
  Copy,
  Check,
} from "lucide-react";

export const OnPageTechView: React.FC = () => {
  const [schemaType, setSchemaType] = useState<"Organization" | "FAQPage" | "Article" | "LocalBusiness">("Organization");
  const [copied, setCopied] = useState(false);

  const schemas: Record<string, string> = {
    Organization: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "AI-Powered SEO Agency",
        "url": "https://ai-powered-seo.agency",
        "logo": "https://ai-powered-seo.agency/logo.png",
        "sameAs": [
          "https://twitter.com/ai_seo_agency",
          "https://linkedin.com/company/ai-seo-agency"
        ],
        "knowsAbout": [
          "Natural Language Processing",
          "Search Engine Optimization",
          "Google AI Overviews",
          "EEAT Authority Engineering"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-800-555-0199",
          "contactType": "customer service",
          "areaServed": "US",
          "availableLanguage": "en"
        }
      },
      null,
      2
    ),
    FAQPage: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does AI Search affect website rankings in 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI search utilizes Natural Language Processing (NLP) and Machine Learning to answer conversational queries directly via AI Overviews, prioritizing search intent and verified author EEAT."
            }
          },
          {
            "@type": "Question",
            "name": "What is the importance of EEAT in modern SEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "EEAT stands for Experience, Expertise, Authoritativeness, and Trustworthiness. It acts as Google's primary quality framework to rank authoritative, human-validated content."
            }
          }
        ]
      },
      null,
      2
    ),
    Article: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "The Future of SEO: AI Search & EEAT Domination",
        "author": {
          "@type": "Person",
          "name": "Dr. Alistair Vance",
          "jobTitle": "Lead AI SEO Research Fellow",
          "worksFor": {
            "@type": "Organization",
            "name": "AI-Powered SEO Agency"
          }
        },
        "publisher": {
          "@type": "Organization",
          "name": "AI-Powered SEO Agency",
          "logo": {
            "@type": "ImageObject",
            "url": "https://ai-powered-seo.agency/logo.png"
          }
        },
        "datePublished": "2026-08-24",
        "dateModified": "2026-08-24"
      },
      null,
      2
    ),
    LocalBusiness: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "AI-Powered SEO Agency HQ",
        "image": "https://ai-powered-seo.agency/office.jpg",
        "telephone": "+1-800-555-0199",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "700 Innovation Way, Suite 400",
          "addressLocality": "San Francisco",
          "addressRegion": "CA",
          "postalCode": "94107",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 37.7749,
          "longitude": -122.4194
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "08:00",
          "closes": "18:00"
        }
      },
      null,
      2
    ),
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemas[schemaType]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="onpage-tech-view" className="space-y-6">
      {/* Header */}
      <div className="bg-[#004d00] rounded-xl p-6 text-white border border-[#003300] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#003300] text-[11px] text-[#ffa500] font-semibold">
            <FileCode className="w-3.5 h-3.5 text-[#ffa500]" />
            Pillars 2 & 3: On-Page & Technical SEO
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            On-Page Optimization & Core Web Vitals Engine
          </h1>
          <p className="text-xs text-green-100 max-w-2xl">
            Fine-tune title tags, 45-word direct answer blocks, mobile responsiveness, Interaction to Next Paint (INP), and JSON-LD structured schema.
          </p>
        </div>
      </div>

      {/* Core Web Vitals 4-Card Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">LCP (Largest Contentful Paint)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 text-[#004d00]">
              Good
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">1.1s</div>
          <p className="text-[11px] text-gray-500 mt-1">Target &lt; 2.5s (Lightning fast load)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">INP (Interaction to Next Paint)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 text-[#004d00]">
              Good
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">48ms</div>
          <p className="text-[11px] text-gray-500 mt-1">Target &lt; 200ms (Instant response)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">CLS (Cumulative Layout Shift)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 text-[#004d00]">
              Good
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">0.01</div>
          <p className="text-[11px] text-gray-500 mt-1">Target &lt; 0.1 (Zero visual jump)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Mobile Speed Score</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900">
              Score 99
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">99 / 100</div>
          <p className="text-[11px] text-gray-500 mt-1">Google Lighthouse Verified</p>
        </div>
      </div>

      {/* On-Page Optimization Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title & Meta Tags */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ffa500]" />
            Title Tags & Meta Description Rules
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
              <span className="font-bold text-[#004d00] block">Title Tag Formula:</span>
              <p className="text-gray-700 font-mono text-[11px]">
                [Primary Keyword] — [Actionable Outcome/USP] | [Brand Name]
              </p>
              <div className="text-[11px] text-gray-500">Max 58 characters to avoid mobile ellipsis truncation.</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
              <span className="font-bold text-[#004d00] block">Meta Description Formula:</span>
              <p className="text-gray-700 text-[11px]">
                Direct 145-character conversational answer stating immediate value proposition and clear CTA.
              </p>
            </div>
          </div>
        </div>

        {/* 45-Word Direct Answer Blocks for SGE */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#004d00]" />
            45-Word Direct Answer Block (AI Overview Snippet Capture)
          </h3>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-1.5">
            <span className="font-bold text-amber-900 block">SGE Target Block Placement:</span>
            <p className="text-gray-800 leading-relaxed italic">
              "AI Search optimization in 2026 relies on semantic keyword clustering, structured FAQ schema, and verified author EEAT credentials to secure citations in Google AI Overviews and answer conversational voice search queries directly."
            </p>
            <div className="text-[10px] text-[#004d00] font-semibold font-mono">
              Word Count: 38 words (Optimal snippet length: 35–48 words).
            </div>
          </div>
        </div>
      </div>

      {/* Structured Schema JSON-LD Generator */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#004d00]" />
              JSON-LD Structured Data Schema Generator
            </h3>
            <p className="text-xs text-gray-500">
              Valid schema markup required for rich snippets, knowledge graph nodes, and Google AI Overviews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={schemaType}
              onChange={(e) => setSchemaType(e.target.value as any)}
              className="text-xs p-2 rounded-lg border border-gray-300 bg-gray-50 font-bold text-gray-800"
            >
              <option value="Organization">Organization Schema</option>
              <option value="FAQPage">FAQPage Schema</option>
              <option value="Article">Article & Author EEAT Schema</option>
              <option value="LocalBusiness">LocalBusiness Schema</option>
            </select>

            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs transition-colors shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Schema"}</span>
            </button>
          </div>
        </div>

        <pre className="bg-gray-950 text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-80 leading-relaxed border border-gray-800">
          {schemas[schemaType]}
        </pre>
      </div>
    </div>
  );
};
