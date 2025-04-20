import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFilteredBugs, getFilterOptions } from '@/data/mockData';
import { Bug, BugStatus, BugSeverity } from '@/types/bug';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, FilterIcon, Search, PlusSquare } from 'lucide-react';
import StatusBadge from '@/components/ui/status-badge';
import SeverityBadge from '@/components/ui/severity-badge';

const BugsList = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Bug>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<BugStatus[]>([]);
  const [severityFilter, setSeverityFilter] = useState<BugSeverity[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [gameAreaFilter, setGameAreaFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const { platforms, gameAreas } = getFilterOptions();
  
  useEffect(() => {
    const filtered = getFilteredBugs(
      {
        search: search,
        status: statusFilter.length > 0 ? statusFilter : undefined,
        severity: severityFilter.length > 0 ? severityFilter : undefined,
        platform: platformFilter !== 'all' ? platformFilter : undefined,
        gameArea: gameAreaFilter !== 'all' ? gameAreaFilter : undefined,
      },
      { field: sortField, direction: sortDirection }
    );
    setBugs(filtered);
  }, [search, statusFilter, severityFilter, platformFilter, gameAreaFilter, sortField, sortDirection]);
  
  const handleSort = (field: keyof Bug) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const toggleStatusFilter = (status: BugStatus) => {
    setStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };
  
  const toggleSeverityFilter = (severity: BugSeverity) => {
    setSeverityFilter(prev =>
      prev.includes(severity) ? prev.filter(s => s !== severity) : [...prev, severity]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter([]);
    setSeverityFilter([]);
    setPlatformFilter('all');
    setGameAreaFilter('all');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bugs</h1>
          <p className="text-gray-500">Manage and track all reported bugs</p>
        </div>
        <Button asChild>
          <Link to="/new-bug">
            <PlusSquare className="w-4 h-4 mr-2" />
            Report New Bug
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search bugs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon className="mr-2 h-4 w-4" />
          Filters
          <span className="ml-2 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-white text-xs">
            {statusFilter.length + severityFilter.length + (platformFilter !== 'all' ? 1 : 0) + (gameAreaFilter !== 'all' ? 1 : 0)}
          </span>
        </Button>
      </div>
      
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(BugStatus).map(status => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      className={`${statusFilter.includes(status) ? 'bg-primary text-white' : ''}`}
                      onClick={() => toggleStatusFilter(status)}
                    >
                      {statusFilter.includes(status) && <CheckIcon className="mr-1 h-3 w-3" />}
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Severity</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(BugSeverity).map(severity => (
                    <Button
                      key={severity}
                      variant="outline"
                      size="sm"
                      className={`${severityFilter.includes(severity) ? 'bg-primary text-white' : ''}`}
                      onClick={() => toggleSeverityFilter(severity)}
                    >
                      {severityFilter.includes(severity) && <CheckIcon className="mr-1 h-3 w-3" />}
                      {severity}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Platform</h3>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    {platforms.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Game Area</h3>
                <Select value={gameAreaFilter} onValueChange={setGameAreaFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {gameAreas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={clearFilters} className="mr-2">Clear Filters</Button>
              <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Title
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game Area</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Created
                    {sortField === 'createdAt' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bugs.map((bug) => (
                <tr key={bug.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link to={`/bug/${bug.id}`} className="text-primary hover:underline">
                      {bug.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={bug.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SeverityBadge severity={bug.severity} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bug.gameArea}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bug.platform}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {bugs.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No bugs found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugsList;
