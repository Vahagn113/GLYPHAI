interface CVOptimizerProps { children?: React.ReactNode; className?: string; }

export function CVOptimizer({ children, className = "" }: CVOptimizerProps) { return <section className={className}>{children}</section>; }
