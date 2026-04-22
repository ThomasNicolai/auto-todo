import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { getHabit } from '@/lib/database';
import { useHabits } from '@/hooks/use-habits';
import { HabitNameInput } from '@/components/habit-name-input';
import { Colors, Typography } from '@/constants/theme';

export default function HabitModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const habitId = id ? parseInt(id, 10) : null;
  const isEditing = habitId !== null;

  const { addHabit, editHabit, removeHabit } = useHabits();
  const [name, setName] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    if (isEditing && habitId !== null) {
      const habit = getHabit(habitId);
      if (habit) setName(habit.name);
    }
    navigation.setOptions({ title: isEditing ? 'Edit Habit' : 'New Habit' });
  }, [isEditing, habitId, navigation]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (isEditing && habitId !== null) {
      editHabit(habitId, trimmed);
    } else {
      addHabit(trimmed);
    }
    router.back();
  }

  function handleDelete() {
    if (habitId === null) return;
    Alert.alert('Delete Habit', 'This will permanently delete the habit and all its history.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeHabit(habitId);
          router.back();
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <HabitNameInput value={name} onChangeText={setName} />

        <TouchableOpacity
          style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!name.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>{isEditing ? 'Save changes' : 'Add habit'}</Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.7}>
            <Text style={styles.deleteButtonText}>Delete habit</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.white,
    gap: 24,
  },
  saveButton: {
    backgroundColor: Colors.black,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.gray200,
  },
  saveButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  deleteButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  deleteButtonText: {
    ...Typography.body,
    color: Colors.black,
    fontWeight: '500',
  },
});
