
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Filter, Eye, ArrowUpDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Results = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState('1');

  // Mock data - in real app this would come from API
  const completedRequests = [
    { id: '1', name: 'Product Pricing Analysis', date: '2024-01-15', results: 150, type: 'Single URL' },
    { id: '2', name: 'Industry Directory Scrape', date: '2024-01-14', results: 2847, type: 'Batch Upload' },
    { id: '3', name: 'Competitor Research', date: '2024-01-13', results: 543, type: 'Custom Query' },
  ];

  // Mock scraped data for the selected request
  const sampleData = [
    { id: 1, productName: 'Wireless Bluetooth Headphones', price: '$79.99', rating: '4.5', reviews: '1,234', category: 'Electronics', availability: 'In Stock' },
    { id: 2, productName: 'Smartphone Charging Cable', price: '$15.99', rating: '4.2', reviews: '856', category: 'Electronics', availability: 'In Stock' },
    { id: 3, productName: 'Laptop Stand Adjustable', price: '$45.00', rating: '4.7', reviews: '2,103', category: 'Office', availability: 'Limited Stock' },
    { id: 4, productName: 'Wireless Mouse Ergonomic', price: '$29.99', rating: '4.3', reviews: '567', category: 'Electronics', availability: 'In Stock' },
    { id: 5, productName: 'USB-C Hub Multi-Port', price: '$35.50', rating: '4.1', reviews: '789', category: 'Electronics', availability: 'Out of Stock' },
  ];

  const selectedRequestData = completedRequests.find(r => r.id === selectedRequest);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scraping Results</h1>
          <p className="text-gray-600 mt-2">View and download your extracted data</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter Data
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      {/* Request Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Request</CardTitle>
          <CardDescription>Choose a completed request to view its results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedRequests.map((request) => (
              <Card 
                key={request.id} 
                className={`cursor-pointer transition-all ${
                  selectedRequest === request.id 
                    ? 'ring-2 ring-orange-500 bg-orange-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedRequest(request.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{request.name}</h3>
                    <Badge variant="outline">{request.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.date}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      {request.results.toLocaleString()} records
                    </span>
                    {selectedRequest === request.id && (
                      <Badge className="bg-orange-500">Selected</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {selectedRequestData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedRequestData.name}</CardTitle>
                <CardDescription>
                  Scraped on {selectedRequestData.date} • {selectedRequestData.results.toLocaleString()} total records
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  JSON
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table" className="space-y-4">
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="summary">Data Summary</TabsTrigger>
                <TabsTrigger value="export">Export Options</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="space-y-4">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search in results..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Data Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">
                          <Button variant="ghost" size="sm" className="p-0 h-auto font-semibold">
                            Product Name <ArrowUpDown className="ml-1 w-3 h-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <Button variant="ghost" size="sm" className="p-0 h-auto font-semibold">
                            Price <ArrowUpDown className="ml-1 w-3 h-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="font-semibold">Rating</TableHead>
                        <TableHead className="font-semibold">Reviews</TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="font-semibold">Availability</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell className="font-semibold text-green-600">{item.price}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-500">★</span>
                              <span>{item.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.reviews}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                item.availability === 'In Stock' ? 'default' :
                                item.availability === 'Limited Stock' ? 'secondary' :
                                'destructive'
                              }
                            >
                              {item.availability}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing 1-5 of {selectedRequestData.results} results
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-blue-600">150</CardTitle>
                      <CardDescription>Total Records</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-green-600">6</CardTitle>
                      <CardDescription>Data Fields</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-purple-600">100%</CardTitle>
                      <CardDescription>Success Rate</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-orange-600">45s</CardTitle>
                      <CardDescription>Processing Time</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="export">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Export Formats</CardTitle>
                      <CardDescription>Choose your preferred format for downloading the data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Download as CSV (Recommended)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Download as Excel (.xlsx)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Download as JSON
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Download as PDF Report
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Export Options</CardTitle>
                      <CardDescription>Customize your export</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Include Headers</label>
                        <p className="text-xs text-gray-500">Add column names to the first row</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Date Range</label>
                        <p className="text-xs text-gray-500">Export data from specific dates only</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Selected Fields Only</label>
                        <p className="text-xs text-gray-500">Choose specific columns to export</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Results;
