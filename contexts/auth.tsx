import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { errorLogger } from '../app/utils/errorLogger';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: {
      user: User | null;
      session: Session | null;
    } | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: {
      user: User | null;
      session: Session | null;
    } | null;
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Get initial session with error handling
      const getInitialSession = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            errorLogger.logError(error, { context: 'Auth: Initial Session Load' });
          }
          
          setSession(data?.session ?? null);
          setUser(data?.session?.user ?? null);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          errorLogger.logError(error, { context: 'Auth: Initial Session Exception' });
        } finally {
          setLoading(false);
        }
      };
      
      getInitialSession();

      // Listen for auth changes with error handling
      let subscription;
      try {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          try {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          } catch (err) {
            errorLogger.logError(err instanceof Error ? err : new Error(String(err)), 
              { context: 'Auth: State Change Handler' });
          }
        });
        subscription = data.subscription;
      } catch (err) {
        errorLogger.logError(err instanceof Error ? err : new Error(String(err)), 
          { context: 'Auth: Subscription Setup' });
      }

      return () => {
        if (subscription) {
          try {
            subscription.unsubscribe();
          } catch (err) {
            console.warn('Error unsubscribing from auth:', err);
          }
        }
      };
    } catch (err) {
      // Catch-all error handler for auth initialization
      errorLogger.logError(err instanceof Error ? err : new Error(String(err)), 
        { context: 'Auth: Effect Setup' });
      setLoading(false);
    }
  }, []);

  // Wrap auth methods with error handling
  const signUp = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (result.error) {
        errorLogger.logError(result.error, { context: 'Auth: Sign Up' });
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      errorLogger.logError(error, { context: 'Auth: Sign Up Exception' });
      return { data: { user: null, session: null }, error };
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (result.error) {
        errorLogger.logError(result.error, { context: 'Auth: Sign In' });
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      errorLogger.logError(error, { context: 'Auth: Sign In Exception' });
      return { data: { user: null, session: null }, error };
    }
  };
  
  const signOut = async () => {
    try {
      const result = await supabase.auth.signOut();
      
      if (result.error) {
        errorLogger.logError(result.error, { context: 'Auth: Sign Out' });
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      errorLogger.logError(error, { context: 'Auth: Sign Out Exception' });
      return { error };
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 