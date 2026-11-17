import { generateDeterministicSeed, type SeedDataset } from './seed';
import type {
  AIInsight,
  Campaign,
  CampaignStatus,
  Competitor,
  CompetitorMetric,
  ContactMessage,
  DailyMetric,
  DateRangeKey,
  NotificationItem,
  NotificationPreferences,
  Platform,
  UserProfile,
  Workspace,
  WorkspaceReport,
} from './types';

export interface DataProvider {
  readonly isDemoMode: boolean;
  getProfile(): Promise<UserProfile>;
  updateProfile(patch: Partial<UserProfile>): Promise<UserProfile>;
  getWorkspace(): Promise<Workspace>;
  updateWorkspace(patch: Partial<Workspace>): Promise<Workspace>;
  getMetrics(range: DateRangeKey, platform?: Platform | 'all'): Promise<DailyMetric[]>;
  getCompetitors(): Promise<Competitor[]>;
  getCompetitorMetrics(range: DateRangeKey): Promise<CompetitorMetric[]>;
  addCompetitor(input: { name: string; platform: Platform; handle: string; notes: string }): Promise<Competitor>;
  removeCompetitor(id: string): Promise<void>;
  getCampaigns(): Promise<Campaign[]>;
  getCampaignById(id: string): Promise<Campaign | undefined>;
  createCampaign(input: {
    name: string;
    platform: Platform;
    objective: string;
    startDate: string;
    endDate: string;
    budget: number;
  }): Promise<Campaign>;
  updateCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;
  getInsights(): Promise<AIInsight[]>;
  saveInsights(insights: AIInsight[]): Promise<AIInsight[]>;
  dismissInsight(id: string): Promise<void>;
  getNotifications(): Promise<NotificationItem[]>;
  markAllNotificationsRead(): Promise<void>;
  getNotificationPreferences(): Promise<NotificationPreferences>;
  updateNotificationPreferences(prefs: NotificationPreferences): Promise<NotificationPreferences>;
  getReports(): Promise<WorkspaceReport[]>;
  generateReport(periodStart: string, periodEnd: string, title?: string): Promise<WorkspaceReport>;
  submitContactMessage(input: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage>;
}

const STORAGE_KEY = 'marketpulse_demo_state_v1';

interface DemoStore extends SeedDataset {
  contactMessages: ContactMessage[];
  notificationPrefs: NotificationPreferences;
}

function loadDemoStore(): DemoStore {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as DemoStore;
      }
    } catch {
      // Fall back to fresh seed
    }
  }
  const seed = generateDeterministicSeed();
  return {
    ...seed,
    contactMessages: [],
    notificationPrefs: {
      weeklyDigest: true,
      campaignAlerts: true,
      competitorSpikes: true,
      aiInsightReady: true,
    },
  };
}

function saveDemoStore(store: DemoStore): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Ignore storage quota errors
    }
  }
}

function daysForRange(range: DateRangeKey): number {
  if (range === '7d') return 7;
  if (range === '30d') return 30;
  return 90;
}

export class DemoProvider implements DataProvider {
  readonly isDemoMode = true;
  private store: DemoStore;

  constructor() {
    this.store = loadDemoStore();
  }

  private persist() {
    saveDemoStore(this.store);
  }

  async getProfile(): Promise<UserProfile> {
    return { ...this.store.profile };
  }

