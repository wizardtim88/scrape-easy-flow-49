
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, AlertCircle, Search, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const RequestStatus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real app this would come from API
  const requests = [
    {
      id: 1,
      name: 'Product Pricing Analysis',
      status: 'completed',
      progress: 100,
      created: '2024-01-15 09:30 AM',
      completed: '2024-01-15 09:45 AM',
      resultsCount: 150,
      type: 'Single URL',
      estimatedTime: '15 minutes'
    },
    {
      id: 2,
      name: 'Competitor Research Batch',
      status: 'in-progress',
      progress: 65,
      created: '2024-01-15 10:15 AM',
      completed: null,
      resultsCount: null,
      type: 'Batch Upload',
      estimatedTime: '25 minutes'
    },
    {
      id: 3,
      name: 'Market Data Collection',
      status: 'pending',
      progress: 0,
      created: '2024-01-15 11:00 AM',
      completed: null,
      resultsCount: null,
      type: 'Custom Query',
      estimatedTime: '30 minutes'
    },
    {
      id: 4,
      name: 'Customer Reviews Analysis',
      status: 'failed',
      progress: 0,
      created: '2024-01-14 02:30 PM',
      completed: null,
      resultsCount: null,
      type: 'Single URL',
      estimatedTime: '10 minutes',
      errorMessage: 'Website blocked access - contact support for assistance'
    },
    {
      id: 5,
      name: 'Industry Directory Scrape',
      status: 'completed',
      progress: 100,
      created: '2024-01-14 08:45 AM',
      completed: '2024-01-14 09:30 AM',
      resultsCount: 2847,
      type: 'Batch Upload',
      estimatedTime: '45 minutes'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      'in-progress': 'secondary',
      pending: 'outline',
      failed: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    'in-progress': requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    failed: requests.filter(r => r.status === 'failed').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Request Status</h1>
          <p className="text-gray-600 mt-2">Track and manage your scraping requests</p>
        </div>
        <Link to="/new-request">
          <Button className="bg-orange-500 hover:bg-orange-600">
            New Request
          </Button>
        </Link>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className={statusFilter === 'all' ? 'ring-2 ring-orange-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">{statusCounts.all}</CardTitle>
            <CardDescription>Total Requests</CardDescription>
          </CardHeader>
        </Card>
        <Card className={statusFilter === 'pending' ? 'ring-2 ring-orange-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-gray-500">{statusCounts.pending}</CardTitle>
            <CardDescription>Pending</CardDescription>
          </CardHeader>
        </Card>
        <Card className={statusFilter === 'in-progress' ? 'ring-2 ring-orange-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-orange-500">{statusCounts['in-progress']}</CardTitle>
            <CardDescription>In Progress</CardDescription>
          </CardHeader>
        </Card>
        <Card className={statusFilter === 'completed' ? 'ring-2 ring-orange-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-green-500">{statusCounts.completed}</CardTitle>
            <CardDescription>Completed</CardDescription>
          </CardHeader>
        </Card>
        <Card className={statusFilter === 'failed' ? 'ring-2 ring-orange-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-red-500">{statusCounts.failed}</CardTitle>
            <CardDescription>Failed</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search requests by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(request.status)}
                    <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                    {getStatusBadge(request.status)}
                    <Badge variant="outline">{request.type}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="text-sm font-medium">{request.created}</p>
                    </div>
                    {request.completed && (
                      <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="text-sm font-medium">{request.completed}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Estimated Time</p>
                      <p className="text-sm font-medium">{request.estimatedTime}</p>
                    </div>
                  </div>

                  {/* Progress Bar for In-Progress */}
                  {request.status === 'in-progress' && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{request.progress}%</span>
                      </div>
                      <Progress value={request.progress} className="h-2" />
                    </div>
                  )}

                  {/* Error Message for Failed */}
                  {request.status === 'failed' && request.errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-800">{request.errorMessage}</p>
                    </div>
                  )}

                  {/* Results Count for Completed */}
                  {request.status === 'completed' && request.resultsCount && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-green-800">
                        ✅ Successfully extracted {request.resultsCount.toLocaleString()} records
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  {request.status === 'completed' && (
                    <>
                      <Link to="/results">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </>
                  )}
                  {request.status === 'failed' && (
                    <Button variant="outline" size="sm" className="w-full">
                      Retry
                    </Button>
                  )}
                  {(request.status === 'pending' || request.status === 'in-progress') && (
                    <Button variant="outline" size="sm" className="w-full">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t created any scraping requests yet'
              }
            </p>
            <Link to="/new-request">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Create Your First Request
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RequestStatus;
