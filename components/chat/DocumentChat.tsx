import type { ChatMessage } from "@/lib/types";

interface DocumentChatProps { messages: ChatMessage[]; input: string; isLoading?: boolean; onInputChange: (value: string) => void; onSubmit: (event: React.FormEvent) => void; className?: string; }

export function DocumentChat({ messages, input, isLoading = false, onInputChange, onSubmit, className = "" }: DocumentChatProps) { return <form onSubmit={onSubmit} className={className}>{messages.map((message) => <div key={message.id}>{message.content}</div>)}<input value={input} onChange={(event) => onInputChange(event.target.value)} disabled={isLoading} /></form>; }
