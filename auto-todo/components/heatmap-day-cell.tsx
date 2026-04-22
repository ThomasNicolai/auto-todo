import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';

export type HeatmapDayCellState = 'completed' | 'missed' | 'future' | 'inactive';

export interface HeatmapDayCellProps {
  day: number | null;
  state: HeatmapDayCellState;
  size?: number;
}

export function HeatmapDayCell({ day, state, size = 32 }: HeatmapDayCellProps) {
  if (day === null || state === 'inactive') {
    return <View style={{ width: size, height: size }} />;
  }

  return (
    <View style={[styles.cell, cellStyles[state], { width: size, height: size, borderRadius: 6 }]}>
      <Text style={[styles.label, state === 'completed' && styles.labelCompleted]}>{day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.black,
  },
  labelCompleted: {
    color: Colors.white,
  },
});

const cellStyles = StyleSheet.create({
  completed: {
    backgroundColor: Colors.black,
  },
  missed: {
    borderWidth: 1,
    borderColor: Colors.black,
  },
  future: {
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  inactive: {},
});
