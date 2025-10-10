# Configuration Guide

This guide explains how to configure and customize the Authenticator App for your organization's branding and requirements.

---

## 📑 Table of Contents

- [Application Configuration (`app.config.json`)](#-application-configuration-appconfigjson)
  - [Configuration Structure](#configuration-structure)
    - [1. App Header Text](#1-app-header-text)
    - [2. Development Mode](#2-development-mode)
    - [3. Security Settings](#3-security-settings)
    - [4. Feature Configuration](#4-feature-configuration)
    - [5. UI Theme Configuration](#5-ui-theme-configuration)
      - [Theme Properties](#theme-properties)
      - [Color Customization](#color-customization)
        - [Screen Colors](#screen-colors)
        - [Overlay Colors](#overlay-colors)
        - [Header Colors](#header-colors)
        - [Button Colors](#button-colors)
        - [Typography Colors](#typography-colors)
        - [Card Colors](#card-colors)
        - [Alert Colors](#alert-colors)
        - [Code Circle Colors](#code-circle-colors)
        - [Avatar Random Color Palette](#avatar-random-color-palette)
  - [Customization Example](#customization-example)
- [Expo Configuration (`app.json`)](#-expo-configuration-appjson)
  - [Key Configuration Options](#key-configuration-options)
    - [1. App Identity](#1-app-identity)
    - [2. App Icon](#2-app-icon)
    - [3. iOS Configuration](#3-ios-configuration)
    - [4. Android Configuration](#4-android-configuration)
  - [Branding Customization in `app.json`](#branding-customization-in-appjson)
- [Splash Screen Configuration](#-splash-screen-configuration)
  - [Current Splash Screen Configuration](#current-splash-screen-configuration)
  - [Configuration Properties](#configuration-properties)
  - [Theming Limitations](#theming-limitations)
  - [Recommended Approach](#recommended-approach)
- [Logo and Branding Assets](#-logo-and-branding-assets)
  - [Available Logo Assets](#available-logo-assets)
  - [Logo Replacement](#logo-replacement)

---

## 🔧 Application Configuration (`app.config.json`)

The `config/app.config.json` file contains the core application settings, including UI theming, security options, and feature configurations.

### Configuration Structure

#### 1. **App Header Text**
```json
"appHeaderText": "Authenticator"
```
- Defines the text displayed in the application header
- Change this to your organization's app name

#### 2. **Development Mode**
```json
"devMode": {
  "enabled": true,
  "host": "http://<<IS_HOST_IP_ADDRESS>>:<<SSL_DISABLED_PORT>>"
}
```
- `enabled`: Set to `true` to enable development mode, `false` for production
- `host`: Development server URL for testing

> [!IMPORTANT]
> Disable dev mode in production builds

> [!IMPORTANT]
> **Local Identity Server Setup**: When running the Identity Server locally and accessing it from a mobile device on the same network, you'll encounter HTTPS certificate issues due to self-signed certificates. To resolve this:
> 
> 1. **Add HTTP Connector**: Configure an HTTP connector in your WSO2 Identity Server by adding the following to `catalina-server.xml.j2`:
>    ```xml
>    <Connector port="8082" protocol="HTTP/1.1"
>               connectionTimeout="20000"
>               redirectPort="8443" />
>    ```
> 
> 2. **File Location**: 
>    ```
>    {IS_HOME}/repository/resources/conf/templates/repository/conf/tomcat/catalina-server.xml.j2
>    ```
> 
> 3. **Update Configuration**: Set your `host` to use HTTP with the new port:
>    ```json
>    "host": "http://192.168.1.100:8082"
>    ```
> 
> This allows the mobile app to communicate with the Identity Server over HTTP, bypassing certificate validation issues during development.

#### 3. **Security Settings**
```json
"security": {
  "enableAppScreenLocks": true
}
```
- `enableAppScreenLocks`: Enables biometric/PIN authentication when accessing the app

#### 4. **Feature Configuration**
```json
"feature": {
  "push": {
    "numberOfHistoryRecords": 5
  }
}
```
- `push.numberOfHistoryRecords`: Number of push authentication history records to display
- Adjust based on your UX requirements (recommended: 5-10)

#### 5. **UI Theme Configuration**

The theme configuration allows you to customize the entire look and feel of the app.

```json
"ui": {
  "theme": {
    "activeTheme": "light",
    "light": {
      "colors": { /* light theme colors */ }
    },
    "dark": {
      "colors": { /* dark theme colors */ }
    }
  }
}
```

##### **Theme Properties:**

- **`activeTheme`**: Set to `"light"` or `"dark"` for the default theme

##### **Color Customization:**

Each theme (light/dark) contains the following color categories:

**Screen Colors:**
```json
"screen": {
  "background": "#fbfbfb"
}
```
- Main background color for app screens

**Overlay Colors:**
```json
"overlay": {
  "background": "#00000080",
  "text": "#ffffff"
}
```
- Used for modal overlays and dialogs

**Header Colors:**
```json
"header": {
  "background": "#ffffff",
  "text": "#17181aff",
  "dropdown": {
    "background": "#ffffff"
  }
}
```
- Navigation header styling

**Button Colors:**
```json
"button": {
  "primary": {
    "background": "#FF7300",
    "text": "#ffffff"
  },
  "secondary": {
    "background": "#f0f1f3ff",
    "text": "#868c99ff"
  }
}
```
- Primary buttons: Main action buttons (use your brand color)
- Secondary buttons: Alternative actions

**Typography Colors:**
```json
"typography": {
  "primary": "#56585eff",
  "secondary": "#868c99ff"
}
```
- Text colors for primary and secondary content

**Card Colors:**
```json
"card": {
  "background": "#f5f6f9ff",
  "text": {
    "primary": "#17181aff",
    "secondary": "#56585eff"
  }
}
```
- Account cards and list item styling

**Alert Colors:**
```json
"alert": {
  "error": {
    "background": "#fdebeaff",
    "text": "#F44336"
  },
  "info": {
    "background": "#e5f2fbff", 
    "text": "#2196F3"
  },
  "success": {
    "background": "#edf9edff",
    "text": "#4CAF50"
  },
  "warning": {
    "background": "#fff4e5ff",
    "text": "#FF9800"
  }
}
```
- Alert notification colors for different message types (error, success, info, warning)
- Each alert type has background and text color properties
- Used for toast notifications and inline alerts throughout the app

**Code Circle Colors:**
```json
"codeCircle": {
  "background": "#f8f8f9",
  "timer": {
    "background": "#e2e3e4ff",
    "validity": {
      "low": "#F44336",
      "medium": "#FF9800", 
      "high": "#4CAF50"
    }
  },
  "shadowColor": "#000000",
  "text": "#000000de",
  "subText": "#00000066"
}
```
- TOTP code display circle styling
- `timer.validity` colors indicate time remaining for the code (red=expiring, yellow=medium, green=fresh)
- Controls the visual presentation of time-based one-time password codes

**Avatar Random Color Palette:**
```json
"avatar": [
  {
    "bg": "#FFB3B3",
    "text": "#B91C1C"
  },
  {
    "bg": "#B3E5FC", 
    "text": "#0369A1"
  }
  // ... additional color combinations
]
```
- Array of color combinations for user account avatars
- Each entry contains background (`bg`) and text (`text`) colors
- The app randomly selects from this palette to assign unique colors to each account
- Provides visual differentiation between multiple accounts in the authenticator

### Customization Example

To brand the app for your organization:

```json
{
  "appHeaderText": "MyCompany Authenticator",
  "security": {
    "enableAppScreenLocks": true,
    "enableSettingsScreenLock": true
  },
  "ui": {
    "theme": {
      "light": {
        "colors": {
          "button": {
            "primary": {
              "background": "#0066CC",
              "text": "#ffffff"
            }
          }
        }
      }
    }
  }
}
```

---

## 📱 Expo Configuration (`app.json`)

The `app.json` file contains Expo-specific configurations for building and deploying the app on iOS and Android platforms.

### Key Configuration Options

#### 1. **App Identity**
```json
"name": "Asgardeo",
"slug": "Asgardeo"
```
- `name`: Display name of the app (shown on device home screen)
- `slug`: URL-friendly name for Expo services
- **Change these to your organization's app name**

#### 2. **App Icon**
```json
"icon": "./assets/images/logo-icon.png"
```
- Path to the app icon image
- Should be a 1024x1024 PNG with transparency

#### 3. **iOS Configuration**
```json
"ios": {
  "bundleIdentifier": "io.asgardeo.dev.push.totp.authenticator",
  "googleServicesFile": "./config/GoogleService-Info.plist"
}
```
- `bundleIdentifier`: Unique identifier for your iOS app (reverse domain format)
- **Must be unique and match your Apple Developer account**
- Example: `com.yourcompany.authenticator`

#### 4. **Android Configuration**
```json
"android": {
  "package": "io.asgardeo.dev.push.totp.authenticator",
  "adaptiveIcon": {
    "foregroundImage": "./assets/images/logo-icon.png",
    "backgroundColor": "#ffffff"
  },
  "googleServicesFile": "./config/google-services.json"
}
```
- `package`: Unique package name for your Android app (reverse domain format)
- **Must be unique and match your Google Play Console**
- Example: `com.yourcompany.authenticator`
- `backgroundColor`: Background color for Android adaptive icon

### Branding Customization in `app.json`

To rebrand the app:

```json
{
  "expo": {
    "name": "MyCompany Auth",
    "slug": "mycompany-auth",
    "icon": "./assets/images/logo-icon.png",
    "ios": {
      "bundleIdentifier": "com.mycompany.authenticator"
    },
    "android": {
      "package": "com.mycompany.authenticator",
      "adaptiveIcon": {
        "backgroundColor": "#0066CC"
      }
    }
  }
}
```

---

## 🚀 Splash Screen Configuration

The splash screen is the initial screen displayed when the app launches, providing a seamless transition while the app loads. This configuration is managed through the `app.json` file.

### Current Splash Screen Configuration

```json
  "plugins": [
    "expo-splash-screen",
    {
      "image": "./assets/images/logo-icon.png",
      "imageWidth": 200,
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  ]
```

#### Configuration Properties:

- **`image`**: Path to the splash screen logo/image
- **`imageWidth`**: Width of the image
- **`resizeMode`**: How the image should be resized (`contain`, `cover`, `stretch`)
- **`backgroundColor`**: Background color for the splash screen

### Theming Limitations

> [!IMPORTANT]
> **Runtime Theming Not Supported**: The splash screen does **not support runtime theming** and cannot dynamically change based on the user's selected system theme (light/dark mode). The splash screen configuration is static and set during the app build process.

### Recommended Approach

Due to the theming limitations, it's recommended to use:

- Use neutral colors like white (`#ffffff`) or light gray (`#f5f5f5`)
- Avoid dark colors that may clash with different system themes
- Consider using your brand's primary color if it works well in both light and dark contexts

---

## 🎨 Logo and Branding Assets

This section covers how to customize the application's visual branding by replacing the default logo assets with your organization's branding elements.

### Available Logo Assets

The application uses three main logo assets located in the `assets/images/` directory:

1. **`logo.png`** - Primary logo for light themes and general use
2. **`logo-white.png`** - White variant logo for dark themes and dark backgrounds  
3. **`logo-icon.png`** - App icon logo used for display purposes

### Logo Replacement

1. Replace the existing logo files in `assets/images/` with your branded versions
2. Ensure file names match exactly: `logo.png` and `logo-white.png`
3. For `logo-icon.png`, you can either replace the file directly or configure a custom name through Expo configuration
