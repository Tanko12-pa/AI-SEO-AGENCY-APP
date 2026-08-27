export type NavigationTab =
  | "overview"
  | "services-catalog"
  | "website-discovery"
  | "ai-consultant"
  | "ai-search-eeat"
  | "a2a-judge"
  | "keywords"
  | "initial-audit"
  | "onpage-tech"
  | "schema-generator"
  | "internal-linking"
  | "migration-seo"
  | "content-marketing"
  | "platform-guides"
  | "integrations-center"
  | "project-management"
  | "white-label"
  | "audio-transcriber"
  | "packages-roi"
  | "algorithm-intel"
  | "subscription-billing";

export interface KeywordItem {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number; // 1-100
  cpc: number;
  currentRank: number;
  previousRank: number;
  intent: "Informational" | "Commercial" | "Transactional" | "Navigational" | string;
  aiOverviewProbability: number; // 1-100%
  serpFeatures: string[];
  cluster: string;
  dateAdded: string;
  status: "Ranking #1-3" | "Top 10" | "Page 2" | "Tracking" | string;
  archived?: boolean;
}

export interface CompetitorItem {
  id: string;
  name: string;
  domain: string;
  domainAuthority: number;
  organicKeywords: number;
  estimatedTraffic: string;
  aiOverviewPresence: number; // %
  backlinksCount: number;
  overlapKeywordsCount: number;
  dateAdded: string;
  archived?: boolean;
}

export interface ContentPieceItem {
  id: string;
  title: string;
  type: "Blog Post" | "Guest Blog" | "Informational Piece" | "Press Release" | "Q&A Guide" | string;
  targetKeyword: string;
  wordCount: number;
  status: "Published" | "In Review" | "Drafting" | "Scheduled" | string;
  eeatScore: number;
  publishDate: string;
  lastAuditedDate?: string;
  aiOptimized: boolean;
  author: string;
  archived?: boolean;
}

export interface GoogleTrendsMonthData {
  month: string;
  interest: number;
}

export interface GoogleTrendsResult {
  keyword: string;
  currentInterestScore: number;
  averageInterestScore: number;
  peakMonth: string;
  trendTrajectory: "Explosive Growth" | "Rising Fast" | "Seasonal Peak" | "Steady Evergreen" | "Declining" | string;
  growthRateYoY: string;
  monthlyTrend: GoogleTrendsMonthData[];
  breakoutQueries: { query: string; growth: string }[];
  topRegions: { region: string; index: number }[];
  aiSearchContext: string;
  actionableTakeaway: string;
  sources?: { title: string; uri: string }[];
}

export interface LocalCitationItem {
  id: string;
  platform: string;
  category: "Google Business Profile" | "Local Directory" | "Industry Profile" | "Q&A Platform" | string;
  status: "Verified & Active" | "Pending Verification" | "Needs Optimization" | string;
  napConsistency: number; // %
  reviewCount: number;
  rating: number;
  profileUrl: string;
  dateUpdated: string;
  archived?: boolean;
}

export interface AudioTranscriptItem {
  id: string;
  title: string;
  client: string;
  duration: string;
  dateRecorded: string;
  fullTranscript: string;
  timestamps: { time: string; speaker: string; text: string; intent?: string }[];
  extractedKeywords: string[];
  actionItems: string[];
  sentiment: "Positive" | "Neutral" | "Constructive" | string;
  archived?: boolean;
}

export interface CampaignLogItem {
  id: string;
  timestamp: string;
  category: "Algorithm" | "On-Page" | "Link-Building" | "Content" | "Audit" | "A2A" | string;
  event: string;
  impactScore: string;
  user: string;
}

export interface SEOPackage {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  billingPeriod: string;
  popular?: boolean;
  colorTheme: string;
  features: string[];
  deliverables: {
    keywords: string;
    audits: string;
    content: string;
    localCitations: string;
    reporting: string;
    aiEngine: string;
  };
}

export interface AlgorithmUpdate {
  id: string;
  name: string;
  releaseDate: string;
  focus: string;
  impactLevel: "Critical" | "High" | "Moderate" | string;
  description: string;
  recommendedAction: string;
  aiSearchFactor: string;
}

export type ThemeMode = "light" | "dark";

export interface AlgorithmNotificationPreferences {
  criticalCoreUpdates: boolean;
  aiOverviewFluctuations: boolean;
  eeatHelpfulContentShifts: boolean;
  dailySerpDigest: boolean;
  marketShiftAlerts: boolean;
  audibleChimes: boolean;
  browserPush: boolean;
  emailAlerts: boolean;
}

