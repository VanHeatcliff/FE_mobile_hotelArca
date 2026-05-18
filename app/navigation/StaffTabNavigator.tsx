import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StaffDashboardScreen from '../screens/StaffDashboardScreen';
import StaffValidationScreen from '../screens/StaffValidationScreen';
import StaffChatReviewsScreen from '../screens/StaffChatReviewsScreen';
const Tab = createBottomTabNavigator();

export default function StaffTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Validate') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Chat/Reviews') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D9534F', // Terracotta accent
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F4F4F4',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={StaffDashboardScreen} />
      <Tab.Screen name="Validate" component={StaffValidationScreen} />
      <Tab.Screen name="Chat/Reviews" component={StaffChatReviewsScreen} />
    </Tab.Navigator>
  );
}
