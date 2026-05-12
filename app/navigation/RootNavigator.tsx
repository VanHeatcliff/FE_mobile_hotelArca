import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import StaffTabNavigator from './StaffTabNavigator';
import { useRole } from '../context/RoleContext';

export default function RootNavigator() {
  const { role } = useRole();

  return (
    <NavigationContainer>
      {role === 'staff' ? <StaffTabNavigator /> : <TabNavigator />}
    </NavigationContainer>
  );
}