export interface MarketShiftAlert {
  id: string;
  keywordId?: string;
  keyword: string;
  previousVolume: number;
  currentVolume: number;
  percentageChange: number; // e.g. +38.5% or -22.0%
  direction: "surge" | "drop";
  detectedAt?: string;
  triggerDate?: string;
  currentTrendScore?: number;
  growthRateYoY?: string;
  aiOverviewImpact?: string;
  source?: "Google Trends Grounding" | "SERP Velocity Engine" | "Historical Baseline" | string;
  significance?: "critical" | "high" | "moderate";
  severity?: "critical" | "high" | "moderate";
  recommendation?: string;
  actionableRecommendation?: string;
  status?: "unread" | "read" | "acknowledged" | "dismissed";
  read?: boolean;
  trendScores?: { month: string; value: number }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  tier: string;
  notificationPreferences: AlgorithmNotificationPreferences;
}

export interface GroundingSource {
  title?: string;
  uri: string;
}

export interface GoogleTrendsMonthData {
  month: string;
  interest: number;
}

export interface GoogleTrendsBreakout {
  query: string;
  growth: string;
}

export interface GoogleTrendsRegion {
  region: string;
  index: number;
}

export interface GoogleTrendsResult {
  keyword: string;
  currentInterestScore: number;
  growthRateYoY: string;
  peakMonth: string;
  trendTrajectory: "Sharp Upward" | "Steady Growth" | "Seasonal Cyclic" | "Emerging Breakout" | string;
  monthlyTrend: GoogleTrendsMonthData[];
  breakoutQueries: GoogleTrendsBreakout[];
  topRegions: GoogleTrendsRegion[];
  aiSearchContext: string;
  actionableTakeaway: string;
  groundingSources?: GroundingSource[];
}

export type SubscriptionPlanType = "free_trial" | "monthly" | "yearly";

export type SubscriptionStatus =
  | "trial_active"
  | "trial_expired"
  | "active_monthly"
  | "active_yearly"
  | "cancelled";

export interface AuthAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  company?: string;
  avatarInitials: string;
  createdAt: string;
  trialStartDate: string;
  trialEndDate: string;
  subscriptionPlan: SubscriptionPlanType;
  subscriptionStatus: SubscriptionStatus;
  nextBillingDate?: string;
  paymentMethod?: string;
  last4?: string;
  paypalSubscriptionId?: string;
  paypalPlanId?: string;
  paypalEmail?: string;
  autoRenew: boolean;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  description: string;
  amount: number;
  plan: "Monthly ($29.99)" | "Yearly ($299.99)" | string;
  status: "Paid" | "Refunded" | "Pending";
  paymentMethod: string;
  pdfDownloadName: string;
  paypalTransactionId?: string;
  paypalPlanId?: string;
  paypalSubscriptionId?: string;
}

export interface TrialState {
  startDate: string;
  endDate: string;
  daysRemaining: number;
  hoursRemaining?: number;
  totalDays: number;
  isExpired: boolean;
  isAdvanceWarning?: boolean;
  hasActiveSubscription?: boolean;
  isAccessRestricted?: boolean;
  percentageUsed: number;
}

export interface PayPalGatewayConfig {
  clientId: string;
  mode: "sandbox" | "live";
  planMonthly: string;
  planYearly: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  isConfigured: boolean;
  webhookConfigured: boolean;
}

export interface PayPalSubscriptionVerifyPayload {
  subscriptionId: string;
  planType: "monthly" | "yearly";
  planId: string;
  userEmail: string;
  orderId?: string;
  facilitatorAccessToken?: string;
}

// ==========================================
// WEBSITE DISCOVERY & 36-SIGNAL CRAWLER
// ==========================================
export interface DiscoverySignalItem {
  id: number;
  name: string;
  category: "Technical" | "Architecture" | "On-Page" | "Performance" | "Authority & Quality";
  status: "Passed" | "Warning" | "Critical" | "Info";
  value: string;
  description: string;
  impact: "Critical" | "High" | "Medium" | "Low";
  recommendation: string;
}

