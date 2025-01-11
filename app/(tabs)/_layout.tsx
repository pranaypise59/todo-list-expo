import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define the type for the color prop
type TabBarIconProps = {
  color: string;
};

// Define the tabBarIcon components outside of the TabLayout component with explicit types
const HomeTabBarIcon: React.FC<TabBarIconProps> = ({ color }) => (
  <IconSymbol size={28} name="house.fill" color={color} />
);

const CompletedTabBarIcon: React.FC<TabBarIconProps> = ({ color }) => (
  <IconSymbol size={28} name="checkmark.circle.fill" color={color} />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: HomeTabBarIcon,
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: 'Completed',
          tabBarIcon: CompletedTabBarIcon,
        }}
      />
    </Tabs>
  );
}
