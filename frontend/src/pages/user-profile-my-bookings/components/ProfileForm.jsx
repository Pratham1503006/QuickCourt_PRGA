import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProfileForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    emergencyContact: user?.emergencyContact || '',
    emergencyPhone: user?.emergencyPhone || '',
    preferredSports: user?.preferredSports || [],
    notifications: user?.notifications || {
      email: true,
      sms: false,
      push: true
    }
  });

  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const stateOptions = [
    { value: '', label: 'Select State' },
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'OH', label: 'Ohio' },
    { value: 'GA', label: 'Georgia' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'MI', label: 'Michigan' }
  ];

  const sportsOptions = [
    { value: 'basketball', label: 'Basketball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'football', label: 'Football' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'cricket', label: 'Cricket' },
    { value: 'table-tennis', label: 'Table Tennis' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNotificationChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        [type]: checked
      }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      if (file?.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e?.target?.result);
        setErrors(prev => ({
          ...prev,
          profileImage: ''
        }));
      };
      reader?.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...formData,
        profileImage
      };
      
      onSave(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      emergencyContact: user?.emergencyContact || '',
      emergencyPhone: user?.emergencyPhone || '',
      preferredSports: user?.preferredSports || [],
      notifications: user?.notifications || {
        email: true,
        sms: false,
        push: true
      }
    });
    setProfileImage(user?.profileImage || '');
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Profile Settings</h2>
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            iconPosition="left"
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
      {/* Profile Image Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-6 border-b border-border">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon name="User" size={32} className="text-muted-foreground" />
            )}
          </div>
          {isEditing && (
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-smooth">
              <Icon name="Camera" size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary">
            {formData?.firstName} {formData?.lastName}
          </h3>
          <p className="text-text-secondary">{formData?.email}</p>
          <p className="text-sm text-text-secondary mt-1">
            Member since January 2024
          </p>
          {errors?.profileImage && (
            <p className="text-error text-sm mt-1">{errors?.profileImage}</p>
          )}
        </div>
      </div>
      {/* Personal Information */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData?.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              error={errors?.firstName}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData?.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              error={errors?.lastName}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData?.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              error={errors?.email}
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData?.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              error={errors?.phone}
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData?.dateOfBirth}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <Select
              label="Gender"
              options={genderOptions}
              value={formData?.gender}
              onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Address Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Street Address"
              name="address"
              value={formData?.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                name="city"
                value={formData?.city}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <Select
                label="State"
                options={stateOptions}
                value={formData?.state}
                onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                disabled={!isEditing}
              />
              <Input
                label="ZIP Code"
                name="zipCode"
                value={formData?.zipCode}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              name="emergencyContact"
              value={formData?.emergencyContact}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <Input
              label="Contact Phone"
              name="emergencyPhone"
              type="tel"
              value={formData?.emergencyPhone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Sports Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Sports Preferences</h3>
          <Select
            label="Preferred Sports"
            description="Select your favorite sports for personalized recommendations"
            options={sportsOptions}
            value={formData?.preferredSports}
            onChange={(value) => setFormData(prev => ({ ...prev, preferredSports: value }))}
            disabled={!isEditing}
            multiple
            searchable
          />
        </div>

        {/* Notification Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData?.notifications?.email}
                onChange={(e) => handleNotificationChange('email', e?.target?.checked)}
                disabled={!isEditing}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <div>
                <span className="text-text-primary font-medium">Email Notifications</span>
                <p className="text-sm text-text-secondary">Receive booking confirmations and updates via email</p>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData?.notifications?.sms}
                onChange={(e) => handleNotificationChange('sms', e?.target?.checked)}
                disabled={!isEditing}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <div>
                <span className="text-text-primary font-medium">SMS Notifications</span>
                <p className="text-sm text-text-secondary">Get text messages for urgent booking updates</p>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData?.notifications?.push}
                onChange={(e) => handleNotificationChange('push', e?.target?.checked)}
                disabled={!isEditing}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <div>
                <span className="text-text-primary font-medium">Push Notifications</span>
                <p className="text-sm text-text-secondary">Receive real-time notifications in your browser</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;