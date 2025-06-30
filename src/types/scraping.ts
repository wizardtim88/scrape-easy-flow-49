
export interface ScrapingRequest {
  name: string;
  type: 'single-url' | 'batch-upload' | 'sql-query';
  url?: string;
  dataPoints?: string;
  sqlQuery?: string;
  file?: File;
}

export interface ValidationErrors {
  name?: string;
  url?: string;
  dataPoints?: string;
  sqlQuery?: string;
  file?: string;
}

export interface SubmissionState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}
