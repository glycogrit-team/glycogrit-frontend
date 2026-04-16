import { Challenge } from '../types/challenge';

/**
 * IMPORTANT: This file contains fallback/example data ONLY
 *
 * The application now fetches real data from the backend API (PostgreSQL database).
 * See: /app/api/events.py for backend endpoints
 * See: src/hooks/useChallenges.ts for frontend data fetching
 *
 * The database contains real events including:
 * - Bangalore Marathon 2026
 * - Mumbai 10K Run 2026
 * - Delhi Half Marathon 2026
 * - Chennai 5K Fun Run 2026
 * - Virtual India Run 2026
 * - 30-Day Running Challenge
 * - Cycling Distance Challenge 500km
 * - 10,000 Steps Daily Challenge
 * - Advanced Marathon Prep
 * - Strength & Cardio Fusion Challenge
 *
 * This hardcoded data is kept for:
 * 1. Reference/documentation purposes
 * 2. TypeScript type checking
 * 3. Fallback during development (if backend is down)
 *
 * DO NOT USE this data in production - always fetch from the API!
 */

export const challenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Running Challenge',
    description: 'Build a consistent running habit with daily runs for 30 days',
    longDescription: 'Join thousands of runners in this transformative 30-day journey. Whether you\'re a beginner or seasoned runner, this challenge will help you build consistency, improve your endurance, and achieve your fitness goals.',
    duration: '30 days',
    difficulty: 'beginner',
    category: 'running',
    participants: 1247,
    startDate: '2024-05-01',
    endDate: '2024-05-30',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    goals: [
      'Run at least 2km every day',
      'Track your progress daily',
      'Complete all 30 days',
    ],
    rules: [
      'Minimum 2km per run',
      'Rest days are allowed (max 3)',
      'Submit proof of activity',
    ],
    rewards: ['Digital badge', 'Certificate of completion', 'Feature on leaderboard'],
  },
  {
    id: '2',
    title: 'Cycling Distance Challenge',
    description: 'Ride 500km in 4 weeks and push your cycling limits',
    longDescription: 'Take your cycling to the next level with this intensive 500km challenge. Perfect for intermediate cyclists looking to improve their stamina and explore new routes.',
    duration: '4 weeks',
    difficulty: 'intermediate',
    category: 'cycling',
    participants: 892,
    startDate: '2024-05-01',
    endDate: '2024-05-28',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800',
    goals: [
      'Complete 500km total distance',
      'Ride at least 4 times per week',
      'Improve average speed',
    ],
    rules: [
      'All rides must be tracked via GPS',
      'Minimum 10km per ride',
      'Indoor cycling counts',
    ],
    rewards: ['Premium digital badge', 'Exclusive merchandise discount', 'Monthly winner recognition'],
  },
  {
    id: '3',
    title: '10,000 Steps Daily',
    description: 'Walk your way to better health with 10,000 steps every day',
    longDescription: 'The simplest yet most effective challenge. Walk 10,000 steps daily for 21 days and experience improved energy, better sleep, and enhanced overall wellness.',
    duration: '21 days',
    difficulty: 'beginner',
    category: 'walking',
    participants: 2156,
    startDate: '2024-05-05',
    endDate: '2024-05-25',
    imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800',
    goals: [
      'Achieve 10,000 steps daily',
      'Maintain consistency',
      'Explore new walking routes',
    ],
    rules: [
      'Steps must be tracked via fitness device',
      'Walking throughout the day counts',
      'Max 2 days below 10,000 steps',
    ],
    rewards: ['Wellness badge', 'Walking tips guide', 'Community recognition'],
  },
  {
    id: '4',
    title: 'Advanced Marathon Prep',
    description: 'Intensive 12-week marathon preparation program',
    longDescription: 'Prepare for your marathon with this comprehensive 12-week training program. Includes structured workouts, nutrition guidance, and expert support.',
    duration: '12 weeks',
    difficulty: 'advanced',
    category: 'running',
    participants: 456,
    startDate: '2024-05-01',
    endDate: '2024-07-24',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    goals: [
      'Build to 42km long run',
      'Follow structured training plan',
      'Complete speed work sessions',
    ],
    rules: [
      'Must complete 80% of scheduled runs',
      'Submit weekly progress reports',
      'Follow provided training schedule',
    ],
    rewards: ['Marathon finisher badge', 'Training completion certificate', 'Race day tips guide'],
  },
  {
    id: '5',
    title: 'Strength & Cardio Fusion',
    description: 'Balanced mix of strength training and cardio workouts',
    longDescription: 'Get the best of both worlds with this mixed challenge combining strength training and cardiovascular exercise for complete fitness.',
    duration: '6 weeks',
    difficulty: 'intermediate',
    category: 'mixed',
    participants: 1089,
    startDate: '2024-05-10',
    endDate: '2024-06-21',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    goals: [
      'Complete 3 strength sessions per week',
      'Complete 3 cardio sessions per week',
      'Improve overall fitness',
    ],
    rules: [
      'Minimum 30 minutes per session',
      'Track all workouts',
      'Rest days required between strength sessions',
    ],
    rewards: ['Fusion fitness badge', 'Workout plan guide', 'Nutrition tips'],
  },
  {
    id: '6',
    title: 'Beginner Cycling Journey',
    description: 'Start your cycling adventure with this beginner-friendly challenge',
    longDescription: 'New to cycling? This challenge is perfect for you! Learn the basics, build confidence, and discover the joy of cycling over 4 weeks.',
    duration: '4 weeks',
    difficulty: 'beginner',
    category: 'cycling',
    participants: 1534,
    startDate: '2024-05-15',
    endDate: '2024-06-12',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
    goals: [
      'Ride 3 times per week',
      'Build to 15km rides',
      'Learn basic cycling skills',
    ],
    rules: [
      'Start with comfortable distances',
      'Safety equipment required',
      'Track progress weekly',
    ],
    rewards: ['Beginner cyclist badge', 'Cycling safety guide', 'Community support access'],
  },
];
