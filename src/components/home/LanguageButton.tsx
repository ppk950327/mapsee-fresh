import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme';

type LanguageButtonProps = {
  language?: string;
  onPress?: () => void;
};

export default function LanguageButton({
  language = 'EN',
  onPress,
}: LanguageButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons
        name="globe-outline"
        size={18}
        color={colors.textDark}
      />

      <Text style={styles.text}>{language}</Text>

      <Ionicons
        name="chevron-down"
        size={12}
        color={colors.textDark}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.creamBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  text: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});