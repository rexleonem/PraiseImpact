import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  onboardingComplete: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    let unsubscribe: any;
    
    try {
      // Check onboarding status
      AsyncStorage.getItem('onboardingComplete').then(value => {
        if (value === 'true') {
          setOnboardingComplete(true);
        }
      }).catch(e => console.log('AsyncStorage error', e));

      // Listen for auth state changes
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }

      unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      }, (err) => {
        console.error('onAuthStateChanged error', err);
        setError(err.message);
        setLoading(false);
      });
    } catch (err: any) {
      console.error('AuthProvider initialization error', err);
      setError(err.message);
      setLoading(false);
    }

    // Fallback to stop loading after 8 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      setOnboardingComplete(true);
    } catch (e) {
      console.error('Error saving onboarding status', e);
    }
  };

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: '#ef4444', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Startup Error</Text>
        <Text style={{ color: '#94a3b8', textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, onboardingComplete, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
