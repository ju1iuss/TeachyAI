import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 200,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          animation: 'none',
        }}
      />
      <Stack.Screen 
        name="goals" 
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="experience" 
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="interests" 
        options={{
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="setup" 
        options={{
          gestureDirection: 'horizontal',
        }}
      />
    </Stack>
  );
} 