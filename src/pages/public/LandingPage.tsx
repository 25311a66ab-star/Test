import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, BarChart3, Check, ChevronDown, ShieldCheck, Sparkles, Target, TrendingUp } from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Button, Card, DemoBadge } from '../../components/ui/Primitives';
import { CHART_THEME } from '../../components/charts/ChartCard';
import { VENTURE_GROUND_TRUTH } from '../../data/ventureData';

const PREVIEW_SERIES = [
  { day: 'W1', reach: 42000, impressions: 56000 },
  { day: 'W2', reach: 48500, impressions: 64200 },
  { day: 'W3', reach: 46800, impressions: 61800 },
  { day: 'W4', reach: 55400, impressions: 73100 },
  { day: 'W5', reach: 61200, impressions: 81400 },
  { day: 'W6', reach: 68900, impressions: 91200 },
];

const SAMPLE_TESTIMONIALS = [
  {
    name: 'Ananya Deshmukh',
    role: 'Founder, Banjara Handlooms (Illustrative)',
    quote:
      'Before MarketPulse, our weekend promotions were guesswork. Seeing which Instagram Reels actually drove store inquiries helped us cut wasted ad spend in half.',
  },
  {
    name: 'Karthik Reddy',
    role: 'Owner, Secunderabad Tech & Audio (Illustrative)',
    quote:
      'Comparing our reach against two nearby competitors showed us we were posting at the wrong hours. Switching to Saturday evening slots lifted engagement immediately.',
  },
  {
    name: 'Meera Nair',
    role: 'Marketing Lead, Deccan Fresh Mart (Illustrative)',
    quote:
      'Having one clean workspace for campaigns, competitor gaps, and printable monthly reports saves our small team hours every week.',
  },
];

