import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/api/base44Client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signUp = (email, password) => supabase.auth.signUp({ email, password });
  const signOut = () => supabase.auth.signOut();

  // isAuthenticated / navigateToLogin は App.jsx の AuthProvider と互換性を持たせる
  const isAuthenticated = !!user;
  const isLoadingAuth = loading;
  const isLoadingPublicSettings = false;
  const authError = null;
  const navigateToLogin = () => { window.location.href = '/digital-planner/login'; };

  return (
    <AuthContext.Provider value={{
      user, loading,
      isAuthenticated, isLoadingAuth, isLoadingPublicSettings,
      authError, navigateToLogin,
      signIn, signUp, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
