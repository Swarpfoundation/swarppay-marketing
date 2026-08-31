import { useEffect, useId, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  CalendarDays,
  Check,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  PackageOpen,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

type FormStatus = 'idle' | 'submitting' | 'success' | 'confirmed' | 'error';

const updates = [
  {
    icon: PackageOpen,
    title: 'Product releases',
    description: 'New digital products, prepaid categories, and platform availability.',
  },
  {
    icon: BellRing,
    title: 'Important news',
    description: 'Major SwarpPay announcements and service updates worth knowing about.',
  },
  {
    icon: CalendarDays,
    title: 'Early access',
    description: 'Invitations to launches, partner opportunities, and selected events.',
  },
] as const;

function updateSubscribeMetadata() {
  document.title = 'Subscribe to SwarpPay Updates';

  const tags: Array<[string, string, string]> = [
    [
      'name',
      'description',
      'Subscribe to verified SwarpPay product releases, important company news, and selected early-access opportunities.',
    ],
    ['property', 'og:title', 'Subscribe to SwarpPay Updates'],
    [
      'property',
      'og:description',
      'Product releases, important news, and selected early access from SwarpPay.',
    ],
    ['property', 'og:url', 'https://swarppay.com/subscribe'],
    ['name', 'twitter:title', 'Subscribe to SwarpPay Updates'],
    [
      'name',
      'twitter:description',
      'Product releases, important news, and selected early access from SwarpPay.',
    ],
  ];

  tags.forEach(([attribute, key, content]) => {
    document
      .querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
      ?.setAttribute('content', content);
  });
}

function SubscribeForm() {
  const emailId = useId();
  const consentId = useId();
  const messageId = useId();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const wasConfirmed = new URLSearchParams(window.location.search).get('confirmed') === 'true';
  const [status, setStatus] = useState<FormStatus>(wasConfirmed ? 'confirmed' : 'idle');
  const [message, setMessage] = useState(
    wasConfirmed ? 'Your email address is confirmed and your subscription is active.' : ''
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!consent) {
      setStatus('error');
      setMessage('Please confirm that you want to receive SwarpPay updates.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent,
          website: form.get('website'),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.message || 'We could not start your subscription. Please try again.');
      }

      setStatus('success');
      setMessage(
        result?.message ||
          'Check your inbox and confirm your email address to complete your subscription.'
      );
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'We could not start your subscription. Please try again.'
      );
    }
  };

  if (status === 'success' || status === 'confirmed') {
    const isConfirmed = status === 'confirmed';

    return (
      <div
        className="flex min-h-[430px] flex-col justify-between border border-gold/25 bg-[#07100f] p-6 shadow-glow sm:p-8"
        role="status"
        aria-live="polite"
      >
        <div>
          <div className="flex h-14 w-14 items-center justify-center border border-gold/35 bg-gold/10 text-gold">
            {isConfirmed ? (
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Mail className="h-6 w-6" aria-hidden="true" />
            )}
          </div>
          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold/75">
            {isConfirmed ? 'Subscription active' : 'One more step'}
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            {isConfirmed ? "You're on the list." : 'Confirm your email.'}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            {message}
          </p>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-white/45">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            {isConfirmed
              ? 'Every update includes a direct unsubscribe link.'
              : 'No updates are sent until the confirmation link is opened.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-sm sm:p-8"
      aria-describedby={message ? messageId : undefined}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold/70">
            Stay informed
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Join SwarpPay updates</h2>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/25 text-gold">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-7">
        <label htmlFor={emailId} className="text-sm font-semibold text-white">
          Email address
        </label>
        <Input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-3 h-14 rounded-none border-white/15 bg-black/45 px-4 text-base text-white placeholder:text-white/25 focus-visible:border-gold focus-visible:ring-gold/20"
        />
      </div>

      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company-website">Company website</label>
        <input id="company-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 flex items-start gap-3 border border-white/10 bg-black/25 p-4">
        <Checkbox
          id={consentId}
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
          aria-required="true"
          className="mt-0.5 rounded-none border-white/30 data-[state=checked]:border-gold data-[state=checked]:bg-gold"
        />
        <label htmlFor={consentId} className="cursor-pointer text-xs leading-relaxed text-white/55">
          I agree to receive SwarpPay product releases, important company news, and selected
          early-access updates by email. I can unsubscribe at any time. See the{' '}
          <a href="/legal.html#privacy" className="text-gold underline-offset-4 hover:underline">
            Privacy Policy
          </a>
          .
        </label>
      </div>

      {message && (
        <p
          id={messageId}
          role="alert"
          className="mt-4 border border-red-400/25 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200"
        >
          {message}
        </p>
      )}

      <Button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 h-14 w-full rounded-none bg-gold px-5 text-sm font-bold text-black hover:bg-gold-light focus-visible:ring-gold/40"
      >
        {status === 'submitting' ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting
          </>
        ) : (
          <>
            Subscribe securely
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/35">
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-gold" aria-hidden="true" /> Double opt-in
        </span>
        <span className="inline-flex items-center gap-1.5">
          <LockKeyhole className="h-3.5 w-3.5 text-gold" aria-hidden="true" /> No spam
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-gold" aria-hidden="true" /> Unsubscribe anytime
        </span>
      </div>
    </form>
  );
}

export function SubscribePage() {
  useEffect(() => {
    updateSubscribeMetadata();
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="relative z-20 border-b border-white/10 bg-black/85 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white">
            <img src="/swarp-logo.png" alt="SwarpPay logo" className="h-9 w-9 object-contain" />
            <span>
              Swarp<span className="text-gold">Pay</span>
            </span>
          </a>
          <a
            href="/"
            className="inline-flex min-h-10 items-center gap-2 border border-white/10 px-4 text-xs font-semibold text-white/65 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to website
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-20 lg:px-10">
        <div
          className="absolute inset-0 opacity-[0.09]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(53,216,208,.8) 1px, transparent 1px), linear-gradient(45deg, rgba(53,216,208,.35) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'linear-gradient(to bottom, black, transparent 78%)',
          }}
        />
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[130px]" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold/75">
              SwarpPay signal
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Be first to know what SwarpPay ships next.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
              A concise email when something matters: new digital products, platform milestones,
              important company news, and selected early-access opportunities.
            </p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              {['Useful updates only', 'Confirmation required', 'Your email stays protected', 'Leave at any time'].map(
                (item) => (
                  <p key={item} className="flex items-center gap-2 text-sm text-white/55">
                    <Check className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    {item}
                  </p>
                )
              )}
            </div>
          </div>

          <SubscribeForm />
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.015] px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold/70">
              What you will receive
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-white md:text-5xl">
              Clear updates. No inbox noise.
            </h2>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {updates.map(({ icon: Icon, title, description }) => (
              <article key={title} className="border border-white/10 bg-black/35 p-6">
                <div className="flex h-11 w-11 items-center justify-center border border-gold/25 text-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 SwarpPay. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <a href="/legal.html#privacy" className="transition-colors hover:text-gold">Privacy</a>
            <a href="/legal.html#terms" className="transition-colors hover:text-gold">Terms</a>
            <a href="/legal.html#cookies" className="transition-colors hover:text-gold">Cookies</a>
            <a href="mailto:info@swarppay.com" className="transition-colors hover:text-gold">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