export interface WebsiteDiscoveryReport {
  url: string;
  scannedAt: string;
  cmsPlatform: string;
  httpsSecure: boolean;
  seoHealthScore: number; // 0-100
  scoreDisclaimer: string;
  signalsCount: {
    passed: number;
    warning: number;
    critical: number;
  };
  signals: DiscoverySignalItem[];
  coreWebVitals: {
    lcp: { value: string; rating: "Good" | "Needs Improvement" | "Poor" };
    inp: { value: string; rating: "Good" | "Needs Improvement" | "Poor" };
    cls: { value: string; rating: "Good" | "Needs Improvement" | "Poor" };
    ttfb: { value: string; rating: "Good" | "Needs Improvement" | "Poor" };
  };
  summary: string;
}

// ==========================================
// SCHEMA / STRUCTURED DATA ENGINE
// ==========================================
export type SchemaType =
  | "Organization"
  | "LocalBusiness"
  | "Person"
  | "Product"
  | "Article"
  | "BlogPosting"
  | "BreadcrumbList"
  | "FAQPage"
  | "HowTo"
  | "Event"
  | "Service"
  | "Review"
  | "AggregateRating"
  | "WebSite"
  | "WebPage"
  | "ImageObject"
  | "VideoObject";

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  jsonLdOutput: string;
}

// ==========================================
// INTERNAL LINKING GRAPH ENGINE
// ==========================================
export interface InternalLinkOpportunity {
  id: string;
  sourcePage: string;
  targetPage: string;
  anchorText: string;
  reason: string;
  cluster: string;
  status: "New" | "Approved" | "Rejected" | "Implemented";
  impactScore: number; // 1-100
  targetPageAuth: number; // Authority rating
}

// ==========================================
// MIGRATION & REPLATFORMING SEO
// ==========================================
export interface RedirectMappingItem {
  id: string;
  oldUrl: string;
  newUrl: string;
  statusCode: 301 | 302 | 410;
  category: string;
  status: "Mapped" | "Needs Review" | "Chain Detected" | "Broken Target";
  trafficWeight: "High" | "Medium" | "Low";
  sourcePlatform?: string;
  targetPlatform?: string;
}

export interface MigrationAuditTask {
  id: string;
  phase: "Pre-Launch" | "Launch-Day" | "Post-Launch Monitoring";
  title: string;
  status: "Completed" | "In Progress" | "Pending" | "Attention Needed";
  priority: "Critical" | "High" | "Medium";
  details: string;
}

// ==========================================
// INTEGRATIONS & CONNECTORS
// ==========================================
export interface ToolIntegrationItem {
  id: string;
  name: string;
  category: "Google Suite" | "Competitor & Keywords" | "Technical Crawl" | "CMS & Store";
  iconName: string;
  status: "Connected" | "Authorization Required" | "Syncing" | "Not Connected" | "Error";
  lastSync?: string;
  docUrl: string;
  description: string;
  apiEndpoint?: string;
  featuresAvailable: string[];
}

// ==========================================
// AI CONSULTANT & WHAT SHOULD I DO NEXT
// ==========================================
export type AiInsightTier =
  | "Observed Data"
  | "Calculated Insight"
  | "Recommendation"
  | "Assumption"
  | "Data Not Available";

export interface AiActionItem {
  id: string;
  title: string;
  category: "Critical Issue" | "Growth Opportunity" | "Technical Fix" | "Content Strategy" | "Local SEO";
  priority: "P1 - Immediate" | "P2 - High" | "P3 - Medium" | "P4 - Low";
  why: string;
  impact: string;
  how: string;
  businessValue: string;
  effort: "Low" | "Medium" | "High";
  status: "New" | "Reviewed" | "Approved" | "In Progress" | "Completed" | "Rejected";
  tier: AiInsightTier;
}

// ==========================================
// AGENCY PROJECT MANAGEMENT & TASKS
// ==========================================
export interface AgencyTaskItem {
  id: string;
  title: string;
  clientName: string;
  category: "Technical Audit" | "Local SEO" | "Content Campaign" | "Link Building" | "Migration" | "E-commerce SEO" | "Monthly Maintenance";
  assignee: string;
  deadline: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "New" | "In Progress" | "Client Review" | "Approved" | "Completed";
  progressPercentage: number;
  commentsCount: number;
}

// ==========================================
// WHITE-LABEL AGENCY CONFIGURATION
// ==========================================
export interface WhiteLabelConfig {
  isEnabled: boolean;
  agencyName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain: string;
  supportEmail: string;
  phone: string;
  address: string;
  hidePlatformBranding: boolean;
  clientPortalEnabled: boolean;
}


