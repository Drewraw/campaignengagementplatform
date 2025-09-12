import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ComposeArea = ({ user, onCreateCampaign }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const navigate = useNavigate();

  const quickProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 999,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
      category: "Electronics"
    },
    {
      id: 2,
      name: "Nike Air Max",
      price: 150,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      category: "Fashion"
    },
    {
      id: 3,
      name: "MacBook Pro",
      price: 1999,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      category: "Electronics"
    },
    {
      id: 4,
      name: "AirPods Pro",
      price: 249,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop",
      category: "Electronics"
    }
  ];

  const handleCreateCampaign = () => {
    if (campaignTitle?.trim() && selectedProduct) {
      const newCampaign = {
        title: campaignTitle,
        product: selectedProduct,
        creator: user
      };
      onCreateCampaign(newCampaign);
      setCampaignTitle('');
      setSelectedProduct(null);
      setIsExpanded(false);
      setShowProductSelector(false);
    }
  };

  const handleFullCreate = () => {
    navigate('/create-campaign');
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowProductSelector(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft mb-6">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full overflow-hidden flex-shrink-0">
            <Image 
              src={user?.avatar} 
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div 
              className={`transition-all duration-200 ${
                isExpanded ? 'min-h-[120px]' : 'min-h-[44px]'
              }`}
            >
              <textarea
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e?.target?.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="What product would you like to campaign for?"
                className="w-full resize-none bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-lg"
                rows={isExpanded ? 3 : 1}
              />
            </div>

            {/* Selected Product Display */}
            {selectedProduct && (
              <div className="mt-3 p-3 bg-muted rounded-lg flex items-center space-x-3">
                <div className="w-12 h-12 bg-background rounded overflow-hidden">
                  <Image 
                    src={selectedProduct?.image} 
                    alt={selectedProduct?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{selectedProduct?.name}</h4>
                  <p className="text-sm text-muted-foreground">${selectedProduct?.price}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProduct(null)}
                  iconName="X"
                />
              </div>
            )}

            {/* Product Selector */}
            {showProductSelector && (
              <div className="mt-3 border border-border rounded-lg bg-background shadow-medium">
                <div className="p-3 border-b border-border">
                  <h4 className="font-medium text-foreground">Quick Product Selection</h4>
                  <p className="text-sm text-muted-foreground">Choose a popular product or create custom</p>
                </div>
                <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                  {quickProducts?.map((product) => (
                    <button
                      key={product?.id}
                      onClick={() => handleProductSelect(product)}
                      className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-smooth text-left"
                    >
                      <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                        <Image 
                          src={product?.image} 
                          alt={product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground">{product?.name}</h5>
                        <p className="text-sm text-muted-foreground">${product?.price} • {product?.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFullCreate}
                    iconName="Plus"
                    iconPosition="left"
                    fullWidth
                  >
                    Create Custom Product Campaign
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            {isExpanded && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProductSelector(!showProductSelector)}
                    iconName="Package"
                    iconPosition="left"
                  >
                    {selectedProduct ? 'Change Product' : 'Select Product'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFullCreate}
                    iconName="Settings"
                    iconPosition="left"
                  >
                    Advanced
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false);
                      setCampaignTitle('');
                      setSelectedProduct(null);
                      setShowProductSelector(false);
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleCreateCampaign}
                    disabled={!campaignTitle?.trim() || !selectedProduct}
                    iconName="Send"
                    iconPosition="left"
                  >
                    Create Campaign
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeArea;