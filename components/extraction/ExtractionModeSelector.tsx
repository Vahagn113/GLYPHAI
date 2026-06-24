interface ExtractionModeSelectorProps { value: string; options: { id: string; label: string; description?: string }[]; onChange: (value: string) => void; className?: string; }

export function ExtractionModeSelector({ value, options, onChange, className = "" }: ExtractionModeSelectorProps) { return <div className={className}>{options.map((option) => <button key={option.id} type="button" onClick={() => onChange(option.id)} aria-pressed={value === option.id}>{option.label}</button>)}</div>; }
