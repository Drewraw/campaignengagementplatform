import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TierConfiguration = ({ 
  formData, 
  onFormChange, 
  errors, 
  onNext, 
  onPrevious 
}) => {
  const [tiers, setTiers] = useState(formData?.tiers || [
    { id: 1, supporters: 50, discount: 10, type: 'percentage' },
    { id: 2, supporters: 100, discount: 20, type: 'percentage' },
    { id: 3, supporters: 200, discount: 30, type: 'percentage' }
  ]);

  const handleTierChange = (tierId, field, value) => {
    const updatedTiers = tiers?.map(tier => 
      tier?.id === tierId ? { ...tier, [field]: value } : tier
    );
    setTiers(updatedTiers);
    onFormChange('tiers', updatedTiers);
  };

  const addTier = () => {
    const newTier = {
      id: Date.now(),
      supporters: Math.max(...tiers?.map(t => t?.supporters)) + 50,
      discount: 5,
      type: 'percentage'
    };
    const updatedTiers = [...tiers, newTier];
    setTiers(updatedTiers);
    onFormChange('tiers', updatedTiers);
  };

  const removeTier = (tierId) => {
    if (tiers?.length > 1) {
      const updatedTiers = tiers?.filter(tier => tier?.id !== tierId);
      setTiers(updatedTiers);
      onFormChange('tiers', updatedTiers);
    }
  };

  const handleNext = () => {
    onNext();
  };

  const getDiscountPreview = (tier) => {
    if (!formData?.selectedProduct) return '$0.00';
    
    const basePrice = formData?.selectedProduct?.price;
    if (tier?.type === 'percentage') {
      const discountAmount = (basePrice * tier?.discount) / 100;
      return `$${(basePrice - discountAmount)?.toFixed(2)}`;
    } else {
      return `$${Math.max(0, basePrice - tier?.discount)?.toFixed(2)}`;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Target" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Tier Configuration</h2>
            <p className="text-sm text-muted-foreground">Set discount tiers based on supporter milestones</p>
          </div>
        </div>
        <Button variant="ghost" onClick={onPrevious} iconName="ArrowLeft" iconPosition="left">
          Back
        </Button>
      </div>
      <div className="space-y-6">
        {/* Product Preview */}
        {formData?.selectedProduct && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img
                src={formData?.selectedProduct?.image}
                alt={formData?.selectedProduct?.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-medium text-foreground">{formData?.selectedProduct?.name}</h4>
                <p className="text-sm text-muted-foreground">{formData?.selectedProduct?.brand}</p>
                <p className="text-lg font-semibold text-primary">Base Price: ${formData?.selectedProduct?.price}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tiers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Discount Tiers</h3>
            <Button variant="outline" onClick={addTier} iconName="Plus" iconPosition="left">
              Add Tier
            </Button>
          </div>

          {tiers?.sort((a, b) => a?.supporters - b?.supporters)?.map((tier, index) => (
            <div key={tier?.id} className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="font-medium text-foreground">Tier {index + 1}</span>
                </div>
                {tiers?.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTier(tier?.id)}
                    iconName="Trash2"
                    className="text-error hover:text-error"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Supporters Required"
                  type="number"
                  value={tier?.supporters}
                  onChange={(e) => handleTierChange(tier?.id, 'supporters', parseInt(e?.target?.value) || 0)}
                  min="1"
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Discount Type</label>
                  <select
                    value={tier?.type}
                    onChange={(e) => handleTierChange(tier?.id, 'type', e?.target?.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <Input
                  label={`Discount ${tier?.type === 'percentage' ? '(%)' : '($)'}`}
                  type="number"
                  value={tier?.discount}
                  onChange={(e) => handleTierChange(tier?.id, 'discount', parseFloat(e?.target?.value) || 0)}
                  min="0"
                  max={tier?.type === 'percentage' ? "100" : undefined}
                  step={tier?.type === 'percentage' ? "1" : "0.01"}
                  required
                />
              </div>

              {/* Preview */}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    When {tier?.supporters} supporters join:
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground line-through">
                      ${formData?.selectedProduct?.price || '0.00'}
                    </span>
                    <span className="font-semibold text-success">
                      {getDiscountPreview(tier)}
                    </span>
                    <span className="text-xs text-success">
                      ({tier?.type === 'percentage' ? `${tier?.discount}%` : `$${tier?.discount}`} off)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {errors?.tiers && (
          <div className="text-error text-sm">{errors?.tiers}</div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleNext} iconName="ArrowRight" iconPosition="right">
            Continue to Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TierConfiguration;