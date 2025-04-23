import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, useWindowDimensions } from 'react-native';

// This hook extends the useSafeAreaInsets hook to include the tab bar height
export function useSafeInsets() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  
  // Calculate the tab bar height (includes inset + tab bar)
  const tabBarTotalHeight = Platform.OS === 'ios' ? 
    (insets.bottom + 100) : // iOS (increased to account for extended footer)
    80; // Android (increased for better padding)
  
  // Add extra bottom padding to avoid content being hidden by the footer
  const footerSafeBottom = tabBarTotalHeight + 25; // Extra padding for safety with the extended footer
  
  return {
    ...insets,
    footerSafeBottom, // Use this value for screens with the tab bar
  };
}