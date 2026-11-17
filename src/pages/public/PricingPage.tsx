import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Button, Card } from '../../components/ui/Primitives';
import { VENTURE_GROUND_TRUTH } from '../../data/ventureData';

const COMPARISON_ROWS = [
  { feature: 'AI Customer Insights', unit: '1 Unit', sub: 'Unlimited', ent: 'Unlimited + Custom' },
  { feature: 'Social Platforms Tracked', unit: 'Up to 2', sub: 'All 5 Platforms', ent: 'All 5 + Multi-Brand' },
  { feature: 'Competitor Benchmarking', unit: '1 Competitor', sub: 'Up to 5 Competitors', ent: 'Unlimited' },
  { feature: 'Campaign Performance Funnel', unit: 'Summary Only', sub: 'Full Funnel & Alerts', ent: 'Full + Team Roles' },
  { feature: 'Exportable PDF Reports', unit: 'Single Report', sub: 'Unlimited Monthly', ent: 'Custom Cadence' },
  { feature: 'Support Channel', unit: 'Email', sub: 'Priority Email', ent: 'Dedicated Onboarding' },
];

export function PricingPage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-semibold text-[#4B5563]">Pricing · Subscription & Per-Unit Model</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F1115]">
            Simple, transparent pricing for growing SMEs
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Pricing reproduced verbatim from the MarketPulse Venture Viability Analysis: ₹99 per individual unit (one-time) and ₹499/month subscription.
          </p>
        </div>

        {/* Notice: No live payment processing */}
        <div className="max-w-3xl mx-auto rounded-xl bg-white border border-[#E1E5EB] p-4 flex items-start gap-3 text-xs text-[#4B5563]">
          <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#0F1115]">Demo Build Notice:</strong> No live payment gateway or billing integration is active in this build (consistent with the initial prototype scope in the Venture Viability Analysis).
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VENTURE_GROUND_TRUTH.pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-[12px] p-7 bg-white flex flex-col justify-between ${
                tier.popular
                  ? 'border-2 border-[#E11D2E] shadow-[0_16px_32px_-8px_rgba(225,29,46,0.12)]'
                  : 'border border-[#EEF0F4]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-[#0F1115]">{tier.name}</h2>
                  {tier.popular && (
                    <span className="text-xs font-semibold text-white bg-brand-gradient px-2.5 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4B5563] mt-1">{tier.audience}</p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#0F1115] tabular-nums">
                    {tier.priceLabel}
                  </span>
                  <span className="text-xs text-[#4B5563]">{tier.cadence}</span>
                </div>
                <p className="text-sm text-[#4B5563] mt-3">{tier.description}</p>

                <ul className="mt-6 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#0F1115]">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to={tier.id === 'enterprise' ? '/contact' : '/register'} className="mt-8 block">
                <Button variant={tier.popular ? 'primary' : 'outline'} className="w-full">
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-[#EEF0F4]">
            <h2 className="text-xl font-bold text-[#0F1115]">Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F9FB] text-xs text-[#4B5563] border-b border-[#EEF0F4]">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Capability</th>
                  <th className="py-3.5 px-6 font-semibold">Per-Unit (₹99)</th>
                  <th className="py-3.5 px-6 font-semibold text-[#0F1115]">Growth (₹499/mo)</th>
                  <th className="py-3.5 px-6 font-semibold">Enterprise (Contact Sales)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF0F4]">
                {COMPARISON_ROWS.map((r) => (
                  <tr key={r.feature} className="hover:bg-[#F8F9FB]/60">
                    <td className="py-3.5 px-6 font-medium text-[#0F1115]">{r.feature}</td>
                    <td className="py-3.5 px-6 text-[#4B5563]">{r.unit}</td>
                    <td className="py-3.5 px-6 font-semibold text-[#0F1115]">{r.sub}</td>
                    <td className="py-3.5 px-6 text-[#4B5563]">{r.ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}
