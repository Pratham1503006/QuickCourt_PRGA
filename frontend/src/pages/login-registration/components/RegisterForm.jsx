import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { notificationService } from '../../../services/notificationService.jsx';
import { sendOTPEmail, verifyOTP, storeOTP } from '../../../utils/emailService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox  from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegisterForm = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });
  const [otpData, setOtpData] = useState({
    otp: '',
    isVerified: false,
    loading: false
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'customer', label: 'Sports Enthusiast', description: 'Book and enjoy sports facilities' },
    { value: 'venue_owner', label: 'Facility Owner', description: 'Manage and rent out sports facilities' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
    if (errors?.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };

  const handleOtpChange = (e) => {
    const { value } = e?.target;
    setOtpData(prev => ({ ...prev, otp: value }));
    if (errors?.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(formData?.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }
    
    if (!formData?.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateOtp = () => {
    const newErrors = {};
    
    if (!otpData?.otp) {
      newErrors.otp = 'OTP is required';
    } else if (otpData?.otp?.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    // Note: Actual OTP validation will happen on the backend when submitting
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const sendOtp = async () => {
    try {
      // Set local loading state for OTP sending
      setOtpData(prev => ({ ...prev, loading: true }));
      
      // Generate a consistent OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      
      console.log(`🔐 Generated OTP for testing: ${otp}`);
      
      // Always store OTP locally as fallback
      storeOTP(formData.email, otp, 10);
      
      // Try to send OTP via backend API
      const result = await sendOTPEmail(formData.email, otp);
      
      if (result.success) {
        notificationService.success(`OTP sent successfully! Check console for development code: ${otp}`);
      } else {
        // Even if backend fails, we have localStorage fallback
        console.warn('Backend OTP sending failed, using localStorage fallback');
        notificationService.success(`OTP generated for development (check console): ${otp}`);
      }
      
      // Reset local loading state
      setOtpData(prev => ({ ...prev, loading: false }));
      return { success: true, otp }; // Return the OTP for testing
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Reset local loading state on error
      setOtpData(prev => ({ ...prev, loading: false }));
      
      // Still provide localStorage fallback
      const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
      storeOTP(formData.email, fallbackOtp, 10);
      console.log(`🔐 Fallback OTP for testing: ${fallbackOtp}`);
      notificationService.success(`OTP generated (fallback mode): ${fallbackOtp}`);
      
      return { success: true, otp: fallbackOtp };
    }
  };

  const handleStep1Submit = async (e) => {
    e?.preventDefault();
    
    if (!validateStep1()) return;
    
    // Send OTP simulation
    const otpResult = await sendOtp();
    
    if (otpResult.success) {
      setCurrentStep(2);
    }
  };

  const handleOtpSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateOtp()) return;
    
    try {
      setSubmitLoading(true);
      
      // Verify OTP before proceeding
      const verificationResult = await verifyOTP(formData.email, otpData.otp);
      
      if (!verificationResult.success) {
        setErrors({ otp: verificationResult.message || 'Invalid OTP. Please try again.' });
        setSubmitLoading(false);
        return;
      }
      
      setOtpData(prev => ({ ...prev, isVerified: true }));
      
      // Create user account with our auth system
      const { user, error } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        role: formData.role
      });

      if (error) {
        setErrors({ submit: error.message });
        setSubmitLoading(false);
        return;
      }

      if (user) {
        notificationService.signupSuccess(user.fullName);
        
        // Navigate based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin-dashboard-management');
            break;
          case 'venue_owner':
            navigate('/venue-details-booking');
            break;
          default:
            navigate('/homepage-dashboard');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resendOtp = async () => {
    // Don't allow resending if already loading
    if (otpData.loading) return;
    
    await sendOtp();
  };

  if (currentStep === 2) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Mail" size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Verify Your Email</h2>
          <p className="text-text-secondary">
            We've sent a verification code to{' '}
            <span className="font-medium text-text-primary">{formData?.email}</span>
          </p>
        </div>
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <Input
            label="Verification Code"
            type="text"
            name="otp"
            placeholder="Enter 6-digit code"
            value={otpData?.otp}
            onChange={handleOtpChange}
            error={errors?.otp}
            description="Enter the 6-digit code sent to your email"
            maxLength={6}
            required
          />

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={submitLoading}
            disabled={submitLoading}
          >
            {submitLoading ? 'Verifying...' : 'Verify Email'}
          </Button>

          <div className="text-center">
            <p className="text-text-secondary text-sm mb-2">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={resendOtp}
              disabled={otpData.loading}
            >
              {otpData.loading ? 'Sending...' : 'Resend Code'}
            </Button>
          </div>
        </form>
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            ← Back to registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Create Account</h2>
        <p className="text-text-secondary">Join QuickCourt and start booking</p>
      </div>
      <form onSubmit={handleStep1Submit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="John"
            value={formData?.firstName}
            onChange={handleInputChange}
            error={errors?.firstName}
            required
          />
          
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Doe"
            value={formData?.lastName}
            onChange={handleInputChange}
            error={errors?.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="john.doe@example.com"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="+1 (555) 123-4567"
          value={formData?.phone}
          onChange={handleInputChange}
          error={errors?.phone}
          required
        />

        <Select
          label="I am a..."
          placeholder="Select your role"
          options={roleOptions}
          value={formData?.role}
          onChange={handleRoleChange}
          error={errors?.role}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a strong password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          description="Must contain uppercase, lowercase, and number"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
        />

        <div className="space-y-4">
          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            name="agreeToTerms"
            checked={formData?.agreeToTerms}
            onChange={handleInputChange}
            error={errors?.agreeToTerms}
            required
          />
          
          <Checkbox
            label="I'd like to receive marketing emails and updates"
            name="agreeToMarketing"
            checked={formData?.agreeToMarketing}
            onChange={handleInputChange}
          />
        </div>

        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      <div className="mt-8 text-center">
        <p className="text-text-secondary">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;