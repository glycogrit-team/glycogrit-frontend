import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import { challenges } from '../constants/challenges';

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const challenge = challenges.find((c) => c.id === id);

  if (!challenge) {
    return <Navigate to="/challenges" replace />;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={challenge.imageUrl}
          alt={challenge.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom pb-12">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
              <span className="text-white capitalize bg-black/30 px-3 py-1 rounded-full text-sm">
                {challenge.category}
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">{challenge.title}</h1>
            <p className="text-xl text-gray-200 max-w-2xl">{challenge.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-1">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Challenge</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{challenge.longDescription}</p>
              </Card>

              {/* Goals */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Challenge Goals</h2>
                <ul className="space-y-3">
                  {challenge.goals.map((goal, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-700">{goal}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Rules */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Rules & Requirements</h2>
                <ul className="space-y-3">
                  {challenge.rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Rewards */}
              {challenge.rewards && challenge.rewards.length > 0 && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Rewards & Recognition</h2>
                  <ul className="space-y-3">
                    {challenge.rewards.map((reward, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                          />
                        </svg>
                        <span className="text-gray-700">{reward}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Join Card */}
              <Card className="p-6 sticky top-24">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold text-gray-900">{challenge.duration}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Participants</span>
                      <span className="font-semibold text-gray-900">
                        {challenge.participants.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Start Date</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(challenge.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">End Date</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(challenge.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <Button fullWidth size="lg" className="mb-3">
                      Join Challenge
                    </Button>
                    <Button fullWidth size="lg" variant="outline">
                      Share with Friends
                    </Button>
                  </div>

                  <div className="bg-primary-50 rounded-lg p-4 text-sm text-primary-900">
                    <svg
                      className="w-5 h-5 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    You can start anytime! The challenge duration begins when you join.
                  </div>
                </div>
              </Card>

              {/* Back Link */}
              <Link
                to="/challenges"
                className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to all challenges
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
