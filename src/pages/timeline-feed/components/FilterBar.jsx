import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterBar = ({ onFilterChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = [
    { id: 'all', label: 'All Campaigns', icon: 'Grid3X3' },
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'new', label: 'New', icon: 'Sparkles' },
    { id: 'ending-soon', label: 'Ending Soon', icon: 'Clock' },
    { id: 'joined', label: 'Joined', icon: 'Check' },
    { id: 'electronics', label: 'Electronics', icon: 'Smartphone' },
    { id: 'fashion', label: 'Fashion', icon: 'Shirt' },
    { id: 'home', label: 'Home & Garden', icon: 'Home' },
    { id: 'sports', label: 'Sports', icon: 'Dumbbell' },
    { id: 'books', label: 'Books', icon: 'Book' }
  ];

  const primaryFilters = filterOptions?.slice(0, 5);
  const categoryFilters = filterOptions?.slice(5);

  const handleFilterClick = (filterId) => {
    onFilterChange(filterId);
  };

  const getActiveFilterCount = () => {
    return activeFilters?.filter(f => f !== 'all')?.length;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft mb-6">
      <div className="p-4">
        {/* Primary Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {primaryFilters?.map((filter) => (
            <Button
              key={filter?.id}
              variant={activeFilters?.includes(filter?.id) ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick(filter?.id)}
              iconName={filter?.icon}
              iconPosition="left"
              className="flex-shrink-0"
            >
              {filter?.label}
            </Button>
          ))}
          
          <Button
            variant={isExpanded ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Categories {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </Button>
        </div>

        {/* Category Filters */}
        {isExpanded && (
          <div className="border-t border-border pt-3 animate-slide-in-from-top">
            <div className="flex flex-wrap gap-2">
              {categoryFilters?.map((filter) => (
                <Button
                  key={filter?.id}
                  variant={activeFilters?.includes(filter?.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterClick(filter?.id)}
                  iconName={filter?.icon}
                  iconPosition="left"
                  className="flex-shrink-0"
                >
                  {filter?.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {activeFilters?.length > 1 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {activeFilters?.length - 1} filter{activeFilters?.length > 2 ? 's' : ''} active
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange('all')}
              iconName="X"
              iconPosition="left"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;