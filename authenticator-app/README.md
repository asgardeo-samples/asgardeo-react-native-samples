<div align="center">
  <img src="./assets/images/logo.png" alt="Asgardeo Logo" width="100" align="center"/>
  
  <h1 align="center">Asgardeo React Native Authenticator App</h1>
  
  <p align="center">
    <strong>Secure, Modern, and User-Friendly Authentication</strong>
  </p>
  
  <p align="center">
    A comprehensive React Native authenticator application built with Asgardeo Identity and Access Management platform. 
    Experience seamless multi-factor authentication, TOTP generation, and push notifications in a beautifully crafted mobile interface.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native"/>
    <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"/>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Asgardeo-FF6B35?style=for-the-badge" alt="Asgardeo"/>
  </p>

  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>

---

## ✨ Features

🔐 **Core Authentication Features**
- **Easy Account Setup** - Seamless account registration using in-app QR scanner
- **TOTP Code Generation** - Real-time TOTP generation with next token and expiry time indicator
- **Multi-State Push Notifications** - Push notification delivery across background, foreground, and app quit states
- **Number Challenge Support** - Advanced push authentication with number challenge prompts
- **Push Login History** - Complete tracking and history of all push authentication activities
- **Push Device Unregistration** - Secure device removal and deregistration capabilities

🔒 **Security Features**
- **Secure Secret Storage** - All secrets and private keys stored securely in iOS Keychain and Android Keystore
- **Device Local Authentication** - Biometric and device authentication for app access control
- **Push Authentication Controls** - Secure push approval and denial mechanisms
- **Account Deletion** - Complete account removal with secure data cleanup

## 🚀 Quick Start

Get your Asgardeo Authenticator App up and running in minutes!

> ⚠️ **Important**: Use physical devices instead of emulators for testing push notifications. Emulators may not properly handle FCM push messages and biometric authentication.

### 📋 Prerequisites

- **Node.js** (version 18 or higher)
- **Expo CLI** (`npm install -g @expo/cli`)
- **Physical iOS/Android device** (recommended for push notifications)
- **Same Network**: Ensure your development machine and mobile device are on the same network

### 🔧 Initial Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/DilshanSenarath/asgardeo-react-native-samples.git
   cd asgardeo-react-native-samples/authenticator-app
   npm install
   ```

### 📱 Push Notifications Setup

Push notifications are essential for the authenticator app functionality. Follow these steps carefully:

#### 🔥 Firebase Cloud Messaging (FCM) Configuration

> 📚 **Official Guide**: Follow the [Firebase Console Setup Guide](https://firebase.google.com/docs/cloud-messaging) for detailed instructions.

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Cloud Messaging API

2. **Android Configuration**
   ```bash
   # Download google-services.json from Firebase Console
   # Place it in: ./config/google-services.json
   ```
   
   > 📖 **Detailed Setup**: [Firebase Android Setup Guide](https://firebase.google.com/docs/android/setup)

3. **iOS Configuration**
   ```bash
   # Download GoogleService-Info.plist from Firebase Console
   # Place it in: ./config/GoogleService-Info.plist
   ```
   
   > 📖 **Detailed Setup**: [Firebase iOS Setup Guide](https://firebase.google.com/docs/ios/setup)

#### 🍎 Apple Push Notification (APN) Setup

> 📚 **Official Guide**: [Firebase Cloud Messaging for iOS](https://firebase.google.com/docs/cloud-messaging/ios/client)

1. **Apple Developer Account Setup**
   - Create/use existing Apple Developer account
   - Generate APNs Authentication Key or Certificate
   - Upload to Firebase Console under Project Settings > Cloud Messaging

2. **iOS Bundle ID Configuration**
   - Ensure your app's bundle ID matches Firebase configuration
   - Enable Push Notifications capability in Xcode

#### 📁 Configuration Files Structure

Ensure your config directory looks like this:
```
config/
├── app.config.json          # App configuration
├── google-services.json     # 🔥 Firebase Android config
└── GoogleService-Info.plist # 🔥 Firebase iOS config
```

> ⚠️ **Security Note**: Never commit these files to public repositories. Add them to `.gitignore` for production apps.

### 🏃‍♂️ Running the Application

#### For Android Device

1. **Enable Developer Options**
   - Go to Settings > About Phone > Tap Build Number 7 times
   - Enable "USB Debugging" in Developer Options

2. **Connect Device and Start**
   ```bash
   # Ensure device is connected via USB or same WiFi network
   npx expo start --android
   
   # For development build
   npx expo run:android --device
   ```

3. **Install Expo Go (Alternative)**
   - Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Play Store
   - Scan QR code from terminal

#### For iOS Device

1. **Trust Developer Certificate**
   - Connect iPhone via USB
   - Trust your computer when prompted

2. **Start Development Server**
   ```bash
   # Ensure device is connected via USB or same WiFi network
   npx expo start --ios
   
   # For development build
   npx expo run:ios --device
   ```

3. **Install Expo Go (Alternative)**
   - Install [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from App Store
   - Scan QR code from terminal or use AirDrop

### 🌐 Network Requirements

> 🔗 **Same Network**: Your development machine and mobile device must be on the same local network for Expo development server to work properly.

**Troubleshooting Network Issues:**
```bash
# Check your local IP
npx expo start --tunnel  # Use tunnel if local network fails

# Alternative: Use ngrok for tunneling
npm install -g @expo/ngrok
npx expo start --tunnel
```

### 🔐 Authentication Setup

1. **Configure Asgardeo Connection**
   - Update `config/app.config.json` with your Asgardeo tenant details
   - Ensure proper redirect URLs are configured in Asgardeo console

2. **Test Push Notifications**
   - Complete a test authentication flow
   - Verify push notifications are received on physical device

### ✅ Verification Steps

1. **App Launches Successfully** ✓
2. **Push Notifications Work** ✓ (only on physical devices)
3. **TOTP Generation Functions** ✓
4. **QR Code Scanning Works** ✓
5. **Biometric Authentication** ✓ (device dependent)

### 🆘 Troubleshooting

**Common Issues:**

- **Push notifications not working**: Verify FCM configuration and use physical device
- **Network connection failed**: Ensure same network and try tunnel mode
- **Build failures**: Check node version and clear cache: `npx expo start --clear`
- **iOS certificate issues**: Verify Apple Developer account and provisioning profiles

**Get Help:**
- 📖 [Expo Documentation](https://docs.expo.dev/)
- 🔥 [Firebase Documentation](https://firebase.google.com/docs)
- 🛡️ [Asgardeo Documentation](https://wso2.com/asgardeo/docs/)
