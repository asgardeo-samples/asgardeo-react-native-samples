<div align="center">
  <img src="./images/logo.png" alt="Asgardeo Logo" width="100" align="center"/>
  
  <h1 align="center">React Native OAuth App</h1>
  
  <p align="center">
    <strong>React Native Mobile Application for OAuth Authentication</strong>
  </p>
  
  <p align="center">
    A reference mobile application built with React Native and <a href="https://wso2.com/asgardeo/">Asgardeo</a> that demonstrates OAuth 2.0 and OpenID Connect authentication implementation on iOS and Android devices.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native"/>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android"/>
    <img src="https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white" alt="iOS"/>
    <img src="https://img.shields.io/badge/Asgardeo-FF6B35?style=for-the-badge" alt="Asgardeo"/>
  </p>
</div>

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
- [Dependencies](#-dependencies)
  - [Core Dependencies](#core-dependencies)
  - [Development Dependencies](#development-dependencies)
- [Initial Setup](#-initial-setup)
- [Configuration](#️-configuration)
- [Run the Application](#️-run-the-application)
- [Development](#-development)
  - [Available Scripts](#available-scripts)

## Overview

This React Native application serves as a comprehensive example of implementing OAuth 2.0 and OpenID Connect authentication in mobile applications using Asgardeo as the identity provider. It demonstrates best practices for secure authentication flows, token management, and protected routes in a React Native environment.

## Quick Start

Get your React Native OAuth App up and running in minutes!

### Prerequisites

| Platform / Dependency | Version |
|----------------------|---------|
| Node.js              | ≥20.0.0 |
| React Native         | 0.82.0  |
| React                | 19.1.1  |
| Android (min SDK)    | 16      |
| TypeScript           | 5.8.3   |

Additional requirements:

- **npm** or yarn
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, Mac only)
- **Asgardeo Account** with an organization

## 📦 Dependencies

### Core Dependencies

- `react-native` (v0.82.0)
- `react` (v19.1.1)
- `react-native-app-auth` (v8.1.0)
- `@react-navigation/native` (v7.1.18)
- `@react-navigation/native-stack` (v7.3.28)
- `rn-secure-storage` (v3.0.1)

### Development Dependencies

- `typescript` (v5.8.3)
- `jest` for testing
- `eslint` for code linting
- `prettier` for code formatting

### 🔧 Initial Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ReactNativeAppAuthCli.git
   cd ReactNativeAppAuthCli
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Configuration

1. Create environment file:

   ```bash
   cp .env.example .env
   ```

2. Configure Asgardeo Application:
   - Navigate to [Asgardeo Console](https://console.asgardeo.io/)
   - Create a new application
   - Configure OAuth/OpenID Connect settings:
     - Redirect URI: `your-redirect-url`
     - Grant Types: Authorization Code, Refresh Token
   - Note down the Client ID

3. Update environment variables:

   ```plaintext
   ASGARDEO_ISSUER=https://api.asgardeo.io/t/your-org/oauth2
   ASGARDEO_CLIENT_ID=your-client-id
   ASGARDEO_REDIRECT_URL=your-redirect-url
   ```

### Run the Application

1. Start the Metro bundler:

   ```bash
   npm start
   ```

2. Launch on Android:

   ```bash
   npm run android
   ```

3. Launch on iOS:

   ```bash
   npm run ios
   ```

## Development

### Available Scripts

- `npm start` - Start the Metro bundler
- `npm run android` - Run the Android app
- `npm run ios` - Run the iOS app
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Jest
