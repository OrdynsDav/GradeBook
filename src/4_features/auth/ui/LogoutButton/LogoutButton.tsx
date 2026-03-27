import { useAuthStore } from "@entities/user";
import { spacing, Theme, withAlpha } from "@shared/index";
import { Button } from "@shared/ui";
import { StyleSheet } from "react-native";

export const LogoutButton = ({isDark, theme}: {isDark: boolean, theme: Theme}) => {
  const logout = useAuthStore((s) => s.logout);
  const accentColor = isDark
    ? theme.colors.primary.light
    : theme.colors.primary.main;

  return (
    <Button
      title="Выйти из аккаунта"
      onPress={logout}
      variant="outline"
      fullWidth
      style={{
        ...styles.logoutButton,
        borderColor: accentColor,
        backgroundColor: withAlpha(accentColor, isDark ? "14" : "08"),
      }}
      textStyle={{ color: accentColor }}
    />
  );
};
const styles = StyleSheet.create({
  logoutButton: {
    marginBottom: spacing.lg,
  },
});