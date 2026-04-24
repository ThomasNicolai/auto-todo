import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "@/constants/theme";
import { CircularCheckbox } from "@/components/circular-checkbox";
import type { Todo } from "@/lib/database";

export interface TodoRowProps {
  todo: Todo;
  onToggle: () => void;
  onLongPress: () => void;
}

export function TodoRow({ todo, onToggle, onLongPress }: TodoRowProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <CircularCheckbox checked={todo.completed} onPress={onToggle} />
      <Text
        style={[styles.title, todo.completed && styles.titleCompleted]}
        numberOfLines={2}
      >
        {todo.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    backgroundColor: Colors.white,
    gap: 14,
  },
  title: {
    ...Typography.body,
    flex: 1,
  },
  titleCompleted: {
    color: Colors.gray500,
    textDecorationLine: "line-through",
  },
});
