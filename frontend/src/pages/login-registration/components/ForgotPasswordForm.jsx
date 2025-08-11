import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateOtp = () => {
    const newErrors = {};
    
    if (!formData?.otp) {
      newErrors.otp = 'OTP is required';
    } else if (formData?.otp?.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    } else if (formData?.otp !== '123456') {
      newErrors.otp = 'Invalid OTP. Use 123456 for demo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!formData?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(formData?.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.newPassword !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleEmailSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentStep(2);
      setIsLoading(false);
    }, 1000);
  };

  const handleOtpSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateOtp()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentStep(3);
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validatePassword()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentStep(4);
      setIsLoading(false);
    }, 1000);
  };

  const resendOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Step 1: Email Input
  if (currentStep === 1) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Forgot Password?</h2>
          <p className="text-text-secondary">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
          />

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Sending Code...' : 'Send Reset Code'}
          </Button>
        </form>
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  // Step 2: OTP Verification
  if (currentStep === 2) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Mail" size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Check Your Email</h2>
          <p className="text-text-secondary">
            We've sent a reset code to{' '}
            <span className="font-medium text-text-primary">{formData?.email}</span>
          </p>
        </div>
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <Input
            label="Reset Code"
            type="text"
            name="otp"
            placeholder="Enter 6-digit code"
            value={formData?.otp}
            onChange={handleInputChange}
            error={errors?.otp}
            description="Use 123456 for demo purposes"
            maxLength={6}
            required
          />

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <div className="text-center">
            <p className="text-text-secondary text-sm mb-2">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={resendOtp}
              disabled={isLoading}
            >
              Resend Code
            </Button>
          </div>
        </form>
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            ← Change email address
          </button>
        </div>
      </div>
    );
  }

  // Step 3: New Password
  if (currentStep === 3) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Key" size={32} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Create New Password</h2>
          <p className="text-text-secondary">
            Your identity has been verified. Set your new password below.
          </p>
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="Create a strong password"
            value={formData?.newPassword}
            onChange={handleInputChange}
            error={errors?.newPassword}
            description="Must contain uppercase, lowercase, and number"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your new password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
            required
          />

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>
      </div>
    );
  }

  // Step 4: Success
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Password Updated!</h2>
        <p className="text-text-secondary">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>
      </div>

      <Button
        variant="default"
        fullWidth
        onClick={onBackToLogin}
      >
        Back to Sign In
      </Button>
    </div>
  );
};

export default ForgotPasswordForm;