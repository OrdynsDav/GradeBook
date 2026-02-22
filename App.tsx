import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@entities/user';
import { LoginScreen } from '@pages/login';
import { DashboardScreen } from '@pages/dashboard';
import { GradesScreen } from '@pages/grades';
import { SubjectDetailScreen } from '@pages/subject-detail';
import { ScheduleScreen } from '@pages/schedule';
import { ProfileScreen } from '@pages/profile';
import { NotificationsScreen } from '@pages/notifications';
import { SettingsScreen } from '@pages/settings';
import type { ThemeColors } from '@shared/config/theme';
import { AppThemeProvider } from '@app/providers/AppThemeProvider';
import { useTheme } from '@shared/lib';
import { Header } from '@shared/ui';
import { AboutAppScreen } from '@pages/about-app';
import { HelpScreen } from '@pages/help';

const screenHeader = ({
  navigation,
  options,
  route,
}: {
  navigation: {
    getState: () => { routes: { name: string }[] };
    goBack: () => void;
    setOptions?: (options: { animation?: 'fade'; animationDuration?: number }) => void;
  };
  options: { title?: string };
  route: { name: string };
}) => {
  const state = navigation.getState();
  const rootRouteName = state.routes[0]?.name;
  const isSubScreen = rootRouteName != null && route.name !== rootRouteName;
  const handleBackPress = () => {
    if (isSubScreen && navigation.setOptions) {
      navigation.setOptions({ animation: 'fade', animationDuration: 380 });
    }
    navigation.goBack();
  };
  return (
    <Header
      title={options.title ?? ''}
      showBackButton={isSubScreen}
      onBackPress={handleBackPress}
    />
  );
};

const tabScreenHeader = ({ options }: { options: { title?: string } }) => (
  <Header title={options.title ?? ''} />
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const GradesStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

const nestedStackScreenOptions = {
  header: screenHeader,
  headerShadowVisible: false,
};

const subSectionScreenOptions = {
  presentation: 'transparentModal' as const,
  animation: 'ios_from_right' as const,
  gestureEnabled: true,
};

function GradesStackScreen() {
  return (
    <GradesStackNav.Navigator screenOptions={nestedStackScreenOptions}>
      <GradesStackNav.Screen name="GradesList" component={GradesScreen} options={{ title: 'Оценки' }} />
      <GradesStackNav.Screen
        name="SubjectDetail"
        component={SubjectDetailScreen}
        options={({ route }: any) => ({
          title: route.params?.subjectName || 'Предмет',
          ...subSectionScreenOptions,
        })}
      />
    </GradesStackNav.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStackNav.Navigator screenOptions={nestedStackScreenOptions}>
      <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Профиль' }} />
      <ProfileStackNav.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Уведомления', ...subSectionScreenOptions }}
      />
      <ProfileStackNav.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Настройки', ...subSectionScreenOptions }}
      />
      <ProfileStackNav.Screen
        name="Help"
        component={HelpScreen}
        options={{ title: 'Помощь', ...subSectionScreenOptions }}
      />
      <ProfileStackNav.Screen
        name="AboutApp"
        component={AboutAppScreen}
        options={{ title: 'О приложении', ...subSectionScreenOptions }}
      />
    </ProfileStackNav.Navigator>
  );
}

const TAB_ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  Dashboard: { on: 'home', off: 'home-outline' },
  Grades: { on: 'school', off: 'school-outline' },
  Schedule: { on: 'calendar', off: 'calendar-outline' },
  Profile: { on: 'person', off: 'person-outline' },
};

const buildNavigationTheme = (isDark: boolean, colors: ThemeColors): NavigationTheme => {
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary.main,
      background: colors.background.default,
      card: colors.background.paper,
      text: colors.text.primary,
      border: colors.border.light,
      notification: colors.status.info,
    },
  };
};

function MainTabs() {
  const { theme } = useTheme();

  const screenOptions = useCallback(
    ({ route }: { route: { name: string } }) => ({
      tabBarActiveTintColor: theme.colors.primary.main,
      tabBarInactiveTintColor: theme.colors.text.secondary,
      tabBarStyle: {
        backgroundColor: theme.colors.background.paper,
        borderTopColor: theme.colors.border.light,
      },
      header: tabScreenHeader,
      headerShadowVisible: false,
      animation: 'none' as const,
      sceneStyle: { backgroundColor: theme.colors.background.default },
      lazy: false,
      freezeOnBlur: false,
      tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
        const icons = TAB_ICONS[route.name] ?? TAB_ICONS.Dashboard;
        return <Ionicons name={focused ? icons.on : icons.off} size={size} color={color} />;
      },
    }),
    [theme]
  );
  return (
    <Tab.Navigator screenOptions={screenOptions} detachInactiveScreens={false}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Главная' }} />
      <Tab.Screen name="Grades" component={GradesStackScreen} options={{ headerShown: false, title: 'Оценки' }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Расписание' }} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ headerShown: false, title: 'Профиль' }} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' as const }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { theme, isDark } = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const didInit = useRef(false);
  const navigationTheme = useMemo(
    () => buildNavigationTheme(isDark, theme.colors),
    [isDark, theme.colors]
  );

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingScreen,
          { backgroundColor: theme.colors.primary.main },
        ]}
      >
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={theme.colors.primary.contrast} />
        <Text style={[styles.loadingText, { color: theme.colors.primary.contrast }]}>ПКТ</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' as const }}>
            {isAuthenticated ? (
              <Stack.Screen name="Main" component={MainTabs} />
            ) : (
              <Stack.Screen name="Auth" component={AuthStack} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </View>
  );
}

export default function App() {
  return (
    <AppThemeProvider>
      <AppContent />
    </AppThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
  },
});
