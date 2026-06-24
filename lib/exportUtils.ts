export async function copyToClipboard(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function downloadBlob(content: BlobPart, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadAsTxt(text: string, filename: string): void {
  downloadBlob(text, filename, "text/plain;charset=utf-8");
}

export function downloadAsJson(data: unknown, filename: string): void {
  downloadBlob(JSON.stringify(data, null, 2), filename, "application/json;charset=utf-8");
}
