import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductSelection = ({ 
  formData, 
  onFormChange, 
  errors, 
  onNext, 
  onPrevious 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      brand: "AudioTech Pro",
      price: 199.99,
      originalPrice: 299.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      verified: true,
      category: "Electronics",
      rating: 4.8,
      reviews: 1250
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      brand: "FitTracker",
      price: 149.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      verified: true,
      category: "Wearables",
      rating: 4.6,
      reviews: 890
    },
    {
      id: 3,
      name: "Organic Skincare Set",
      brand: "NaturalGlow",
      price: 89.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop",
      verified: true,
      category: "Beauty",
      rating: 4.9,
      reviews: 567
    },
    {
      id: 4,
      name: "Professional Coffee Maker",
      brand: "BrewMaster",
      price: 299.99,
      originalPrice: 399.99,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
      verified: false,
      category: "Kitchen",
      rating: 4.7,
      reviews: 432
    }
  ];

  const filteredProducts = mockProducts?.filter(product =>
    product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    product?.brand?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    product?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e?.target?.value);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleProductSelect = (product) => {
    onFormChange('selectedProduct', product);
  };

  const handleNext = () => {
    if (formData?.selectedProduct) {
      onNext();
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name="Package" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Product Selection</h2>
            <p className="text-sm text-muted-foreground">Choose the product for your campaign</p>
          </div>
        </div>
        <Button variant="ghost" onClick={onPrevious} iconName="ArrowLeft" iconPosition="left">
          Back
        </Button>
      </div>
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Search products by name, brand, or category..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
          <Icon 
            name={isSearching ? "Loader2" : "Search"} 
            size={16} 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ${isSearching ? 'animate-spin' : ''}`}
          />
        </div>

        {/* Selected Product */}
        {formData?.selectedProduct && (
          <div className="bg-muted rounded-lg p-4 border-2 border-primary">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Selected Product</span>
            </div>
            <div className="flex items-center space-x-4">
              <Image
                src={formData?.selectedProduct?.image}
                alt={formData?.selectedProduct?.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{formData?.selectedProduct?.name}</h4>
                <p className="text-sm text-muted-foreground">{formData?.selectedProduct?.brand}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-lg font-semibold text-primary">${formData?.selectedProduct?.price}</span>
                  <span className="text-sm text-muted-foreground line-through">${formData?.selectedProduct?.originalPrice}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFormChange('selectedProduct', null)}
                iconName="X"
              >
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts?.map((product) => (
            <div
              key={product?.id}
              className={`bg-background border rounded-lg p-4 cursor-pointer transition-all hover:shadow-medium ${
                formData?.selectedProduct?.id === product?.id 
                  ? 'border-primary ring-2 ring-primary/20' :'border-border hover:border-primary/50'
              }`}
              onClick={() => handleProductSelect(product)}
            >
              <div className="relative mb-3">
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-32 rounded-lg object-cover"
                />
                {product?.verified && (
                  <div className="absolute top-2 right-2 bg-success text-success-foreground rounded-full p-1">
                    <Icon name="BadgeCheck" size={12} />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground line-clamp-2">{product?.name}</h4>
                <p className="text-sm text-muted-foreground">{product?.brand}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-primary">${product?.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${product?.originalPrice}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} className="text-warning fill-current" />
                    <span className="text-xs text-muted-foreground">{product?.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{product?.category}</span>
                  <span>{product?.reviews} reviews</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}

        {errors?.selectedProduct && (
          <div className="text-error text-sm">{errors?.selectedProduct}</div>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={handleNext}
            disabled={!formData?.selectedProduct}
            iconName="ArrowRight" 
            iconPosition="right"
          >
            Continue to Tier Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;