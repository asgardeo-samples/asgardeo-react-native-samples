# 📋 Asgardeo Authenticator - Codebase Documentation

## 📑 Table of Contents

- [Technology Stack](#-technology-stack)
- [Package Dependencies & Usage](#-package-dependencies--usage)
  - [Core React Native & Expo Packages](#core-react-native--expo-packages)
  - [Authentication & Security Packages](#authentication--security-packages)
  - [Storage Packages](#storage-packages)
  - [Firebase & Push Notifications](#firebase--push-notifications)
  - [Camera & QR Scanning](#camera--qr-scanning)
  - [UI & Navigation Packages](#ui--navigation-packages)
  - [Utility Packages](#utility-packages)
- [Directory Structure & Architecture](#-directory-structure--architecture)
  - [Root Level Files](#root-level-files)
    - [Configuration Files](#configuration-files)
  - [`app/` Directory - Expo Router Pages](#app-directory---expo-router-pages)
  - [`src/` Directory - Core Application Logic](#src-directory---core-application-logic)
    - [`src/components/` - UI Components](#srccomponents---ui-components)
    - [`src/contexts/` - State Management](#srccontexts---state-management)
    - [`src/models/` - TypeScript Interfaces](#srcmodels---typescript-interfaces)
    - [`src/utils/` - Utility Services](#srcutils---utility-services)
    - [`src/constants/` - Application Constants](#srcconstants---application-constants)
  - [`assets/` Directory](#assets-directory)
  - [`config/` Directory](#config-directory)
  - [`docs/` Directory](#docs-directory)
- [Application Flow & Architecture](#-application-flow--architecture)
  - [Context Provider Hierarchy](#context-provider-hierarchy)
  - [Data Flow](#data-flow)
  - [Storage Architecture](#storage-architecture)
  - [Security Layers](#security-layers)
- [Key Features Implementation](#-key-features-implementation)
  - [TOTP (Time-based One-Time Password)](#totp-time-based-one-time-password)
  - [Push Authentication](#push-authentication)
  - [QR Code Scanning](#qr-code-scanning)
  - [Security Features](#security-features)

---

## 🧑‍💻 Technology Stack

- **Framework**: React Native 0.79.6 with Expo ~53.0.22
- **Language**: TypeScript 5.8.3
- **Navigation**: Expo Router 5.1.5 (file-based routing)
- **State Management**: React Context API with custom providers
- **Platform**: iOS & Android with native integrations

---

## 📦 Package Dependencies & Usage

### Core React Native & Expo Packages

| Package | Version | Purpose | Usage in Project |
|---------|---------|---------|------------------|
| `react` | 19.0.0 | Core React library | Component rendering and state management |
| `react-native` | 0.79.6 | React Native framework | Mobile app foundation |
| `expo` | ~53.0.22 | Expo development platform | Development tooling and native APIs |
| `expo-router` | ~5.1.5 | File-based routing | Navigation between screens in `app/` directory |

### Authentication & Security Packages

| Package | Version | Purpose | Usage in Project |
|---------|---------|---------|------------------|
| `expo-local-authentication` | ^17.0.7 | Biometric authentication | User authentication for app access in `verifyLocalAuthentication.ts` |
| `expo-secure-store` | ^15.0.7 | Secure key storage | Storing private keys and TOTP secrets in `SecureStorageService.ts` |
| `expo-crypto` | ^15.0.7 | Expo crypto utilities | Random number generation |
| `react-native-quick-crypto` | ^0.7.17 | Fast crypto operations | RSA key generation and JWT signing in `CryptoService.ts` |
| `react-native-rsa-native` | ^2.0.5 | Native RSA operations | RSA cryptographic operations |
| `otpauth` | ^9.4.1 | TOTP/HOTP implementation | TOTP code generation in `CryptoService.ts` |

### Storage Packages

| Package | Version | Purpose | Usage in Project |
|---------|---------|---------|------------------|
| `@react-native-async-storage/async-storage` | ^2.2.0 | Persistent storage | Account data storage in `AsyncStorageService.ts` |
| `react-native-mmkv` | ^3.3.3 | Fast storage | Quick access storage for themes in `FastStorage.ts` |

### Firebase & Push Notifications

| Package | Version | Purpose | Usage in Project |
|---------|---------|---------|------------------|
| `@react-native-firebase/app` | ^23.4.0 | Firebase core | Firebase initialization for push notifications |
| `@react-native-firebase/messaging` | ^23.4.0 | FCM messaging | Push notification handling in `MessagingService.ts` |
| `expo-notifications` | ^0.32.12 | Local notifications | Notification management and display |

### Camera & QR Scanning

| Package | Version | Purpose | Usage in Project |
|---------|---------|---------|------------------|
| `expo-camera` | ~16.1.11 | Camera access | QR code scanning in `QRScanner.tsx` |

### UI & Navigation Packages

| Package | Version | Purpose | Usage in Project |
|---------|---------|---------|------------------|
| `@react-navigation/native` | ^7.1.6 | Navigation core | Navigation infrastructure |
| `@react-navigation/bottom-tabs` | ^7.3.10 | Tab navigation | Bottom tab navigation |
| `@react-navigation/elements` | ^2.3.8 | Navigation elements | Navigation UI components |
| `@expo/vector-icons` | ^14.1.0 | Icon library | Icons throughout the app |
| `expo-blur` | ~14.1.5 | Blur effects | UI blur effects |
| `react-native-svg` | ^15.13.0 | SVG support | Vector graphics rendering |

### Utility Packages

| Package | Version | Purpose | Usage in Project |
|---------|---------|---------|------------------|
| `buffer` | ^6.0.3 | Buffer polyfill | Node.js Buffer support for crypto operations |
| `react-native-get-random-values` | ^1.11.0 | Crypto random values | Polyfill for crypto.getRandomValues() |
| `expo-application` | ^7.0.7 | App information | Application metadata |
| `expo-device` | ^8.0.7 | Device information | Device details for push registration |
| `expo-clipboard` | ^8.0.7 | Clipboard access | Copy TOTP codes to clipboard |
| `expo-haptics` | ^14.1.4 | Haptic feedback | Touch feedback |

---

## 📁 Directory Structure & Architecture

### Root Level Files

#### Configuration Files

- **`package.json`**: Project dependencies and scripts
- **`app.json`**: Expo configuration including app metadata, permissions, and platform-specific settings
- **`tsconfig.json`**: TypeScript configuration with strict mode and path aliases
- **`eslint.config.js`**: ESLint configuration using Expo's flat config
- **`expo-env.d.ts`**: TypeScript environment declarations

### `app/` Directory - Expo Router Pages

File-based routing system using Expo Router:

| File | Purpose | Navigation Role |
|------|---------|-----------------|
| `_layout.tsx` | Root layout component | Provides navigation structure and theme context |
| `index.tsx` | Entry point | Redirects to home screen |
| `home.tsx` | Home screen | Main dashboard showing account list |
| `account.tsx` | Account details | TOTP code display and management |
| `qr-scanner.tsx` | QR scanner | Camera-based QR code scanning |
| `push-auth.tsx` | Push authentication | Handle push auth challenges |
| `push-auth-history.tsx` | Push auth history | Display authentication history |

### `src/` Directory - Core Application Logic

#### `src/components/` - UI Components

Organized by feature modules:

**`account/` Components:**
- `AccountHeaderRight.tsx`: Header actions for account screen
- `CircularProgress.tsx`: TOTP countdown progress indicator
- `SettingsDropdown.tsx`: Account management dropdown menu
- `TOTPCode.tsx`: Main TOTP display component with code generation

**`common/` Components:**
- `AlertWidget.tsx`: Reusable alert/modal component
- `AvatarWidget.tsx`: User avatar display component
- `HeaderTitle.tsx`: Consistent header title component

**`home/` Components:**
- `AccountList.tsx`: List container for all accounts
- `AccountListItem.tsx`: Individual account list item
- `HeaderSettings.tsx`: Home screen header with settings

**`push-auth/` Components:**
- `AppNotification.tsx`: Push notification display component

**`push-auth-history/` Components:**
- `EmptyCard.tsx`: Empty state for history
- `HistoryCard.tsx`: Individual history item
- `HistoryList.tsx`: History list container

**`qr/` Components:**
- `QRScanner.tsx`: Camera QR code scanner implementation

#### `src/contexts/` - State Management

Context-based state management with providers and hooks:

**`asgardeo/` - Root Application Context:**
- `AsgardeoContext.tsx`: Root application context definition
- `AsgardeoProvider.tsx`: Root provider with authentication flow
- `useAsgardeo.tsx`: Hook for accessing root context

**`account/` - Account Management:**
- `AccountContext.tsx`: Account data context definition
- `AccountProvider.tsx`: Account data provider with CRUD operations
- `useAccount.tsx`: Hook for account operations

**`totp/` - TOTP Management:**
- `TOTPContext.tsx`: TOTP context definition
- `TOTPProvider.tsx`: TOTP provider with registration/unregistration
- `useTOTP.tsx`: Hook for TOTP operations

**`push-auth/` - Push Authentication:**
- `PushAuthContext.tsx`: Push auth context definition
- `PushAuthProvider.tsx`: Push auth provider with device management
- `usePushAuth.tsx`: Hook for push auth operations

#### `src/models/` - TypeScript Interfaces

Type definitions for the application:

| File | Purpose | Key Interfaces |
|------|---------|----------------|
| `core.ts` | Core application types | `QRDataValidationResponseInterface`, `DeploymentConfig` |
| `crypto.ts` | Cryptographic types | `KeyPair` |
| `push-notification.ts` | Push auth types | `PushNotificationQRDataInterface`, `PushAuthenticationDataInterface` |
| `storage.ts` | Storage data types | `AccountInterface`, `StorageDataInterface` |
| `theme.ts` | UI theme types | `ThemeInterface`, `ColorInterface` |
| `totp.ts` | TOTP types | `TOTPQRDataInterface` |
| `ui.ts` | UI component types | `ThemeConfigs`, `AlertProps` |

#### `src/utils/` - Utility Services

Business logic and service classes:

**Storage Services:**
- `AsyncStorageService.ts`: Plain text storage operations using React Native AsyncStorage
- `SecureStorageService.ts`: Secure storage operations using Expo SecureStore
- `FastStorage.ts`: Fast storage using MMKV for frequently accessed data

**Security Services:**
- `CryptoService.ts`: Cryptographic operations including RSA key generation, JWT signing, and TOTP generation
- `verifyLocalAuthentication.ts`: Biometric authentication verification

**Communication Services:**
- `MessagingService.ts`: Firebase Cloud Messaging operations for push notifications

**Utility Functions:**
- `getAvatarColors.ts`: Generate avatar colors based on account data
- `getInitials.ts`: Extract initials from display names
- `getTimeFromNow.ts`: Time formatting utilities
- `getUsername.ts`: Username extraction utilities
- `resolveHostName.ts`: Host name resolution for API calls
- `Theme.ts`: Theme management singleton
- `TypeConvert.ts`: Type conversion utilities
- `validateQRData.ts`: QR code data validation

#### `src/constants/` - Application Constants

- `AppPaths.ts`: Route path constants for navigation
- `StorageConstants.ts`: Storage key constants

### `assets/` Directory

Static assets:
- `images/`: Application logos and icons

### `config/` Directory

Configuration files:
- `app.config.json`: Application configuration including theme, security settings, and deployment config
- `google-services.json`: Firebase configuration for Android
- `GoogleService-Info.plist`: Firebase configuration for iOS

### `docs/` Directory

Documentation:
- `CODE.md`: This comprehensive codebase documentation
- `CONFIGURATION.md`: Configuration guide
- `images/`: Documentation images

---

## 🔄 Application Flow & Architecture

### Context Provider Hierarchy

```
AsgardeoProvider (Root authentication)
├── AccountProvider (Account management)
    ├── TOTPProvider (TOTP operations)
        └── PushAuthProvider (Push authentication)
            └── Application Components
```

### Data Flow

1. **App Initialization**: `AsgardeoProvider` handles biometric authentication
2. **Account Loading**: `AccountProvider` loads stored accounts from AsyncStorage
3. **TOTP Operations**: `TOTPProvider` manages TOTP registration and code generation
4. **Push Auth**: `PushAuthProvider` handles push notification registration and responses

### Storage Architecture

- **Secure Storage (Keychain/Keystore)**: Private keys, TOTP secrets
- **AsyncStorage**: Account metadata, push auth history
- **MMKV**: Theme preferences, fast-access data

### Security Layers

1. **Device Authentication**: Biometric/PIN protection for app access
2. **Secure Storage**: Sensitive data stored in device secure enclaves
3. **Cryptographic Protection**: RSA encryption for push auth, TOTP secrets protection
4. **Network Security**: JWT-based authentication for API calls

---

## 🔧 Key Features Implementation

### TOTP (Time-based One-Time Password)

- **Registration**: QR code scanning to extract TOTP parameters
- **Code Generation**: Real-time TOTP code generation with countdown
- **Storage**: Secure storage of TOTP secrets in device keychain
- **UI**: Circular progress indicator showing remaining time

### Push Authentication

- **Device Registration**: Firebase FCM token-based device registration
- **Challenge Handling**: Number challenge prompts for enhanced security
- **JWT Verification**: RSA-based JWT signing for authentication responses
- **History Tracking**: Complete audit trail of push authentication events

### QR Code Scanning

- **Camera Integration**: Expo Camera for QR code detection
- **Data Validation**: Comprehensive validation of scanned QR data
- **Multi-format Support**: Support for both TOTP and push auth QR codes

### Security Features

- **Biometric Authentication**: Face ID, Touch ID, fingerprint authentication
- **Secure Key Storage**: iOS Keychain and Android Keystore integration
- **Data Encryption**: RSA encryption for sensitive communications
- **Session Management**: Secure session handling with automatic re-authentication
