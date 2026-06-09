export function Footer() {
  return (
    <footer className="relative w-full py-14 px-6 lg:px-16 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
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
        <p className="text-xs text-white/25">&copy; 2025 SwarpPay. All rights reserved.</p>
      </div>
    </footer>
  );
}
