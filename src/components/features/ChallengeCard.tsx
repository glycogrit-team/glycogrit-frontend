import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../lib/events-api';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { ChallengeConfig, RouteConfig } from '../../lib/config';
import { adminAPI } from '../../lib/admin-api';

interface ChallengeCardProps {
  event: Event;
  isAdmin?: boolean;
  onUpdate?: () => void;
}

export default function ChallengeCard({ event, isAdmin = false, onUpdate }: ChallengeCardProps) {
  const [loading, setLoading] = useState(false);

  const isPublished = event.status === 'published';

  const handleTogglePublish = async () => {
    if (!confirm(`${isPublished ? 'Unpublish' : 'Publish'} "${event.name}"?`)) return;
    setLoading(true);
    try {
      await adminAPI.togglePublish(event.id, isPublished);
      onUpdate?.();
    } catch (err) {
      alert(`Failed to ${isPublished ? 'unpublish' : 'publish'} event: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async () => {
    if (!confirm(`${event.is_featured ? 'Unfeature' : 'Feature'} "${event.name}"?`)) return;
    setLoading(true);
    try {
      await adminAPI.toggleFeatured(event.id, event.is_featured);
      onUpdate?.();
    } catch (err) {
      alert(`Failed to toggle featured: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${event.name}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await adminAPI.deleteEvent(event.id);
      onUpdate?.();
    } catch (err) {
      alert(`Failed to delete event: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date range
  const formatDateRange = () => {
    const start = new Date(event.start_date || event.event_date);
    const end = event.end_date ? new Date(event.end_date) : null;

    if (end && start.getTime() !== end.getTime()) {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} days`;
    }
    return '1 day';
  };

  return (
    <Card hoverable className="overflow-hidden relative">
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 bg-white/90 backdrop-blur rounded-lg p-1 shadow">
          <button
            onClick={handleTogglePublish}
            disabled={loading}
            className={`p-1.5 ${isPublished ? 'text-gray-600' : 'text-green-600'} hover:bg-blue-50 rounded transition disabled:opacity-50`}
            title={isPublished ? "Unpublish" : "Publish"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isPublished ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </>
              )}
            </svg>
          </button>
          <button
            onClick={handleToggleFeatured}
            disabled={loading}
            className={`p-1.5 ${event.is_featured ? 'text-yellow-600' : 'text-gray-400'} hover:bg-yellow-50 rounded transition disabled:opacity-50`}
            title={event.is_featured ? "Unfeature" : "Feature"}
          >
            <svg className="w-4 h-4" fill={event.is_featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      <div className="h-48 overflow-hidden bg-gray-200">
        <img
          src={event.banner_image_url || 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800'}
          alt={event.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          {event.difficulty_level && (
            <Badge variant={ChallengeConfig.getDifficultyColor(event.difficulty_level)}>
              {ChallengeConfig.getDifficultyDisplayName(event.difficulty_level)}
            </Badge>
          )}
          <span className="text-sm text-gray-500">
            {ChallengeConfig.getCategoryDisplayName(event.event_type)}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {event.name}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDateRange()}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {event.current_participants.toLocaleString()} / {event.max_participants?.toLocaleString() || '∞'}
          </span>
        </div>

        <Link to={RouteConfig.getChallengeDetailUrl(event.id.toString())}>
          <Button fullWidth>
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
