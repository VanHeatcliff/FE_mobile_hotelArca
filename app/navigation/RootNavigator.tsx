import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import StaffTabNavigator from './StaffTabNavigator';
import OwnerTabNavigator from './OwnerTabNavigator';
import AuthScreen from '../screens/AuthScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RoomListScreen from '../screens/RoomListScreen';
import PaymentScreen from '../screens/PaymentScreen';
import TravelPlanScreen from '../screens/TravelPlanScreen';
import { useRole } from '../context/RoleContext';

const Stack = createNativeStackNavigator();

function CustomerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="RoomList" component={RoomListScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="TravelPlan" component={TravelPlanScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { role } = useRole();

  return (
    <NavigationContainer>
      {role === null ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : role === 'owner' ? (
        <OwnerTabNavigator />
      ) : role === 'staff' ? (
        <StaffTabNavigator />
      ) : (
        <CustomerStack />
      )}
    </NavigationContainer>
  );
}
