import Link from 'next/link';

export default function CTAButton({ href, children, variant = 'primary', className = '' }: { href: string, children: React.ReactNode, variant?: 'primary' | 'secondary', className?: string }) {
  const base = "inline-flex items-center justify-center px-8 py-4 font-sans text-lg tracking-widest rounded transition-all";
  const variants = {
    primary: "bg-blue hover:bg-blue-light text-white shadow-[0_0_20px_rgba(22,84,255,0.4)] hover:shadow-[0_0_35px_rgba(58,123,255,0.6)]",
    secondary: "bg-transparent border border-zinc-700 text-white hover:border-blue hover:text-blue-light"
  };

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
