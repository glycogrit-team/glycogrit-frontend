import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChallengeCard from '../components/features/ChallengeCard';
import { useChallenges } from '../hooks/useChallenges';
import { ChallengeCategory, DifficultyLevel } from '../types/challenge';
import { ChallengeConfig } from '../lib/config';

export default function Challenges() {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');

  // Fetch challenges from backend with filters
  const { challenges, loading, error } = useChallenges({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
    limit: 100, // Fetch all challenges for filtering
  });

  const filteredChallenges = challenges;

  const categories: Array<ChallengeCategory | 'all'> = ['all', ...ChallengeConfig.CATEGORIES];
  const difficulties: Array<DifficultyLevel | 'all'> = ['all', ...ChallengeConfig.DIFFICULTY_LEVELS];

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
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading challenges...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-24 w-24 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Error loading challenges</h3>
              <p className="mt-2 text-red-600">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredChallenges.length}</span>{' '}
                  {filteredChallenges.length === 1 ? 'challenge' : 'challenges'}
                </p>
              </div>

              {filteredChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
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
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
