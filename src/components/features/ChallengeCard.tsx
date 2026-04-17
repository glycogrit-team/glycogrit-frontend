import { Link } from 'react-router-dom';
import { Challenge } from '../../types/challenge';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import OptimizedImage from '../common/OptimizedImage';
import { ChallengeConfig, RouteConfig } from '../../lib/config';

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <Card hoverable className="overflow-hidden group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <OptimizedImage
          src={challenge.imageUrl}
          alt={challenge.title}
          className="h-full transition-transform duration-500 group-hover:scale-110"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4">
          <Badge variant={ChallengeConfig.getDifficultyColor(challenge.difficulty)} className="shadow-lg">
            {ChallengeConfig.getDifficultyDisplayName(challenge.difficulty)}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {ChallengeConfig.getCategoryDisplayName(challenge.category)}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
          {challenge.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {challenge.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{challenge.duration}</span>
          </span>
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium">{challenge.participants.toLocaleString()}</span>
          </span>
        </div>

        <Link to={RouteConfig.getChallengeDetailUrl(challenge.id)}>
          <Button fullWidth className="group-hover:shadow-lg transition-shadow duration-300">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
