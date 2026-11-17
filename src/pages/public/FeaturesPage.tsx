import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Compass,
  FileText,
  Megaphone,
  Sparkles,
  Users,
} from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Button, Card, DemoBadge } from '../../components/ui/Primitives';

const FEATURES = [
  {
    id: 'social-analytics',
    title: 'Social Media Analytics',
    icon: BarChart3,
    problem: 'Small businesses struggle to compare performance across Instagram, LinkedIn, X, Facebook, and TikTok.',
    solution: 'Unified daily reach, impressions, engagement rate, and follower growth charts with 7d, 30d, and 90d filtering.',
    metric: '5 Platforms · 90-Day History',
    to: '/dashboard',
  },
  {
    id: 'competitor-benchmarking',
    title: 'Competitor Benchmarking',
    icon: Users,
    problem: 'Local retailers rarely know why nearby competitors capture more weekend reach or audience growth.',
    solution: 'Track competitors side by side with multi-series follower trends, 5-dimension radar scores, and strength/weakness matrices.',
    metric: '5-Axis Radar & Sortable Tables',
    to: '/dashboard/competitors',
  },
  {
    id: 'ai-insights',
    title: 'AI-Powered Insights',
    icon: Sparkles,
    problem: 'Raw spreadsheets do not tell a busy founder what to fix first.',
    solution: 'Structured insights across Recommendations, Weak Campaigns, Competitor Gaps, Engagement Playbook, and Full Strategy.',
    metric: 'Labelled AI / Heuristic Engine',
    to: '/dashboard/insights',
  },
  {
    id: 'campaign-optimization',
    title: 'Campaign Optimization',
    icon: Megaphone,
    problem: 'Underperforming ads drain limited SME marketing budgets before anyone notices.',
    solution: 'Monitor spend vs. budget, conversion funnels (impressions → clicks → conversions), and pause weak campaigns in one click.',
    metric: 'Funnel & Budget Pacing',
    to: '/dashboard/campaigns',
  },
  {
    id: 'performance-monitoring',
    title: 'Performance Monitoring',
    icon: Activity,
    problem: 'Sudden drops in channel engagement go undetected for weeks.',
    solution: 'Automated moving-average trendlines and workspace notifications highlight anomalies and milestones immediately.',
    metric: 'Moving Averages & Alerts',
    to: '/dashboard',
  },
  {
    id: 'actionable-reports',
    title: 'Actionable Reports',
    icon: FileText,
    problem: 'Preparing monthly marketing summaries for partners or investors takes hours of manual screenshots.',
    solution: 'Generate structured period reports from workspace metrics and export clean, print-ready PDFs.',
    metric: '1-Click Print / PDF Layout',
    to: '/dashboard/reports',
  },
  {
    id: 'strategy-suggestions',
    title: 'Marketing Strategy Suggestions',
    icon: Compass,
    problem: 'Limited marketing knowledge makes planning the next 30 days overwhelming.',
    solution: 'Input your business goal and current challenge to receive a prioritized 30-day playbook tailored to your metrics.',
    metric: 'Tailored 30-Day Playbooks',
    to: '/dashboard/insights',
  },
];

export function FeaturesPage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold text-[#4B5563]">Features & Services</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F1115] mt-2">
            Everything small businesses need to grow with data
          </h1>
          <p className="text-base text-[#4B5563] mt-3">
            Seven integrated capabilities designed to replace guesswork with measurable social media growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky In-Page Nav on Desktop */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24">
            <Card className="p-4">
              <p className="text-xs font-bold text-[#0F1115] px-2 pb-2 border-b border-[#EEF0F4]">
                Capabilities
              </p>
              <nav aria-label="Feature sections" className="mt-2 space-y-1">
                {FEATURES.map((f) => (
                  <a
                    key={f.id}
                    href={`#${f.id}`}
                    className="block px-2.5 py-2 rounded-lg text-xs font-medium text-[#4B5563] hover:text-[#0F1115] hover:bg-[#F8F9FB] transition-colors"
                  >
                    {f.title}
                  </a>
                ))}
              </nav>
            </Card>
          </aside>

          {/* Anchored Feature Sections */}
          <div className="lg:col-span-9 space-y-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <section key={f.id} id={f.id} className="scroll-mt-24">
                  <Card className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-8 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4] flex items-center justify-center text-[#E11D2E]">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-[#4B5563]">0{idx + 1}</p>
                            <h2 className="text-xl font-bold text-[#0F1115]">{f.title}</h2>
                          </div>
                        </div>
                        <p className="text-sm text-[#4B5563]">
                          <strong className="text-[#0F1115]">Problem:</strong> {f.problem}
                        </p>
                        <p className="text-sm text-[#4B5563]">
                          <strong className="text-[#0F1115]">MarketPulse Solution:</strong> {f.solution}
                        </p>
                      </div>

                      <div className="md:col-span-4 rounded-xl bg-[#F8F9FB] border border-[#EEF0F4] p-5 flex flex-col justify-between gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#0F1115]">Live in Demo</span>
                          <DemoBadge />
                        </div>
                        <p className="text-sm font-bold text-[#0F1115]">{f.metric}</p>
                        <Link to={f.to}>
                          <Button size="sm" variant="outline" className="w-full">
                            Open Module
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </section>
              );
            })}

            {/* Final CTA */}
            <div className="rounded-[16px] bg-[#0F1115] text-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Experience all seven modules right now</h2>
                <p className="text-sm text-white/75 mt-1">
                  No credit card or live social account credentials required.
                </p>
              </div>
              <Link to="/dashboard">
                <Button className="bg-brand-gradient">
                  Open Demo Workspace
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
