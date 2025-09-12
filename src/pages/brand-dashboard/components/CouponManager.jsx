import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CouponManager = ({ coupons, onGenerateCoupons, onToggleStatus }) => {
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    count: 10,
    discount: 20,
    expirationDays: 30,
    prefix: 'BRAND'
  });

  const handleGenerateSubmit = (e) => {
    e?.preventDefault();
    onGenerateCoupons(generateForm);
    setShowGenerateForm(false);
    setGenerateForm({
      count: 10,
      discount: 20,
      expirationDays: 30,
      prefix: 'BRAND'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'expired': return 'text-error bg-error/10';
      case 'used': return 'text-muted-foreground bg-muted/10';
      default: return 'text-warning bg-warning/10';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Coupon Management</h2>
            <p className="text-sm text-muted-foreground mt-1">Generate and track coupon codes</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowGenerateForm(!showGenerateForm)}
            iconName="Plus"
            iconPosition="left"
          >
            Generate Coupons
          </Button>
        </div>
      </div>
      {showGenerateForm && (
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <form onSubmit={handleGenerateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Number of Coupons"
                type="number"
                value={generateForm?.count}
                onChange={(e) => setGenerateForm(prev => ({ ...prev, count: parseInt(e?.target?.value) }))}
                min="1"
                max="1000"
                required
              />
              <Input
                label="Discount (%)"
                type="number"
                value={generateForm?.discount}
                onChange={(e) => setGenerateForm(prev => ({ ...prev, discount: parseInt(e?.target?.value) }))}
                min="1"
                max="100"
                required
              />
              <Input
                label="Expiration (Days)"
                type="number"
                value={generateForm?.expirationDays}
                onChange={(e) => setGenerateForm(prev => ({ ...prev, expirationDays: parseInt(e?.target?.value) }))}
                min="1"
                max="365"
                required
              />
              <Input
                label="Code Prefix"
                type="text"
                value={generateForm?.prefix}
                onChange={(e) => setGenerateForm(prev => ({ ...prev, prefix: e?.target?.value?.toUpperCase() }))}
                maxLength="10"
                required
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button type="submit" variant="primary">
                Generate Coupons
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setShowGenerateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Ticket" size={16} className="text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Coupons</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{coupons?.length}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-muted-foreground">Active</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {coupons?.filter(c => c?.status === 'active')?.length}
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={16} className="text-warning" />
              <span className="text-sm font-medium text-muted-foreground">Used</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {coupons?.filter(c => c?.status === 'used')?.length}
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-error" />
              <span className="text-sm font-medium text-muted-foreground">Expired</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {coupons?.filter(c => c?.status === 'expired')?.length}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {coupons?.slice(0, 10)?.map((coupon) => (
            <div key={coupon?.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-smooth">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Icon name="Ticket" size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-mono text-sm font-medium text-foreground">{coupon?.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {coupon?.discount}% off • Expires {formatDate(coupon?.expirationDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(coupon?.status)}`}>
                  {coupon?.status}
                </span>
                {coupon?.usedBy && (
                  <div className="flex items-center space-x-1">
                    <Icon name="User" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{coupon?.usedBy}</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStatus(coupon?.id)}
                  disabled={coupon?.status === 'used'}
                >
                  <Icon name="MoreVertical" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {coupons?.length > 10 && (
          <div className="mt-4 text-center">
            <Button variant="outline">
              View All Coupons ({coupons?.length})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManager;