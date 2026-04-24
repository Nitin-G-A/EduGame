import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  xp: number;
  level: number;
  streak_days: number;
  last_activity_date: string | null;
}

// XP needed to REACH a given level (level 1 = 0 XP, level 2 = 100 XP, etc.)
// So getLevelThreshold(2) = 100 means "you need 100 XP to be level 2"
const getLevelThreshold = (level: number): number => {
  if (level <= 1) return 0;
  return (level - 1) * 100;
};

// Given total XP, what level should the user be?
const calculateLevel = (xp: number): number => {
  // Level 1: 0–99 XP, Level 2: 100–199 XP, Level 3: 200–299 XP, etc.
  return Math.floor(xp / 100) + 1;
};

// XP needed to reach the NEXT level from current XP
const xpToNextLevel = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  return currentLevel * 100 - xp;
};

export const useGamification = () => {
  const { user, refreshProfile } = useAuth();

  const awardXP = async (amount: number, reason?: string): Promise<boolean> => {
    if (!user) {
      console.warn('awardXP called but no user is logged in');
      return false;
    }

    try {
      // Fetch current profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('xp, level, streak_days, last_activity_date')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentXP = profile?.xp ?? 0;
      const currentLevel = profile?.level ?? 1;
      const newXP = currentXP + amount;

      // Use formula-based level calc — no loop, no infinite risk
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > currentLevel;

      // Streak logic
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = profile?.last_activity_date;
      let newStreak = profile?.streak_days ?? 0;

      if (lastActivity) {
        const diffDays = Math.floor(
          (new Date(today).getTime() - new Date(lastActivity).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          newStreak += 1; // consecutive day
        } else if (diffDays > 1) {
          newStreak = 1; // missed days — reset
        }
        // diffDays === 0 means same day — no change
      } else {
        newStreak = 1; // first activity ever
      }

      // Persist to DB
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          xp: newXP,
          level: newLevel,
          streak_days: newStreak,
          last_activity_date: today,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh the profile in AuthContext so the UI updates immediately
      await refreshProfile();

      // Toast notifications
      if (reason) {
        toast.success(`+${amount} XP — ${reason}`);
      }

      if (leveledUp) {
        toast.success(`🎉 Level Up! You're now Level ${newLevel}!`, {
          duration: 5000,
        });
      }

      // Streak milestone toasts
      if (newStreak > 0 && newStreak % 7 === 0) {
        toast.success(`🔥 ${newStreak}-day streak! Keep it up!`, {
          duration: 4000,
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to award XP:', error);
      toast.error('Could not update XP. Please try again.');
      return false;
    }
  };

  const getUserStats = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('xp, level, streak_days, last_activity_date')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  };

  return { awardXP, getUserStats, getLevelThreshold, calculateLevel, xpToNextLevel };
};
