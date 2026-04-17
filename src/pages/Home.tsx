import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ChallengeCard from '../components/features/ChallengeCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useChallenges } from '../hooks/useChallenges';

export default function Home() {
  const { challenges: featuredChallenges, loading, error } = useChallenges({ is_featured: true, limit: 10 });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 md:py-28 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-secondary-500 rounded-full opacity-20 blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-primary-400 rounded-full opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white animate-fade-in-up leading-tight">
              Transform Your Fitness Journey
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-50 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              Join thousands of fitness enthusiasts in exciting challenges. Track your progress, stay motivated, and achieve your goals with GlycoGrit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/challenges">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50 hover:shadow-glow transition-all duration-300">
                  Explore Challenges
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-300">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
                <div className="text-blue-100 text-sm md:text-base">Active Users</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100 text-sm md:text-base">Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">1M+</div>
                <div className="text-blue-100 text-sm md:text-base">Activities Logged</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
              Popular Challenges
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Challenges</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Start your journey with our most popular challenges and join a community of achievers</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonLoader type="card" count={6} />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : featuredChallenges.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-400 rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">No challenges available yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                {featuredChallenges.map((challenge, index) => (
                  <div key={challenge.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ChallengeCard challenge={challenge} />
                  </div>
                ))}
              </div>

              <div className="text-center mt-12 animate-fade-in">
                <Link to="/challenges">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    View All Challenges
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-secondary-50 text-secondary-600 rounded-full text-sm font-semibold mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get started in three simple steps and begin your transformation journey today</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-primary-200" style={{ width: 'calc(100% - 200px)', left: '100px' }} />

            <Card className="p-8 text-center relative bg-white hover:shadow-elevation-3 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg relative z-10">
                1
              </div>
              <div className="mb-4">
                <svg className="w-12 h-12 text-primary-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Choose a Challenge</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse our collection of fitness challenges and pick one that matches your goals and fitness level.
              </p>
            </Card>

            <Card className="p-8 text-center relative bg-white hover:shadow-elevation-3 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg relative z-10">
                2
              </div>
              <div className="mb-4">
                <svg className="w-12 h-12 text-secondary-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Your Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Log your daily activities, monitor your progress, and stay motivated with real-time updates.
              </p>
            </Card>

            <Card className="p-8 text-center relative bg-white hover:shadow-elevation-3 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg relative z-10">
                3
              </div>
              <div className="mb-4">
                <svg className="w-12 h-12 text-primary-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Achieve Your Goals</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete the challenge, earn badges, and celebrate your success with our community.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose GlycoGrit?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join a community that supports your fitness journey with powerful tools and motivation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            <div className="flex items-start space-x-4 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Structured Programs</h3>
                <p className="text-gray-600 leading-relaxed">Well-designed challenges with clear goals and timelines to keep you on track</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Supportive Community</h3>
                <p className="text-gray-600 leading-relaxed">Connect with like-minded individuals on the same journey toward better health</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600 leading-relaxed">Monitor your achievements with detailed analytics and visualize your growth</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Earn Rewards</h3>
                <p className="text-gray-600 leading-relaxed">Get badges and recognition for completing challenges and hitting milestones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container-custom text-center relative z-10">
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl md:text-2xl mb-10 text-blue-50 leading-relaxed">Join thousands of people transforming their lives through fitness and achieving their goals</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/challenges">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50 hover:shadow-glow-lg transition-all duration-300 text-lg px-8">
                  Get Started Now
                </Button>
              </Link>
              <Link to="#how-it-works">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-300 text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
