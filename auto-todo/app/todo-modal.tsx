import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { getTodo } from "@/lib/database";
import { useTodos } from "@/hooks/use-todos";
import { HabitNameInput } from "@/components/habit-name-input";
import { Colors, Typography } from "@/constants/theme";

export default function TodoModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const { addTodo, editTodo, removeTodo } = useTodos();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? "Edit Todo" : "New Todo" });
    if (isEditing && id) {
      getTodo(id).then((todo) => {
        if (todo) setTitle(todo.title);
      });
    }
  }, [isEditing, id, navigation]);

  async function handleSave() {
    const trimmed = title.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      if (isEditing && id) {
        await editTodo(id, trimmed);
      } else {
        await addTodo(trimmed);
      }
      router.back();
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!id) return;
    Alert.alert("Delete Todo", "This will permanently delete this todo.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeTodo(id);
          router.back();
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <HabitNameInput
          value={title}
          onChangeText={setTitle}
          placeholder="What do you need to do?"
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!title.trim() || saving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!title.trim() || saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? "Save changes" : "Add todo"}
            </Text>
          )}
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Delete todo</Text>
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
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: Colors.gray200,
  },
  saveButtonText: {
    ...(Typography.body as object),
    color: Colors.white,
    fontWeight: "600",
  },
  deleteButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  deleteButtonText: {
    ...(Typography.body as object),
    color: Colors.black,
    fontWeight: "500",
  },
});
