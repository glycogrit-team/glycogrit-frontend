/**
 * Strava Connect Component
 * Allows users to connect/disconnect their Strava account
 */

import { useState, useEffect } from 'react';
import { stravaService, StravaConnection } from '../../lib/strava';
import Button from '../common/Button';
import Card from '../common/Card';

export default function StravaConnect() {
  const [connection, setConnection] = useState<StravaConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetchConnectionStatus();
  }, []);

  const fetchConnectionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await stravaService.getConnectionStatus();
      setConnection(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connection status');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setError(null);
      await stravaService.connectStrava();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Strava');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Strava account?')) {
      return;
    }

    try {
      setDisconnecting(true);
      setError(null);
      await stravaService.disconnectStrava();
      setConnection(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect Strava');
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-[#FC4C02]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Strava Connection</h3>
            <p className="text-sm text-gray-600">
              {connection ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {connection ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-green-900">Connected</span>
            </div>
            {connection.athlete_name && (
              <p className="text-sm text-green-800">
                Athlete: {connection.athlete_name}
              </p>
            )}
            {connection.last_sync_at && (
              <p className="text-xs text-green-700 mt-1">
                Last synced: {new Date(connection.last_sync_at).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="flex-1"
            >
              {disconnecting ? 'Disconnecting...' : 'Disconnect'}
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            <p>Your Strava activities will be automatically synced to track your challenge progress.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Connect your Strava account to automatically track your activities and progress in challenges.
          </p>

          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Automatic activity syncing</span>
            </li>
            <li className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Real-time progress tracking</span>
            </li>
            <li className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Compete on leaderboards</span>
            </li>
          </ul>

          <Button
            onClick={handleConnect}
            className="w-full bg-[#FC4C02] hover:bg-[#E34402] text-white"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
              </svg>
              <span>Connect with Strava</span>
            </span>
          </Button>
        </div>
      )}
    </Card>
  );
}
