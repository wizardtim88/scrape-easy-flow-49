import { useState, useCallback } from 'react';
import { ScrapingRequest, ValidationErrors } from '@/types/scraping';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback((data: ScrapingRequest): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate request name
    if (!data.name || data.name.trim().length < 3) {
      newErrors.name = 'Request name must be at least 3 characters long';
    } else if (data.name.length > 100) {
      newErrors.name = 'Request name must be less than 100 characters';
    }

    // Validate optional data points field
    if (data.dataPoints && data.dataPoints.length > 500) {
      newErrors.dataPoints = 'Data points description must be less than 500 characters';
    }

    // Validate based on type
    switch (data.type) {
      case 'single-url':
        if (!data.url) {
          newErrors.url = 'URL is required';
        } else if (!isValidUrl(data.url)) {
          newErrors.url = 'Please enter a valid HTTP or HTTPS URL';
        }
        break;

      case 'batch-upload':
        if (!data.file) {
          newErrors.file = 'Please select a file to upload';
        } else if (!isValidFileType(data.file)) {
          newErrors.file = 'Please upload an Excel (.xlsx, .xls) or CSV file';
        } else if (data.file.size > 10 * 1024 * 1024) {
          newErrors.file = 'File size must be less than 10MB';
        }
        break;

      case 'sql-query':
        if (!data.sqlQuery) {
          newErrors.sqlQuery = 'SQL query is required';
        } else if (data.sqlQuery.length < 10) {
          newErrors.sqlQuery = 'SQL query seems too short';
        } else if (!isValidSqlQuery(data.sqlQuery)) {
          newErrors.sqlQuery = 'Please check your SQL syntax';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validateForm, clearErrors };
};

const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];
  const allowedExtensions = ['.xlsx', '.xls', '.csv'];
  
  return allowedTypes.includes(file.type) || 
         allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
};

const isValidSqlQuery = (query: string): boolean => {
  // Basic SQL validation - check for required keywords
  const normalizedQuery = query.toLowerCase().trim();
  return normalizedQuery.startsWith('select') && 
         normalizedQuery.includes('from') &&
         normalizedQuery.includes('http');
};
