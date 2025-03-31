import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { useState } from 'react';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export function PhoneInput({ value, onChangeText, error }: PhoneInputProps) {
  const [focused, setFocused] = useState(false);

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Ensure it starts with +49 for German numbers
    if (!text.startsWith('+49') && cleaned.length > 0) {
      return '+49' + cleaned;
    }
    
    return text;
  };

  const handleChangeText = (text: string) => {
    const formattedNumber = formatPhoneNumber(text);
    onChangeText(formattedNumber);
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        label="Telefonnummer"
        value={value}
        onChangeText={handleChangeText}
        keyboardType="phone-pad"
        placeholder="+49"
        error={!!error}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
        outlineStyle={styles.outline}
        contentStyle={styles.content}
        right={focused ? <TextInput.Icon icon="phone" /> : null}
      />
      {error && <HelperText type="error" style={styles.error}>{error}</HelperText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 56,
  },
  outline: {
    borderRadius: 12,
    borderColor: '#E5E5EA',
  },
  content: {
    fontSize: 16,
  },
  error: {
    color: '#FF3B30',
    marginTop: 4,
  }
}); 