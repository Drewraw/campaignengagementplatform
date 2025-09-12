import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CampaignBasicInfo from './components/CampaignBasicInfo';
import ProductSelection from './components/ProductSelection';
import TierConfiguration from './components/TierConfiguration';
import CampaignPreview from './components/CampaignPreview';
import StepIndicator from './components/StepIndicator';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetCount: '',
    duration: '',
    selectedProduct: null,
    tiers: []
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 4;

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData?.title?.trim()) {
          newErrors.title = 'Campaign title is required';
        } else if (formData?.title?.length < 10) {
          newErrors.title = 'Title must be at least 10 characters long';
        }
        
        if (!formData?.description?.trim()) {
          newErrors.description = 'Campaign description is required';
        } else if (formData?.description?.length < 20) {
          newErrors.description = 'Description must be at least 20 characters long';
        }
        
        if (!formData?.targetCount || formData?.targetCount < 10) {
          newErrors.targetCount = 'Target count must be at least 10 supporters';
        } else if (formData?.targetCount > 10000) {
          newErrors.targetCount = 'Target count cannot exceed 10,000 supporters';
        }
        
        if (!formData?.duration || formData?.duration < 1) {
          newErrors.duration = 'Duration must be at least 1 day';
        } else if (formData?.duration > 90) {
          newErrors.duration = 'Duration cannot exceed 90 days';
        }
        break;

      case 2:
        if (!formData?.selectedProduct) {
          newErrors.selectedProduct = 'Please select a product for your campaign';
        }
        break;

      case 3:
        if (!formData?.tiers || formData?.tiers?.length === 0) {
          newErrors.tiers = 'At least one discount tier is required';
        } else {
          // Validate tier logic
          const sortedTiers = formData?.tiers?.sort((a, b) => a?.supporters - b?.supporters);
          for (let i = 0; i < sortedTiers?.length; i++) {
            if (sortedTiers?.[i]?.supporters <= 0) {
              newErrors.tiers = 'All tiers must have positive supporter counts';
              break;
            }
            if (sortedTiers?.[i]?.discount <= 0) {
              newErrors.tiers = 'All tiers must have positive discount values';
              break;
            }
            if (i > 0 && sortedTiers?.[i]?.supporters <= sortedTiers?.[i-1]?.supporters) {
              newErrors.tiers = 'Each tier must require more supporters than the previous tier';
              break;
            }
          }
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePublish = async () => {
    if (!validateStep(currentStep)) return;

    setIsPublishing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful campaign creation
      const campaignId = Math.random()?.toString(36)?.substr(2, 9);
      
      // Navigate to campaign details or timeline
      navigate('/timeline-feed', { 
        state: { 
          message: 'Campaign published successfully!',
          campaignId 
        }
      });
    } catch (error) {
      console.error('Error publishing campaign:', error);
      setErrors({ publish: 'Failed to publish campaign. Please try again.' });
    } finally {
      setIsPublishing(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CampaignBasicInfo
            formData={formData}
            onFormChange={handleFormChange}
            errors={errors}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <ProductSelection
            formData={formData}
            onFormChange={handleFormChange}
            errors={errors}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <TierConfiguration
            formData={formData}
            onFormChange={handleFormChange}
            errors={errors}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <CampaignPreview
            formData={formData}
            onPrevious={handlePrevious}
            onPublish={handlePublish}
            isPublishing={isPublishing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Campaign</h1>
            <p className="text-muted-foreground">
              Launch a group buying campaign to unlock exclusive deals for your community
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

          {/* Current Step Content */}
          {renderCurrentStep()}

          {/* Global Error */}
          {errors?.publish && (
            <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="text-error text-sm">{errors?.publish}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateCampaign;