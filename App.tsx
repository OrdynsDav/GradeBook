import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from './src/entities/user';
import { LoginScreen } from './src/pages/login';
import { DashboardScreen } from './src/pages/dashboard';
import { GradesScreen } from './src/pages/grades';
import { SubjectDetailScreen } from './src/pages/subject-detail';
import { ScheduleScreen } from './src/pages/schedule';
import { ProfileScreen } from './src/pages/profile';
import { NotificationsScreen } from './src/pages/notifications';
import { colors } from './src/shared/config/theme';
import { AboutAppScreen } from '@pages/about-app';
import { HelpScreen } from '@pages/help';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const GradesStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

function GradesStackScreen() {
  return (
    <GradesStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary.main },
        headerTintColor: colors.primary.contrast,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <GradesStackNav.Screen name="GradesList" component={GradesScreen} options={{ title: 'Оценки' }} />
      <GradesStackNav.Screen
        name="SubjectDetail"
        component={SubjectDetailScreen}
        options={({ route }: any) => ({ title: route.params?.subjectName || 'Предмет' })}
      />
    </GradesStackNav.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary.main },
        headerTintColor: colors.primary.contrast,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Профиль' }} />
      <ProfileStackNav.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Уведомления' }} />
      <ProfileStackNav.Screen name="Help" component={HelpScreen} options={{ title: 'Помощь' }} />
      <ProfileStackNav.Screen name="AboutApp" component={AboutAppScreen} options={{ title: 'О приложении' }} />
    </ProfileStackNav.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Grades') iconName = focused ? 'school' : 'school-outline';
          else if (route.name === 'Schedule') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        headerStyle: { backgroundColor: colors.primary.main },
        headerTintColor: colors.primary.contrast,
        headerTitleStyle: { fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Главная' }} />
      <Tab.Screen name="Grades" component={GradesStackScreen} options={{ headerShown: false, title: 'Оценки' }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Расписание' }} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ headerShown: false, title: 'Профиль' }} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