  async updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
    this.store.profile = { ...this.store.profile, ...patch };
    if (patch.fullName) {
      const parts = patch.fullName.trim().split(/\s+/);
      this.store.profile.avatarInitials = parts
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('');
    }
    this.persist();
    return { ...this.store.profile };
  }

  async getWorkspace(): Promise<Workspace> {
    return { ...this.store.workspace };
  }

  async updateWorkspace(patch: Partial<Workspace>): Promise<Workspace> {
    this.store.workspace = { ...this.store.workspace, ...patch };
    this.persist();
    return { ...this.store.workspace };
  }

  async getMetrics(range: DateRangeKey, platform: Platform | 'all' = 'all'): Promise<DailyMetric[]> {
    const count = daysForRange(range);
    const allDates = Array.from(new Set(this.store.metricsDaily.map((m) => m.date))).sort();
    const allowedDates = new Set(allDates.slice(-count));
    return this.store.metricsDaily.filter(
      (m) => allowedDates.has(m.date) && (platform === 'all' || m.platform === platform)
    );
  }

  async getCompetitors(): Promise<Competitor[]> {
    return [...this.store.competitors];
  }

  async getCompetitorMetrics(range: DateRangeKey): Promise<CompetitorMetric[]> {
    const count = daysForRange(range);
    const allDates = Array.from(new Set(this.store.competitorMetrics.map((m) => m.date))).sort();
    const allowedDates = new Set(allDates.slice(-count));
    return this.store.competitorMetrics.filter((m) => allowedDates.has(m.date));
  }

  async addCompetitor(input: {
    name: string;
    platform: Platform;
    handle: string;
    notes: string;
  }): Promise<Competitor> {
    const newComp: Competitor = {
      id: `comp-${Date.now()}`,
      workspaceId: this.store.workspace.id,
      name: input.name,
      platform: input.platform,
      handle: input.handle.startsWith('@') ? input.handle : `@${input.handle}`,
      notes: input.notes,
      strengths: ['Active regional presence', 'Consistent posting cadence'],
      weaknesses: ['Limited multi-channel attribution'],
      scores: { reach: 72, engagement: 68, consistency: 74, contentQuality: 70, audienceGrowth: 69 },
    };
    this.store.competitors = [newComp, ...this.store.competitors];

    // Add deterministic baseline metrics for the new competitor across existing dates
    const allDates = Array.from(new Set(this.store.metricsDaily.map((m) => m.date))).sort();
    let followers = 9500;
    const newMetrics: CompetitorMetric[] = allDates.map((date, idx) => {
      followers += 14 + (idx % 9);
      const reach = 8200 + ((idx * 173) % 2400);
      const engagement = Math.round(reach * 0.041);
      return {
        id: `cm-${newComp.id}-${date}`,
        competitorId: newComp.id,
        date,
        reach,
        engagement,
        followers,
      };
    });
    this.store.competitorMetrics = [...this.store.competitorMetrics, ...newMetrics];
    this.persist();
    return newComp;
  }

  async removeCompetitor(id: string): Promise<void> {
    this.store.competitors = this.store.competitors.filter((c) => c.id !== id);
    this.store.competitorMetrics = this.store.competitorMetrics.filter((m) => m.competitorId !== id);
    this.persist();
  }

  async getCampaigns(): Promise<Campaign[]> {
    return [...this.store.campaigns];
  }

  async getCampaignById(id: string): Promise<Campaign | undefined> {
    return this.store.campaigns.find((c) => c.id === id);
  }

  async createCampaign(input: {
    name: string;
    platform: Platform;
    objective: string;
    startDate: string;
    endDate: string;
    budget: number;
  }): Promise<Campaign> {
    const camp: Campaign = {
      id: `camp-${Date.now()}`,
      workspaceId: this.store.workspace.id,
      name: input.name,
      platform: input.platform,
      objective: input.objective,
      status: 'active',
      startDate: input.startDate,
      endDate: input.endDate,
      budget: input.budget,
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      engagement: 0,
    };
    this.store.campaigns = [camp, ...this.store.campaigns];
    this.persist();
    return camp;
  }

  async updateCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign> {
    const idx = this.store.campaigns.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Campaign not found');
    this.store.campaigns[idx] = { ...this.store.campaigns[idx], status };
    this.persist();
    return this.store.campaigns[idx];
  }

  async deleteCampaign(id: string): Promise<void> {
    this.store.campaigns = this.store.campaigns.filter((c) => c.id !== id);
    this.persist();
  }

  async getInsights(): Promise<AIInsight[]> {
    return this.store.aiInsights.filter((i) => !i.isDismissed);
  }

  async saveInsights(insights: AIInsight[]): Promise<AIInsight[]> {
    this.store.aiInsights = [...insights, ...this.store.aiInsights];
    this.persist();
    return insights;
  }

  async dismissInsight(id: string): Promise<void> {
    this.store.aiInsights = this.store.aiInsights.map((i) =>
      i.id === id ? { ...i, isDismissed: true } : i
    );
    this.persist();
  }

  async getNotifications(): Promise<NotificationItem[]> {
    return [...this.store.notifications];
  }

  async markAllNotificationsRead(): Promise<void> {
    const now = new Date().toISOString();
    this.store.notifications = this.store.notifications.map((n) => ({
      ...n,
      readAt: n.readAt ?? now,
    }));
    this.persist();
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return { ...this.store.notificationPrefs };
  }

  async updateNotificationPreferences(prefs: NotificationPreferences): Promise<NotificationPreferences> {
    this.store.notificationPrefs = { ...prefs };
    this.persist();
    return { ...this.store.notificationPrefs };
  }

  async getReports(): Promise<WorkspaceReport[]> {
    return [...this.store.reports];
  }

  async generateReport(periodStart: string, periodEnd: string, title?: string): Promise<WorkspaceReport> {
    const filtered = this.store.metricsDaily.filter(
      (m) => m.date >= periodStart && m.date <= periodEnd
    );
    const dataset = filtered.length > 0 ? filtered : this.store.metricsDaily.slice(-150);
    const totalReach = dataset.reduce((s, m) => s + m.reach, 0);
    const totalImpressions = dataset.reduce((s, m) => s + m.impressions, 0);
    const totalEngagement = dataset.reduce((s, m) => s + m.engagement, 0);
    const avgEngagementRate = totalReach > 0 ? Number(((totalEngagement / totalReach) * 100).toFixed(2)) : 0;

    const platformReach: Record<Platform, number> = {
      instagram: 0,
      linkedin: 0,
      x: 0,
      facebook: 0,
      tiktok: 0,
    };
    dataset.forEach((m) => {
      platformReach[m.platform] += m.reach;
    });
    const topPlatform = (Object.entries(platformReach).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      'instagram') as Platform;

    const activeCampaigns = this.store.campaigns.filter((c) => c.status === 'active').length;

    const report: WorkspaceReport = {
      id: `rep-${Date.now()}`,
      workspaceId: this.store.workspace.id,
      title: title?.trim() || `Performance Report (${periodStart} to ${periodEnd})`,
      periodStart,
      periodEnd,
      createdAt: new Date().toISOString(),
      payload: {
        totalReach,
        totalImpressions,
        avgEngagementRate,
        followerGrowth: Math.round(totalReach / 190),
        topPlatform,
        activeCampaigns,
        executiveSummary: `Across ${periodStart} to ${periodEnd}, your workspace generated ${totalReach.toLocaleString('en-IN')} reach and ${totalImpressions.toLocaleString('en-IN')} impressions at a ${avgEngagementRate}% average engagement rate, led by ${topPlatform}.`,
        keyHighlights: [
          `Top performing channel: ${topPlatform.toUpperCase()} by total reach.`,
          `${activeCampaigns} active campaigns currently monitored in workspace.`,
          `Average engagement rate held at ${avgEngagementRate}% across tracked channels.`,
        ],
      },
    };
    this.store.reports = [report, ...this.store.reports];
    this.persist();
    return report;
  }

  async submitContactMessage(input: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> {
    const msg: ContactMessage = {
      ...input,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.store.contactMessages = [msg, ...this.store.contactMessages];
    this.persist();
    return msg;
  }
}

// Single-file swap point: switch to SupabaseProvider when Supabase credentials are configured
export const dataProvider: DataProvider = new DemoProvider();
