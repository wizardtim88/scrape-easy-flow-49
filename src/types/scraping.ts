
export interface ScrapingRequest {
  name: string;
  type: 'single-url' | 'batch-upload' | 'sql-query';
  url?: string;
  dataPoints?: string;
  sqlQuery?: string;
  file?: File;
  domain?: string;
  locations?: string[];
  scrapingMethod?: 'discovery' | 'standard';
}

export interface ValidationErrors {
  name?: string;
  url?: string;
  dataPoints?: string;
  sqlQuery?: string;
  file?: string;
  domain?: string;
  locations?: string;
  scrapingMethod?: string;
}

export interface SubmissionState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}
