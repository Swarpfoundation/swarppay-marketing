import { useEffect, useMemo, useState } from 'react';
import {
  Gift,
  Globe2,
  HeartHandshake,
  PackageCheck,
  Send,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  languageDirections,
  languageLabels,
  languages,
  resolveSendGiftLanguage,
  sendGiftContent,
  type SendGiftLanguage,
} from './sendGiftContent';

const giftCardsUrl = 'https://giftcard.swarppay.com/';
const merchantUrl = 'https://merchant.swarppay.com/';
const contactUrl = 'mailto:info@swarppay.com';
const legalLinks = [
  { labelKey: 'terms', href: '/legal.html#terms' },
  { labelKey: 'privacy', href: '/legal.html#privacy' },
  { labelKey: 'cookies', href: '/legal.html#cookies' },
] as const;

const categoryIcons = [Smartphone, Gift, Globe2, ShoppingBag, PackageCheck, PackageCheck];
const audienceIcons = [Send, HeartHandshake, Store];
const whyIcons = [ShieldCheck, HeartHandshake, Send, PackageCheck, Globe2];

function sanitizeCampaignParam(value: string | null) {
  if (!value) return '';
  return value.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 64);
}

function buildExternalUrl(baseUrl: string, campaign: string) {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', 'swarppay_send_gift');
  url.searchParams.set('utm_medium', 'qr');

  if (campaign) {
    url.searchParams.set('utm_campaign', campaign);
  }

  return url.toString();
}

function updateSendGiftMetadata() {
  document.title = 'SwarpPay — Send Digital Gifts to Morocco';

  const tags: Array<[string, string, string]> = [
    [
      'name',
      'description',
      'Buy a digital gift card or voucher and send it to family in Morocco. SwarpPay supports digital products, prepaid value, and merchant access for Moroccan consumers and retailers.',
    ],
    ['property', 'og:title', 'Send Digital Gifts to Morocco with SwarpPay'],
    [
      'property',
      'og:description',
      'Choose a digital product, pay online, and send the code to someone in Morocco.',
    ],
    ['property', 'og:url', 'https://swarppay.com/send-gift'],
    ['name', 'twitter:title', 'Send Digital Gifts to Morocco with SwarpPay'],
    [
      'name',
      'twitter:description',
      'Choose a digital product, pay online, and send the code to someone in Morocco.',
    ],
  ];

  tags.forEach(([attribute, key, content]) => {
    const selector = `meta[${attribute}="${key}"]`;
    const tag = document.querySelector<HTMLMetaElement>(selector);
    tag?.setAttribute('content', content);
  });
}

function LanguageSwitcher({
  currentLanguage,
  onChange,
}: {
  currentLanguage: SendGiftLanguage;
  onChange: (language: SendGiftLanguage) => void;
}) {
  return (
    <div className="flex items-center gap-1 border border-white/10 bg-white/[0.03] p-1">
      {languages.map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => onChange(language)}
          aria-pressed={currentLanguage === language}
          className={`px-3 py-2 text-xs font-semibold transition-colors ${
            currentLanguage === language
              ? 'bg-gold text-black'
              : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          {languageLabels[language]}
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-8">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold/70">
        SwarpPay
      </p>
      <h2 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

function ExternalButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: string;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center border px-5 py-3 text-center text-sm font-semibold transition-colors ${
        variant === 'primary'
          ? 'border-gold bg-gold text-black hover:bg-gold-light'
          : 'border-white/15 text-white hover:border-gold/50 hover:text-gold'
      }`}
    >
      {children}
    </a>
  );
}

