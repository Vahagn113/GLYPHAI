interface FilePreviewProps { name: string; size?: string; preview?: string; mimeType?: string; className?: string; }

export function FilePreview({ name, size, preview, mimeType, className = "" }: FilePreviewProps) { return <div className={className}>{preview && mimeType?.startsWith("image/") ? <img src={preview} alt={name} /> : null}<span>{name}</span>{size ? <span>{size}</span> : null}</div>; }
