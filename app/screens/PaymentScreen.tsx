import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function PaymentScreen() {
  const navigation = useNavigation<any>();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    if (!imageUri) {
      Alert.alert('Error', 'Silakan pilih foto bukti pembayaran terlebih dahulu.');
      return;
    }

    // In a real app, this would upload the image to a server
    Alert.alert(
      'Berhasil',
      'Bukti pembayaran berhasil diunggah. Menunggu verifikasi staf.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3D2B1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Instruksi Pembayaran</Text>
          <Text style={styles.infoText}>Silakan transfer ke rekening berikut:</Text>

          <View style={styles.bankContainer}>
            <View style={styles.bankInfo}>
              <Text style={styles.bankName}>BCA</Text>
              <Text style={styles.bankAccount}>1234 5678 9012</Text>
              <Text style={styles.bankAccountName}>a.n. Hotel Arca</Text>
            </View>
            <Ionicons name="copy-outline" size={24} color="#8B5E3C" />
          </View>

          <Text style={styles.amountText}>Total Pembayaran: Rp 2.450.000</Text>
        </View>

        <Text style={styles.uploadLabel}>Upload Bukti Pembayaran</Text>
        <TouchableOpacity style={styles.uploadContainer} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="cloud-upload-outline" size={48} color="#8B5E3C" />
              <Text style={styles.uploadPlaceholderText}>Ketuk untuk memilih foto</Text>
            </View>
          )}
        </TouchableOpacity>

        {imageUri && (
          <TouchableOpacity style={styles.reselectButton} onPress={pickImage}>
            <Text style={styles.reselectText}>Pilih Foto Lain</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !imageUri && styles.submitButtonDisabled]}
          onPress={handleUpload}
          disabled={!imageUri}
        >
          <Text style={styles.submitButtonText}>Kirim Pembayaran</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAF8F5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D2B1F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  content: {
    padding: 24,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D2B1F',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  bankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3D2B1F',
    marginBottom: 4,
  },
  bankAccount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5E3C',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bankAccountName: {
    fontSize: 14,
    color: '#888',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 8,
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3D2B1F',
    marginBottom: 12,
  },
  uploadContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadPlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#888',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  reselectButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  reselectText: {
    color: '#8B5E3C',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  submitButton: {
    backgroundColor: '#8B5E3C',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1C4B7',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
