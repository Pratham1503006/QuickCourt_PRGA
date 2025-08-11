import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';

const CourtForm = ({ 
  court, 
  onSubmit, 
  sportsOptions, 
  surfaceOptions, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sportType: '',
    surface: '',
    dimensions: { length: '', width: '', unit: 'meters' },
    capacity: '',
    pricePerHour: '',
    features: [],
    operatingHours: {
      monday: { isOpen: true, open: '08:00', close: '22:00' },
      tuesday: { isOpen: true, open: '08:00', close: '22:00' },
      wednesday: { isOpen: true, open: '08:00', close: '22:00' },
      thursday: { isOpen: true, open: '08:00', close: '22:00' },
      friday: { isOpen: true, open: '08:00', close: '22:00' },
      saturday: { isOpen: true, open: '09:00', close: '21:00' },
      sunday: { isOpen: true, open: '09:00', close: '21:00' }
    },
    maintenanceSchedule: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const featureOptions = [
    'Professional lighting',
    'Sound system',
    'Scoreboard',
    'Air conditioning',
    'Net included',
    'Line marking',
    'Flood lights',
    'Weather protection',
    'Equipment rental',
    'Non-slip surface',
    'Spectator seating',
    'Water station',
    'First aid kit',
    'Storage area'
  ];

  const unitOptions = [
    { value: 'meters', label: 'Meters' },
    { value: 'feet', label: 'Feet' }
  ];

  useEffect(() => {
    if (court && isEdit) {
      setFormData({
        name: court.name || '',
        sportType: court.sportType || '',
        surface: court.surface || '',
        dimensions: court.dimensions || { length: '', width: '', unit: 'meters' },
        capacity: court.capacity || '',
        pricePerHour: court.pricePerHour || '',
        features: court.features || [],
        operatingHours: court.operatingHours || {
          monday: { isOpen: true, open: '08:00', close: '22:00' },
          tuesday: { isOpen: true, open: '08:00', close: '22:00' },
          wednesday: { isOpen: true, open: '08:00', close: '22:00' },
          thursday: { isOpen: true, open: '08:00', close: '22:00' },
          friday: { isOpen: true, open: '08:00', close: '22:00' },
          saturday: { isOpen: true, open: '09:00', close: '21:00' },
          sunday: { isOpen: true, open: '09:00', close: '21:00' }
        },
        maintenanceSchedule: court.maintenanceSchedule || []
      });
    }
  }, [court, isEdit]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Court name is required';
    }

    if (!formData.sportType) {
      newErrors.sportType = 'Sport type is required';
    }

    if (!formData.surface) {
      newErrors.surface = 'Surface type is required';
    }

    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (!formData.pricePerHour || formData.pricePerHour < 0) {
      newErrors.pricePerHour = 'Price per hour must be a positive number';
    }

    if (formData.dimensions.length && formData.dimensions.length <= 0) {
      newErrors['dimensions.length'] = 'Length must be positive';
    }

    if (formData.dimensions.width && formData.dimensions.width <= 0) {
      newErrors['dimensions.width'] = 'Width must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        capacity: parseInt(formData.capacity),
        pricePerHour: parseFloat(formData.pricePerHour),
        dimensions: {
          ...formData.dimensions,
          length: parseFloat(formData.dimensions.length) || 0,
          width: parseFloat(formData.dimensions.width) || 0
        }
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEdit && court) {
      setFormData({
        name: court.name || '',
        sportType: court.sportType || '',
        surface: court.surface || '',
        dimensions: court.dimensions || { length: '', width: '', unit: 'meters' },
        capacity: court.capacity || '',
        pricePerHour: court.pricePerHour || '',
        features: court.features || [],
        operatingHours: court.operatingHours || {},
        maintenanceSchedule: court.maintenanceSchedule || []
      });
    } else {
      setFormData({
        name: '',
        sportType: '',
        surface: '',
        dimensions: { length: '', width: '', unit: 'meters' },
        capacity: '',
        pricePerHour: '',
        features: [],
        operatingHours: {
          monday: { isOpen: true, open: '08:00', close: '22:00' },
          tuesday: { isOpen: true, open: '08:00', close: '22:00' },
          wednesday: { isOpen: true, open: '08:00', close: '22:00' },
          thursday: { isOpen: true, open: '08:00', close: '22:00' },
          friday: { isOpen: true, open: '08:00', close: '22:00' },
          saturday: { isOpen: true, open: '09:00', close: '21:00' },
          sunday: { isOpen: true, open: '09:00', close: '21:00' }
        },
        maintenanceSchedule: []
      });
    }
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Basic Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Court Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Basketball Court A"
            error={errors.name}
            required
          />

          <Select
            label="Sport Type"
            options={sportsOptions}
            value={formData.sportType}
            onChange={(value) => handleInputChange('sportType', value)}
            placeholder="Select sport type"
            error={errors.sportType}
            required
          />

          <Select
            label="Surface Type"
            options={surfaceOptions}
            value={formData.surface}
            onChange={(value) => handleInputChange('surface', value)}
            placeholder="Select surface type"
            error={errors.surface}
            required
          />

          <Input
            label="Maximum Capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            placeholder="e.g., 10"
            error={errors.capacity}
            required
          />

          <Input
            label="Price per Hour ($)"
            type="number"
            min="0"
            step="0.01"
            value={formData.pricePerHour}
            onChange={(e) => handleInputChange('pricePerHour', e.target.value)}
            placeholder="e.g., 45.00"
            error={errors.pricePerHour}
            required
          />
        </div>
      </div>

      {/* Dimensions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Court Dimensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Length"
            type="number"
            min="0"
            step="0.1"
            value={formData.dimensions.length}
            onChange={(e) => handleInputChange('dimensions.length', e.target.value)}
            placeholder="e.g., 28"
            error={errors['dimensions.length']}
          />

          <Input
            label="Width"
            type="number"
            min="0"
            step="0.1"
            value={formData.dimensions.width}
            onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
            placeholder="e.g., 15"
            error={errors['dimensions.width']}
          />

          <Select
            label="Unit"
            options={unitOptions}
            value={formData.dimensions.unit}
            onChange={(value) => handleInputChange('dimensions.unit', value)}
          />
        </div>
      </div>

      {/* Features */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Court Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {featureOptions.map((feature) => (
            <Checkbox
              key={feature}
              label={feature}
              checked={formData.features.includes(feature)}
              onChange={() => handleFeatureToggle(feature)}
            />
          ))}
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Operating Hours</h3>
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day.key} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-card-foreground">
                {day.label}
              </div>
              
              <Checkbox
                label="Open"
                checked={formData.operatingHours[day.key]?.isOpen || false}
                onChange={(checked) => handleOperatingHoursChange(day.key, 'isOpen', checked)}
              />

              {formData.operatingHours[day.key]?.isOpen && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={formData.operatingHours[day.key]?.open || '08:00'}
                    onChange={(e) => handleOperatingHoursChange(day.key, 'open', e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={formData.operatingHours[day.key]?.close || '22:00'}
                    onChange={(e) => handleOperatingHoursChange(day.key, 'close', e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {!formData.operatingHours[day.key]?.isOpen && (
                <span className="text-muted-foreground text-sm">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Reset Form
        </Button>

        <div className="flex items-center space-x-3">
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Icon name={isEdit ? "Save" : "Plus"} size={16} className="mr-2" />
                {isEdit ? 'Update Court' : 'Create Court'}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CourtForm;
