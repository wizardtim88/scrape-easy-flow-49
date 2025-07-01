import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Globe, Database as DatabaseIcon, HelpCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from '@/components/FileUpload';
import { DomainLocationSelector } from '@/components/DomainLocationSelector';
import { useFormValidation } from '@/hooks/useFormValidation';
import { ScrapingRequest, SubmissionState } from '@/types/scraping';

const NewRequest = () => {
  // Form state
  const [requestName, setRequestName] = useState('');
  const [dataPoints, setDataPoints] = useState('');
  const [singleUrl, setSingleUrl] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [scrapingMethod, setScrapingMethod] = useState<'discovery' | 'standard' | 'real-time'>('standard');
  const [activeTab, setActiveTab] = useState('single-url');
  
  // Validation and submission state
  const { errors, validateForm, clearErrors } = useFormValidation();
  const [submission, setSubmission] = useState<SubmissionState>({
    isSubmitting: false,
    error: null,
    success: false
  });
  
  const { toast } = useToast();

  const handleSubmit = async (type: string) => {
    console.log(`Attempting to submit ${type} request`);
    
    // Clear previous errors and submission state
    clearErrors();
    setSubmission({ isSubmitting: false, error: null, success: false });

    // Prepare form data
    const formData: ScrapingRequest = {
      name: requestName.trim(),
      type: type as 'single-url' | 'batch-upload' | 'sql-query',
      url: type === 'single-url' ? singleUrl.trim() : undefined,
      dataPoints: dataPoints.trim() || undefined,
      sqlQuery: type === 'sql-query' ? sqlQuery.trim() : undefined,
      file: type === 'batch-upload' ? selectedFile : undefined,
      domain: (type === 'single-url' || type === 'batch-upload') ? selectedDomain : undefined,
      locations: (type === 'single-url' || type === 'batch-upload') ? selectedLocations : undefined,
      scrapingMethod: (type === 'single-url' || type === 'batch-upload') ? scrapingMethod : undefined
    };

    // Validate form
    if (!validateForm(formData)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Set submitting state
    setSubmission({ isSubmitting: true, error: null, success: false });

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/scraping-requests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success state
      setSubmission({ isSubmitting: false, error: null, success: true });
      
      toast({
        title: "Request Submitted Successfully!",
        description: `Your ${type.replace('-', ' ')} scraping request has been queued for processing.`,
      });

      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setSubmission({ 
        isSubmitting: false, 
        error: errorMessage, 
        success: false 
      });
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setRequestName('');
    setDataPoints('');
    setSingleUrl('');
    setSqlQuery('');
    setSelectedFile(null);
    setSelectedDomain('');
    setSelectedLocations([]);
    setScrapingMethod('standard');
    clearErrors();
  };

  const isFormDisabled = submission.isSubmitting;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Create New Scraping Request</h1>
        <p className="text-lg text-gray-600">
          Choose your preferred method to extract data from websites
        </p>
      </div>

      {/* Request Name and Data Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Request Details</span>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Give your request a descriptive name and specify what data to extract</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>Provide a name and description for your scraping request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="request-name">Request Name *</Label>
            <Input
              id="request-name"
              placeholder="e.g., Product Pricing Analysis, Competitor Research"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              disabled={isFormDisabled}
              className={`mt-1 ${errors.name ? 'border-red-300' : ''}`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="data-points">What data do you want to extract?</Label>
            <Textarea
              id="data-points"
              placeholder="e.g., Product names, prices, descriptions, reviews, contact information..."
              value={dataPoints}
              onChange={(e) => setDataPoints(e.target.value)}
              disabled={isFormDisabled}
              className={`mt-1 h-20 ${errors.dataPoints ? 'border-red-300' : ''}`}
            />
            {errors.dataPoints ? (
              <p className="text-sm text-red-600 mt-1">{errors.dataPoints}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Describe the specific information you need in plain language (optional)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scraping Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Scraping Method</CardTitle>
          <CardDescription>Select the method that best fits your data extraction needs</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single-url" className="flex items-center space-x-2" disabled={isFormDisabled}>
                <Globe className="w-4 h-4" />
                <span>Single URL</span>
              </TabsTrigger>
              <TabsTrigger value="batch-upload" className="flex items-center space-x-2" disabled={isFormDisabled}>
                <span>Excel/CSV Upload</span>
              </TabsTrigger>
              <TabsTrigger value="sql-query" className="flex items-center space-x-2" disabled={isFormDisabled}>
                <DatabaseIcon className="w-4 h-4" />
                <span>SQL Query</span>
              </TabsTrigger>
            </TabsList>

            {/* Single URL Tab */}
            <TabsContent value="single-url" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Single URL Scraping</h3>
                <p className="text-sm text-blue-800">
                  Extract data from a single webpage. Perfect for one-time data collection or testing.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="single-url">Website URL *</Label>
                  <Input
                    id="single-url"
                    type="url"
                    placeholder="https://example.com/page-to-scrape"
                    value={singleUrl}
                    onChange={(e) => setSingleUrl(e.target.value)}
                    disabled={isFormDisabled}
                    className={`mt-1 ${errors.url ? 'border-red-300' : ''}`}
                  />
                  {errors.url ? (
                    <p className="text-sm text-red-600 mt-1">{errors.url}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the complete URL including http:// or https://
                    </p>
                  )}
                </div>

                <DomainLocationSelector
                  selectedDomain={selectedDomain}
                  selectedLocations={selectedLocations}
                  onDomainChange={setSelectedDomain}
                  onLocationsChange={setSelectedLocations}
                  disabled={isFormDisabled}
                  errors={{ domain: errors.domain, locations: errors.locations }}
                />

                <div>
                  <Label>Scraping Method</Label>
                  <RadioGroup
                    value={scrapingMethod}
                    onValueChange={(value) => setScrapingMethod(value as 'discovery' | 'standard' | 'real-time')}
                    disabled={isFormDisabled}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="discovery" id="discovery" />
                      <Label htmlFor="discovery" className="font-normal cursor-pointer">
                        Discovery Scraping - For exact and direct match creation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-normal cursor-pointer">
                        Standard Scraping - For including data in standard business views
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="real-time" id="real-time" />
                      <Label htmlFor="real-time" className="font-normal cursor-pointer">
                        Real-Time Scraping - For immediate access in streaming data views
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => handleSubmit('single-url')}
                  disabled={isFormDisabled || !requestName || !singleUrl}
                >
                  {submission.isSubmitting && activeTab === 'single-url' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Excel/CSV Upload Tab */}
            <TabsContent value="batch-upload" className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Excel/CSV Batch Scraping</h3>
                <p className="text-sm text-green-800">
                  Upload an Excel or CSV file with multiple URLs to scrape data from many pages at once.
                </p>
              </div>
              <div className="space-y-4">
                <FileUpload
                  onFileSelect={setSelectedFile}
                  error={errors.file}
                  disabled={isFormDisabled}
                />

                <DomainLocationSelector
                  selectedDomain={selectedDomain}
                  selectedLocations={selectedLocations}
                  onDomainChange={setSelectedDomain}
                  onLocationsChange={setSelectedLocations}
                  disabled={isFormDisabled}
                  errors={{ domain: errors.domain, locations: errors.locations }}
                />

                <div>
                  <Label>Scraping Method</Label>
                  <RadioGroup
                    value={scrapingMethod}
                    onValueChange={(value) => setScrapingMethod(value as 'discovery' | 'standard' | 'real-time')}
                    disabled={isFormDisabled}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="discovery" id="discovery-batch" />
                      <Label htmlFor="discovery-batch" className="font-normal cursor-pointer">
                        Discovery Scraping - For exact and direct match creation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard-batch" />
                      <Label htmlFor="standard-batch" className="font-normal cursor-pointer">
                        Standard Scraping - For including data in standard business views
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="real-time" id="real-time-batch" />
                      <Label htmlFor="real-time-batch" className="font-normal cursor-pointer">
                        Real-Time Scraping - For immediate access in streaming data views
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">File Format Requirements:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• First column should contain URLs</li>
                    <li>• Include header row (e.g., "URL", "Name", "Category")</li>
                    <li>• Maximum 1000 URLs per batch</li>
                    <li>• Each URL should be complete (including http/https)</li>
                    <li>• Supports Excel (.xlsx, .xls) and CSV formats</li>
                  </ul>
                </div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => handleSubmit('batch-upload')}
                  disabled={isFormDisabled || !requestName || !selectedFile}
                >
                  {submission.isSubmitting && activeTab === 'batch-upload' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* SQL Query Tab */}
            <TabsContent value="sql-query" className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">SQL Query Scraping</h3>
                <p className="text-sm text-purple-800">
                  Use SQL-like syntax to specify complex data extraction patterns and conditions.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sql-query">SQL Query *</Label>
                  <Textarea
                    id="sql-query"
                    placeholder="SELECT product_name, price, rating, reviews_count FROM 'https://example.com/products' WHERE category = 'electronics' AND price < 500 LIMIT 100"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    disabled={isFormDisabled}
                    className={`mt-1 h-32 font-mono text-sm ${errors.sqlQuery ? 'border-red-300' : ''}`}
                  />
                  {errors.sqlQuery ? (
                    <p className="text-sm text-red-600 mt-1">{errors.sqlQuery}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Write SQL-like queries to specify what data to extract and from which URLs
                    </p>
                  )}
                </div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => handleSubmit('sql-query')}
                  disabled={isFormDisabled || !requestName || !sqlQuery}
                >
                  {submission.isSubmitting && activeTab === 'sql-query' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Submission Status */}
      {submission.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">
              <strong>Error:</strong> {submission.error}
            </p>
          </CardContent>
        </Card>
      )}

      {submission.success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-800">
              <strong>Success!</strong> Your scraping request has been submitted and will be processed shortly.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-orange-500" />
            <span>Need Help?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Examples of Good Requests</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• "Extract product prices from competitor websites"</li>
                <li>• "Collect contact information from business directories"</li>
                <li>• "Gather customer reviews for market research"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What We Can Scrape</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Product information and pricing</li>
                <li>• Contact details and business info</li>
                <li>• News articles and content</li>
                <li>• Public reviews and ratings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Get Support</h4>
              <p className="text-gray-600 mb-2">
                Our team is here to help with complex requests or technical questions.
              </p>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRequest;
