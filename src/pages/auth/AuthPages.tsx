import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { BrandLogo, Button, Input } from '../../components/ui/Primitives';
import { useApp } from '../../context/AppContext';

function AuthSplitShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto space-y-6">
          <Link to="/" className="inline-block">
            <BrandLogo />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1115]">{title}</h1>
            <p className="text-sm text-[#4B5563] mt-1.5">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden lg:flex lg:col-span-6 bg-brand-gradient p-12 text-white flex-col justify-between">
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            MarketPulse Analytics
          </p>
          <h2 className="text-3xl font-extrabold mt-3 leading-tight">
            Turn multi-platform social data into clear weekly growth actions.
          </h2>
          <p className="text-sm text-white/85 mt-4 leading-relaxed">
            Built for urban and semi-urban SMEs. Track 5 social channels, benchmark local competitors, and catch underperforming campaigns early.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 space-y-3 max-w-md">
          <p className="text-xs font-semibold text-white/90">Included in Demo Workspace</p>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• 90 days of deterministic multi-platform metrics</li>
            <li>• 3 regional competitors & 6 active/paused campaigns</li>
            <li>• Rule-based & AI-ready insights engine</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'founder@marketpulse.demo', password: 'password123' },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    await login(data.email, data.password);
    navigate(params.get('next') || '/dashboard');
  };

  return (
    <AuthSplitShell title="Sign in to MarketPulse" subtitle="Access your social analytics and AI insights workspace.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
            Email address
          </label>
          <Input id="login-email" type="email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-[#DC2626] mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-pw" className="block text-xs font-semibold text-[#0F1115]">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs text-[#2563EB] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="login-pw"
              type={showPw ? 'text' : 'password'}
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-[#DC2626] mt-1">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>

        <p className="text-xs text-center text-[#4B5563]">
          New to MarketPulse?{' '}
          <Link to="/register" className="font-semibold text-[#0F1115] hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthSplitShell>
  );
}

const registerSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  companyName: z.string().min(2, 'Enter your business name'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function RegisterPage() {
  const { register: registerUser } = useApp();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const pw = watch('password') || '';
  const strength = Math.min(
    4,
    (pw.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(pw) ? 1 : 0) +
      (/[0-9]/.test(pw) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(pw) ? 1 : 0)
  );

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    await registerUser(data.fullName, data.email, data.companyName, data.password);
    navigate('/dashboard');
  };

  return (
    <AuthSplitShell title="Create your workspace" subtitle="Start exploring MarketPulse with seeded 90-day analytics.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="reg-name" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
            Full Name
          </label>
          <Input id="reg-name" {...register('fullName')} placeholder="Nithin Rao" aria-invalid={!!errors.fullName} />
          {errors.fullName && <p className="text-xs text-[#DC2626] mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="reg-company" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
            Business Name
          </label>
          <Input id="reg-company" {...register('companyName')} placeholder="Deccan Urban Retail" aria-invalid={!!errors.companyName} />
          {errors.companyName && <p className="text-xs text-[#DC2626] mt-1">{errors.companyName.message}</p>}
        </div>

        <div>
          <label htmlFor="reg-email" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
            Work Email
          </label>
          <Input id="reg-email" type="email" {...register('email')} placeholder="you@business.in" aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-[#DC2626] mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="reg-pw" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
            Password
          </label>
          <div className="relative">
            <Input
              id="reg-pw"
              type={showPw ? 'text' : 'password'}
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Password strength meter */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 rounded-full ${
                  strength >= level
                    ? strength >= 3
                      ? 'bg-[#16A34A]'
                      : 'bg-[#F59E0B]'
                    : 'bg-[#EEF0F4]'
                }`}
              />
            ))}
          </div>
          {errors.password && <p className="text-xs text-[#DC2626] mt-1">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating workspace...' : 'Create Account'}
        </Button>

        <p className="text-xs text-center text-[#4B5563]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#0F1115] hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthSplitShell>
  );
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) setSent(true);
  };

  return (
    <AuthSplitShell title="Reset your password" subtitle="Enter your email and we will send a recovery link.">
      {sent ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
            <p className="text-xs text-[#0F1115]">
              Recovery instructions have been sent to <strong>{email}</strong> (demo mode).
            </p>
          </div>
          <Link to="/reset-password" className="block">
            <Button variant="outline" className="w-full">
              Continue to Reset Password
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fp-email" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
              Email address
            </label>
            <Input
              id="fp-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="founder@marketpulse.demo"
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
          <p className="text-xs text-center text-[#4B5563]">
            <Link to="/login" className="font-semibold text-[#0F1115] hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </AuthSplitShell>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useApp();
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return;
    toast({ title: 'Password updated', description: 'You can now sign in with your new password.', variant: 'success' });
    navigate('/login');
  };

  return (
    <AuthSplitShell title="Choose a new password" subtitle="Minimum 8 characters for workspace security.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rp-pw" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
            New Password
          </label>
          <Input
            id="rp-pw"
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full">
          Update Password
        </Button>
      </form>
    </AuthSplitShell>
  );
}
