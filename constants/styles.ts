import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    elevation: 0,
    shadowOpacity: 0,
  },
  button: {
    borderRadius: 25,
    marginVertical: 8,
    height: 56,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    height: 56,
    marginBottom: 16,
  },
}); 