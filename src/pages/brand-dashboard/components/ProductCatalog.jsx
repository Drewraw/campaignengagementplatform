import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductCatalog = ({ products, onUpdateProduct, onToggleEligibility }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'sports', name: 'Sports & Outdoors' }
  ];

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         product?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product?.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEditStart = (product) => {
    setEditingProduct(product?.id);
    setEditForm({
      name: product?.name,
      price: product?.price,
      description: product?.description,
      minSupporters: product?.minSupporters
    });
  };

  const handleEditSubmit = (e) => {
    e?.preventDefault();
    onUpdateProduct(editingProduct, editForm);
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'inactive': return 'text-error bg-error/10';
      case 'pending': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Product Catalog</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your product listings and campaign eligibility</p>
          </div>
          <Button variant="primary" iconName="Plus" iconPosition="left">
            Add Product
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e?.target?.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {categories?.map((category) => (
              <option key={category?.id} value={category?.id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts?.map((product) => (
            <div key={product?.id} className="border border-border rounded-lg overflow-hidden hover:shadow-medium transition-smooth">
              <div className="aspect-w-16 aspect-h-9 bg-muted">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-4">
                {editingProduct === product?.id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-3">
                    <Input
                      type="text"
                      value={editForm?.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e?.target?.value }))}
                      placeholder="Product name"
                      required
                    />
                    <Input
                      type="number"
                      value={editForm?.price}
                      onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e?.target?.value) }))}
                      placeholder="Price"
                      step="0.01"
                      required
                    />
                    <textarea
                      value={editForm?.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e?.target?.value }))}
                      placeholder="Description"
                      rows={2}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      required
                    />
                    <Input
                      type="number"
                      value={editForm?.minSupporters}
                      onChange={(e) => setEditForm(prev => ({ ...prev, minSupporters: parseInt(e?.target?.value) }))}
                      placeholder="Min supporters"
                      min="1"
                      required
                    />
                    <div className="flex space-x-2">
                      <Button type="submit" variant="primary" size="sm">
                        Save
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={handleEditCancel}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-foreground">{product?.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product?.status)}`}>
                        {product?.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product?.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-foreground">${product?.price}</span>
                      <span className="text-sm text-muted-foreground">
                        Min: {product?.minSupporters} supporters
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>{product?.activeCampaigns} active campaigns</span>
                      <span>{product?.totalSales} total sales</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStart(product)}
                        iconName="Edit"
                        iconSize={14}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={product?.campaignEligible ? "destructive" : "success"}
                        size="sm"
                        onClick={() => onToggleEligibility(product?.id)}
                        iconName={product?.campaignEligible ? "EyeOff" : "Eye"}
                        iconSize={14}
                      >
                        {product?.campaignEligible ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || categoryFilter !== 'all' ?'Try adjusting your search or filter criteria' :'Start by adding your first product to the catalog'
              }
            </p>
            <Button variant="primary" iconName="Plus" iconPosition="left">
              Add Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;