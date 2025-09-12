import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationSearch = ({ onSearch, onClear, isSearching }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery?.trim()) {
        onSearch(searchQuery?.trim());
      } else {
        onClear();
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, onSearch, onClear]);

  const handleClear = () => {
    setSearchQuery('');
    setIsExpanded(false);
    onClear();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      onSearch(searchQuery?.trim());
    }
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="p-4">
        {isExpanded ? (
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                autoFocus
              />
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="flex items-center space-x-2"
            >
              <Icon name="X" size={16} />
              <span className="hidden sm:inline">Cancel</span>
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
              <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                Stay updated
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="flex items-center space-x-2"
            >
              <Icon name="Search" size={16} />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>
        )}

        {/* Search suggestions */}
        {isExpanded && !searchQuery && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-2">Try searching for:</p>
            <div className="flex flex-wrap gap-2">
              {['campaign', 'milestone', 'comment', 'like', 'system']?.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded hover:bg-muted/80 transition-smooth"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search results summary */}
        {searchQuery && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Search" size={14} />
            <span>Searching for "{searchQuery}"</span>
            {isSearching && <span>...</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSearch;