import type { Language } from "@/lib/types";

interface LanguageSwitcherProps { language: Language; onChange: (language: Language) => void; className?: string; }

export function LanguageSwitcher({ language, onChange, className = "" }: LanguageSwitcherProps) { return <div className={className}>{(["en", "ru", "am"] as Language[]).map((item) => <button key={item} type="button" onClick={() => onChange(item)} aria-pressed={language === item}>{item.toUpperCase()}</button>)}</div>; }
