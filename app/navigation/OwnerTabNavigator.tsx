import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import OwnerDashboardScreen from '../screens/OwnerDashboardScreen';
import OwnerRoomManagementScreen from '../screens/OwnerRoomManagementScreen';
import OwnerBookingHistoryScreen from '../screens/OwnerBookingHistoryScreen';
import OwnerReputationScreen from '../screens/OwnerReputationScreen';
import { useRole } from '../context/RoleContext';

const Tab = createBottomTabNavigator();

export default function OwnerTabNavigator() {
  const { logout } = useRole();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home-outline';
          if (route.name === 'Dashboard') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'Pricing') iconName = focused ? 'pricetag' : 'pricetag-outline';
          else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Reviews') iconName = focused ? 'star' : 'star-outline';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#d4af37', // Gold
        tabBarInactiveTintColor: '#aaaaaa',
        tabBarStyle: {
          backgroundColor: '#222222', // Dark Charcoal
          borderTopColor: '#333333',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#222222',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
            <Ionicons name="log-out-outline" size={24} color="#d4af37" />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={OwnerDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Pricing"
        component={OwnerRoomManagementScreen}
        options={{ title: 'Pricing' }}
      />
      <Tab.Screen
        name="History"
        component={OwnerBookingHistoryScreen}
        options={{ title: 'History' }}
      />
      <Tab.Screen
        name="Reviews"
        component={OwnerReputationScreen}
        options={{ title: 'Reviews' }}
      />
    </Tab.Navigator>
  );
}