const FAQS = [
  {
    q: 'Who is MarketPulse built for?',
    a: 'MarketPulse is built for small business owners and local retailers in urban and semi-urban areas of India who want reliable customer insights without enterprise complexity.',
  },
  {
    q: 'Are the analytics in this build connected to live social media accounts?',
    a: 'No. This evaluation build runs on a deterministic 90-day Demo Data engine so every chart, campaign, and AI recommendation can be explored immediately without API credentials.',
  },
  {
    q: 'How does MarketPulse pricing work?',
    a: 'Per our Venture Viability Analysis, MarketPulse offers ₹99 per individual unit (one-time) and ₹499/month for full subscription access. No payment processing is live in this demo build.',
  },
  {
    q: 'How does the AI Insights engine work?',
    a: 'MarketPulse analyzes your actual workspace metrics—engagement deltas, campaign CPA, and competitor reach gaps—to surface plain-language recommendations rather than raw spreadsheets.',
  },
];

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-[#EEF0F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-semibold text-[#4B5563] tracking-wide">
                AI-Powered Customer Insights Platform · Built for SMEs
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0F1115] leading-[1.1] tracking-tight">
                Transform Your Social Media Data Into{' '}
                <span className="text-brand-gradient">Business Growth</span>
              </h1>
              <p className="text-base sm:text-lg text-[#4B5563] max-w-[60ch]">
                {VENTURE_GROUND_TRUTH.solution.summary}. Stop guessing what your local customers want—turn multi-platform metrics into clear next actions.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-brand-gradient hover:opacity-95">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline">
                    Explore Features
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-[#EEF0F4] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#4B5563]">
                <span>{VENTURE_GROUND_TRUTH.context.statement}</span>
                <span aria-hidden="true">·</span>
                <span>Source: World Bank Group SME Finance</span>
              </div>
            </div>

            {/* Real Rendered Analytics Preview */}
            <div className="lg:col-span-6">
              <div className="rounded-[16px] bg-white border border-[#E1E5EB] shadow-[0_16px_32px_-8px_rgba(15,17,21,0.09)] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#EEF0F4]">
                  <div>
                    <p className="text-sm font-bold text-[#0F1115]">Workspace Performance Preview</p>
                    <p className="text-xs text-[#4B5563]">Deccan Urban Retail · 6-Week Reach & Impressions</p>
                  </div>
                  <DemoBadge />
                </div>

                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="p-3 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4]">
                    <p className="text-[11px] text-[#4B5563]">Total Reach</p>
                    <p className="text-lg font-bold text-[#0F1115] tabular-nums mt-0.5">322.8K</p>
                    <p className="text-[11px] font-medium text-[#16A34A] tabular-nums">+18.4%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4]">
                    <p className="text-[11px] text-[#4B5563]">Engagement</p>
                    <p className="text-lg font-bold text-[#0F1115] tabular-nums mt-0.5">4.8%</p>
                    <p className="text-[11px] font-medium text-[#16A34A] tabular-nums">+0.9%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4]">
                    <p className="text-[11px] text-[#4B5563]">Active Alerts</p>
                    <p className="text-lg font-bold text-[#0F1115] tabular-nums mt-0.5">3</p>
                    <p className="text-[11px] font-medium text-[#4B5563]">AI Insights</p>
                  </div>
                </div>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PREVIEW_SERIES} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                      <defs>
                        <linearGradient id="heroReach" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_THEME.brand} stopOpacity={0.22} />
                          <stop offset="95%" stopColor={CHART_THEME.brand} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="heroImp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_THEME.accent} stopOpacity={0.18} />
                          <stop offset="95%" stopColor={CHART_THEME.accent} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CHART_THEME.tooltipStyle} />
                      <Area type="monotone" dataKey="impressions" name="Impressions" stroke={CHART_THEME.accent} strokeWidth={2} fill="url(#heroImp)" />
                      <Area type="monotone" dataKey="reach" name="Reach" stroke={CHART_THEME.brand} strokeWidth={2.5} fill="url(#heroReach)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid (4 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1115]">
            Built to solve real small-business marketing bottlenecks
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563] mt-2">
            {VENTURE_GROUND_TRUTH.problem.statement}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Target,
              title: 'Identify Target Customers',
              body: 'Understand which platforms and content formats actually resonate with urban and semi-urban buyers.',
            },
            {
              icon: Sparkles,
              title: 'AI-Powered Recommendations',
              body: 'Receive plain-language next steps derived directly from your engagement deltas and campaign spend.',
            },
            {
              icon: TrendingUp,
              title: 'Competitor Benchmarking',
              body: 'Track local rivals side by side to spot reach gaps, posting cadence advantages, and audience trends.',
            },
            {
              icon: ShieldCheck,
              title: '50% Lower Workflow Cost',
              body: VENTURE_GROUND_TRUTH.solution.uvp,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-6">
                <div className="w-10 h-10 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4] flex items-center justify-center text-[#E11D2E] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0F1115]">{item.title}</h3>
                <p className="text-sm text-[#4B5563] mt-2">{item.body}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights (3 Alternating Sections) */}
      <section className="bg-white border-y border-[#EEF0F4] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {[
            {
              kicker: '01. Unified Analytics',
              title: 'Every social channel in one clean workspace',
              body: 'Track reach, impressions, engagement rate, and follower growth across Instagram, LinkedIn, X, Facebook, and TikTok with instant 7d, 30d, and 90d filtering.',
              cta: 'Explore Dashboard',
              to: '/dashboard',
              statLabel: 'Platforms Tracked',
              statValue: '5 Channels',
            },
            {
              kicker: '02. AI Insights Engine',
              title: 'Catch underperforming campaigns before budgets burn',
              body: 'MarketPulse flags high-CPA campaigns, declining channel engagement, and optimal weekend posting windows—always showing whether an insight is AI-generated or rule-based.',
              cta: 'Try AI Insights',
              to: '/dashboard/insights',
              statLabel: 'Analysis Speed',
              statValue: 'Real-Time',
            },
            {
              kicker: '03. Actionable Reports',
              title: 'Investor- and team-ready performance summaries',
              body: 'Generate structured period reports directly from workspace metrics and export clean print-ready PDFs for weekly reviews.',
              cta: 'View Reports',
              to: '/dashboard/reports',
              statLabel: 'Export Format',
              statValue: 'Print / PDF',
            },
          ].map((sec, idx) => (
            <div
              key={sec.title}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <p className="text-xs font-semibold text-[#4B5563]">{sec.kicker}</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0F1115]">{sec.title}</h3>
                <p className="text-sm sm:text-base text-[#4B5563] max-w-[58ch]">{sec.body}</p>
                <Link to={sec.to} className="inline-block pt-1">
                  <Button variant="outline">
                    {sec.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <Card className="p-8 bg-[#F8F9FB] flex flex-col justify-between min-h-[200px]">
                  <div className="flex items-center justify-between">
                    <BarChart3 className="w-6 h-6 text-[#E11D2E]" />
                    <DemoBadge />
                  </div>
                  <div className="mt-8">
                    <p className="text-xs text-[#4B5563]">{sec.statLabel}</p>
                    <p className="text-3xl font-extrabold text-[#0F1115] mt-1">{sec.statValue}</p>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials (Clearly Marked Sample / Illustrative) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1115]">
              How local businesses use MarketPulse
            </h2>
            <p className="text-xs text-[#4B5563] mt-1">
              Sample testimonials — illustrative only. Not attributed to real commercial customers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_TESTIMONIALS.map((t) => (
            <Card key={t.name} className="p-6 flex flex-col justify-between">
              <p className="text-sm text-[#0F1115] leading-relaxed">“{t.quote}”</p>
              <div className="mt-6 pt-4 border-t border-[#EEF0F4]">
                <p className="text-sm font-bold text-[#0F1115]">{t.name}</p>
                <p className="text-xs text-[#4B5563] mt-0.5">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-white border-y border-[#EEF0F4] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1115]">
              Accessible pricing designed for Indian SMEs
            </h2>
            <p className="text-sm text-[#4B5563] mt-2">
              Reproduced directly from the MarketPulse Venture Viability Analysis revenue model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VENTURE_GROUND_TRUTH.pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-[12px] p-6 bg-white flex flex-col justify-between ${
                  tier.popular
                    ? 'border-2 border-[#E11D2E] shadow-[0_16px_32px_-8px_rgba(225,29,46,0.12)]'
                    : 'border border-[#EEF0F4]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-[#0F1115]">{tier.name}</h3>
                    {tier.popular && (
                      <span className="text-xs font-semibold text-white bg-brand-gradient px-2.5 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1">{tier.audience}</p>
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#0F1115] tabular-nums">
                      {tier.priceLabel}
                    </span>
                    <span className="text-xs text-[#4B5563]">{tier.cadence}</span>
                  </div>
                  <p className="text-sm text-[#4B5563] mt-3">{tier.description}</p>
                  <ul className="mt-5 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[#0F1115]">
                        <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={tier.id === 'enterprise' ? '/contact' : '/register'} className="mt-6 block">
                  <Button
                    variant={tier.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1115] text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <Card key={item.q} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#0F1115] hover:bg-[#F8F9FB]"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#4B5563] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-[#4B5563] border-t border-[#EEF0F4] pt-3">
                    {item.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Final CTA Band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-[16px] bg-brand-gradient p-8 sm:p-12 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Ready to see your social media metrics clearly?
            </h2>
            <p className="text-sm sm:text-base text-white/90 mt-2">
              Explore the interactive MarketPulse demo workspace with 90 days of seeded multi-platform analytics.
            </p>
          </div>
          <Link to="/dashboard">
            <Button size="lg" className="bg-white text-[#0F1115] hover:bg-[#F8F9FB]">
              Launch Demo Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
