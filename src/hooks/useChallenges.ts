/**
 * Custom hook for managing challenges data
 */

import { useState, useEffect } from 'react';
import { Challenge } from '../types/challenge';
import { apiClient } from '../lib/api-client';
import { APIError, getUserFriendlyMessage, logError } from '../lib/errors';

interface UseChallengesOptions {
  category?: string;
  difficulty?: string;
  autoFetch?: boolean;
}

interface UseChallengesReturn {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage challenges list
 */
export function useChallenges(options: UseChallengesOptions = {}): UseChallengesReturn {
  const { category, difficulty, autoFetch = true } = options;
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.getChallenges({
        category,
        difficulty,
      });
      setChallenges(data);
    } catch (err) {
      const errorMessage = getUserFriendlyMessage(err);
      setError(errorMessage);
      logError(err, { category, difficulty });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchChallenges();
    }
  }, [category, difficulty, autoFetch]);

  return {
    challenges,
    loading,
    error,
    refetch: fetchChallenges,
  };
}

interface UseChallengeReturn {
  challenge: Challenge | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch a single challenge by ID
 */
export function useChallenge(id: string | undefined): UseChallengeReturn {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenge = async () => {
    if (!id) {
      setError('Challenge ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.getChallengeById(id);
      setChallenge(data);
    } catch (err) {
      const errorMessage = getUserFriendlyMessage(err);
      setError(errorMessage);
      logError(err, { challengeId: id });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  return {
    challenge,
    loading,
    error,
    refetch: fetchChallenge,
  };
}

interface UseChallengeActionsReturn {
  joining: boolean;
  leaving: boolean;
  joinError: string | null;
  leaveError: string | null;
  joinChallenge: (challengeId: string, userId: string) => Promise<boolean>;
  leaveChallenge: (challengeId: string, userId: string) => Promise<boolean>;
}

/**
 * Hook for challenge actions (join, leave)
 */
export function useChallengeActions(): UseChallengeActionsReturn {
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  const joinChallenge = async (challengeId: string, userId: string): Promise<boolean> => {
    setJoining(true);
    setJoinError(null);

    try {
      await apiClient.joinChallenge(challengeId, userId);
      return true;
    } catch (err) {
      const errorMessage = getUserFriendlyMessage(err);
      setJoinError(errorMessage);
      logError(err, { challengeId, userId, action: 'join' });
      return false;
    } finally {
      setJoining(false);
    }
  };

  const leaveChallenge = async (challengeId: string, userId: string): Promise<boolean> => {
    setLeaving(true);
    setLeaveError(null);

    try {
      await apiClient.leaveChallenge(challengeId, userId);
      return true;
    } catch (err) {
      const errorMessage = getUserFriendlyMessage(err);
      setLeaveError(errorMessage);
      logError(err, { challengeId, userId, action: 'leave' });
      return false;
    } finally {
      setLeaving(false);
    }
  };

  return {
    joining,
    leaving,
    joinError,
    leaveError,
    joinChallenge,
    leaveChallenge,
  };
}
