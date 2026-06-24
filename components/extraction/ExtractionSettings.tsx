import { ExtractionModeSelector } from "./ExtractionModeSelector";

interface ExtractionSettingsProps { mode: string; options: { id: string; label: string; description?: string }[]; onModeChange: (value: string) => void; children?: React.ReactNode; className?: string; }

export function ExtractionSettings({ mode, options, onModeChange, children, className = "" }: ExtractionSettingsProps) { return <section className={className}><ExtractionModeSelector value={mode} options={options} onChange={onModeChange} />{children}</section>; }
