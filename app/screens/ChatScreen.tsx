import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.headerName}>CS Hotel Arca</Text>
            <Text style={styles.onlineStatus}>Online</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="call-outline" size={24} color="#8B5E3C" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.chatArea}>
        <View style={styles.messageBubbleReceived}>
          <Text style={styles.messageTextReceived}>Halo! Ada yang bisa kami bantu mengenai reservasi Anda?</Text>
          <Text style={styles.timeText}>10:00 AM</Text>
        </View>
        
        <View style={styles.messageBubbleSent}>
          <Text style={styles.messageTextSent}>Halo, saya ingin bertanya apakah bisa request early check-in?</Text>
          <Text style={styles.timeTextSent}>10:05 AM</Text>
        </View>
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="camera-outline" size={24} color="#8B5E3C" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Ketik pesan..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  onlineStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  chatArea: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubbleReceived: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageTextReceived: {
    color: '#2C2C2C',
    fontSize: 15,
    lineHeight: 22,
  },
  messageBubbleSent: {
    backgroundColor: '#8B5E3C',
    padding: 14,
    borderRadius: 16,
    borderTopRightRadius: 4,
    maxWidth: '80%',
    alignSelf: 'flex-end',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageTextSent: {
    color: '#FFF',
    fontSize: 15,
    lineHeight: 22,
  },
  timeText: {
    fontSize: 11,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  timeTextSent: {
    fontSize: 11,
    color: '#E0D0C1',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#8B5E3C',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
