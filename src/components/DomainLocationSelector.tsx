import { useState, useEffect, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DomainLocationSelectorProps {
  selectedDomain?: string;
  selectedLocations?: string[];
  onDomainChange: (domain: string) => void;
  onLocationsChange: (locations: string[]) => void;
  disabled?: boolean;
  errors?: {
    domain?: string;
    locations?: string;
  };
}

const DOMAIN_LOCATIONS = {
  'walmart.com': [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA'
  ],
  'target.com': [
    'Minneapolis, MN',
    'Atlanta, GA',
    'Boston, MA',
    'Seattle, WA',
    'Denver, CO',
    'Miami, FL',
    'Las Vegas, NV',
    'Portland, OR',
    'Austin, TX',
    'Nashville, TN'
  ],
  'bestbuy.com': [
    'Richfield, MN',
    'San Francisco, CA',
    'Detroit, MI',
    'Tampa, FL',
    'Orlando, FL',
    'Sacramento, CA',
    'Kansas City, MO',
    'Cleveland, OH',
    'Pittsburgh, PA',
    'Cincinnati, OH'
  ],
  'homedepot.com': [
    'Atlanta, GA',
    'Charlotte, NC',
    'Raleigh, NC',
    'Jacksonville, FL',
    'Memphis, TN',
    'Louisville, KY',
    'Birmingham, AL',
    'Richmond, VA',
    'Norfolk, VA',
    'Greensboro, NC'
  ],
  'amazon.com': [
    'Seattle, WA',
    'New York, NY',
    'San Francisco, CA',
    'Austin, TX',
    'Boston, MA',
    'Washington, DC',
    'Chicago, IL',
    'Los Angeles, CA',
    'Atlanta, GA',
    'Denver, CO'
  ]
};

export const DomainLocationSelector = ({ 
  selectedDomain, 
  selectedLocations = [], 
  onDomainChange, 
  onLocationsChange, 
  disabled,
  errors 
}: DomainLocationSelectorProps) => {
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedDomain && DOMAIN_LOCATIONS[selectedDomain as keyof typeof DOMAIN_LOCATIONS]) {
      setAvailableLocations(DOMAIN_LOCATIONS[selectedDomain as keyof typeof DOMAIN_LOCATIONS]);
    } else {
      setAvailableLocations([]);
      onLocationsChange([]);
    }
    // Reset search when domain changes
    setSearchTerm('');
  }, [selectedDomain, onLocationsChange]);

  const filteredLocations = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableLocations;
    }
    
    return availableLocations.filter(location =>
      location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableLocations, searchTerm]);

  const handleLocationToggle = (location: string, checked: boolean) => {
    if (checked) {
      onLocationsChange([...selectedLocations, location]);
    } else {
      onLocationsChange(selectedLocations.filter(loc => loc !== location));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Add all filtered locations that aren't already selected
      const newSelections = [...selectedLocations];
      filteredLocations.forEach(location => {
        if (!selectedLocations.includes(location)) {
          newSelections.push(location);
        }
      });
      onLocationsChange(newSelections);
    } else {
      // Remove all filtered locations from selection
      onLocationsChange(selectedLocations.filter(loc => !filteredLocations.includes(loc)));
    }
  };

  const selectedFilteredLocations = selectedLocations.filter(loc => filteredLocations.includes(loc));
  const isAllFilteredSelected = filteredLocations.length > 0 && selectedFilteredLocations.length === filteredLocations.length;
  const isPartiallyFilteredSelected = selectedFilteredLocations.length > 0 && selectedFilteredLocations.length < filteredLocations.length;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="domain">Retailer Domain *</Label>
        <Select value={selectedDomain} onValueChange={onDomainChange} disabled={disabled}>
          <SelectTrigger className={`mt-1 ${errors?.domain ? 'border-red-300' : ''}`}>
            <SelectValue placeholder="Select retailer domain..." />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(DOMAIN_LOCATIONS).map((domain) => (
              <SelectItem key={domain} value={domain}>
                {domain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.domain && (
          <p className="text-sm text-red-600 mt-1">{errors.domain}</p>
        )}
      </div>

      {availableLocations.length > 0 && (
        <div>
          <Label>Store Locations</Label>
          <div className={`mt-1 border rounded-md p-3 max-h-60 overflow-y-auto ${errors?.locations ? 'border-red-300' : 'border-gray-300'}`}>
            <div className="space-y-2">
              {/* Search Input */}
              <div className="relative pb-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-sm"
                    disabled={disabled}
                  />
                </div>
              </div>

              {/* Select All Option */}
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                <Checkbox
                  id="select-all"
                  checked={isAllFilteredSelected}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  disabled={disabled}
                  className={isPartiallyFilteredSelected ? 'data-[state=checked]:bg-blue-500' : ''}
                />
                <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                  Select All ({filteredLocations.length} {searchTerm ? 'filtered ' : ''}locations)
                </Label>
              </div>
              
              {/* Individual Location Options */}
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={location}
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={(checked) => handleLocationToggle(location, checked as boolean)}
                      disabled={disabled}
                    />
                    <Label htmlFor={location} className="text-sm font-normal cursor-pointer">
                      {location}
                    </Label>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  No locations found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
          {errors?.locations ? (
            <p className="text-sm text-red-600 mt-1">{errors.locations}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              {selectedLocations.length > 0 
                ? `${selectedLocations.length} location${selectedLocations.length === 1 ? '' : 's'} selected` 
                : 'Select one or more store locations to scrape'
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
};
