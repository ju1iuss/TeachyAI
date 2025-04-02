import { createContext, useContext, useState, ReactNode } from 'react';

type OnboardingData = {
  herausforderungen: string | null;
  job: string | null;
  subjects: string;
};

type OnboardingContextType = {
  data: OnboardingData;
  setHerausforderungen: (value: string) => void;
  setJob: (value: string) => void;
  setSubjects: (value: string) => void;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>({
    herausforderungen: null,
    job: null,
    subjects: '',
  });

  const setHerausforderungen = (value: string) => {
    setData(prev => ({ ...prev, herausforderungen: value }));
  };

  const setJob = (value: string) => {
    setData(prev => ({ ...prev, job: value }));
  };

  const setSubjects = (value: string) => {
    setData(prev => ({ ...prev, subjects: value }));
  };

  const reset = () => {
    setData({
      herausforderungen: null,
      job: null,
      subjects: '',
    });
  };

  return (
    <OnboardingContext.Provider value={{ data, setHerausforderungen, setJob, setSubjects, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
} 