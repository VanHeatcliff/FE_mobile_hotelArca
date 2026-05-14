import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';

export default function DevMenuScreen() {
  const { role, setRole } = useRole();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DEVELOPER MODE / ADMIN TOOL</Text>
        <Text style={styles.subtitle}>Manually Switch Active User Dashboard (Simulation)</Text>
      </View>

      <View style={styles.content}>

        {/* Customer Button */}
        <TouchableOpacity
          style={[styles.roleButton, role === 'customer' && styles.activeRoleButton]}
          onPress={() => setRole('customer')}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="person"
              size={32}
              color={role === 'customer' ? '#FFFFFF' : '#1A1A1A'}
            />
          </View>
          <View style={styles.roleTextContainer}>
            <Text style={[styles.roleTitle, role === 'customer' && styles.activeRoleText]}>
              Simulate Customer View
            </Text>
            <Text style={[styles.roleDesc, role === 'customer' && styles.activeRoleTextSecondary]}>
              View the app as a guest
            </Text>
          </View>
          {role === 'customer' && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Staff Button */}
        <TouchableOpacity
          style={[styles.roleButton, role === 'staff' && styles.activeRoleButton]}
          onPress={() => setRole('staff')}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="id-card"
              size={32}
              color={role === 'staff' ? '#FFFFFF' : '#1A1A1A'}
            />
          </View>
          <View style={styles.roleTextContainer}>
            <Text style={[styles.roleTitle, role === 'staff' && styles.activeRoleText]}>
              Simulate Staff View
            </Text>
            <Text style={[styles.roleDesc, role === 'staff' && styles.activeRoleTextSecondary]}>
              View the internal operational portal
            </Text>
          </View>
          {role === 'staff' && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Owner/Admin Button */}
        <TouchableOpacity
          style={[styles.roleButton, role === 'owner' && styles.activeRoleButton]}
          onPress={() => setRole('owner')}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="business"
              size={32}
              color={role === 'owner' ? '#FFFFFF' : '#1A1A1A'}
            />
          </View>
          <View style={styles.roleTextContainer}>
            <Text style={[styles.roleTitle, role === 'owner' && styles.activeRoleText]}>
              Simulate Owner View
            </Text>
            <Text style={[styles.roleDesc, role === 'owner' && styles.activeRoleTextSecondary]}>
              View the executive management dashboard
            </Text>
          </View>
          {role === 'owner' && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          )}
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D9534F',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    padding: 24,
    gap: 20,
    flex: 1,
    justifyContent: 'center',
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeRoleButton: {
    backgroundColor: '#1A1A1A',
  },
  iconContainer: {
    marginRight: 16,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 14,
    color: '#666666',
  },
  activeRoleText: {
    color: '#FFFFFF',
  },
  activeRoleTextSecondary: {
    color: '#A0A0A0',
  },
  activeBadge: {
    backgroundColor: '#5CB85C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
