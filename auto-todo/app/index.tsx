import { FlatList, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDate } from "@/hooks/use-completions";
import { HabitRow } from "@/components/habit-row";
import { FAB } from "@/components/fab";
import { Colors, Typography } from "@/constants/theme";
import { initDb, type Habit } from "@/lib/database";

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export default function TodayScreen() {
  initDb();
  const today = todayISO();
  const { habits, refresh: refreshHabits } = useHabits();
  const {
    completions,
    toggle,
    refresh: refreshCompletions,
  } = useCompletionsForDate(today);

  useFocusEffect(
    useCallback(() => {
      refreshHabits();
      refreshCompletions();
    }, [refreshHabits, refreshCompletions]),
  );

  const completedIds = new Set(completions.map((c) => c.habit_id));

  function renderHabit({ item }: { item: Habit }) {
    return (
      <HabitRow
        habit={item}
        isCompleted={completedIds.has(item.id)}
        onToggle={() => toggle(item.id)}
        onPress={() =>
          router.push({ pathname: "/habit/[id]", params: { id: item.id } })
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap + to add your first habit
            </Text>
          </View>
        ) : (
          <FlatList
            data={habits}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderHabit}
            contentContainerStyle={styles.list}
          />
        )}
        <FAB onPress={() => router.push({ pathname: "/habit-modal" })} />
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
