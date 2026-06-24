interface LoadingStateProps { title?: string; description?: string; className?: string; }

export function LoadingState({ title = "Loading", description, className = "" }: LoadingStateProps) { return <div className={className}><p>{title}</p>{description ? <p>{description}</p> : null}</div>; }