export function SendGiftPage() {
  const initialLanguage = resolveSendGiftLanguage(new URLSearchParams(window.location.search).get('lang'));
  const [language, setLanguage] = useState<SendGiftLanguage>(initialLanguage);
  const content = sendGiftContent[language];
  const direction = languageDirections[language];

  const campaign = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return sanitizeCampaignParam(params.get('campaign'));
  }, []);

  const giftCtaUrl = useMemo(() => buildExternalUrl(giftCardsUrl, campaign), [campaign]);
  const merchantCtaUrl = useMemo(() => buildExternalUrl(merchantUrl, campaign), [campaign]);

  useEffect(() => {
    updateSendGiftMetadata();
    document.documentElement.lang = language === 'darija' ? 'ar-MA' : language;
    document.documentElement.dir = direction;

    return () => {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    };
  }, [direction, language]);

  const changeLanguage = (nextLanguage: SendGiftLanguage) => {
    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set('lang', nextLanguage);
    const nextQuery = nextParams.toString();
    window.history.replaceState(null, '', `${window.location.pathname}?${nextQuery}`);
    setLanguage(nextLanguage);
  };

  return (
    <main dir={direction} className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <a href="/" className="flex min-w-0 items-center gap-2 text-lg font-semibold text-white">
            <img src="/swarp-logo.png" alt="SwarpPay logo" className="h-9 w-9 object-contain" />
            <span>SwarpPay</span>
          </a>
          <LanguageSwitcher currentLanguage={language} onChange={changeLanguage} />
        </div>
      </header>

      <section className="relative overflow-hidden px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div
          className="absolute inset-0 opacity-[0.08]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(53,216,208,.75) 1px, transparent 1px), linear-gradient(45deg, rgba(53,216,208,.35) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold/75">
              QR Campaign
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.02] text-white sm:text-5xl md:text-6xl">
              {content.hero.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
              {content.hero.subheadline}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ExternalButton href={giftCtaUrl}>{content.hero.primaryCta}</ExternalButton>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center border border-white/15 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:border-gold/50 hover:text-gold"
              >
                {content.hero.secondaryCta}
              </a>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/45">
              {content.hero.trustLine}
            </p>
          </div>

          <div className="border border-gold/20 bg-gold/[0.05] p-5 shadow-glow md:p-7">
            <div className="mb-6 flex h-14 w-14 items-center justify-center border border-gold/30 text-gold">
              <Gift className="h-7 w-7" />
            </div>
            <div className="space-y-4">
              {content.howItWorks.steps.map((step, index) => (
                <div key={step.title} className="flex gap-4 border border-white/10 bg-black/35 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-gold/25 text-xs font-mono text-gold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/50">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={content.howItWorks.title} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {content.howItWorks.steps.map((step, index) => (
              <article key={step.title} className="border border-white/10 bg-white/[0.025] p-5">
                <span className="mb-8 flex h-10 w-10 items-center justify-center border border-gold/25 text-sm font-mono text-gold">
                  0{index + 1}
                </span>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/52">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071312] px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={content.send.title} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.send.cards.map((card, index) => {
              const Icon = categoryIcons[index] ?? PackageCheck;
              return (
                <article key={card} className="flex items-center gap-4 border border-white/10 bg-black/30 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/25 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-semibold text-white">{card}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={content.audience.title} />
          <div className="grid gap-4 md:grid-cols-3">
            {content.audience.cards.map((card, index) => {
              const Icon = audienceIcons[index] ?? HeartHandshake;
              return (
                <article key={card.title} className="border border-white/10 bg-white/[0.025] p-5">
                  <Icon className="mb-8 h-7 w-7 text-gold" />
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/52">{card.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#071312] px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={content.why.title} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {content.why.benefits.map((benefit, index) => {
              const Icon = whyIcons[index] ?? ShieldCheck;
              return (
                <article key={benefit.title} className="border border-white/10 bg-black/30 p-5">
                  <Icon className="mb-7 h-6 w-6 text-gold" />
                  <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/52">{benefit.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl border border-gold/20 bg-gold/[0.05] p-6 md:p-9">
          <Store className="mb-8 h-8 w-8 text-gold" />
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
                {content.merchant.title}
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/60">
                {content.merchant.text}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ExternalButton href={merchantCtaUrl}>{content.merchant.cta}</ExternalButton>
              <a
                href={contactUrl}
                className="inline-flex min-h-12 items-center justify-center border border-white/15 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:border-gold/50 hover:text-gold"
              >
                {content.merchant.secondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#071312] px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <SectionHeader title={content.faq.title} />
          <Accordion type="single" collapsible className="border border-white/10 bg-black/30 px-4 md:px-6">
            {content.faq.items.map((item, index) => (
              <AccordionItem key={item.title} value={`item-${index}`} className="border-white/10">
                <AccordionTrigger className="py-5 text-base text-white hover:text-gold hover:no-underline">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-white/58">
                  {item.text}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold leading-tight text-white md:text-6xl">
            {content.finalCta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/58 md:text-lg">
            {content.finalCta.text}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ExternalButton href={giftCtaUrl}>{content.finalCta.primaryCta}</ExternalButton>
            <ExternalButton href={merchantCtaUrl} variant="secondary">
              {content.finalCta.secondaryCta}
            </ExternalButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
            <img src="/swarp-logo.png" alt="SwarpPay logo" className="h-8 w-8 object-contain" />
            <span>SwarpPay</span>
          </a>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/45">
            <a href={contactUrl} className="hover:text-gold">
              {content.footer.contact}
            </a>
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-gold">
                {content.footer[link.labelKey]}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
