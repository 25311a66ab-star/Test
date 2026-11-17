import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Card } from '../../components/ui/Primitives';
import { CHART_THEME } from '../../components/charts/ChartCard';
import { formatINR, VENTURE_GROUND_TRUTH } from '../../data/ventureData';

export function BusinessPage() {
  const { financials, revenueModel } = VENTURE_GROUND_TRUTH;
  const pnl = financials.fy2026_27_PnL;
  const ue = financials.unitEconomics;

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold text-[#4B5563]">
            Financial & Business Overview · Currency: Indian Rupee (INR)
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F1115]">
            Venture Viability & Financial Projections
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Revenue model, 3-year back-of-the-envelope projections, FY 2026–27 Profit & Loss summary, and unit economics reproduced verbatim from the MarketPulse Venture Viability Analysis.
          </p>
        </div>

        {/* Revenue Model & Key Assumptions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Primary Revenue Model', value: revenueModel.primary, sub: `Business Model: ${revenueModel.chosenBusinessModel}` },
            { label: 'Pricing Structure', value: '₹99 / ₹499 mo', sub: '₹99 one-time unit · ₹499/mo subscription' },
            { label: 'Expected First Month Sales', value: `${revenueModel.expectedFirstMonthUnits} units`, sub: `Monthly growth target: ${revenueModel.expectedMonthlyGrowthRate}` },
            { label: 'Break-Even Month', value: `Month ${ue.breakEvenMonth}`, sub: `SOM: ${financials.marketSize.som}` },
          ].map((stat) => (
            <Card key={stat.label} className="p-5">
              <p className="text-xs text-[#4B5563]">{stat.label}</p>
              <p className="text-2xl font-extrabold text-[#0F1115] mt-1 tabular-nums">{stat.value}</p>
              <p className="text-xs text-[#4B5563] mt-1">{stat.sub}</p>
            </Card>
          ))}
        </section>

        {/* 3-Year Back-of-the-Envelope Projections (Chart + Table) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6">
            <h2 className="text-lg font-bold text-[#0F1115]">Back-of-the-Envelope 3-Year Projections (INR)</h2>
            <p className="text-xs text-[#4B5563] mt-0.5 mb-5">Revenues, Total Expenses, and Profit — Presentational</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...financials.threeYearBackOfEnvelope]} margin={{ top: 10, right: 12, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#4B5563' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `₹${(v / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    contentStyle={CHART_THEME.tooltipStyle}
                    formatter={(value: unknown) => formatINR(Number(value))}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="revenues" name="Revenues" fill={CHART_THEME.brand} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Total Expenses" fill="#9CA3AF" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill={CHART_THEME.accent} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-5 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0F1115]">3-Year Financial Table</h2>
              <p className="text-xs text-[#4B5563] mt-0.5 mb-4">Exact figures from PDF Page 20</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#F8F9FB] text-xs text-[#4B5563] border-b border-[#EEF0F4]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Area</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Year 1</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Year 2</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Year 3</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF0F4] tabular-nums">
                    <tr>
                      <td className="py-3 px-3 font-medium text-[#0F1115]">Revenues</td>
                      {financials.threeYearBackOfEnvelope.map((y) => (
                        <td key={y.year} className="py-3 px-3 text-right">{formatINR(y.revenues)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-medium text-[#0F1115]">Total Expenses</td>
                      {financials.threeYearBackOfEnvelope.map((y) => (
                        <td key={y.year} className="py-3 px-3 text-right text-[#4B5563]">{formatINR(y.expenses)}</td>
                      ))}
                    </tr>
                    <tr className="bg-[#F8F9FB] font-bold">
                      <td className="py-3 px-3 text-[#0F1115]">Profit</td>
                      {financials.threeYearBackOfEnvelope.map((y) => (
                        <td key={y.year} className="py-3 px-3 text-right text-[#16A34A]">{formatINR(y.profit)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[11px] text-[#4B5563] mt-4 pt-3 border-t border-[#EEF0F4]">
              Market Growth Rate: {financials.marketSize.growthRate} · Source: {financials.marketSize.source}
            </p>
          </Card>
        </section>

        {/* FY 2026-27 P&L Summary & Unit Economics */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 overflow-hidden">
            <div className="p-6 border-b border-[#EEF0F4]">
              <h2 className="text-lg font-bold text-[#0F1115]">Profit & Loss Summary — FY 2026-27</h2>
              <p className="text-xs text-[#4B5563] mt-0.5">Exact breakdown from PDF Page 30</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left tabular-nums">
                <thead className="bg-[#F8F9FB] text-xs text-[#4B5563] border-b border-[#EEF0F4]">
                  <tr>
                    <th className="py-3 px-6 font-semibold">Particulars</th>
                    <th className="py-3 px-6 font-semibold text-right">Amount (INR)</th>
                    <th className="py-3 px-6 font-semibold text-right">% of Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF0F4]">
                  <tr className="bg-[#F0FDF4] font-bold">
                    <td className="py-3 px-6 text-[#0F1115]">Total Revenue</td>
                    <td className="py-3 px-6 text-right text-[#0F1115]">{formatINR(pnl.totalRevenue)}</td>
                    <td className="py-3 px-6 text-right text-[#16A34A]">100%</td>
                  </tr>
                  {pnl.revenueBreakdown.map((r) => (
                    <tr key={r.item}>
                      <td className="py-2.5 px-6 pl-10 text-[#4B5563]">{r.item}</td>
                      <td className="py-2.5 px-6 text-right">{formatINR(r.amount)}</td>
                      <td className="py-2.5 px-6 text-right text-[#4B5563]">{r.percentOfRevenue}%</td>
                    </tr>
                  ))}
                  <tr className="bg-[#FEF2F2] font-bold">
                    <td className="py-3 px-6 text-[#0F1115]">Total Expenses</td>
                    <td className="py-3 px-6 text-right text-[#0F1115]">{formatINR(pnl.totalExpenses)}</td>
                    <td className="py-3 px-6 text-right text-[#DC2626]">75%</td>
                  </tr>
                  {pnl.expenseBreakdown.map((e) => (
                    <tr key={e.item}>
                      <td className="py-2.5 px-6 pl-10 text-[#4B5563]">{e.item}</td>
                      <td className="py-2.5 px-6 text-right">{formatINR(e.amount)}</td>
                      <td className="py-2.5 px-6 text-right text-[#4B5563]">{e.percentOfRevenue}%</td>
                    </tr>
                  ))}
                  <tr className="bg-[#F8F9FB] font-extrabold">
                    <td className="py-3.5 px-6 text-[#0F1115]">Net Profit</td>
                    <td className="py-3.5 px-6 text-right text-[#16A34A]">{formatINR(pnl.netProfit)}</td>
                    <td className="py-3.5 px-6 text-right text-[#16A34A]">{pnl.profitMarginPercent}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="lg:col-span-5 p-6">
            <h2 className="text-lg font-bold text-[#0F1115]">Unit Economics & Break-Even (FY 2026-27)</h2>
            <p className="text-xs text-[#4B5563] mt-0.5 mb-5">Exact metrics from PDF Page 31</p>
            <div className="space-y-3 tabular-nums">
              {[
                { label: 'Year 1 Revenues', value: formatINR(ue.year1Revenues) },
                { label: 'Gross Profits for Year 1', value: formatINR(ue.grossProfitsYear1) },
                { label: 'Net Profits for Year 1', value: formatINR(ue.netProfitsYear1) },
                { label: 'Break-even Month', value: `Month ${ue.breakEvenMonth}` },
                { label: 'Customer Acquisition Cost (CAC)', value: formatINR(ue.cac) },
                { label: 'Average Order Value (AOV)', value: formatINR(ue.aov) },
                { label: 'Contribution Margin', value: `${ue.contributionMarginPercent}%` },
                { label: 'Contribution per Customer', value: formatINR(ue.contributionPerCustomer) },
                { label: 'Payback Period', value: `${ue.paybackPeriodMonths} months` },
                { label: 'LTV (Lifetime Value)', value: formatINR(ue.ltv) },
                { label: 'LTV:CAC Ratio', value: ue.ltvCacRatio },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-2 border-b border-[#EEF0F4] last:border-0 text-sm"
                >
                  <span className="text-[#4B5563]">{row.label}</span>
                  <span className="font-bold text-[#0F1115]">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Mandatory Footnote */}
        <p className="text-xs text-[#4B5563] text-center pt-4 border-t border-[#EEF0F4]">
          Figures reproduced from the MarketPulse Venture Viability Analysis.
        </p>
      </div>
    </PublicLayout>
  );
}
