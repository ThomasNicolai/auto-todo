import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Colors, Typography } from '@/constants/theme';
import { HeatmapDayCell, type HeatmapDayCellState } from '@/components/heatmap-day-cell';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface MonthHeatmapProps {
  year: number;
  month: number;
  completionDates: Set<string>;
  habitCreatedAt: string;
}

type Cell = { day: number | null; state: HeatmapDayCellState };

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function MonthHeatmap({ year, month, completionDates, habitCreatedAt }: MonthHeatmapProps) {
  const { width } = useWindowDimensions();
  const HORIZONTAL_PADDING = 40;
  const cellSize = Math.floor((width - HORIZONTAL_PADDING) / 7);

  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = firstDayOfMonth.getDay();

  const cells: Cell[] = [];

  for (let i = 0; i < startWeekday; i++) {
    cells.push({ day: null, state: 'inactive' });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${pad(month)}-${pad(day)}`;
    let state: HeatmapDayCellState;

    if (dateStr < habitCreatedAt) {
      state = 'inactive';
    } else if (dateStr > today) {
      state = 'future';
    } else if (completionDates.has(dateStr)) {
      state = 'completed';
    } else {
      state = 'missed';
    }

    cells.push({ day, state });
  }

  const rows = chunkArray(cells, 7);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {MONTH_NAMES[month - 1]} {year}
      </Text>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((wd) => (
          <View key={wd} style={{ width: cellSize, alignItems: 'center' }}>
            <Text style={styles.weekday}>{wd}</Text>
          </View>
        ))}
      </View>

      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => (
            <View key={cellIndex} style={{ width: cellSize, alignItems: 'center', paddingVertical: 2 }}>
              <HeatmapDayCell day={cell.day} state={cell.state} size={cellSize - 6} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    ...Typography.heading,
    marginBottom: 12,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekday: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray500,
  },
  row: {
    flexDirection: 'row',
  },
});
