
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle, XCircle, Upload } from 'lucide-react';

const Dashboard = () => {
  // Mock data - in real app this would come from API
  const recentRequests = [
    { id: 1, name: 'Product Pricing Analysis', status: 'completed', date: '2024-01-15', results: 150 },
    { id: 2, name: 'Competitor Research', status: 'in-progress', date: '2024-01-15', results: null },
    { id: 3, name: 'Market Data Collection', status: 'pending', date: '2024-01-14', results: null },
    { id: 4, name: 'Customer Reviews Batch', status: 'failed', date: '2024-01-14', results: null },
  ];

  const stats = {
    totalRequests: 47,
    completedToday: 8,
    pendingRequests: 3,
    successRate: 94
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
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
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to DataScraper Pro</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Extract data from websites with ease. Simply provide URLs, upload CSV files, or describe what you need - we'll handle the technical complexity.
        </p>
        <Link to="/new-request">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
            Start Scraping <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-orange-600">{stats.totalRequests}</CardTitle>
            <CardDescription>Total Requests</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-green-600">{stats.completedToday}</CardTitle>
            <CardDescription>Completed Today</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-blue-600">{stats.pendingRequests}</CardTitle>
            <CardDescription>Pending Requests</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-purple-600">{stats.successRate}%</CardTitle>
            <CardDescription>Success Rate</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common scraping tasks to get you started quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/new-request">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <Upload className="w-6 h-6" />
                <span>Single URL</span>
              </Button>
            </Link>
            <Link to="/new-request">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <Upload className="w-6 h-6" />
                <span>Batch Upload</span>
              </Button>
            </Link>
            <Link to="/new-request">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <Upload className="w-6 h-6" />
                <span>Custom Query</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Your latest scraping activities</CardDescription>
          </div>
          <Link to="/status">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(request.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{request.name}</h4>
                    <p className="text-sm text-gray-500">Submitted on {request.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {request.results && (
                    <span className="text-sm text-gray-600">{request.results} results</span>
                  )}
                  {getStatusBadge(request.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
