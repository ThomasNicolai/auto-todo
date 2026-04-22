import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef } from 'react';
import { getHabit } from '@/lib/database';
import { useCompletionsForHabit } from '@/hooks/use-completions';
import { MonthHeatmap } from '@/components/month-heatmap';
import { Colors, Typography } from '@/constants/theme';

type MonthEntry = { year: number; month: number };

function getMonthRange(createdAt: string): MonthEntry[] {
  const start = new Date(createdAt);
  const end = new Date();
  const months: MonthEntry[] = [];
  let y = start.getFullYear();
  let m = start.getMonth() + 1;
  while (y < end.getFullYear() || (y === end.getFullYear() && m <= end.getMonth() + 1)) {
    months.push({ year: y, month: m });
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return months;
}

function computeStreak(completionDates: Set<string>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (completionDates.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habitId = parseInt(id, 10);
  const habit = getHabit(habitId);
  const { completionDates } = useCompletionsForHabit(habitId);
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);

  const streak = computeStreak(completionDates);
  const total = completionDates.size;
  const months = habit ? getMonthRange(habit.created_at) : [];

  useEffect(() => {
    if (!habit) return;
    navigation.setOptions({
      title: habit.name,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/habit-modal', params: { id: habitId } })}
          hitSlop={8}
        >
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [habit, habitId, navigation]);

  if (!habit) {
    return (
      <View style={styles.center}>
        <Text style={Typography.caption}>Habit not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      onLayout={() => scrollRef.current?.scrollToEnd({ animated: false })}
    >
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>day streak</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>total days</Text>
        </View>
      </View>

      <View style={styles.heatmapSection}>
        {months.map(({ year, month }) => (
          <MonthHeatmap
            key={`${year}-${month}`}
            year={year}
            month={month}
            completionDates={completionDates}
            habitCreatedAt={habit.created_at}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  editButton: {
    ...Typography.body,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    marginBottom: 32,
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray200,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.black,
    lineHeight: 38,
  },
  statLabel: {
    ...Typography.caption,
  },
  heatmapSection: {
    gap: 0,
  },
});
