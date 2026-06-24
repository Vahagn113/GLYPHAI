interface ConfidenceBadgeProps { value: number; label?: string; className?: string; }

export function ConfidenceBadge({ value, label = "Confidence", className = "" }: ConfidenceBadgeProps) { return <span className={className}>{label}: {Math.round(value)}%</span>; }
