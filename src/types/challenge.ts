export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ChallengeCategory = 'running' | 'cycling' | 'walking' | 'mixed' | 'strength';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  difficulty: DifficultyLevel;
  category: ChallengeCategory;
  participants: number;
  startDate: string;
  endDate: string;
  imageUrl: string;
  goals: string[];
  rules: string[];
  rewards?: string[];
}
