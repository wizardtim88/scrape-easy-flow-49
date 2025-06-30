
# Web Scraping Platform - Developer Documentation

## Overview
This is a React-based frontend for a web scraping platform that allows users to submit scraping requests through three methods:
- Single URL scraping
- Batch Excel/CSV upload
- SQL-like query interface

## Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React

## Project Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── Layout.tsx       # Main layout wrapper
├── pages/
│   └── NewRequest.tsx   # Main scraping request form
├── hooks/
│   └── use-toast.ts     # Toast notification hook
└── lib/
    └── utils.ts         # Utility functions
```

## Data Models

### ScrapingRequest Interface
```typescript
interface ScrapingRequest {
  id: string;
  name: string;
  type: 'single-url' | 'batch-upload' | 'sql-query';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  
  // Single URL specific
  url?: string;
  dataPoints?: string;
  
  // Batch upload specific
  fileId?: string;
  fileName?: string;
  
  // SQL query specific
  sqlQuery?: string;
  
  // Results
  results?: ScrapingResult[];
  errorMessage?: string;
}

interface ScrapingResult {
  id: string;
  requestId: string;
  url: string;
  data: Record<string, any>;
  scrapedAt: Date;
}
```

## Required Backend API Endpoints

### 1. Submit Scraping Request
```
POST /api/scraping-requests
Content-Type: application/json

Body:
{
  "name": "string",
  "type": "single-url" | "batch-upload" | "sql-query",
  "url"?: "string",
  "dataPoints"?: "string",
  "sqlQuery"?: "string",
  "fileId"?: "string"
}

Response: ScrapingRequest
```

### 2. Get Request Status
```
GET /api/scraping-requests/:id

Response: ScrapingRequest
```

### 3. File Upload
```
POST /api/file-upload
Content-Type: multipart/form-data

Body: FormData with file

Response:
{
  "fileId": "string",
  "fileName": "string",
  "size": number,
  "validUrls": number
}
```

### 4. Get Results
```
GET /api/scraping-requests/:id/results
Optional: ?format=csv|json

Response: ScrapingResult[] or CSV file
```

## Frontend Implementation Notes

### Form Validation Requirements
- Request name: Required, 3-100 characters
- Single URL: Valid HTTP/HTTPS URL
- Data points: Optional, max 500 characters
- SQL query: Required for SQL method, basic syntax validation
- File upload: Excel/CSV only, max 10MB, max 1000 URLs

### File Upload Specifications
- Supported formats: .xlsx, .xls, .csv
- Maximum file size: 10MB
- Maximum URLs per batch: 1000
- Required format: First column must contain URLs
- Headers are recommended for better processing

### SQL Query Syntax
The platform should support a simplified SQL-like syntax:
```sql
SELECT field1, field2, field3 
FROM 'https://example.com/page' 
WHERE condition = 'value' 
LIMIT 100
```

## Backend Implementation Requirements

### 1. Web Scraping Engine
- Use Puppeteer, Playwright, or similar for JavaScript-heavy sites
- Implement rate limiting and respectful crawling
- Handle dynamic content loading
- Support common anti-bot measures

### 2. File Processing
- Parse Excel/CSV files securely
- Validate URLs in batch uploads
- Process files asynchronously
- Store original files for audit trails

### 3. Queue System
- Implement job queue for scraping tasks
- Support priority levels and scheduling
- Handle failures with retry logic
- Provide real-time status updates

### 4. Database Schema
```sql
-- Scraping requests table
CREATE TABLE scraping_requests (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  url TEXT,
  data_points TEXT,
  sql_query TEXT,
  file_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  error_message TEXT
);

-- Results table
CREATE TABLE scraping_results (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES scraping_requests(id),
  url TEXT NOT NULL,
  data JSONB,
  scraped_at TIMESTAMP DEFAULT NOW()
);

-- File uploads table
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY,
  original_name VARCHAR(255),
  file_path TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Security Considerations
- Validate and sanitize all URLs
- Implement rate limiting per user/IP
- Scan uploaded files for malware
- Use HTTPS for all communications
- Implement proper CORS policies
- Add authentication and authorization

### 6. Error Handling
- Network timeouts and connection errors
- Invalid HTML/content parsing errors
- File format validation errors
- Rate limiting and blocking detection
- Memory and storage limitations

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Backend API server running on expected endpoints

### Installation
```bash
npm install
npm run dev
```

### Environment Variables
Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_BATCH_URLS=1000
```

## Testing Strategy

### Frontend Testing
- Unit tests for form validation logic
- Integration tests for API calls
- E2E tests for complete user flows
- File upload testing with various formats

### Backend Testing
- Unit tests for scraping logic
- Integration tests for API endpoints
- Load testing for concurrent requests
- File processing validation tests

## Deployment Considerations

### Frontend Deployment
- Build optimized bundle: `npm run build`
- Deploy to CDN or static hosting
- Configure proper routing for SPA

### Backend Deployment
- Containerize scraping services
- Set up job queue infrastructure
- Configure file storage (S3, etc.)
- Implement monitoring and logging
- Set up database with proper indexing

## Performance Optimization

### Frontend
- Implement proper loading states
- Add request caching with React Query
- Lazy load components
- Optimize bundle size

### Backend
- Implement connection pooling
- Use caching for repeated requests
- Optimize database queries
- Implement horizontal scaling for scrapers

## Monitoring and Analytics
- Track request success/failure rates
- Monitor scraping performance metrics
- Log errors and exceptions
- Track user engagement metrics
- Set up alerts for system health

## Next Steps for Development
1. Set up backend API with chosen technology stack
2. Implement authentication system
3. Create database schema and migrations
4. Build web scraping engine with queue system
5. Add real-time updates via WebSockets
6. Implement file processing pipeline
7. Add comprehensive error handling
8. Set up monitoring and logging
9. Create admin dashboard for request management
10. Add user dashboard for request history
