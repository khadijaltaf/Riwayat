# Riwayat - Heritage on a Plate 🍛

**Riwayat** is a premium home-cooked food delivery application designed to connect authentic home chefs with food lovers. The app features a stunning, high-end "Red & White" aesthetic and provides a seamless experience for both partners and customers.

## ✨ Features

### 📱 Dashboard & Interface
*   **Premium UI/UX:** A modern, clean design using a curated "Riwayat Red" (#600E10) and White palette.
*   **Dynamic Dashboard:**
    *   **Kitchen Status:** One-tap online/offline switch with gradient card styling.
    *   **Quick Actions:** 2x3 Grid layout for fast access to key features (Menu, Orders, Earnings, etc.).
    *   **Recent Updates:** Carousel view of the latest platform news.

### 💬 Advanced Chat System
*   **WhatsApp-Style Messaging:** Real-time feel with bubble UI.
*   **Rich Media:**
    *   📸 Image Sharing (Gallery/Camera).
    *   🎙️ Voice Notes (Recording & Playback with waveforms).
    *   📞 One-tap calling (In-app routing or System dialer).
*   **Smart Interactions:** Quick reply chips and status indicators.

### 📝 Partner Registration
*   **6-Step Flow:** Comprehensive onboarding including Personal Info, Kitchen Setup, Menu Creation, and Pricing.
*   **Validation:** Smart input masking for Phone numbers (`03XX-XXXXXXX`) and CNIC.
*   **Bypass Mode:** Dev features to test flows without backend dependencies.

## 🛠️ Tech Stack
*   **Framework:** React Native (Expo SDK 52)
*   **Routing:** Expo Router (File-based routing)
*   **Styling:** StyleSheet & Custom Design System (Popping Fonts)
*   **Icons:** Ionicons
*   **Audio/Media:** `expo-av`, `expo-image-picker`

## 🚀 Getting Started

### Prerequisites
*   Node.js & npm/yarn
*   Expo Go app on your phone

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/riwayat-app.git
    cd riwayat-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the app**
    ```bash
    npx expo start --tunnel
    ```

## 🔑 Test Credentials (Mock Auth)

Use these credentials to log in during development:

| Role | Phone | PIN |
|------|-------|-----|
| **Test Chef** | `03001122334` | `1234` |
| **Chef Ahmad** | `03330000000` | `1234` |

## 📦 Building for Android

To generate a release APK:

```bash
npx expo prebuild
cd android
./gradlew assembleRelease
```
The APK will be located in `android/app/build/outputs/apk/release/app-release.apk`.

---
*Built with ❤️ for Riwayat*
