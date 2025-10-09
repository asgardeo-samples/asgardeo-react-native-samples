# Configuration Guide

This guide explains how to configure and customize the Authenticator App for your organization's branding and requirements.

---

## Table of Contents

1. [Application Configuration (`app.config.json`)](#application-configuration-appconfigjson)
2. [Expo Configuration (`app.json`)](#expo-configuration-appjson)
3. [Logo and Branding Assets](#logo-and-branding-assets)

---

## Application Configuration (`app.config.json`)

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
  "host": "https://<<IS_HOST_IP_ADDRESS>>:9443"
}
```
- `enabled`: Set to `true` to enable development mode, `false` for production
- `host`: Development server URL for testing

> [!IMPORTANT]
> Disable dev mode in production builds

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

## Expo Configuration (`app.json`)

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

## Logo and Branding Assets

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
