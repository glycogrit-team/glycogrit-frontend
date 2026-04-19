import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChallengeCard from '../components/features/ChallengeCard';
import { ChallengeConfig } from '../lib/config';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, Event } from '../lib/events-api';

export default function Challenges() {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | 'all'>('all');

  // Fetch events from API
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsAPI.getEvents({ limit: 100 });
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = events.filter((event) => {
    const categoryMatch = selectedCategory === 'all' || event.event_type === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || event.difficulty_level === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const categories: Array<string> = ['all', 'running', 'cycling', 'walking', 'mixed', 'strength'];
  const difficulties: Array<string> = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">Fitness Challenges</h1>
          <p className="text-xl text-blue-100">
            Choose from a variety of challenges to match your fitness goals
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white shadow-sm sticky top-16 z-40 py-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All' : ChallengeConfig.getCategoryDisplayName(category)}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty === 'all' ? 'All' : ChallengeConfig.getDifficultyDisplayName(difficulty)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="py-12 bg-gray-50 flex-1">
        <div className="container-custom">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredChallenges.length}</span>{' '}
              {filteredChallenges.length === 1 ? 'challenge' : 'challenges'}
            </p>
            {isAdmin && (
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium flex items-center gap-2"
                onClick={() => alert('Create Challenge feature coming soon! For now, admin can edit existing challenges using the controls on each card.')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Challenge
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-24 w-24 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Failed to load events</h3>
              <p className="mt-2 text-gray-500">{error}</p>
              <button
                onClick={loadEvents}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : filteredChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredChallenges.map((event) => (
                <ChallengeCard key={event.id} event={event} isAdmin={isAdmin} onUpdate={loadEvents} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No challenges found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
