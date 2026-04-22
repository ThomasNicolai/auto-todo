import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '@/constants/theme';
import { CircularCheckbox } from '@/components/circular-checkbox';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Habit } from '@/lib/database';

export interface HabitRowProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  onPress: () => void;
}

export function HabitRow({ habit, isCompleted, onToggle, onPress }: HabitRowProps) {
  return (
    <View style={styles.container}>
      <CircularCheckbox checked={isCompleted} onPress={onToggle} />
      <TouchableOpacity style={styles.labelArea} onPress={onPress} activeOpacity={0.6}>
        <Text
          style={[
            styles.name,
            isCompleted && styles.nameCompleted,
          ]}
          numberOfLines={1}
        >
          {habit.name}
        </Text>
        <IconSymbol name="chevron.right" size={16} color={Colors.gray200} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    backgroundColor: Colors.white,
    gap: 14,
  },
  labelArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...Typography.body,
    flex: 1,
    marginRight: 8,
  },
  nameCompleted: {
    color: Colors.gray500,
    textDecorationLine: 'line-through',
  },
});
