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
        tabBarActiveTintColor: '#8B5E3C',
        tabBarInactiveTintColor: '#B5A897',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0EBE3',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 62,
          elevation: 8,
          shadowColor: '#8B5E3C',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={StaffDashboardScreen} />
      <Tab.Screen name="Validate" component={StaffValidationScreen} />
      <Tab.Screen name="Chat/Reviews" component={StaffChatReviewsScreen} />
    </Tab.Navigator>
  );
}
