import { StyleSheet, TextInput } from 'react-native';
import { Colors } from '@/constants/theme';

export interface HabitNameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function HabitNameInput({
  value,
  onChangeText,
  placeholder = 'Habit name',
  autoFocus = true,
}: HabitNameInputProps) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.gray500}
      autoFocus={autoFocus}
      returnKeyType="done"
      blurOnSubmit
      autoCapitalize="sentences"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.black,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.black,
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
});
