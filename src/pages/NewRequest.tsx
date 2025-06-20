
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Globe, FileText, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const NewRequest = () => {
  const [requestName, setRequestName] = useState('');
  const [singleUrl, setSingleUrl] = useState('');
  const [customQuery, setCustomQuery] = useState('');

  const handleSubmit = (type: string) => {
    console.log(`Submitting ${type} request`);
    // In real app, this would submit to API
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Create New Scraping Request</h1>
        <p className="text-lg text-gray-600">
          Choose your preferred method to extract data from websites
        </p>
      </div>

      {/* Request Name */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Request Details</span>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Give your request a descriptive name for easy tracking</p>
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
              className="mt-1"
            />
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
          <Tabs defaultValue="single-url" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single-url" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Single URL</span>
              </TabsTrigger>
              <TabsTrigger value="batch-upload" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Batch Upload</span>
              </TabsTrigger>
              <TabsTrigger value="custom-query" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Custom Query</span>
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
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the complete URL including http:// or https://
                  </p>
                </div>
                <div>
                  <Label htmlFor="data-points">What data do you want to extract?</Label>
                  <Textarea
                    id="data-points"
                    placeholder="e.g., Product names, prices, descriptions, reviews, contact information..."
                    className="mt-1 h-20"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Describe the specific information you need in plain language
                  </p>
                </div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => handleSubmit('single-url')}
                  disabled={!requestName || !singleUrl}
                >
                  Start Single URL Scraping
                </Button>
              </div>
            </TabsContent>

            {/* Batch Upload Tab */}
            <TabsContent value="batch-upload" className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Batch URL Scraping</h3>
                <p className="text-sm text-green-800">
                  Upload a CSV file with multiple URLs to scrape data from many pages at once.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-upload">Upload CSV File *</Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop your CSV file
                    </p>
                    <p className="text-xs text-gray-500">
                      CSV files only, max 10MB
                    </p>
                    <Button variant="outline" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• First column should contain URLs</li>
                    <li>• Include header row (e.g., "URL", "Name", "Category")</li>
                    <li>• Maximum 1000 URLs per batch</li>
                    <li>• Each URL should be complete (including http/https)</li>
                  </ul>
                </div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => handleSubmit('batch-upload')}
                  disabled={!requestName}
                >
                  Start Batch Scraping
                </Button>
              </div>
            </TabsContent>

            {/* Custom Query Tab */}
            <TabsContent value="custom-query" className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Custom Query Scraping</h3>
                <p className="text-sm text-purple-800">
                  Describe your data extraction needs in detail. Perfect for complex or specific requirements.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-query">Describe Your Data Needs *</Label>
                  <Textarea
                    id="custom-query"
                    placeholder="Example: I need to collect product information from Amazon search results for 'wireless headphones', including product names, prices, ratings, number of reviews, and seller information. I want data from the first 5 pages of results."
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    className="mt-1 h-32"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Be as specific as possible about what data you need and where to find it
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Expected Data Volume</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">Small (1-100 records)</Badge>
                      <Badge variant="outline">Medium (100-1000 records)</Badge>
                      <Badge variant="outline">Large (1000+ records)</Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Priority Level</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">Standard</Badge>
                      <Badge variant="outline">High</Badge>
                      <Badge variant="outline">Urgent</Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => handleSubmit('custom-query')}
                  disabled={!requestName || !customQuery}
                >
                  Submit Custom Request
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
