/**
 * Challenge Progress Component
 * Displays user's progress in a challenge with Strava sync
 */

import { useState, useEffect } from 'react';
import { stravaService, ChallengeProgress as Progress } from '../../lib/strava';
import Button from '../common/Button';
import Card from '../common/Card';

interface ChallengeProgressProps {
  challengeId: number;
  challengeTitle: string;
}

export default function ChallengeProgress({ challengeId, challengeTitle }: ChallengeProgressProps) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgress();
  }, [challengeId]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stravaService.getChallengeProgress(challengeId);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      const data = await stravaService.syncChallengeActivities(challengeId);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync activities');
    } finally {
      setSyncing(false);
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

  if (!progress) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Your Progress</h3>
        <Button
          size="sm"
          onClick={handleSync}
          disabled={syncing}
          className="bg-[#FC4C02] hover:bg-[#E34402] text-white"
        >
          {syncing ? (
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Syncing...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Sync from Strava</span>
            </span>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Distance Progress */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-medium text-gray-700">Distance Covered</span>
            <span className="text-2xl font-bold text-primary-600">
              {progress.total_distance_km.toFixed(2)} km
              {progress.goal_distance_km && (
                <span className="text-sm text-gray-500 ml-1">
                  / {progress.goal_distance_km.toFixed(0)} km
                </span>
              )}
            </span>
          </div>
          {progress.goal_distance_km && (
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress.progress_percentage, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-600 mb-1">Progress</p>
            <p className="text-2xl font-bold text-blue-900">
              {progress.progress_percentage.toFixed(1)}%
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-green-600 mb-1">Activities</p>
            <p className="text-2xl font-bold text-green-900">
              {progress.total_activities}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-600 mb-1">Streak</p>
            <p className="text-2xl font-bold text-purple-900">
              {progress.current_streak_days}
              <span className="text-sm ml-1">days</span>
            </p>
          </div>
        </div>

        {/* Last Activity */}
        {progress.last_activity_date && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Last activity: {new Date(progress.last_activity_date).toLocaleString()}
            </p>
          </div>
        )}

        {/* Motivation Message */}
        {progress.goal_distance_km && progress.progress_percentage < 100 && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">
                {(progress.goal_distance_km - progress.total_distance_km).toFixed(2)} km
              </span>{' '}
              to go! Keep pushing!
            </p>
          </div>
        )}

        {progress.progress_percentage >= 100 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-bold text-green-900">Goal Completed!</span>
            </div>
            <p className="text-sm text-green-800">Congratulations on completing the challenge!</p>
          </div>
        )}
      </div>
    </Card>
  );
}
