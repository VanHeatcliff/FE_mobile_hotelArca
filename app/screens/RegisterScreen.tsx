import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../context/RoleContext';
import { registerCustomer } from '../services/authService';
import { login } from '../services/authService';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation<any>();
  const { setAuth } = useRole();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua field tidak boleh kosong');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password dan Konfirmasi Password tidak cocok');
      return;
    }

    setLoading(true);
    try {
      // 1. Register customer
      await registerCustomer(name, email, password, phoneNumber);
      // 2. Auto-login after registration
      const data = await login(email, password, 'customer');
      setAuth(data.token, data.user);
    } catch (error: any) {
      Alert.alert('Registrasi Gagal', error.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/arca_logo.png')} 
              style={styles.logoImage} 
            />
            <Text style={styles.title}>Buat Akun Baru</Text>
            <Text style={styles.subtitle}>Bergabunglah dengan Hotel Arca</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama lengkap Anda"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan email Anda"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor Telepon (Opsional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 08123456789"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Buat password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Konfirmasi Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Ulangi password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
            </View>

            <TouchableOpacity style={[styles.registerButton, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.registerButtonText}>Daftar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
                <Text style={styles.loginLink}>Masuk di sini</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5E3C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#2C2C2C',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2C2C2C',
  },
  registerButton: {
    backgroundColor: '#8B5E3C',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#888',
    fontSize: 14,
  },
  loginLink: {
    color: '#8B5E3C',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
