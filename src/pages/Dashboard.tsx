/**
 * Dashboard Page
 * User dashboard showing profile, registered challenges, activity history, and stats
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StravaConnect from '../components/strava/StravaConnect';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api-client';
import { Challenge } from '../types/challenge';

export default function Dashboard() {
  const { user } = useAuth();
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Fetch user's registered challenges
        const challenges = await apiClient.getUserChallenges(user.id.toString());
        setUserChallenges(challenges);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-gray-600">Track your progress and manage your challenges</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <div className="flex flex-col items-center text-center">
                {/* Profile Picture */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold mb-4 overflow-hidden">
                  {user.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{user.email}</p>

                {user.oauth_provider && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
                    Connected via {user.oauth_provider}
                  </span>
                )}

                {user.city && user.state && (
                  <p className="text-gray-500 text-sm mb-4">
                    {user.city}, {user.state}
                  </p>
                )}

                <div className="w-full pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Account Status</span>
                    <span className={`font-medium ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Email Status</span>
                    <span className={`font-medium ${user.email_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {user.email_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Statistics Card */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Active Challenges</p>
                    <p className="text-2xl font-bold text-blue-600">{userChallenges.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Distance</p>
                    <p className="text-2xl font-bold text-green-600">0 km</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold text-purple-600">0 days</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            {/* Strava Connection Card */}
            <StravaConnect />
          </div>

          {/* Right Column - Challenges & Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Registered Challenges */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">My Challenges</h2>
                <Link to="/challenges">
                  <Button size="sm" variant="outline">
                    Browse Challenges
                  </Button>
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-600">Loading challenges...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : userChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No challenges yet</h3>
                  <p className="mt-1 text-gray-500">Get started by joining your first challenge!</p>
                  <div className="mt-6">
                    <Link to="/challenges">
                      <Button>Explore Challenges</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userChallenges.map((challenge) => (
                    <Link
                      key={challenge.id}
                      to={`/challenges/${challenge.id}`}
                      className="block group"
                    >
                      <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                          <img
                            src={challenge.imageUrl}
                            alt={challenge.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              challenge.difficulty === 'beginner'
                                ? 'bg-green-100 text-green-800'
                                : challenge.difficulty === 'intermediate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {challenge.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{challenge.duration}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {challenge.participants} participants
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Activity History */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No activities yet</h3>
                <p className="mt-1 text-gray-500">Start tracking your activities in your challenges!</p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
