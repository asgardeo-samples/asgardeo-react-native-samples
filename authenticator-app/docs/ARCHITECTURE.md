## 🏗️ Architecture

![High Level Architecture Diagram](./images/high-level-architecture-diagram.png)

- **Cross-platform application**: A React Native mobile application to support both push-based authentication and TOTP authentication.
- **Ease of use**: Users can install the application on their mobile devices and use it without sign in.
- **Device registration**: For both push authentication and TOTP, users can scan a QR code to register their device for authentication.
- **Secure storage for push authentication**:
   - A key pair is generated on the mobile application.
   - The private key is securely stored in the iOS Keychain and Android Keystore.
   - The public key is transmitted to Asgardeo for push authentication signature verification.
- **Data storage**: Account details, device ID, TOTP period, and user/organization details will be stored in React Native Async Storage (key-value pair storage).
- **Push notifications**:
   - Firebase Cloud Messaging (FCM) is used to deliver push notifications to both iOS and Android devices.
   - On Android, FCM delivers notifications directly.
   - On iOS, Apple Push Notification (APN) Service will be integrated with FCM to deliver notifications.

For more details, refer to the [codebase](./CODE.md) guide.
