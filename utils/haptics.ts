import * as Haptics from 'expo-haptics';

export const haptics = {
  // Light feedback for small interactions
  light: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently fail if haptics are not available
      console.log('Haptics not available:', error);
    }
  },

  // Medium feedback for more significant interactions
  medium: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  // Heavy feedback for major interactions
  heavy: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  // Success feedback
  success: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log('Haptics not supported');
    }
  },

  // Warning feedback
  warning: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.log('Haptics not supported');
    }
  },

  // Error feedback
  error: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.log('Haptics not supported');
    }
  },

  // Selection feedback
  selection: async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },
}; 