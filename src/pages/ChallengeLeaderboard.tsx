/**
 * Challenge Leaderboard Page
 * Displays rankings for a specific challenge based on distance covered
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { stravaService, LeaderboardEntry } from '../lib/strava';
import { useAuth } from '../contexts/AuthContext';

export default function ChallengeLeaderboard() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLeaderboard();
    }
  }, [id]);

  const fetchLeaderboard = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await stravaService.getChallengeLeaderboard(parseInt(id), 50);
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  const getRankColor = (rank: number): string => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-br from-amber-600 to-amber-800 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/challenges/${id}`} className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Challenge
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Challenge Leaderboard</h1>
              <p className="text-gray-600">Top performers ranked by distance covered</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              variant="outline"
              size="sm"
            >
              {refreshing ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span>Refreshing...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </span>
              )}
            </Button>
          </div>
        </div>

        {loading ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchLeaderboard}>Try Again</Button>
            </div>
          </Card>
        ) : leaderboard.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
              <p className="text-gray-600">Be the first to sync your activities and appear on the leaderboard!</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="text-center order-1">
                  <div className="bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg p-6 mb-3">
                    <div className="text-4xl font-bold text-white mb-2">2</div>
                    <p className="text-sm font-medium text-white">{leaderboard[1].user_name}</p>
                    <p className="text-2xl font-bold text-white mt-2">{leaderboard[1].total_distance_km.toFixed(1)} km</p>
                    <p className="text-xs text-gray-100 mt-1">{leaderboard[1].total_activities} activities</p>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="text-center order-2">
                  <div className="bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-lg p-6 mb-3 transform scale-110 shadow-xl">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-white mb-2">{leaderboard[0].user_name}</p>
                    <p className="text-3xl font-bold text-white mt-2">{leaderboard[0].total_distance_km.toFixed(1)} km</p>
                    <p className="text-xs text-yellow-100 mt-1">{leaderboard[0].total_activities} activities</p>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="text-center order-3">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-800 rounded-lg p-6 mb-3">
                    <div className="text-4xl font-bold text-white mb-2">3</div>
                    <p className="text-sm font-medium text-white">{leaderboard[2].user_name}</p>
                    <p className="text-2xl font-bold text-white mt-2">{leaderboard[2].total_distance_km.toFixed(1)} km</p>
                    <p className="text-xs text-amber-100 mt-1">{leaderboard[2].total_activities} activities</p>
                  </div>
                </div>
              </div>
            )}

            {/* Full Leaderboard */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Athlete
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Distance
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activities
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((entry) => (
                      <tr
                        key={entry.user_id}
                        className={`${
                          user && entry.user_id === user.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                        } transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${getRankColor(entry.rank)}`}>
                            {getRankIcon(entry.rank) || (
                              <span className="text-sm font-bold">{entry.rank}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {entry.user_name}
                                {user && entry.user_id === user.id && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {entry.total_distance_km.toFixed(2)} km
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-500">{entry.total_activities}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Info Banner */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-blue-800">
                    Rankings are updated in real-time when participants sync their Strava activities.
                    Connect your Strava account to participate and compete!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
