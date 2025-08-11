/**
 * Email service for sending OTP and handling email verification
 * Integrates with backend API for real email sending
 */

/**
 * Generates a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends OTP to the specified email via backend API
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP to send
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendOTPEmail = async (email, otp) => {
  try {
    // Check if we have a backend API URL in environment variables
    const backendApiUrl = import.meta.env?.VITE_BACKEND_API_URL || 'http://localhost:3001/api';
    
    console.log(`Sending OTP ${otp} to ${email} via backend API`);
    
    // Send request to backend API to send email
    const response = await fetch(`${backendApiUrl}/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        otp,
        subject: 'QuickCourt - Verification Code',
        template: 'otp',
        expiration: 10 // minutes
      }),
    });
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = 'Failed to send OTP email';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If response is not JSON, use default message
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    
    return {
      success: true,
      message: result.message || 'OTP sent successfully to your email address.'
    };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    
    // Fallback for development - store OTP locally if backend is not available
    if (import.meta.env?.DEV) {
      console.warn('Using local storage fallback for OTP in development mode');
      storeOTP(email, otp, 10);
      return {
        success: true,
        message: 'OTP sent successfully (dev mode - check console for code: ' + otp + ')'
      };
    }
    
    return {
      success: false,
      message: error.message || 'Failed to send OTP. Please try again.'
    };
  }
};

/**
 * Validates an email address format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Stores OTP with expiration time in localStorage
 * In a production app, this should be handled server-side
 * @param {string} email - Email associated with OTP
 * @param {string} otp - OTP to store
 * @param {number} expirationMinutes - Expiration time in minutes
 */
export const storeOTP = (email, otp, expirationMinutes = 10) => {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + expirationMinutes);
  
  const otpData = {
    otp,
    expiration: expirationTime.getTime()
  };
  
  localStorage.setItem(`otp_${email}`, JSON.stringify(otpData));
};

/**
 * Verifies OTP via backend API
 * Falls back to localStorage verification in development
 * @param {string} email - Email associated with OTP
 * @param {string} inputOtp - OTP entered by user
 * @returns {Promise<Object>} Verification result
 */
export const verifyOTP = async (email, inputOtp) => {
  try {
    // First, try localStorage verification for development
    if (import.meta.env?.DEV) {
      console.log('Development mode: Checking localStorage first for OTP verification');
      const localResult = verifyOTPLocal(email, inputOtp);
      if (localResult.success) {
        return localResult;
      }
      console.log('localStorage verification failed, trying backend...');
    }

    // Try backend API verification
    const backendApiUrl = import.meta.env?.VITE_BACKEND_API_URL || 'http://localhost:3001/api';
    
    const response = await fetch(`${backendApiUrl}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp: inputOtp }),
    });
    
    if (!response.ok) {
      // If backend fails, try localStorage as fallback
      if (import.meta.env?.DEV) {
        console.warn('Backend verification failed, using localStorage fallback');
        return verifyOTPLocal(email, inputOtp);
      }
      
      let errorMessage = 'Failed to verify OTP';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    
    return {
      success: true,
      message: result.message || 'OTP verified successfully.'
    };
  } catch (error) {
    console.error('Error verifying OTP via backend:', error);
    
    // Final fallback for development - verify OTP from localStorage
    if (import.meta.env?.DEV) {
      console.warn('Using local storage fallback for OTP verification in development mode');
      return verifyOTPLocal(email, inputOtp);
    }
    
    return {
      success: false,
      message: error.message || 'Error verifying OTP. Please try again.'
    };
  }
};

/**
 * Verifies OTP from localStorage (development fallback)
 * @param {string} email - Email associated with OTP
 * @param {string} inputOtp - OTP entered by user
 * @returns {Object} Verification result
 */
const verifyOTPLocal = (email, inputOtp) => {
  try {
    const storedOtpData = localStorage.getItem(`otp_${email}`);
    
    if (!storedOtpData) {
      return {
        success: false,
        message: 'No OTP found for this email. Please request a new one.'
      };
    }
    
    const { otp, expiration } = JSON.parse(storedOtpData);
    const currentTime = new Date().getTime();
    
    if (currentTime > expiration) {
      // Remove expired OTP
      localStorage.removeItem(`otp_${email}`);
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.'
      };
    }
    
    if (otp !== inputOtp) {
      return {
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      };
    }
    
    // Remove used OTP
    localStorage.removeItem(`otp_${email}`);
    
    return {
      success: true,
      message: 'OTP verified successfully.'
    };
  } catch (error) {
    console.error('Error verifying OTP locally:', error);
    return {
      success: false,
      message: 'Error verifying OTP. Please try again.'
    };
  }
};
