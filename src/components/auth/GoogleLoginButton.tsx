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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      console.error('Google sign-in error:', error);

      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const handleError = () => {
    const errorMessage = 'Google sign-in failed';
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
