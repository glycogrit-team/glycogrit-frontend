/**
 * Strava OAuth Callback Page
 * Handles the redirect from Strava after authorization
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { stravaService } from '../lib/strava';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';

export default function StravaCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting your Strava account...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Authorization failed: ${error}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        return;
      }

      try {
        await stravaService.handleCallback(code);
        setStatus('success');
        setMessage('Successfully connected to Strava!');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Failed to connect Strava');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center container-custom py-16">
        <Card className="max-w-md w-full p-8">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FC4C02]"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connecting to Strava</h2>
                <p className="text-gray-600">{message}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-green-100 p-4">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-red-100 p-4">
                    <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Return to Dashboard
                </button>
              </>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
