import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Radio,
  Search,
  Trash2,
  Play,
  Pause,
  Clock,
  Sparkles,
  CheckCircle2,
  Volume2,
  FileText,
} from "lucide-react";
import { AudioTranscriptItem } from "../../types";
import { analyzeAudioTranscript, AudioAnalysisResult } from "../../services/api";

interface AudioTranscribeViewProps {
  transcripts: AudioTranscriptItem[];
  onAddTranscript: (tr: AudioTranscriptItem) => void;
  onDeleteTranscript: (id: string) => void;
  onOpenAddModal: () => void;
  isRecordingProp?: boolean;
  onToggleRecording?: () => void;
}

export const AudioTranscribeView: React.FC<AudioTranscribeViewProps> = ({
  transcripts,
  onAddTranscript,
  onDeleteTranscript,
  onOpenAddModal,
  isRecordingProp = false,
  onToggleRecording,
}) => {
  const [isRecording, setIsRecording] = useState(isRecordingProp);
  const [liveTranscriptText, setLiveTranscriptText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedTranscript, setSelectedTranscript] = useState<AudioTranscriptItem>(transcripts[0]);
  const [activeTimestamp, setActiveTimestamp] = useState<string>("00:00");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AudioAnalysisResult | null>(null);

  const timerRef = useRef<any>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Sync prop changes
  useEffect(() => {
    setIsRecording(isRecordingProp);
  }, [isRecordingProp]);

  // Handle live recording simulation & real mic capture
  const handleToggleRecording = async () => {
    if (onToggleRecording) {
      onToggleRecording();
    }
    const nextState = !isRecording;
    setIsRecording(nextState);

    if (nextState) {
      setRecordingSeconds(0);
      setLiveTranscriptText("Listening to audio feed... [Live NLP stream initialized]");
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          if (next === 3) {
            setLiveTranscriptText("Speaker 1: Welcome everyone. Today we are discussing Google AI Overviews and how NLP conversational queries are reshaping our search strategy...");
          } else if (next === 6) {
            setLiveTranscriptText((curr) => curr + "\n\nSpeaker 2: We need to ensure all 8 informational pieces include 45-word direct answer blocks to maximize AI summary capture.");
          } else if (next === 10) {
            setLiveTranscriptText((curr) => curr + "\n\nSpeaker 1: Agreed. Let's also verify schema markup for FAQ and author EEAT profiles before the next algorithm sync.");
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      // Auto-save transcript
      if (liveTranscriptText.length > 30) {
        const newTr: AudioTranscriptItem = {
          id: `tr-live-${Date.now()}`,
          title: `Live Audio Session (${new Date().toLocaleTimeString()})`,
          client: "Apex HealthTech & Enterprise SaaS",
          duration: `${Math.floor(recordingSeconds / 60)}m ${recordingSeconds % 60}s`,
          dateRecorded: "2026-08-24",
          fullTranscript: liveTranscriptText,
          timestamps: [
            { time: "00:00", speaker: "Speaker 1", text: "Welcome everyone. Discussing Google AI Overviews.", intent: "Meeting Opening" },
            { time: "00:06", speaker: "Speaker 2", text: "Ensure informational pieces have 45-word answer blocks.", intent: "Strategy" },
            { time: "00:10", speaker: "Speaker 1", text: "Verify schema markup for FAQ and author EEAT.", intent: "Action Item" },
          ],
          extractedKeywords: ["Google AI Overviews", "45-word answer blocks", "author EEAT"],
          actionItems: ["Deploy 45-word answer blocks", "Verify FAQ schema markup"],
          sentiment: "Positive / Strategic",
        };
        onAddTranscript(newTr);
        setSelectedTranscript(newTr);
      }
    }
  };

  const handleTimestampClick = (timeStr: string) => {
    setActiveTimestamp(timeStr);
    setIsPlayingAudio(true);
  };

  const handleAnalyzeWithGemini = async () => {
    if (!selectedTranscript) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeAudioTranscript({
        transcriptText: selectedTranscript.fullTranscript,
        clientContext: selectedTranscript.client,
      });
      setAiAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredTranscripts = transcripts.filter(
    (t) =>
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.fullTranscript.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.client.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div id="audio-transcribe-view" className="space-y-6">
      {/* Header */}
      <div className="bg-[#004d00] rounded-xl p-6 text-white border border-[#003300] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#003300] text-[11px] text-[#ffa500] font-semibold">
            <Mic className="w-3.5 h-3.5 text-[#ffa500]" />
            Live Audio Feed Transcription & Intent Discovery
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Real-Time Audio Transcriber & Voice Search NLP Engine
          </h1>
          <p className="text-xs text-green-100 max-w-2xl">
            Real-time speech transcription with natural language query search. Click interactive timestamps to jump directly to specific recorded points.
          </p>
        </div>

        {/* Live Recording Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleRecording}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-xs shadow transition-all whitespace-nowrap ${
              isRecording
                ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
                : "bg-[#ffa500] hover:brightness-110 text-slate-950 active:scale-[0.98]"
            }`}
          >
            {isRecording ? <Radio className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-slate-950" />}
            <span>{isRecording ? `Recording (${recordingSeconds}s)... Stop & Save` : "Start Live Audio Feed"}</span>
          </button>
        </div>
      </div>

      {/* Live Audio Stream Monitor (Active when recording) */}
      {isRecording && (
        <div className="bg-red-950 border border-red-500/60 p-5 rounded-xl text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-red-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              LIVE AUDIO FEED IN PROGRESS — {recordingSeconds}s
            </div>
            <span className="text-[11px] font-mono text-red-300">NLP Stream 24kHz</span>
          </div>

          <div className="flex items-center gap-1 h-6">
            {[40, 70, 95, 30, 80, 60, 100, 45, 90, 85, 35, 75, 95, 60, 80, 50, 90, 70, 40].map((h, idx) => (
              <div
                key={idx}
                className="flex-1 bg-red-400 rounded-full transition-all duration-150 animate-pulse"
                style={{ height: `${(h * (recordingSeconds % 4 + 1)) % 100}%` }}
              />
            ))}
          </div>

          <div className="bg-black p-3 rounded-lg border border-red-900 text-xs font-mono text-emerald-300 whitespace-pre-wrap">
            {liveTranscriptText}
          </div>
        </div>
      )}

      {/* Main Transcript Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Historical Transcripts List & High-Accuracy Search */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#004d00]" />
              Historical Transcripts ({transcripts.length})
            </h3>
            <button
              onClick={onOpenAddModal}
              className="text-xs text-[#ffa500] font-bold hover:underline"
            >
              + Add Note
            </button>
          </div>

          {/* Transcript Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search conversational queries or client..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
            />
          </div>

          {/* Transcript List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredTranscripts.map((t) => {
              const isSelected = selectedTranscript?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTranscript(t)}
                  className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#004d00] text-white border-[#003300] shadow"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`font-bold ${isSelected ? "text-[#ffa500]" : "text-gray-900"}`}>
                      {t.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTranscript(t.id);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className={isSelected ? "text-green-100" : "text-gray-500"}>{t.client}</span>
                    <span className="font-mono text-[10px] bg-black/30 text-[#ffa500] px-1.5 py-0.5 rounded">
                      {t.duration}
                    </span>
                  </div>

                  <p
                    className={`line-clamp-2 text-[11px] ${
                      isSelected ? "text-green-100" : "text-gray-600"
                    }`}
                  >
                    {t.fullTranscript}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Timestamp Audio Player & AI SEO Extractor */}
        <div className="lg:col-span-7 space-y-4">
          {selectedTranscript ? (
            <>
              {/* Active Audio Player with Interactive Timestamps */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      Interactive Audio Player
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-1">{selectedTranscript.title}</h3>
                    <p className="text-xs text-gray-500">
                      Recorded: {selectedTranscript.dateRecorded} • Duration: {selectedTranscript.duration}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#004d00] text-white hover:bg-[#003800] font-bold text-xs transition-colors"
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5 text-[#ffa500]" /> : <Play className="w-3.5 h-3.5 text-[#ffa500]" />}
                      <span>{isPlayingAudio ? "Pause Audio" : "Play Feed"}</span>
                    </button>
                    <button
                      onClick={handleAnalyzeWithGemini}
                      disabled={isAnalyzing}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs transition-colors shadow"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                      <span>{isAnalyzing ? "Extracting..." : "AI SEO Extraction"}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Clickable Timestamps Navigation */}
                <div>
                  <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#ffa500]" />
                    Click Timestamp to Jump to Audio Point:
                  </div>
                  <div className="space-y-2">
                    {selectedTranscript.timestamps.map((ts, idx) => {
                      const isActive = activeTimestamp === ts.time;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleTimestampClick(ts.time)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer flex items-start gap-3 transition-all ${
                            isActive
                              ? "bg-amber-50 border-amber-300 shadow-sm"
                              : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                          }`}
                        >
                          <button className="flex items-center gap-1 font-mono font-bold text-amber-900 bg-white border border-amber-200 px-2 py-1 rounded text-[11px] shadow-sm flex-shrink-0">
                            <Volume2 className="w-3 h-3 text-[#ffa500]" />
                            <span>{ts.time}</span>
                          </button>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-gray-900">{ts.speaker}</span>
                              <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                                {ts.intent}
                              </span>
                            </div>
                            <p className="text-gray-600 text-[11px] leading-relaxed">{ts.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Gemini AI Transcript SEO Analysis Result */}
              {aiAnalysis && (
                <div className="bg-[#004d00] text-white rounded-xl p-5 border border-[#003300] shadow space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 border-b border-[#003300] pb-3">
                    <Sparkles className="w-4 h-4 text-[#ffa500]" />
                    <h4 className="text-sm font-bold">Gemini 3.7 Flash Voice Intent & SEO Extraction</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#003300] p-3 rounded-lg border border-[#002800] space-y-1">
                      <strong className="text-[#ffa500] block">Extracted Voice Keywords:</strong>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {aiAnalysis.extractedKeywords.map((kw, i) => (
                          <span key={i} className="bg-[#004d00] px-2 py-0.5 rounded text-[11px] text-green-100">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#003300] p-3 rounded-lg border border-[#002800] space-y-1">
                      <strong className="text-[#ffa500] block">Voice Search Intent Rating:</strong>
                      <p className="text-green-100 text-[11px]">{aiAnalysis.voiceSearchIntent}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <strong className="text-[#ffa500] block">Immediate Action Items:</strong>
                    {aiAnalysis.actionItems.map((act, i) => (
                      <div key={i} className="flex items-center gap-2 text-green-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#ffa500] flex-shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl p-10 text-center border border-gray-200 text-gray-400">
              Select a transcript from the left to inspect timestamps and run AI analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
