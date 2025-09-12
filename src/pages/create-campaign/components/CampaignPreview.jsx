import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CampaignPreview = ({ 
  formData, 
  onPrevious, 
  onPublish, 
  isPublishing 
}) => {
  const currentDate = new Date();
  const endDate = new Date(currentDate.getTime() + (formData.duration * 24 * 60 * 60 * 1000));

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getHighestDiscount = () => {
    if (!formData?.tiers || formData?.tiers?.length === 0) return 0;
    return Math.max(...formData?.tiers?.map(tier => tier?.discount));
  };

  const getLowestPrice = () => {
    if (!formData?.selectedProduct || !formData?.tiers) return formData?.selectedProduct?.price || 0;
    
    const basePrice = formData?.selectedProduct?.price;
    const highestTier = formData?.tiers?.reduce((max, tier) => 
      tier?.supporters > max?.supporters ? tier : max
    );
    
    if (highestTier?.type === 'percentage') {
      return basePrice - (basePrice * highestTier?.discount / 100);
    } else {
      return Math.max(0, basePrice - highestTier?.discount);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
            <Icon name="Eye" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Campaign Preview</h2>
            <p className="text-sm text-muted-foreground">Review your campaign before publishing</p>
          </div>
        </div>
        <Button variant="ghost" onClick={onPrevious} iconName="ArrowLeft" iconPosition="left">
          Back
        </Button>
      </div>
      <div className="space-y-6">
        {/* Preview Card */}
        <div className="bg-background border border-border rounded-lg p-6 shadow-soft">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={20} color="white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-foreground">John Doe</span>
                <span className="text-sm text-muted-foreground">@johndoe</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">now</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Megaphone" size={14} className="text-primary" />
                <span className="text-sm text-primary font-medium">Campaign</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-foreground mb-2">{formData?.title}</h3>
            <p className="text-muted-foreground">{formData?.description}</p>
          </div>

          {/* Product Display */}
          {formData?.selectedProduct && (
            <div className="bg-muted rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-4">
                <Image
                  src={formData?.selectedProduct?.image}
                  alt={formData?.selectedProduct?.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{formData?.selectedProduct?.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{formData?.selectedProduct?.brand}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-success">
                      From ${getLowestPrice()?.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ${formData?.selectedProduct?.price}
                    </span>
                    <span className="text-sm text-success font-medium">
                      Up to {getHighestDiscount()}% off
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Campaign Progress</span>
              <span className="text-sm text-muted-foreground">0 / {formData?.targetCount} supporters</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>

          {/* Tiers Display */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Discount Tiers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {formData?.tiers?.sort((a, b) => a?.supporters - b?.supporters)?.map((tier, index) => (
                <div key={tier?.id} className="bg-background border border-border rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-primary">{tier?.supporters}</div>
                  <div className="text-xs text-muted-foreground mb-1">supporters</div>
                  <div className="text-sm font-medium text-success">
                    {tier?.type === 'percentage' ? `${tier?.discount}%` : `$${tier?.discount}`} off
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>Ends {formatDate(endDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{formData?.duration} days left</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                <Icon name="Heart" size={14} />
                <span>0</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                <Icon name="MessageCircle" size={14} />
                <span>0</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                <Icon name="Share" size={14} />
              </button>
            </div>
          </div>

          {/* Join Button */}
          <div className="mt-4">
            <Button fullWidth size="lg" disabled>
              <Icon name="Users" size={18} className="mr-2" />
              Join Campaign
            </Button>
          </div>
        </div>

        {/* Campaign Summary */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Campaign Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Title:</span>
              <span className="ml-2 text-foreground">{formData?.title}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Target Supporters:</span>
              <span className="ml-2 text-foreground">{formData?.targetCount}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <span className="ml-2 text-foreground">{formData?.duration} days</span>
            </div>
            <div>
              <span className="text-muted-foreground">Discount Tiers:</span>
              <span className="ml-2 text-foreground">{formData?.tiers?.length || 0}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Product:</span>
              <span className="ml-2 text-foreground">{formData?.selectedProduct?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Max Discount:</span>
              <span className="ml-2 text-foreground">{getHighestDiscount()}%</span>
            </div>
          </div>
        </div>

        {/* Publish Button */}
        <div className="flex justify-center">
          <Button
            onClick={onPublish}
            loading={isPublishing}
            size="lg"
            iconName="Send"
            iconPosition="right"
            className="px-8"
          >
            {isPublishing ? 'Publishing Campaign...' : 'Publish Campaign'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignPreview;