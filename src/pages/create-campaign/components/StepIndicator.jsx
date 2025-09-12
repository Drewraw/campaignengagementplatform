import React from 'react';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { id: 1, title: 'Basic Info', icon: 'Info' },
    { id: 2, title: 'Product', icon: 'Package' },
    { id: 3, title: 'Tiers', icon: 'Target' },
    { id: 4, title: 'Preview', icon: 'Eye' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.id}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                step?.id === currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : step?.id < currentStep 
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}>
                {step?.id < currentStep ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <Icon name={step?.icon} size={20} />
                )}
              </div>
              <div className="hidden sm:block">
                <div className={`text-sm font-medium ${
                  step?.id === currentStep 
                    ? 'text-primary' 
                    : step?.id < currentStep 
                      ? 'text-success' :'text-muted-foreground'
                }`}>
                  {step?.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  Step {step?.id} of {totalSteps}
                </div>
              </div>
            </div>
            
            {index < steps?.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                step?.id < currentStep ? 'bg-success' : 'bg-muted'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Mobile step info */}
      <div className="sm:hidden mt-4 text-center">
        <div className="text-sm font-medium text-foreground">
          {steps?.[currentStep - 1]?.title}
        </div>
        <div className="text-xs text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;