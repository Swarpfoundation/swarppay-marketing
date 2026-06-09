const socialLinks = [
  { label: 'X', href: 'https://x.com/Swarp_Pay' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/swarp-pay/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@swarp.pay' },
  { label: 'Instagram', href: 'https://www.instagram.com/swarp_pay/' },
  { label: 'Facebook', href: 'https://www.facebook.com/people/Swarp-Pay/61579879769479/' },
];

export function Footer() {
  return (
    <footer className="relative w-full py-14 px-6 lg:px-16 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <a href="#" className="inline-flex items-center gap-3 text-2xl font-semibold tracking-tight text-white">
            <img
              src="/swarp-logo.png"
              alt="SwarpPay logo"
              className="h-10 w-10 object-contain"
              draggable={false}
            />
            <span>
              Swarp<span className="text-gold">Pay</span>
            </span>
          </a>
          <p className="max-w-xl text-sm leading-relaxed text-white/40">
            SwarpPay is a digital product and prepaid value platform for Morocco. Customers
            can buy digital products. Merchants can sell them. Partners can distribute them.
          </p>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 px-3 py-2 text-xs font-semibold text-white/45 transition-colors hover:border-gold/40 hover:text-gold"
                aria-label={`SwarpPay on ${link.label}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-10 border-t border-white/5 pt-6 text-xs text-white/25">
          &copy; 2025 SwarpPay. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
