/**
 * Google Login Button Component
 * Handles Google OAuth sign-in flow
 */

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      // Send the Google token to our backend
      await loginWithGoogle(credentialResponse.credential);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default: redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);

      // Provide user-friendly error messages
      let errorMessage = 'Failed to sign in with Google';
      const errorString = error.message || error.toString();

      if (errorString.includes('network') || errorString.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (errorString.includes('invalid') || errorString.includes('token')) {
        errorMessage = 'Google authentication failed. Please try again.';
      } else if (errorString.includes('rate limit') || errorString.includes('too many')) {
        errorMessage = 'Too many attempts. Please try again in a few minutes.';
      } else if (errorString) {
        errorMessage = errorString;
      }

      if (onError) {
        onError(errorMessage);
      } else {
        // Show alert if no error handler provided
        alert(`Sign in failed: ${errorMessage}`);
      }
    }
  };

  const handleError = () => {
    const errorMessage = 'Google sign-in was cancelled or failed. Please try again.';
    console.error(errorMessage);

    if (onError) {
      onError(errorMessage);
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="outline"
        size="large"
        text="continue_with"
        width="100%"
      />
    </div>
  );
}
