import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Cpu, Database, Sparkles, Target, Users } from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Button, Card } from '../../components/ui/Primitives';
import { VENTURE_GROUND_TRUTH } from '../../data/ventureData';

export function AboutPage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Header */}
        <section className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold text-[#4B5563]">
            About MarketPulse · {VENTURE_GROUND_TRUTH.institution}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F1115]">
            Helping small businesses turn social data into confident decisions
          </h1>
          <p className="text-base text-[#4B5563] max-w-[65ch]">
            {VENTURE_GROUND_TRUTH.tagline}. Originating from our Venture Viability Analysis under the Wadhwani Foundation program, MarketPulse addresses the marketing intelligence gap faced by urban and semi-urban SMEs.
          </p>
        </section>

        {/* Problem Statement & MarketPulse Solution */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-7 space-y-3">
            <h2 className="text-xl font-bold text-[#0F1115]">The Problem We Solve</h2>
            <p className="text-sm text-[#4B5563]">{VENTURE_GROUND_TRUTH.problem.statement}</p>
            <p className="text-sm text-[#4B5563]">{VENTURE_GROUND_TRUTH.problem.impact}</p>
            <div className="pt-3 border-t border-[#EEF0F4]">
              <p className="text-xs font-semibold text-[#0F1115] mb-2">Root Causes Identified:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#4B5563]">
                {VENTURE_GROUND_TRUTH.problem.rootCauses.map((cause) => (
                  <li key={cause}>• {cause}</li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="p-7 space-y-3">
            <h2 className="text-xl font-bold text-[#0F1115]">The MarketPulse Solution</h2>
            <p className="text-sm text-[#4B5563]">{VENTURE_GROUND_TRUTH.solution.summary}.</p>
            <p className="text-sm font-medium text-[#0F1115]">
              Unique Value Proposition: {VENTURE_GROUND_TRUTH.solution.uvp}
            </p>
            <div className="pt-3 border-t border-[#EEF0F4]">
              <p className="text-xs font-semibold text-[#0F1115] mb-2">Core Capabilities:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#4B5563]">
                {VENTURE_GROUND_TRUTH.solution.keyFeatures.map((feat) => (
                  <li key={feat}>• {feat}</li>
                ))}
              </ul>
            </div>
          </Card>
        </section>

        {/* Vision & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-7 bg-[#0F1115] text-white border-[#0F1115]">
            <Compass className="w-6 h-6 text-[#FF7A1A] mb-3" />
            <h2 className="text-xl font-bold">Our Vision</h2>
            <p className="text-sm text-white/80 mt-2 leading-relaxed">
              Empower small business owners and local retailers across India with accessible, enterprise-grade AI customer intelligence so they can compete confidently with larger brands.
            </p>
          </Card>
          <Card className="p-7">
            <Target className="w-6 h-6 text-[#E11D2E] mb-3" />
            <h2 className="text-xl font-bold text-[#0F1115]">Our Mission</h2>
            <p className="text-sm text-[#4B5563] mt-2 leading-relaxed">
              Deliver a simple, cloud-based analytics and recommendation platform that replaces marketing guesswork with reliable insights, measurable campaign tracking, and clear local growth actions.
            </p>
          </Card>
        </section>

        {/* How AI Improves Marketing Decisions (3-Step Flow) */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0F1115]">How AI Improves Marketing Decisions</h2>
            <p className="text-sm text-[#4B5563] mt-1">
              From scattered social signals to concrete weekly actions in three steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Database,
                title: 'Aggregate Social & Campaign Data',
                body: 'Unify daily reach, impressions, engagement, clicks, and competitor benchmarks in a single structured schema.',
              },
              {
                step: '02',
                icon: Cpu,
                title: 'Detect Anomalies & Gaps',
                body: 'Analyze week-over-week engagement deltas, campaign CPA against workspace averages, and competitor reach velocity.',
              },
              {
                step: '03',
                icon: Sparkles,
                title: 'Recommend Next Actions',
                body: 'Surface prioritized, plain-language recommendations with confidence indicators and exportable reports.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#4B5563]">STEP {item.step}</span>
                    <Icon className="w-5 h-5 text-[#E11D2E]" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F1115]">{item.title}</h3>
                  <p className="text-sm text-[#4B5563] mt-2">{item.body}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Target Customer Segments & Venture Team */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-7 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E11D2E]" />
              <h2 className="text-xl font-bold text-[#0F1115]">Target Customer Segments</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4]">
                <p className="text-xs font-semibold text-[#0F1115]">Primary Segment</p>
                <p className="text-sm text-[#4B5563] mt-1">{VENTURE_GROUND_TRUTH.segments.primary}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4]">
                <p className="text-xs font-semibold text-[#0F1115]">Secondary Segment</p>
                <p className="text-sm text-[#4B5563] mt-1">{VENTURE_GROUND_TRUTH.segments.secondary}</p>
              </div>
            </div>
            <p className="text-xs text-[#4B5563]">
              <strong>Geographic Focus:</strong> {VENTURE_GROUND_TRUTH.segments.geographicFocus}
            </p>
          </Card>

          <Card className="lg:col-span-5 p-7 space-y-4">
            <h2 className="text-xl font-bold text-[#0F1115]">Venture Team</h2>
            <p className="text-xs text-[#4B5563]">{VENTURE_GROUND_TRUTH.institution}</p>
            <div className="space-y-3">
              {VENTURE_GROUND_TRUTH.team.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4]"
                >
                  <span className="text-sm font-semibold text-[#0F1115]">{member.name}</span>
                  <span className="text-xs text-[#4B5563]">Major: {member.major}</span>
                </div>
              ))}
            </div>
            <Link to="/business" className="inline-block pt-2">
              <Button variant="outline" size="sm">
                View Financial & Business Overview
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>
        </section>
      </div>
    </PublicLayout>
  );
}
