export const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"] as const;
export const ALLOWED_CV_FILE_TYPES = [...ALLOWED_FILE_TYPES, "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"] as const;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File, allowedTypes: readonly string[] = ALLOWED_FILE_TYPES): FileValidationResult {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: "The file is too large. Please upload files smaller than 10MB." };
  }

  if (allowedTypes.length && !allowedTypes.includes(file.type)) {
    return { valid: false, error: "Unsupported file type." };
  }

  return { valid: true };
}
