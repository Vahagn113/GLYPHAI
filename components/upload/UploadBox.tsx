import type { ChangeEvent, DragEvent, RefObject } from "react";

interface UploadBoxProps { inputRef?: RefObject<HTMLInputElement | null>; accept?: string; onFileChange: (event: ChangeEvent<HTMLInputElement>) => void; onDrop?: (event: DragEvent<HTMLDivElement>) => void; onDragOver?: (event: DragEvent<HTMLDivElement>) => void; onDragLeave?: (event: DragEvent<HTMLDivElement>) => void; children?: React.ReactNode; className?: string; }

export function UploadBox({ inputRef, accept, onFileChange, onDrop, onDragOver, onDragLeave, children, className = "" }: UploadBoxProps) { return <div className={className} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}><input ref={inputRef} type="file" accept={accept} onChange={onFileChange} className="hidden" />{children}</div>; }
