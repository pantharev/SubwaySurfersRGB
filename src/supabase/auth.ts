import { supabase, isSupabaseConfigured } from './client';
import type { Session, User } from '@supabase/supabase-js';

export async function signInWithGoogle(): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    console.error('Sign in error:', error.message);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error.message);
    throw error;
  }
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Get session error:', error.message);
    return null;
  }
  return data.session;
}

export async function getUser(): Promise<User | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Get user error:', error.message);
    return null;
  }
  return data.user;
}

export function onAuthStateChange(
  callback: (session: Session | null) => void
): (() => void) | undefined {
  if (!supabase) return undefined;

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session);
    }
  );

  return () => subscription.unsubscribe();
}

export { isSupabaseConfigured };
