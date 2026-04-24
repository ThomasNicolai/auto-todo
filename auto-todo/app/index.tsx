import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTodos } from "@/hooks/use-todos";
import { TodoRow } from "@/components/todo-row";
import { FAB } from "@/components/fab";
import { Colors, Typography } from "@/constants/theme";
import type { Todo } from "@/lib/database";

export default function TodoScreen() {
  const { todos, loading, toggleTodoItem, refresh } = useTodos();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  function renderTodo({ item }: { item: Todo }) {
    return (
      <TodoRow
        todo={item}
        onToggle={() => toggleTodoItem(item.id, !item.completed)}
        onLongPress={() =>
          router.push({ pathname: "/todo-modal", params: { id: item.id } })
        }
      />
    );
  }

  if (loading && todos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.black} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        {todos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No todos yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap + to add your first todo
            </Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={renderTodo}
            contentContainerStyle={styles.list}
          />
        )}
        <FAB onPress={() => router.push({ pathname: "/todo-modal" })} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  list: {
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    ...Typography.heading,
  },
  emptySubtitle: {
    ...Typography.caption,
  },
});
