import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalyticsChart = ({ data }) => {
  const [activeChart, setActiveChart] = useState('campaigns');
  const [timeRange, setTimeRange] = useState('7d');

  const chartTypes = [
    { id: 'campaigns', label: 'Campaign Performance', icon: 'BarChart3' },
    { id: 'engagement', label: 'User Engagement', icon: 'TrendingUp' },
    { id: 'conversion', label: 'Conversion Rates', icon: 'Target' }
  ];

  const timeRanges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' }
  ];

  const campaignData = [
    { name: 'Mon', campaigns: 12, supporters: 145, conversions: 23 },
    { name: 'Tue', campaigns: 19, supporters: 189, conversions: 31 },
    { name: 'Wed', campaigns: 15, supporters: 167, conversions: 28 },
    { name: 'Thu', campaigns: 22, supporters: 203, conversions: 35 },
    { name: 'Fri', campaigns: 18, supporters: 178, conversions: 29 },
    { name: 'Sat', campaigns: 25, supporters: 234, conversions: 42 },
    { name: 'Sun', campaigns: 21, supporters: 198, conversions: 38 }
  ];

  const engagementData = [
    { name: 'Week 1', likes: 1240, comments: 340, shares: 120 },
    { name: 'Week 2', likes: 1580, comments: 420, shares: 180 },
    { name: 'Week 3', likes: 1320, comments: 380, shares: 140 },
    { name: 'Week 4', likes: 1890, comments: 520, shares: 220 }
  ];

  const conversionData = [
    { name: 'Electronics', value: 35, color: '#1E40AF' },
    { name: 'Fashion', value: 28, color: '#6366F1' },
    { name: 'Home & Garden', value: 22, color: '#F59E0B' },
    { name: 'Sports', value: 15, color: '#10B981' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-large p-3">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'campaigns':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="campaigns" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="supporters" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'engagement':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="likes" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="comments" 
                stroke="var(--color-secondary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="shares" 
                stroke="var(--color-accent)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'conversion':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={conversionData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
              >
                {conversionData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Analytics Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">Track performance metrics and trends</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              {timeRanges?.map((range) => (
                <button
                  key={range?.id}
                  onClick={() => setTimeRange(range?.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-smooth ${
                    timeRange === range?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {range?.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 mt-4 overflow-x-auto">
          {chartTypes?.map((chart) => (
            <button
              key={chart?.id}
              onClick={() => setActiveChart(chart?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap ${
                activeChart === chart?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={chart?.icon} size={16} />
              <span>{chart?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {renderChart()}
      </div>
      <div className="px-6 py-4 border-t border-border bg-muted/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">1,247</p>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">89</p>
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">23.4%</p>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">$12,450</p>
            <p className="text-sm text-muted-foreground">Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;