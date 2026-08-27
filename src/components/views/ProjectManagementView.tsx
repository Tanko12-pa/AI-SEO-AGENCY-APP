import React, { useState } from "react";
import {
  CheckSquare,
  Clock,
  User,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Sparkles,
} from "lucide-react";
import { AgencyTaskItem } from "../../types";

const INITIAL_TASKS: AgencyTaskItem[] = [
  {
    id: "task-1",
    title: "Execute Technical Crawl & Fix 4 Staging Noindex Tags",
    clientName: "OmniRank Digital",
    category: "Technical Audit",
    assignee: "Alex Rivera (Lead Tech)",
    deadline: "2026-08-30",
    priority: "Critical",
    status: "In Progress",
    progressPercentage: 65,
    commentsCount: 4,
  },
  {
    id: "task-2",
    title: "Harmonize NAP Consistency & Google Business Profile Categories",
    clientName: "Bay Area Legal Group",
    category: "Local SEO",
    assignee: "Sarah Chen (Local Specialist)",
    deadline: "2026-09-02",
    priority: "High",
    status: "New",
    progressPercentage: 20,
    commentsCount: 2,
  },
  {
    id: "task-3",
    title: "Draft 4 Topic Cluster Pillar Articles on Generative Engine Optimization",
    clientName: "OmniRank Digital",
    category: "Content Campaign",
    assignee: "David Miller (Content Strategist)",
    deadline: "2026-09-05",
    priority: "High",
    status: "Client Review",
    progressPercentage: 85,
    commentsCount: 7,
  },
  {
    id: "task-4",
    title: "Generate 301 Redirect Mapping for Shopify Store Migration",
    clientName: "Apex Retailers LLC",
    category: "Migration",
    assignee: "Alex Rivera (Lead Tech)",
    deadline: "2026-09-01",
    priority: "Critical",
    status: "Approved",
    progressPercentage: 100,
    commentsCount: 5,
  },
  {
    id: "task-5",
    title: "Audit Category Facet Pagination & Product Schema Markup",
    clientName: "Luxe Goods Direct",
    category: "E-commerce SEO",
    assignee: "Elena Rostova (E-Com Analyst)",
    deadline: "2026-09-08",
    priority: "Medium",
    status: "New",
    progressPercentage: 10,
    commentsCount: 1,
  },
  {
    id: "task-6",
    title: "Monthly Algorithm SERP Volatility Digest & Client Reporting",
    clientName: "All Retained Clients (18)",
    category: "Monthly Maintenance",
    assignee: "Marcus Vance (Agency Director)",
    deadline: "2026-08-31",
    priority: "High",
    status: "In Progress",
    progressPercentage: 50,
    commentsCount: 3,
  },
];

const AUTOMATION_RULES = [
  { trigger: "High Impressions (>5,000) & Low CTR (<2.0%)", action: "Automatically creates Task: 'Review Title Tag & Meta Description CTR'", status: "Active (Listening)" },
  { trigger: "Page Indexability Lost (Accidental Noindex / 4xx)", action: "Instantly flags Critical P1 Technical Alert & assigns Tech Lead", status: "Active (Listening)" },
  { trigger: "Spike in 404 Not Found Crawl Errors (>5 URLs)", action: "Auto-generates 301 Redirect Repair Recommendation in Migration Engine", status: "Active (Listening)" },
  { trigger: "Organic Traffic Decline >15% Over 14-Day Window", action: "Dispatches Automated Deep SEO Diagnostic Investigation to AI Consultant", status: "Active (Listening)" },
  { trigger: "Historical Pillar Content Ranking Dip (>3 Positions)", action: "Queues EEAT Content Refresh Brief in Editorial Calendar", status: "Active (Listening)" },
];

export const ProjectManagementView: React.FC = () => {
  const [tasks, setTasks] = useState<AgencyTaskItem[]>(INITIAL_TASKS);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskClient, setNewTaskClient] = useState("OmniRank Digital");
  const [newTaskCategory, setNewTaskCategory] = useState<AgencyTaskItem["category"]>("Technical Audit");
  const [newTaskAssignee, setNewTaskAssignee] = useState("Alex Rivera");
  const [newTaskDeadline, setNewTaskDeadline] = useState("2026-09-10");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: AgencyTaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      clientName: newTaskClient,
      category: newTaskCategory,
      assignee: newTaskAssignee,
      deadline: newTaskDeadline,
      priority: "High",
      status: "New",
      progressPercentage: 0,
      commentsCount: 0,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const handleStatusChange = (id: string, newStatus: AgencyTaskItem["status"]) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus,
              progressPercentage: newStatus === "Completed" ? 100 : t.progressPercentage,
            }
          : t
      )
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeCategoryFilter === "All") return true;
    return t.category === activeCategoryFilter;
  });

  return (
    <div id="project-management-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#ffa500]" />
              <span>SEO Agency Project Management & Workflow Automation</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Coordinate technical audits, local citations, content cluster sprints, and automated trigger rules across agency clients.
            </p>
          </div>
        </div>

        {/* Content Approval Pipeline Indicator */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
            6-Stage Verified Content & Technical Rollout Workflow:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
            <span className="px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-green-950 text-gray-700 dark:text-gray-300">
              1. AI / Discovery Draft
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              2. SEO Technical Review
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
              3. Human Specialist QA
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              4. Client Approval
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              5. Scheduled & Published
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="px-2.5 py-1 rounded-lg bg-[#004d00] text-white font-bold">
              6. Performance Radar
            </span>
          </div>
        </div>
      </div>

      {/* Task Creation Form */}
      <form
        onSubmit={handleCreateTask}
        className="p-5 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs"
      >
        <div className="sm:col-span-2">
          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            New Task Title
          </label>
          <input
            type="text"
            placeholder="e.g. Audit LCP hero asset preloading on homepage"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Client Account
          </label>
          <select
            value={newTaskClient}
            onChange={(e) => setNewTaskClient(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
          >
            <option value="OmniRank Digital">OmniRank Digital</option>
            <option value="Bay Area Legal Group">Bay Area Legal Group</option>
            <option value="Apex Retailers LLC">Apex Retailers LLC</option>
            <option value="Luxe Goods Direct">Luxe Goods Direct</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Category Template
          </label>
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value as AgencyTaskItem["category"])}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
          >
            <option value="Technical Audit">Technical Audit</option>
            <option value="Local SEO">Local SEO</option>
            <option value="Content Campaign">Content Campaign</option>
            <option value="Link Building">Link Building</option>
            <option value="Migration">Migration</option>
            <option value="E-commerce SEO">E-commerce SEO</option>
            <option value="Monthly Maintenance">Monthly Maintenance</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#ffa500]" />
            <span>Create Task</span>
          </button>
        </div>
      </form>

      {/* Task Filters */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {["All", "Technical Audit", "Local SEO", "Content Campaign", "Migration", "E-commerce SEO", "Monthly Maintenance"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategoryFilter === cat
                  ? "bg-[#004d00] text-white shadow-xs"
                  : "bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-green-950/60 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    t.priority === "Critical"
                      ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {t.priority}
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{t.clientName}</span>
                <span className="text-[10px] font-medium text-gray-400">• {t.category}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-500 flex items-center gap-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <span>{t.assignee}</span>
                </span>
                <span className="text-gray-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>Due {t.deadline}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{t.title}</h4>
                <div className="w-full max-w-md bg-gray-200 dark:bg-green-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#004d00] dark:bg-[#ffa500]"
                    style={{ width: `${t.progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t.id, e.target.value as AgencyTaskItem["status"])}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <option value="New">Status: New</option>
                  <option value="In Progress">Status: In Progress</option>
                  <option value="Client Review">Status: Client Review</option>
                  <option value="Approved">Status: Approved</option>
                  <option value="Completed">Status: Completed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Automated Workflow Rules Panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#ffa500]" />
          <span>SEO Task Automation Triggers</span>
        </h3>

        <div className="divide-y divide-gray-100 dark:divide-green-950/60 text-xs">
          {AUTOMATION_RULES.map((rule, i) => (
            <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <strong className="text-gray-900 dark:text-white font-mono flex items-center gap-1.5">
                  <span className="text-[#004d00] dark:text-[#ffa500] font-bold">WHEN:</span>
                  <span>{rule.trigger}</span>
                </strong>
                <p className="text-gray-500 dark:text-gray-400 pl-6">
                  <strong className="text-emerald-600 font-sans">THEN:</strong> {rule.action}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 self-start sm:self-center">
                {rule.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
