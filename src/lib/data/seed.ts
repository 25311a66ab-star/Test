import type {
  AIInsight,
  Campaign,
  Competitor,
  CompetitorMetric,
  DailyMetric,
  NotificationItem,
  Platform,
  UserProfile,
  Workspace,
  WorkspaceReport,
} from './types';

// Deterministic seeded PRNG (Mulberry32) so demo data is identical across restarts
function createSeededRng(seed: number) {
  let a = seed;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PLATFORMS: Platform[] = ['instagram', 'linkedin', 'x', 'facebook', 'tiktok'];

export interface SeedDataset {
  profile: UserProfile;
  workspace: Workspace;
  metricsDaily: DailyMetric[];
  competitors: Competitor[];
  competitorMetrics: CompetitorMetric[];
  campaigns: Campaign[];
  aiInsights: AIInsight[];
  notifications: NotificationItem[];
  reports: WorkspaceReport[];
}

export function generateDeterministicSeed(): SeedDataset {
  const rng = createSeededRng(20260417);
  const workspaceId = 'ws-marketpulse-demo-01';
  const ownerId = 'usr-demo-founder-01';

  const profile: UserProfile = {
    id: ownerId,
    email: 'founder@marketpulse.demo',
    fullName: 'Nithin Rao',
    companyName: 'Deccan Urban Retail',
    industry: 'Retail & Local Business',
    plan: 'Growth Subscription (₹499/mo)',
    avatarInitials: 'NR',
  };

  const workspace: Workspace = {
    id: workspaceId,
    ownerId,
    name: 'Deccan Urban Retail — Hyderabad',
    industry: 'Retail & Local Business',
    demoMode: true,
  };

  // Generate 90 days ending 2026-11-17
  const endDate = new Date('2026-11-17T00:00:00Z');
  const days = 90;
  const metricsDaily: DailyMetric[] = [];

  const platformConfig: Record<
    Platform,
    { baseReach: number; baseFollowers: number; engRate: number; weekendMult: number }
  > = {
    instagram: { baseReach: 4200, baseFollowers: 14800, engRate: 0.056, weekendMult: 1.24 },
    linkedin: { baseReach: 1950, baseFollowers: 5200, engRate: 0.038, weekendMult: 0.62 },
    x: { baseReach: 1650, baseFollowers: 4100, engRate: 0.024, weekendMult: 0.88 },
    facebook: { baseReach: 2800, baseFollowers: 9400, engRate: 0.032, weekendMult: 1.12 },
    tiktok: { baseReach: 3400, baseFollowers: 7900, engRate: 0.068, weekendMult: 1.3 },
  };

  const followerRunning: Record<Platform, number> = {
    instagram: platformConfig.instagram.baseFollowers,
    linkedin: platformConfig.linkedin.baseFollowers,
    x: platformConfig.x.baseFollowers,
    facebook: platformConfig.facebook.baseFollowers,
    tiktok: platformConfig.tiktok.baseFollowers,
  };

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setUTCDate(endDate.getUTCDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayOfWeek = d.getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayIndex = days - 1 - i; // 0 to 89

    // Step-change uplift mid-period (day 45+)
    const uplift = dayIndex >= 45 ? 1.18 : 1.0;
    const trend = 1 + (dayIndex / days) * 0.22;

    for (const platform of PLATFORMS) {
      const cfg = platformConfig[platform];
      const noise = 0.88 + rng() * 0.24;
      const seasonality = isWeekend ? cfg.weekendMult : 1.0;

      // Introduce a gentle recent decline on X so AI Insights has a real signal to detect
      const xDecline = platform === 'x' && dayIndex >= 74 ? 0.78 : 1.0;

      const reach = Math.round(cfg.baseReach * trend * uplift * seasonality * noise * xDecline);
      const impressions = Math.round(reach * (1.28 + rng() * 0.18));
      const engagement = Math.round(reach * cfg.engRate * (0.9 + rng() * 0.22) * xDecline);
      const clicks = Math.round(engagement * (0.28 + rng() * 0.12));
      const newFollowers = Math.max(2, Math.round((reach / 240) * (0.7 + rng() * 0.6)));
      followerRunning[platform] += newFollowers;

      metricsDaily.push({
        id: `m-${platform}-${dateStr}`,
        workspaceId,
        platform,
        date: dateStr,
        reach,
        impressions,
        engagement,
        followers: followerRunning[platform],
        clicks,
      });
    }
  }

  const competitors: Competitor[] = [
    {
      id: 'comp-01',
      workspaceId,
      name: 'Charminar Craft Co.',
      platform: 'instagram',
      handle: '@charminarcraft',
      notes: 'Strong regional Reels cadence and festive influencer collaborations in Hyderabad.',
      strengths: ['High-frequency short-form video', 'Strong weekend engagement spikes', 'Local festive promotions'],
      weaknesses: ['Low LinkedIn B2B presence', 'Inconsistent reply times on comments'],
      scores: { reach: 88, engagement: 81, consistency: 84, contentQuality: 79, audienceGrowth: 86 },
    },
    {
      id: 'comp-02',
      workspaceId,
      name: 'Telangana Retail Hub',
      platform: 'facebook',
      handle: '@telanganaretailhub',
      notes: 'Broad Facebook community groups and paid local catalogue ads.',
      strengths: ['Large legacy Facebook audience', 'Consistent local event coverage'],
      weaknesses: ['Declining organic reach', 'Low click-through rate on static banners'],
      scores: { reach: 74, engagement: 58, consistency: 72, contentQuality: 65, audienceGrowth: 61 },
    },
    {
      id: 'comp-03',
      workspaceId,
      name: 'Jubilee Trends Studio',
      platform: 'tiktok',
      handle: '@jubileetrends',
      notes: 'Fast-growing youth-focused retail brand with high video completion rates.',
      strengths: ['Viral product unboxings', 'High shareability among 18-24 segment'],
      weaknesses: ['Volatile posting schedule', 'Limited conversion tracking'],
      scores: { reach: 82, engagement: 90, consistency: 64, contentQuality: 85, audienceGrowth: 91 },
    },
  ];

  const competitorMetrics: CompetitorMetric[] = [];
  const compBase: Record<string, { reach: number; engRate: number; followers: number }> = {
    'comp-01': { reach: 16400, engRate: 0.052, followers: 22400 },
    'comp-02': { reach: 11200, engRate: 0.029, followers: 18900 },
    'comp-03': { reach: 14100, engRate: 0.064, followers: 16200 },
  };
  const compFollowerRunning: Record<string, number> = {
    'comp-01': compBase['comp-01'].followers,
    'comp-02': compBase['comp-02'].followers,
    'comp-03': compBase['comp-03'].followers,
  };

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setUTCDate(endDate.getUTCDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayIndex = days - 1 - i;

    for (const comp of competitors) {
      const cfg = compBase[comp.id];
      const noise = 0.9 + rng() * 0.2;
      const growth = 1 + (dayIndex / days) * 0.16;
      const reach = Math.round(cfg.reach * growth * noise);
      const engagement = Math.round(reach * cfg.engRate * (0.9 + rng() * 0.2));
      compFollowerRunning[comp.id] += Math.round(18 + rng() * 26);

      competitorMetrics.push({
        id: `cm-${comp.id}-${dateStr}`,
        competitorId: comp.id,
        date: dateStr,
        reach,
        engagement,
        followers: compFollowerRunning[comp.id],
      });
    }
  }

  const campaigns: Campaign[] = [
    {
      id: 'camp-01',
      workspaceId,
      name: 'Diwali Local Shoppers Reels',
      platform: 'instagram',
      objective: 'Store Visits & Conversions',
      status: 'active',
      startDate: '2026-10-15',
      endDate: '2026-11-30',
      budget: 45000,
      spend: 31200,
      impressions: 248000,
      clicks: 9420,
      conversions: 612,
      engagement: 14880,
    },
    {
      id: 'camp-02',
      workspaceId,
      name: 'Hyderabad B2B Wholesale Outreach',
      platform: 'linkedin',
      objective: 'Lead Generation',
      status: 'active',
      startDate: '2026-10-20',
      endDate: '2026-12-05',
      budget: 30000,
      spend: 18900,
      impressions: 92400,
      clicks: 3140,
      conversions: 194,
      engagement: 4620,
    },
    {
      id: 'camp-03',
      workspaceId,
      name: 'Flash Weekend Discount Push',
      platform: 'x',
      objective: 'Website Traffic',
      status: 'active',
      startDate: '2026-10-28',
      endDate: '2026-11-25',
      budget: 22000,
      spend: 19400,
      impressions: 64200,
      clicks: 710,
      conversions: 28,
      engagement: 1120,
      isUnderperforming: true,
    },
    {
      id: 'camp-04',
      workspaceId,
      name: 'Catalogue Retargeting — Secunderabad',
      platform: 'facebook',
      objective: 'Conversions',
      status: 'paused',
      startDate: '2026-09-10',
      endDate: '2026-10-25',
      budget: 28000,
      spend: 24100,
      impressions: 112000,
      clicks: 1420,
      conversions: 41,
      engagement: 2150,
      isUnderperforming: true,
    },
    {
      id: 'camp-05',
      workspaceId,
      name: 'Monsoon New Arrivals Teaser',
      platform: 'tiktok',
      objective: 'Brand Awareness',
      status: 'completed',
      startDate: '2026-08-20',
      endDate: '2026-09-30',
      budget: 35000,
      spend: 34800,
      impressions: 318000,
      clicks: 11200,
      conversions: 490,
      engagement: 22400,
    },
    {
      id: 'camp-06',
      workspaceId,
      name: 'Winter Festive Pre-Booking',
      platform: 'instagram',
      objective: 'Lead Generation',
      status: 'draft',
      startDate: '2026-12-01',
      endDate: '2026-12-31',
      budget: 40000,
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      engagement: 0,
    },
  ];

  const aiInsights: AIInsight[] = [
    {
      id: 'ins-01',
      workspaceId,
      createdAt: '2026-11-17T08:15:00Z',
      category: 'Recommendations',
      severity: 'high',
      title: 'X (Twitter) engagement declined 22% over the past 14 days',
      body: 'Daily reach and interaction volume on X dropped notably compared to your 30-day baseline while Instagram and TikTok climbed.',
      recommendation: 'Shift 30% of X promotional copy to short Instagram Reels and test concise poll threads on X between 12:00–14:00 IST.',
      confidence: 92,
      generatedBy: 'heuristic',
      isDismissed: false,
    },
    {
      id: 'ins-02',
      workspaceId,
      createdAt: '2026-11-17T08:10:00Z',
      category: 'Competitor Gaps',
      severity: 'high',
      title: 'Charminar Craft Co. leads weekly reach by 24% on Instagram',
      body: 'Your closest regional competitor captures higher weekend impressions through short-form festive product demos.',
      recommendation: 'Publish 2 additional 15-second local store showcase Reels every Friday evening to capture weekend buyer intent.',
      confidence: 89,
      generatedBy: 'heuristic',
      isDismissed: false,
    },
    {
      id: 'ins-03',
      workspaceId,
      createdAt: '2026-11-16T18:30:00Z',
      category: 'Weak Campaigns',
      severity: 'high',
      title: 'Flash Weekend Discount Push CPA is 4.6x above workspace average',
      body: 'Spend reached ₹19,400 (88% of budget) with only 28 conversions and a 1.1% click-through rate.',
      recommendation: 'Pause underperforming ad sets on X immediately and reallocate remaining ₹2,600 to Diwali Local Shoppers Reels.',
      confidence: 95,
      generatedBy: 'heuristic',
      isDismissed: false,
    },
    {
      id: 'ins-04',
      workspaceId,
      createdAt: '2026-11-16T14:20:00Z',
      category: 'Engagement Playbook',
      severity: 'medium',
      title: 'Optimal posting window: Saturday & Sunday 18:00–21:00 IST',
      body: 'Weekend posts on Instagram and TikTok consistently outperform weekday averages by +24% to +30% in reach.',
      recommendation: 'Schedule your highest-priority product launches and discount announcements for Saturday 18:30 IST.',
      confidence: 88,
      generatedBy: 'heuristic',
      isDismissed: false,
    },
    {
      id: 'ins-05',
      workspaceId,
      createdAt: '2026-11-15T11:00:00Z',
      category: 'Full Strategy',
      severity: 'medium',
      title: 'Untapped audience growth opportunity on TikTok & short-form video',
      body: 'Short-form video delivers your highest engagement rate (6.8%) yet represents only 24% of active campaign spend.',
      recommendation: 'Repurpose top-performing Diwali Reels into vertical unboxing clips to accelerate follower acquisition.',
      confidence: 86,
      generatedBy: 'heuristic',
      isDismissed: false,
    },
    {
      id: 'ins-06',
      workspaceId,
      createdAt: '2026-11-14T16:45:00Z',
      category: 'Weak Campaigns',
      severity: 'medium',
      title: 'Catalogue Retargeting — Secunderabad showed audience fatigue',
      body: 'CTR fell to 1.26% prior to pausing with ₹587 cost per conversion.',
      recommendation: 'Refresh creative imagery with customer testimonials and tighten geo-radius before resuming.',
      confidence: 84,
      generatedBy: 'heuristic',
      isDismissed: false,
    },
    {
      id: 'ins-07',
      workspaceId,
      createdAt: '2026-11-13T09:15:00Z',
      category: 'Competitor Gaps',
      severity: 'low',
      title: 'You outperform Telangana Retail Hub on engagement rate (+1.9%)',
      body: 'Your community responds more actively to interactive product posts than static local catalogue banners.',
      recommendation: 'Maintain conversational captions and pin customer reviews to defend your engagement advantage.',
      confidence: 91,
      generatedBy: 'heuristic',
      isDismissed: false,
    },
    {
      id: 'ins-08',
      workspaceId,
      createdAt: '2026-11-12T10:30:00Z',
      category: 'Engagement Playbook',
      severity: 'low',
      title: 'LinkedIn B2B posts peak Tuesday–Thursday mornings',
      body: 'LinkedIn reach drops 38% on weekends while mid-week wholesale updates generate 3.4% CTR.',
      recommendation: 'Batch LinkedIn wholesale partner posts for Tuesday and Wednesday 09:30 IST.',
      confidence: 87,
      generatedBy: 'heuristic',
      isDismissed: false,
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif-01',
      type: 'alert',
      title: 'Campaign budget alert: Flash Weekend Discount Push',
      body: '88% of budget spent with below-average conversion velocity.',
      createdAt: '2026-11-17T08:20:00Z',
      readAt: null,
    },
    {
      id: 'notif-02',
      type: 'insight',
      title: 'New AI recommendation ready',
      body: 'Weekend posting window analysis identified +24% reach uplift.',
      createdAt: '2026-11-17T07:45:00Z',
      readAt: null,
    },
    {
      id: 'notif-03',
      type: 'campaign',
      title: 'Diwali Local Shoppers Reels crossed 600 conversions',
      body: 'Your flagship Instagram campaign is pacing 18% ahead of target.',
      createdAt: '2026-11-16T19:10:00Z',
      readAt: null,
    },
    {
      id: 'notif-04',
      type: 'report',
      title: 'Monthly Performance Summary (Oct 2026) generated',
      body: 'Ready to view or export as print-ready PDF.',
      createdAt: '2026-11-01T09:00:00Z',
      readAt: '2026-11-02T10:15:00Z',
    },
    {
      id: 'notif-05',
      type: 'alert',
      title: 'Competitor reach spike detected',
      body: 'Charminar Craft Co. increased weekly Reels output by 40%.',
      createdAt: '2026-10-29T14:30:00Z',
      readAt: '2026-10-30T08:00:00Z',
    },
  ];

  const reports: WorkspaceReport[] = [
    {
      id: 'rep-01',
      workspaceId,
      title: 'October 2026 Social Performance Summary',
      periodStart: '2026-10-01',
      periodEnd: '2026-10-31',
      createdAt: '2026-11-01T09:00:00Z',
      payload: {
        totalReach: 438200,
        totalImpressions: 594800,
        avgEngagementRate: 4.52,
        followerGrowth: 2410,
        topPlatform: 'instagram',
        activeCampaigns: 3,
        executiveSummary:
          'October delivered a +18% step-change in reach following the launch of Diwali Local Shoppers Reels. Instagram and TikTok drove 64% of total engagement.',
        keyHighlights: [
          'Instagram led all channels with 5.6% average engagement rate.',
          'Diwali Local Shoppers Reels achieved ₹51 cost per conversion.',
          'Weekend publishing generated +24% higher organic reach than weekday posts.',
        ],
      },
    },
    {
      id: 'rep-02',
      workspaceId,
      title: 'Q3 2026 Competitor & Campaign Benchmark',
      periodStart: '2026-08-19',
      periodEnd: '2026-09-30',
      createdAt: '2026-10-02T11:30:00Z',
      payload: {
        totalReach: 512400,
        totalImpressions: 689100,
        avgEngagementRate: 4.18,
        followerGrowth: 2890,
        topPlatform: 'tiktok',
        activeCampaigns: 2,
        executiveSummary:
          'Monsoon New Arrivals Teaser drove strong brand awareness on TikTok, closing the reach gap against Jubilee Trends Studio.',
        keyHighlights: [
          'Monsoon New Arrivals Teaser completed with 318,000 impressions.',
          'Outperformed Telangana Retail Hub by +1.9% in engagement rate.',
          'LinkedIn B2B wholesale inquiries increased 14% month-over-month.',
        ],
      },
    },
  ];

  return {
    profile,
    workspace,
    metricsDaily,
    competitors,
    competitorMetrics,
    campaigns,
    aiInsights,
    notifications,
    reports,
  };
}
