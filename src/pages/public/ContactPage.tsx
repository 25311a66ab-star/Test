import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Clock, Info, Mail, MapPin } from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Button, Card, Input, Textarea } from '../../components/ui/Primitives';
import { dataProvider } from '../../lib/data/provider';
import { useApp } from '../../context/AppContext';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactPage() {
  const { toast } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    await dataProvider.submitContactMessage(values);
    setSubmitted(true);
    reset();
    toast({
      title: 'Message received',
      description: 'Your inquiry has been saved to the workspace demo store.',
      variant: 'success',
    });
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold text-[#4B5563]">Contact MarketPulse</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F1115]">
            Get in touch with our team
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Questions about our SME subscription model, enterprise onboarding, or the Venture Viability Analysis? Send us a message.
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#E1E5EB] p-4 flex items-start gap-3 text-xs text-[#4B5563]">
          <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#0F1115]">This is a demo build.</strong> Contact submissions are validated and persisted locally in the DemoProvider store for evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 p-6 sm:p-8">
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#16A34A] mx-auto" />
                <h2 className="text-xl font-bold text-[#0F1115]">Thank you for reaching out</h2>
                <p className="text-sm text-[#4B5563] max-w-md mx-auto">
                  Your message has been recorded. Our team typically responds within one business day.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                      Full Name *
                    </label>
                    <Input id="contact-name" {...register('name')} placeholder="Aarav Sharma" aria-invalid={!!errors.name} />
                    {errors.name && <p className="text-xs text-[#DC2626] mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                      Work Email *
                    </label>
                    <Input id="contact-email" type="email" {...register('email')} placeholder="you@company.in" aria-invalid={!!errors.email} />
                    {errors.email && <p className="text-xs text-[#DC2626] mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-company" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                      Company / Store Name
                    </label>
                    <Input id="contact-company" {...register('company')} placeholder="Deccan Urban Retail" />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                      Subject *
                    </label>
                    <Input id="contact-subject" {...register('subject')} placeholder="Enterprise inquiry" aria-invalid={!!errors.subject} />
                    {errors.subject && <p className="text-xs text-[#DC2626] mt-1">{errors.subject.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                    Message *
                  </label>
                  <Textarea id="contact-message" rows={5} {...register('message')} placeholder="Tell us about your business and social media goals..." aria-invalid={!!errors.message} />
                  {errors.message && <p className="text-xs text-[#DC2626] mt-1">{errors.message.message}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </Card>

          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold text-[#0F1115]">Support & Location</h2>
              <div className="space-y-3 text-sm text-[#4B5563]">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#E11D2E] mt-0.5 shrink-0" />
                  <span>support@marketpulse.demo</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#E11D2E] mt-0.5 shrink-0" />
                  <span>Monday – Saturday, 09:30 – 18:30 IST</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#E11D2E] mt-0.5 shrink-0" />
                  <span>Hyderabad, Telangana (Sreenidhi Institute of Science and Technology, Ghatkesar)</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-base font-bold text-[#0F1115]">Support FAQ</h2>
              {[
                { q: 'How quickly can we onboard?', a: 'Demo workspaces load instantly. Production onboarding takes under 15 minutes.' },
                { q: 'Do you support multiple local branches?', a: 'Yes, multi-location workspaces are available under our Contact Sales tier.' },
                { q: 'Can we export monthly reports?', a: 'Yes, every generated report supports print-optimized PDF export.' },
                { q: 'Is payment required to test?', a: 'No. This demo build includes full access without payment processing.' },
              ].map((item) => (
                <div key={item.q} className="pt-2 border-t border-[#EEF0F4] first:border-0 first:pt-0">
                  <p className="text-xs font-semibold text-[#0F1115]">{item.q}</p>
                  <p className="text-xs text-[#4B5563] mt-0.5">{item.a}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
