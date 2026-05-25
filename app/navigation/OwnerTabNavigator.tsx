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
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#8C7B6B',
        tabBarStyle: {
          backgroundColor: '#FBF8F4',
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
        },
        headerStyle: {
          backgroundColor: '#FBF8F4',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#F0EBE3',
        },
        headerTintColor: '#3D2B1F',
        headerTitleStyle: {
          fontWeight: '700',
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
