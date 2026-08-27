import React, { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  FileText,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import { KeywordItem, CompetitorItem } from "../types";

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  importType: "keywords" | "competitors";
  onImportKeywords?: (newKeywords: KeywordItem[]) => void;
  onImportCompetitors?: (newCompetitors: CompetitorItem[]) => void;
}

// Sample CSV templates for user convenience
const SAMPLE_KEYWORD_CSV = `Keyword,Cluster,Intent,Search Volume,Difficulty,CPC,Current Rank,AI Overview Prob
AI SEO Optimization Strategy,AI Search Optimization,Commercial,12400,68,4.50,3,88%
Google Search Grounding Best Practices,Algorithmic Visibility,Informational,8900,54,3.20,2,92%
Autonomous Content Production Engine,Content Automation,Transactional,5600,62,6.80,5,74%
Real-Time SERP Volatility Monitoring,Algorithmic Visibility,Commercial,4200,48,2.90,4,80%
Voice Search NLP Indexing 2026,Search Intent Optimization,Informational,7100,59,3.75,1,85%`;

const SAMPLE_COMPETITOR_CSV = `Name,Domain,Domain Authority,Organic Keywords,Estimated Traffic,AI Overview %,Backlinks
OmniRank Digital,omnirank-digital.com,76,28400,145k/mo,65%,12400
SearchVelocity Labs,searchvelocity.io,68,19200,92k/mo,48%,8900
ApexGrowth Solutions,apexgrowth.co,72,24100,118k/mo,58%,10200
SynapseRank Media,synapserank.com,64,15800,74k/mo,42%,6500`;

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  importType,
  onImportKeywords,
  onImportCompetitors,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [dragOver, setDragOver] = useState(false);
  const [rawCsvText, setRawCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Function to parse CSV text into array of rows
  const parseCSV = (csvContent: string) => {
    setErrorMsg(null);
    try {
      const lines = csvContent
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length < 2) {
        setErrorMsg("CSV file must contain a header line and at least one data record.");
        setParsedRows([]);
        return;
      }

      // Parse headers
      const headerLine = lines[0];
      const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase().trim());

      const dataRows: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === 0 || (values.length === 1 && !values[0])) continue;

        const rowObj: Record<string, any> = {};
        headers.forEach((hdr, idx) => {
          rowObj[hdr] = values[idx] !== undefined ? values[idx].trim() : "";
        });

        if (importType === "keywords") {
          // Extract KeywordItem fields
          const kwText =
            rowObj["keyword"] ||
            rowObj["target keyword"] ||
            rowObj["term"] ||
            rowObj["keyword focus"] ||
            values[0] ||
            "";

          if (!kwText) continue;

          const cluster =
            rowObj["cluster"] ||
            rowObj["category"] ||
            rowObj["topic"] ||
            "AI Search Optimization";

          const intentVal = (
            rowObj["intent"] ||
            rowObj["nlp intent"] ||
            rowObj["search intent"] ||
            "Commercial"
          ).trim();

          const rawVol =
            rowObj["search volume"] ||
            rowObj["volume"] ||
            rowObj["monthly volume"] ||
            "3500";
          const searchVolume = parseInt(String(rawVol).replace(/[^0-9]/g, ""), 10) || 3500;

          const rawDiff =
            rowObj["difficulty"] || rowObj["kd"] || rowObj["seo difficulty"] || "50";
          const difficulty = Math.min(100, Math.max(1, parseInt(String(rawDiff).replace(/[^0-9]/g, ""), 10) || 50));

          const rawCpc = rowObj["cpc"] || rowObj["cost per click"] || "$3.50";
          const cpc = parseFloat(String(rawCpc).replace(/[^0-9.]/g, "")) || 3.5;

          const rawRank = rowObj["current rank"] || rowObj["rank"] || rowObj["position"] || "5";
          const currentRank = Math.min(100, Math.max(1, parseInt(String(rawRank).replace(/[^0-9]/g, ""), 10) || 5));

          const rawAi =
            rowObj["ai overview prob"] ||
            rowObj["ai overview probability"] ||
            rowObj["ai overview"] ||
            rowObj["sge prob"] ||
            "75%";
          const aiOverviewProbability = Math.min(
            100,
            Math.max(0, parseInt(String(rawAi).replace(/[^0-9]/g, ""), 10) || 75)
          );

          const newKw: KeywordItem = {
            id: `kw-import-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
            keyword: kwText,
            cluster,
            intent: (["Commercial", "Informational", "Transactional", "Navigational"].includes(intentVal)
              ? intentVal
              : "Commercial") as any,
            searchVolume,
            difficulty,
            cpc: Number(cpc.toFixed(2)),
            currentRank,
            previousRank: Math.min(100, currentRank + Math.floor(Math.random() * 5) - 2),
            aiOverviewProbability,
            serpFeatures: ["AI Overview", "Featured Snippet"],
            dateAdded: new Date().toISOString().slice(0, 10),
            status: currentRank <= 3 ? "Top 3" : currentRank <= 10 ? "Top 10" : "Tracking",
            archived: false,
          };

          dataRows.push(newKw);
        } else {
          // Extract CompetitorItem fields
          const name =
            rowObj["name"] ||
            rowObj["competitor"] ||
            rowObj["company"] ||
            values[0] ||
            "";

          if (!name) continue;

          const domain =
            rowObj["domain"] ||
            rowObj["website"] ||
            rowObj["url"] ||
            `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;

          const rawDa = rowObj["domain authority"] || rowObj["da"] || rowObj["authority"] || "65";
          const domainAuthority = Math.min(100, Math.max(1, parseInt(String(rawDa).replace(/[^0-9]/g, ""), 10) || 65));

          const rawKwCount = rowObj["organic keywords"] || rowObj["keywords"] || "15000";
          const organicKeywords = parseInt(String(rawKwCount).replace(/[^0-9]/g, ""), 10) || 15000;

          const rawTraffic = rowObj["estimated traffic"] || rowObj["monthly traffic"] || rowObj["traffic"] || "85k/mo";
          const estimatedTraffic = String(rawTraffic).includes("/mo") ? String(rawTraffic) : `${rawTraffic}/mo`;

          const rawAiShare = rowObj["ai overview %"] || rowObj["ai overview presence"] || rowObj["ai overview share"] || rowObj["ai share"] || "55%";
          const aiOverviewPresence = Math.min(
            100,
            Math.max(0, parseInt(String(rawAiShare).replace(/[^0-9]/g, ""), 10) || 55)
          );

          const rawBacklinks = rowObj["backlinks"] || rowObj["backlinks count"] || "8500";
          const backlinksCount = parseInt(String(rawBacklinks).replace(/[^0-9]/g, ""), 10) || 8500;

          const rawOverlap = rowObj["overlap keywords"] || rowObj["overlap"] || "450";
          const overlapKeywordsCount = parseInt(String(rawOverlap).replace(/[^0-9]/g, ""), 10) || 450;

          const newComp: CompetitorItem = {
            id: `comp-import-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
            name,
            domain,
            domainAuthority,
            organicKeywords,
            estimatedTraffic,
            aiOverviewPresence,
            backlinksCount,
            overlapKeywordsCount,
            dateAdded: new Date().toISOString().slice(0, 10),
            archived: false,
          };

          dataRows.push(newComp);
        }
      }

      if (dataRows.length === 0) {
        setErrorMsg("No valid records could be extracted. Please verify the CSV column headers.");
      }

      setParsedRows(dataRows);
    } catch (err: any) {
      setErrorMsg(`CSV parsing error: ${err.message}`);
      setParsedRows([]);
    }
  };

  // Helper function to parse individual CSV line handling quotes and commas
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(cur);
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(cur);
    return result;
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawCsvText(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawCsvText(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  // Download Sample Template CSV
  const handleDownloadSample = () => {
    const sampleContent =
      importType === "keywords" ? SAMPLE_KEYWORD_CSV : SAMPLE_COMPETITOR_CSV;
    const blob = new Blob([sampleContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Sample_${importType === "keywords" ? "Keywords" : "Competitors"}_Import_Template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Apply Sample Data into preview
  const handleLoadSample = () => {
    const sample =
      importType === "keywords" ? SAMPLE_KEYWORD_CSV : SAMPLE_COMPETITOR_CSV;
    setFileName(`Sample_${importType}.csv`);
    setRawCsvText(sample);
    parseCSV(sample);
  };

  // Confirm Import
  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);

    try {
      if (importType === "keywords" && onImportKeywords) {
        onImportKeywords(parsedRows as KeywordItem[]);
      } else if (importType === "competitors" && onImportCompetitors) {
        onImportCompetitors(parsedRows as CompetitorItem[]);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(`Import failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="csv-bulk-import-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="csv-bulk-import-modal"
        className="bg-white dark:bg-[#0b170b] w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 dark:border-green-950/80 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#004d00] text-white px-6 py-4 flex items-center justify-between border-b border-[#003300]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#003300] text-[#ffa500]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>Bulk Import {importType === "keywords" ? "Keywords" : "Competitors"} via CSV</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ffa500] text-slate-950 font-bold">
                  CSV Engine
                </span>
              </h3>
              <p className="text-xs text-green-100 mt-0.5">
                Upload a structured CSV spreadsheet to instantly populate the dataset with automatic field mapping.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#003300] hover:bg-[#002800] text-green-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Method Tabs & Template Link */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-green-950/60 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === "upload"
                    ? "bg-[#004d00] text-white shadow-xs"
                    : "bg-gray-100 dark:bg-green-950/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                Upload File (.csv)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("paste")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === "paste"
                    ? "bg-[#004d00] text-white shadow-xs"
                    : "bg-gray-100 dark:bg-green-950/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                Paste Raw CSV Text
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#004d00] dark:text-[#ffa500] hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Data</span>
              </button>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Template</span>
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          {activeTab === "upload" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-[#004d00] bg-[#004d00]/5 dark:bg-[#004d00]/20 scale-[1.01]"
                  : "border-gray-300 dark:border-green-950 hover:border-[#004d00] hover:bg-gray-50 dark:hover:bg-[#060e06]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2.5">
                <div className="p-3.5 rounded-full bg-emerald-50 dark:bg-[#004d00]/40 text-[#004d00] dark:text-[#ffa500]">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {fileName ? `Selected: ${fileName}` : "Drag and drop your CSV file here, or click to browse"}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Supports standard UTF-8 CSV with column headers (Keyword, Volume, Intent, Cluster, Rank, etc.)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="font-bold text-gray-700 dark:text-gray-300 block">
                Paste CSV Contents:
              </label>
              <textarea
                value={rawCsvText}
                onChange={(e) => {
                  setRawCsvText(e.target.value);
                  parseCSV(e.target.value);
                }}
                rows={6}
                placeholder={`Keyword,Cluster,Intent,Search Volume,Difficulty,CPC,Current Rank\nAI Agent SEO,AI Search,Commercial,12000,65,4.20,2`}
                className="w-full p-3 font-mono text-xs rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
              />
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview Parsed Records */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Preview Parsed Records ({parsedRows.length} ready to import)</span>
                </h4>
                <span className="text-[11px] text-gray-500 font-mono">
                  Schema valid • Ready to inject
                </span>
              </div>

              <div className="border border-gray-200 dark:border-green-950 rounded-xl overflow-x-auto max-h-52 overflow-y-auto">
                <table className="w-full text-left text-[11px] divide-y divide-gray-200 dark:divide-green-950/60">
                  <thead className="bg-gray-50 dark:bg-[#060e06] sticky top-0 font-bold text-gray-500 dark:text-gray-400">
                    {importType === "keywords" ? (
                      <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Keyword Phrase</th>
                        <th className="p-2">Cluster</th>
                        <th className="p-2">Intent</th>
                        <th className="p-2 text-right">Volume</th>
                        <th className="p-2 text-center">Rank</th>
                        <th className="p-2 text-center">AI Prob</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Competitor</th>
                        <th className="p-2">Domain</th>
                        <th className="p-2 text-center">DA</th>
                        <th className="p-2 text-right">Keywords</th>
                        <th className="p-2 text-right">Traffic</th>
                        <th className="p-2 text-center">AI Share</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-green-950/40 bg-white dark:bg-[#0b170b]">
                    {parsedRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#163016]/40">
                        <td className="p-2 text-gray-400 font-mono">{idx + 1}</td>
                        {importType === "keywords" ? (
                          <>
                            <td className="p-2 font-bold text-gray-900 dark:text-white">{row.keyword}</td>
                            <td className="p-2 text-gray-600 dark:text-gray-300">{row.cluster}</td>
                            <td className="p-2">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                {row.intent}
                              </span>
                            </td>
                            <td className="p-2 text-right font-mono text-gray-700 dark:text-gray-300">
                              {row.searchVolume.toLocaleString()}
                            </td>
                            <td className="p-2 text-center font-bold text-emerald-600">#{row.currentRank}</td>
                            <td className="p-2 text-center font-mono text-[#ffa500] font-bold">
                              {row.aiOverviewProbability}%
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-2 font-bold text-gray-900 dark:text-white">{row.name}</td>
                            <td className="p-2 font-mono text-gray-600 dark:text-gray-300">{row.domain}</td>
                            <td className="p-2 text-center font-bold text-emerald-600">{row.domainAuthority}</td>
                            <td className="p-2 text-right font-mono text-gray-700 dark:text-gray-300">
                              {row.organicKeywords.toLocaleString()}
                            </td>
                            <td className="p-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                              {row.estimatedTraffic}
                            </td>
                            <td className="p-2 text-center font-mono text-[#ffa500] font-bold">
                              {row.aiOverviewPresence}%
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 dark:bg-[#060e06] px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-green-950/80">
          <div className="text-gray-500 dark:text-gray-400 text-xs">
            {parsedRows.length > 0
              ? `${parsedRows.length} valid item${parsedRows.length > 1 ? "s" : ""} loaded`
              : "Select or drop a CSV file to continue"}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-green-950/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={parsedRows.length === 0 || isProcessing}
              onClick={handleConfirmImport}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#004d00] hover:bg-[#003800] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-[#ffa500]" />
              <span>
                {isProcessing ? "Importing..." : `Import ${parsedRows.length} ${importType === "keywords" ? "Keywords" : "Competitors"}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
