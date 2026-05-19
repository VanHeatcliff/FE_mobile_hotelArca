# Hotel Arca Mobile Application
A mobile-based hotel reservation application built using **React Native** and **Expo**. This project is part of the integrated Hotel Arca System, designed to provide a seamless booking experience with smart recommendation features.

## 🚀 Tech Stack

- **Framework:** React Native (Expo SDK)
- **Language:** JavaScript / React
- **Logic & Recommendations:** Gemini API Integration
- **UI Architecture:** Component-based with Modular Navigation

## 📁 Project Structure

Proyek ini mengikuti arsitektur folder yang modular untuk mempermudah skalabilitas dan pemeliharaan kode:

```text
FE_Mobile_Hotel/
├── src/
│   ├── components/   # UI Komponen reusable (Button, Card, Input field)
│   ├── screens/      # Halaman utama aplikasi (Home, Booking, Detail, Profile)
│   ├── navigation/   # Konfigurasi Routing & Stack/Tab Navigation
│   ├── services/     # Integrasi API (Axios/Fetch) ke backend Laravel & Gemini
│   └── utils/        # Fungsi helper, format mata uang, & tema warna
├── assets            # Media (Gambar, Ikon, Custom Fonts)
├── App.js            # Entry point utama aplikasi
├── app.json          # Konfigurasi metadata Expo
└── package.json      # Daftar dependensi dan script proyek
```
## 🛠️ Getting Started

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di lingkungan pengembangan lokal:
1. Pastikan Anda telah menginstal Node.js dan aplikasi Expo Go di perangkat Android/iOS.
2. Jalankan perintah berikut di terminal: npm install
3. Gunakan perintah ini untuk memulai Metro Bundler: npx expo start / npm start
