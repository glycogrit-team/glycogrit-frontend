import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChallengeCard from '../components/features/ChallengeCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
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
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-secondary-500 rounded-full opacity-20 blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-primary-400 rounded-full opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container-custom text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white animate-fade-in-up">Fitness Challenges</h1>
          <p className="text-xl md:text-2xl text-blue-50 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Choose from a variety of challenges to match your fitness goals
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white shadow-soft sticky top-16 z-40 py-6 border-b border-gray-100">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All' : ChallengeConfig.getCategoryDisplayName(category)}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      selectedDifficulty === difficulty
                        ? 'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white shadow-lg scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
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
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white flex-1">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonLoader type="card" count={9} />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-600 rounded-full mb-6 animate-bounce-slow">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">Error loading challenges</h3>
              <p className="mt-2 text-red-600 text-lg">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <p className="text-gray-600 text-lg">
                  <span className="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-semibold">
                    {filteredChallenges.length} {filteredChallenges.length === 1 ? 'Challenge' : 'Challenges'}
                  </span>
                </p>
              </div>

              {filteredChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredChallenges.map((challenge, index) => (
                    <div key={challenge.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <ChallengeCard challenge={challenge} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 text-gray-400 rounded-full mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-gray-900">No challenges found</h3>
                  <p className="mt-2 text-gray-500 text-lg">Try adjusting your filters to see more results.</p>
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
