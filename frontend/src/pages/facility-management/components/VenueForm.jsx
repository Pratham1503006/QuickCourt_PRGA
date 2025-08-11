import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';
import ImageUpload from './ImageUpload';

const VenueForm = ({ 
  venue, 
  onSubmit, 
  sportsOptions, 
  amenitiesOptions, 
  isFormDirty, 
  setIsFormDirty, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    coordinates: { lat: '', lng: '' },
    sportTypes: [],
    amenities: [],
    images: [],
    operatingHours: {
      monday: { isOpen: true, open: '08:00', close: '22:00' },
      tuesday: { isOpen: true, open: '08:00', close: '22:00' },
      wednesday: { isOpen: true, open: '08:00', close: '22:00' },
      thursday: { isOpen: true, open: '08:00', close: '22:00' },
      friday: { isOpen: true, open: '08:00', close: '22:00' },
      saturday: { isOpen: true, open: '09:00', close: '21:00' },
      sunday: { isOpen: true, open: '09:00', close: '21:00' }
    },
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    }
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

  useEffect(() => {
    if (venue && isEdit) {
      setFormData({
        name: venue.name || '',
        description: venue.description || '',
        address: venue.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        },
        coordinates: venue.coordinates || { lat: '', lng: '' },
        sportTypes: venue.sportTypes || [],
        amenities: venue.amenities || [],
        images: venue.images || [],
        operatingHours: venue.operatingHours || {
          monday: { isOpen: true, open: '08:00', close: '22:00' },
          tuesday: { isOpen: true, open: '08:00', close: '22:00' },
          wednesday: { isOpen: true, open: '08:00', close: '22:00' },
          thursday: { isOpen: true, open: '08:00', close: '22:00' },
          friday: { isOpen: true, open: '08:00', close: '22:00' },
          saturday: { isOpen: true, open: '09:00', close: '21:00' },
          sunday: { isOpen: true, open: '09:00', close: '21:00' }
        },
        contactInfo: venue.contactInfo || {
          phone: '',
          email: '',
          website: ''
        }
      });
    }
  }, [venue, isEdit]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsFormDirty(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
    setIsFormDirty(true);
  };

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
    setIsFormDirty(true);
  };

  const handleCoordinatesChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: parseFloat(value) || ''
      }
    }));
    setIsFormDirty(true);
  };

  const handleSportToggle = (sportValue) => {
    setFormData(prev => ({
      ...prev,
      sportTypes: prev.sportTypes.includes(sportValue)
        ? prev.sportTypes.filter(s => s !== sportValue)
        : [...prev.sportTypes, sportValue]
    }));
    setIsFormDirty(true);
  };

  const handleAmenityToggle = (amenityValue) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityValue)
        ? prev.amenities.filter(a => a !== amenityValue)
        : [...prev.amenities, amenityValue]
    }));
    setIsFormDirty(true);
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
    setIsFormDirty(true);
  };

  const handleImagesChange = (images) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
    setIsFormDirty(true);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Venue name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required';
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }

    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'State is required';
    }

    if (!formData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = 'ZIP code is required';
    }

    if (formData.sportTypes.length === 0) {
      newErrors.sportTypes = 'At least one sport type must be selected';
    }

    if (formData.contactInfo.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.contactInfo.phone)) {
      newErrors['contactInfo.phone'] = 'Please enter a valid phone number';
    }

    if (formData.contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      newErrors['contactInfo.email'] = 'Please enter a valid email address';
    }

    if (formData.contactInfo.website && !/^https?:\/\/.+/.test(formData.contactInfo.website)) {
      newErrors['contactInfo.website'] = 'Please enter a valid website URL (including http:// or https://)';
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEdit && venue) {
      setFormData({
        name: venue.name || '',
        description: venue.description || '',
        address: venue.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        },
        coordinates: venue.coordinates || { lat: '', lng: '' },
        sportTypes: venue.sportTypes || [],
        amenities: venue.amenities || [],
        images: venue.images || [],
        operatingHours: venue.operatingHours || {},
        contactInfo: venue.contactInfo || {
          phone: '',
          email: '',
          website: ''
        }
      });
    } else {
      setFormData({
        name: '',
        description: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        },
        coordinates: { lat: '', lng: '' },
        sportTypes: [],
        amenities: [],
        images: [],
        operatingHours: {
          monday: { isOpen: true, open: '08:00', close: '22:00' },
          tuesday: { isOpen: true, open: '08:00', close: '22:00' },
          wednesday: { isOpen: true, open: '08:00', close: '22:00' },
          thursday: { isOpen: true, open: '08:00', close: '22:00' },
          friday: { isOpen: true, open: '08:00', close: '22:00' },
          saturday: { isOpen: true, open: '09:00', close: '21:00' },
          sunday: { isOpen: true, open: '09:00', close: '21:00' }
        },
        contactInfo: {
          phone: '',
          email: '',
          website: ''
        }
      });
    }
    setErrors({});
    setIsFormDirty(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Basic Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Venue Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter venue name"
            error={errors.name}
            required
          />

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your venue, its features, and what makes it special..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.description 
                  ? 'border-destructive focus:ring-destructive' 
                  : 'border-border focus:ring-primary'
              }`}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Address & Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              type="text"
              value={formData.address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="123 Main Street"
              error={errors['address.street']}
              required
            />
          </div>
          
          <Input
            label="City"
            type="text"
            value={formData.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="City"
            error={errors['address.city']}
            required
          />

          <Input
            label="State"
            type="text"
            value={formData.address.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            placeholder="State"
            error={errors['address.state']}
            required
          />

          <Input
            label="ZIP Code"
            type="text"
            value={formData.address.zipCode}
            onChange={(e) => handleAddressChange('zipCode', e.target.value)}
            placeholder="12345"
            error={errors['address.zipCode']}
            required
          />

          <Input
            label="Country"
            type="text"
            value={formData.address.country}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            placeholder="United States"
          />

          <Input
            label="Latitude (Optional)"
            type="number"
            step="any"
            value={formData.coordinates.lat}
            onChange={(e) => handleCoordinatesChange('lat', e.target.value)}
            placeholder="40.7128"
          />

          <Input
            label="Longitude (Optional)"
            type="number"
            step="any"
            value={formData.coordinates.lng}
            onChange={(e) => handleCoordinatesChange('lng', e.target.value)}
            placeholder="-74.0060"
          />
        </div>
      </div>

      {/* Sports & Amenities */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Sports & Amenities</h3>
        
        <div className="space-y-6">
          {/* Sports Types */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Sports Available <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sportsOptions.map((sport) => (
                <Checkbox
                  key={sport.value}
                  label={sport.label}
                  checked={formData.sportTypes.includes(sport.label)}
                  onChange={() => handleSportToggle(sport.label)}
                />
              ))}
            </div>
            {errors.sportTypes && (
              <p className="text-sm text-destructive mt-2">{errors.sportTypes}</p>
            )}
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenitiesOptions.map((amenity) => (
                <Checkbox
                  key={amenity.value}
                  label={amenity.label}
                  checked={formData.amenities.includes(amenity.label)}
                  onChange={() => handleAmenityToggle(amenity.label)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Venue Images</h3>
        <ImageUpload
          images={formData.images}
          onImagesChange={handleImagesChange}
          maxImages={10}
        />
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

      {/* Contact Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            value={formData.contactInfo.phone}
            onChange={(e) => handleContactChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            error={errors['contactInfo.phone']}
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.contactInfo.email}
            onChange={(e) => handleContactChange('email', e.target.value)}
            placeholder="contact@venue.com"
            error={errors['contactInfo.email']}
          />

          <div className="md:col-span-2">
            <Input
              label="Website URL"
              type="url"
              value={formData.contactInfo.website}
              onChange={(e) => handleContactChange('website', e.target.value)}
              placeholder="https://www.venue.com"
              error={errors['contactInfo.website']}
            />
          </div>
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
            disabled={isSubmitting || !isFormDirty}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Icon name={isEdit ? "Save" : "Plus"} size={16} className="mr-2" />
                {isEdit ? 'Update Venue' : 'Create Venue'}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default VenueForm;
