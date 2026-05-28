export default function SectionWrapper({ children, className = '', id }: { children: React.ReactNode, className?: string, id?: string }) {
  return (
    <section id={id} className={`py-24 md:py-32 px-6 max-w-7xl mx-auto w-full ${className}`}>
      {children}
    </section>
  );
}
