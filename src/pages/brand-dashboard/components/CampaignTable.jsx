import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CampaignTable = ({ campaigns, onApprove, onReject, onMessage }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCampaigns = [...campaigns]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'progress') {
      aValue = (a?.currentSupporters / a?.targetSupporters) * 100;
      bValue = (b?.currentSupporters / b?.targetSupporters) * 100;
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'completed': return 'text-primary bg-primary/10';
      case 'expired': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    return (
      <Icon 
        name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
        size={14} 
        className="text-primary" 
      />
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Campaign Management</h2>
        <p className="text-sm text-muted-foreground mt-1">Monitor and manage brand-related campaigns</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('productName')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Product</span>
                  <SortIcon field="productName" />
                </button>
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('creator')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Creator</span>
                  <SortIcon field="creator" />
                </button>
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('currentSupporters')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Supporters</span>
                  <SortIcon field="currentSupporters" />
                </button>
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('progress')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Progress</span>
                  <SortIcon field="progress" />
                </button>
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Status</span>
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedCampaigns?.map((campaign) => {
              const progress = (campaign?.currentSupporters / campaign?.targetSupporters) * 100;
              
              return (
                <tr key={campaign?.id} className="hover:bg-muted/20 transition-smooth">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={campaign?.productImage} 
                        alt={campaign?.productName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{campaign?.productName}</p>
                        <p className="text-xs text-muted-foreground">${campaign?.price}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={campaign?.creatorAvatar} 
                        alt={campaign?.creator}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-foreground">{campaign?.creator}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">
                      {campaign?.currentSupporters}/{campaign?.targetSupporters}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign?.status)}`}>
                      {campaign?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      {campaign?.status === 'pending' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => onApprove(campaign?.id)}
                            iconName="Check"
                            iconSize={14}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onReject(campaign?.id)}
                            iconName="X"
                            iconSize={14}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMessage(campaign?.id)}
                        iconName="MessageCircle"
                        iconSize={14}
                      >
                        Message
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignTable;