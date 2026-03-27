import { colors } from "@shared/config";
import { Logo } from "@shared/ui/icons";
import { StyleSheet, ActivityIndicator, View, Text } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@shared/lib';

export const BeforeAuthLoad = () => {
    const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        styles.loadingScreen,
        { backgroundColor: theme.colors.primary.main },
      ]}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Logo width={130} height={130} />
        </View>
        <Text style={[styles.text, { color: theme.colors.primary.contrast }]}>
          Электронный журнал
        </Text>
      </View>
      <StatusBar style="light" />
      <ActivityIndicator size="large" color={theme.colors.primary.contrast} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  logo: {
    backgroundColor: colors.background.paper,
    borderRadius: 16,
    width: 160,
    height: 160,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  loadingScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 32,
    fontWeight: '600',
  },
});