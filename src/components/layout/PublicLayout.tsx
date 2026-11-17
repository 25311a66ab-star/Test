import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BrandLogo, Button } from '../ui/Primitives';
import { useApp } from '../../context/AppContext';

const NAV_LINKS = [
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/business', label: 'Business' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] text-[#0F1115]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0F1115] focus:text-white focus:rounded-lg"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#EEF0F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <Link to="/" aria-label="MarketPulse home">
            <BrandLogo />
          </Link>

          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    active ? 'text-[#0F1115] font-semibold' : 'text-[#4B5563] hover:text-[#0F1115]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <Button size="sm">{isAuthenticated ? 'Open Dashboard' : 'Get Started'}</Button>
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-[#0F1115] hover:bg-[#EEF0F4]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-[#EEF0F4] px-4 py-4 space-y-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#0F1115]"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#EEF0F4] flex gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                onClick={() => setMobileOpen(false)}
                className="flex-1"
              >
                <Button className="w-full">{isAuthenticated ? 'Dashboard' : 'Get Started'}</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-[#EEF0F4] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-3">
              <BrandLogo />
              <p className="text-sm text-[#4B5563] max-w-xs">
                AI-Powered Customer Insights Platform helping small businesses and local retailers turn social media data into measurable growth.
              </p>
              <p className="text-xs text-[#4B5563]">
                Sreenidhi Institute of Science and Technology, Ghatkesar · Wadhwani Foundation Venture
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#0F1115] mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-[#4B5563]">
                <li><Link to="/features" className="hover:text-[#0F1115]">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-[#0F1115]">Pricing</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#0F1115]">Live Demo Dashboard</Link></li>
                <li><Link to="/dashboard/insights" className="hover:text-[#0F1115]">AI Insights</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#0F1115] mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-[#4B5563]">
                <li><Link to="/about" className="hover:text-[#0F1115]">About Us</Link></li>
                <li><Link to="/business" className="hover:text-[#0F1115]">Financial Overview</Link></li>
                <li><Link to="/contact" className="hover:text-[#0F1115]">Contact</Link></li>
                <li><Link to="/login" className="hover:text-[#0F1115]">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#0F1115] mb-3">Demo & Data Notice</h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Analytics inside the workspace use deterministic synthetic Demo Data and are not connected to live social media APIs. Financial projections on the Business page are reproduced verbatim from the MarketPulse Venture Viability Analysis.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#EEF0F4] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4B5563]">
            <span>© {new Date().getFullYear()} MarketPulse. All rights reserved.</span>
            <span>Demo Build — No live payment processing or external social API connections.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
