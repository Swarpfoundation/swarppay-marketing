export function Footer() {
  return (
    <footer className="relative w-full py-16 lg:py-24 px-6 lg:px-16 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="mb-4 inline-flex items-center gap-3 text-2xl font-semibold tracking-tight text-white">
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
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mt-4">
              One unified platform for Africa's payments infrastructure. 
              Built from Morocco. Designed for the continent.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white/60 text-xs tracking-wider uppercase mb-6">Platform</p>
            <ul className="space-y-3">
              {['Consumer Wallet', 'Merchant Tools', 'SME Treasury', 'Enterprise API'].map((item) => (
                <li key={item}>
                  <span className="text-white/30 text-sm hover:text-gold transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/60 text-xs tracking-wider uppercase mb-6">Company</p>
            <ul className="space-y-3">
              {['About', 'Leadership', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <span className="text-white/30 text-sm hover:text-gold transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p className="text-white/20 text-xs">
            &copy; 2025 SwarpPay. All rights reserved. Confidential &middot; Institutional Investor Presentation.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="text-white/20 text-xs hover:text-gold transition-colors cursor-pointer">Privacy</span>
            <span className="text-white/20 text-xs hover:text-gold transition-colors cursor-pointer">Terms</span>
            <span className="text-white/20 text-xs hover:text-gold transition-colors cursor-pointer">Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
