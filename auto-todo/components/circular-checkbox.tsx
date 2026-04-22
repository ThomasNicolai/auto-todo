import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';

export interface CircularCheckboxProps {
  checked: boolean;
  onPress: () => void;
  size?: number;
}

export function CircularCheckbox({ checked, onPress, size = 28 }: CircularCheckboxProps) {
  const radius = size / 2;
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8} activeOpacity={0.7}>
      <View
        style={[
          styles.base,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: checked ? Colors.black : Colors.white,
            borderColor: Colors.black,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
  },
});
