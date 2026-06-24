interface HeroSectionProps { title: string; subtitle?: string; children?: React.ReactNode; className?: string; }

export function HeroSection({ title, subtitle, children, className = "" }: HeroSectionProps) { return <section className={className}><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}{children}</section>; }
