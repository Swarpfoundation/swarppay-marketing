import { useEffect, useState } from 'react';

const STORAGE_KEY = 'swarppay-cookie-choice';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(STORAGE_KEY));
  }, []);

  const saveChoice = (choice: string) => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[80] border border-white/10 bg-black/90 p-5 shadow-2xl backdrop-blur-md md:left-auto md:max-w-xl">
      <p className="text-sm font-semibold text-white">We use cookies</p>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        SwarpPay uses necessary cookies to operate the website and optional cookies to
        improve performance, understand usage, and support marketing. You can accept all,
        reject non-essential cookies, or manage your preferences.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => saveChoice('all')}
          className="border border-gold bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => saveChoice('necessary')}
          className="border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
        >
          Reject non-essential
        </button>
        <a
          href="/legal.html#cookies"
          className="border border-white/15 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
        >
          Manage preferences
        </a>
      </div>
    </div>
  );
}
