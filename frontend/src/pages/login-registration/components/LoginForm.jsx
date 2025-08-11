import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { notificationService } from '../../../services/notificationService.jsx';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Checkbox  from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSwitchToRegister, onForgotPassword }) => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  // Demo credentials for development
  const demoCredentials = {
    admin: { email: "admin@quickcourt.com", password: "demo123", role: "admin" },
    owner: { email: "john.smith@example.com", password: "demo123", role: "venue_owner" },
    customer: { email: "alice.wilson@example.com", password: "demo123", role: "customer" }
  };

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const { user, error } = await signIn({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        setErrors({ submit: error.message || 'Login failed. Please try again.' });
        return;
      }

      if (user) {
        notificationService.loginSuccess(user.fullName || user.email);
        
        // Navigate based on user role
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
      console.error('Login error:', err);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    }
  };

  // Quick demo login
  const handleDemoLogin = async (role) => {
    const credentials = demoCredentials[role];
    if (credentials) {
      setFormData({
        email: credentials.email,
        password: credentials.password,
        rememberMe: false
      });
      
      // Clear any existing errors
      setErrors({});
      
      // Auto-submit after a short delay to show the form update
      setTimeout(async () => {
        try {
          const { user, error } = await signIn({
            email: credentials.email,
            password: credentials.password
          });

          if (!error && user) {
            notificationService.loginSuccess(`Demo ${role.charAt(0).toUpperCase() + role.slice(1)} Login`);
            
            switch (role) {
              case 'admin':
                navigate('/admin-dashboard-management');
                break;
              case 'owner':
                navigate('/venue-details-booking');
                break;
              default:
                navigate('/homepage-dashboard');
            }
          }
        } catch (err) {
          console.error('Demo login error:', err);
          notificationService.error('Demo login failed. Please try again.');
        }
      }, 500);
    }
  };

  const handleSocialLogin = (provider) => {
    notificationService.info(`${provider} login will be available in production.`);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h2>
        <p className="text-text-secondary">Sign in to your QuickCourt account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
          />
          
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-smooth"
          >
            Forgot password?
          </button>
        </div>

        {errors?.submit && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
              <div className="text-sm text-error">{errors?.submit}</div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      {/* Demo Login Section */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-center text-sm font-medium text-blue-800 mb-3">Demo Mode Active - Quick Login:</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('customer')}
            disabled={loading}
            className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Customer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('owner')}
            disabled={loading}
            className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Owner
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('admin')}
            disabled={loading}
            className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Admin
          </Button>
        </div>
        <div className="text-xs text-blue-600 space-y-1">
          <p><strong>Valid Demo Accounts:</strong></p>
          <p>• admin@quickcourt.com (Admin)</p>
          <p>• john.smith@example.com (Venue Owner)</p>
          <p>• alice.wilson@example.com (Customer)</p>
          <p><strong>Password for all:</strong> demo123</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface text-text-secondary">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin('Google')}
            disabled={loading}
          >
            <Icon name="Chrome" size={20} className="mr-2" />
            Google
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin('Facebook')}
            disabled={loading}
          >
            <Icon name="Facebook" size={20} className="mr-2" />
            Facebook
          </Button>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-text-secondary">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;