interface CVResultViewerProps { text: string; className?: string; }

export function CVResultViewer({ text, className = "" }: CVResultViewerProps) { return <article className={className}>{text}</article>; }
