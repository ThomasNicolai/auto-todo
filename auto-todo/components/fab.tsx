import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';

export interface FABProps {
  onPress: () => void;
  size?: number;
}

export function FAB({ onPress, size = 56 }: FABProps) {
  const radius = size / 2;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, { width: size, height: size, borderRadius: radius }]}
    >
      <Text style={styles.icon}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
    marginTop: -2,
  },
});
