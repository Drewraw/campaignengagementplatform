import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CampaignBasicInfo = ({ 
  formData, 
  onFormChange, 
  errors, 
  onNext 
}) => {
  const handleInputChange = (field) => (e) => {
    onFormChange(field, e?.target?.value);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onNext();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="Info" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Campaign Basics</h2>
          <p className="text-sm text-muted-foreground">Set up your campaign's core information</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Campaign Title"
          type="text"
          placeholder="Enter a compelling campaign title"
          value={formData?.title}
          onChange={handleInputChange('title')}
          error={errors?.title}
          required
          description="Make it catchy and descriptive to attract supporters"
        />

        <Input
          label="Campaign Description"
          type="text"
          placeholder="Describe your campaign goals and benefits"
          value={formData?.description}
          onChange={handleInputChange('description')}
          error={errors?.description}
          required
          description="Explain what makes this campaign special and why people should join"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Target Supporters"
            type="number"
            placeholder="100"
            value={formData?.targetCount}
            onChange={handleInputChange('targetCount')}
            error={errors?.targetCount}
            required
            min="10"
            max="10000"
            description="Minimum supporters needed to unlock deals"
          />

          <Input
            label="Campaign Duration (Days)"
            type="number"
            placeholder="30"
            value={formData?.duration}
            onChange={handleInputChange('duration')}
            error={errors?.duration}
            required
            min="1"
            max="90"
            description="How long the campaign will run"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" iconName="ArrowRight" iconPosition="right">
            Continue to Product Selection
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CampaignBasicInfo;