/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import messaging, {
  FirebaseMessagingTypes,
  getToken,
  onMessage,
  requestPermission,
  onNotificationOpenedApp,
  getInitialNotification
} from '@react-native-firebase/messaging';
import {
  DeviceRegistrationDataInterface,
  PushAuthenticationDataInterface,
  PushNotificationScenario
} from '../models/push-notification';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  addNotificationResponseReceivedListener,
  getLastNotificationResponse,
  NotificationResponse,
  clearLastNotificationResponse,
  scheduleNotificationAsync,
  setNotificationHandler
} from "expo-notifications";
import formatDateTime from './formatDateTime';

const messagingInstance: FirebaseMessagingTypes.Module = messaging();

/**
 * Allow locally displayed notifications (e.g. device registration alerts) to be
 * shown while the app is in the foreground. Without a handler, expo-notifications
 * discards them silently.
 */
setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

/**
 * Class containing messaging service utility methods.
 */
class MessagingService {
  /**
   * FCM data payload keys carrying the registered device details. Both the
   * kebab-case originals set on the server-side event and the camelCase variants
   * produced by the FCM publisher are accepted.
   */
  private static readonly DEVICE_NAME_KEYS: string[] = ['push-device-name', 'pushDeviceName'];
  private static readonly DEVICE_MODEL_KEYS: string[] = ['push-device-model', 'pushDeviceModel'];
  private static readonly REGISTRATION_TIME_KEYS: string[] = ['registration-time', 'registrationTime'];
  private static readonly IP_ADDRESS_KEYS: string[] = ['ipAddress', 'ip-address'];
  private static readonly USERNAME_KEYS: string[] = ['username', 'user-name', 'userName'];
  private static readonly TENANT_DOMAIN_KEYS: string[] = ['tenantDomain', 'tenant-domain'];
  private static readonly ORGANIZATION_NAME_KEYS: string[] = ['organizationName', 'organization-name'];

  /**
   * Returns the first non-empty value found in the data payload for the given keys.
   */
  private static pickDataValue(data: Record<string, unknown> | undefined, keys: string[]): string | undefined {
    if (!data) {
      return undefined;
    }
    for (const key of keys) {
      const value = data[key];
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
    }
    return undefined;
  }

  /**
   * Requests user permissions to display offline notifications.
   */
  static async requestUserPermission(): Promise<void> {
    if (Platform.OS === 'ios') {
      await requestPermission(messagingInstance);
    } else if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
  }

  /**
   * Generates a new FCM token for the device.
   *
   * @returns The FCM token for the device.
   */
  static async generateFCMToken(): Promise<string> {
    return getToken(messagingInstance);
  }

  /**
   * Creates a push authentication data payload from the received message.
   *
   * @param message - The received remote message.
   * @returns The push authentication data payload or null if the message is invalid.
   */
  private static createPushDataPayload(
    message: FirebaseMessagingTypes.RemoteMessage
  ): PushAuthenticationDataInterface | null {
    if (!message.data?.pushId) {
      return null;
    }

    return {
      username: message.data.username as string,
      tenantDomain: message.data.tenantDomain as string,
      organizationId: message.data.organizationId as string,
      organizationName: message.data.organizationName as string,
      userStoreDomain: message.data.userStoreDomain as string,
      deviceId: message.data.deviceId as string,
      applicationName: message.data.applicationName as string,
      notificationScenario: message.data.notificationScenario as string,
      pushId: message.data.pushId as string,
      challenge: message.data.challenge as string,
      numberChallenge: message.data.numberChallenge as string,
      ipAddress: message.data.ipAddress as string,
      deviceOS: message.data.deviceOS as string,
      browser: message.data.browser as string,
      sentTime: message.sentTime as number
    };
  }

  /**
   * Creates a push authentication data payload from the notification response.
   *
   * @param response - The notification response from Expo.
   * @returns The push authentication data payload or null if the response is invalid.
   */
  static createPushDataPayloadFromExpo(
    response: NotificationResponse
  ): PushAuthenticationDataInterface | null {
    if (!response?.notification?.request?.content?.data?.pushId) {
      return null;
    }

    return {
      username: response.notification.request.content.data.username as string,
      tenantDomain: response.notification.request.content.data.tenantDomain as string,
      organizationId: response.notification.request.content.data.organizationId as string,
      organizationName: response.notification.request.content.data.organizationName as string,
      userStoreDomain: response.notification.request.content.data.userStoreDomain as string,
      deviceId: response.notification.request.content.data.deviceId as string,
      applicationName: response.notification.request.content.data.applicationName as string,
      notificationScenario: response.notification.request.content.data.notificationScenario as string,
      pushId: response.notification.request.content.data.pushId as string,
      challenge: response.notification.request.content.data.challenge as string,
      numberChallenge: response.notification.request.content.data.numberChallenge as string,
      ipAddress: response.notification.request.content.data.ipAddress as string,
      deviceOS: response.notification.request.content.data.deviceOS as string,
      browser: response.notification.request.content.data.browser as string,
      sentTime: response.notification.date as number
    };
  }

  /**
   * Checks whether the given notification data payload belongs to a device
   * registration notification.
   *
   * @param data - The data payload of the notification.
   * @returns Whether the payload is a device registration notification.
   */
  private static isDeviceRegistrationScenario(data?: Record<string, unknown>): boolean {
    return data?.notificationScenario === PushNotificationScenario.DEVICE_REGISTRATION;
  }

  /**
   * Extracts the registered device details from the FCM data payload.
   *
   * @param data - The data payload of the notification.
   * @returns The extracted device details, or an empty object if the payload is missing.
   */
  private static parseDeviceRegistrationData(
    data?: Record<string, unknown>
  ): Pick<DeviceRegistrationDataInterface, 'deviceName' | 'deviceModel' | 'registrationTime'> {
    if (!data) {
      return {};
    }

    return {
      deviceName: this.pickDataValue(data, this.DEVICE_NAME_KEYS),
      deviceModel: this.pickDataValue(data, this.DEVICE_MODEL_KEYS),
      registrationTime: this.pickDataValue(data, this.REGISTRATION_TIME_KEYS)
    };
  }

  /**
   * Creates a device registration data payload from the received message.
   *
   * @param message - The received remote message.
   * @returns The device registration data payload.
   */
  private static createDeviceRegistrationPayload(
    message: FirebaseMessagingTypes.RemoteMessage
  ): DeviceRegistrationDataInterface {
    console.log('[MessagingService] FCM device-registration data keys:', message.data && Object.keys(message.data));
    console.log('[MessagingService] FCM device-registration data:', JSON.stringify(message.data));

    return {
      title: message.notification?.title ?? 'New Device Registered',
      body: message.notification?.body ?? 'A new device was registered to your account.',
      username: this.pickDataValue(message.data, this.USERNAME_KEYS),
      tenantDomain: this.pickDataValue(message.data, this.TENANT_DOMAIN_KEYS),
      organizationName: this.pickDataValue(message.data, this.ORGANIZATION_NAME_KEYS),
      ipAddress: this.pickDataValue(message.data, this.IP_ADDRESS_KEYS),
      ...this.parseDeviceRegistrationData(message.data),
      sentTime: (message.sentTime as number) ?? Date.now()
    };
  }

  /**
   * Creates a device registration data payload from the notification response.
   *
   * @param response - The notification response from Expo.
   * @returns The device registration data payload.
   */
  private static createDeviceRegistrationPayloadFromExpo(
    response: NotificationResponse
  ): DeviceRegistrationDataInterface {
    const content = response.notification.request.content;
    const data = content.data as Record<string, unknown> | undefined;

    console.log('[MessagingService] Expo device-registration data keys:', data && Object.keys(data));
    console.log('[MessagingService] Expo device-registration data:', JSON.stringify(data));

    return {
      title: content.title ?? 'New Device Registered',
      body: content.body ?? 'A new device was registered to your account.',
      username: this.pickDataValue(data, this.USERNAME_KEYS),
      tenantDomain: this.pickDataValue(data, this.TENANT_DOMAIN_KEYS),
      organizationName: this.pickDataValue(data, this.ORGANIZATION_NAME_KEYS),
      ipAddress: this.pickDataValue(data, this.IP_ADDRESS_KEYS),
      ...this.parseDeviceRegistrationData(data),
      sentTime: response.notification.date as number
    };
  }

  /**
   * Displays an informational push notification (e.g. a device registration alert)
   * as a local notification.
   *
   * The OS only renders the notification payload of an FCM message automatically
   * when the app is in the background, so messages received in the foreground
   * have to be re-displayed locally to become visible to the user.
   *
   * @param message - The received remote message.
   */
  private static async displayNotification(message: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
    let body: string = message.notification?.body ?? 'A new device was registered to your account.';

    // Replace the raw ISO-8601 timestamp in the body with a user friendly local time.
    const { registrationTime } = this.parseDeviceRegistrationData(message.data);
    if (registrationTime) {
      body = body.replace(registrationTime, formatDateTime(registrationTime));
    }

    await scheduleNotificationAsync({
      content: {
        title: message.notification?.title ?? 'New Device Registered',
        body,
        data: message.data
      },
      trigger: null
    });
  }

  /**
   * Listens for taps on notifications displayed by the app itself
   * (e.g. device registration alerts shown while the app is in the foreground).
   *
   * @param onDeviceRegistration - The callback to execute when a device registration notification is tapped.
   * @returns A function to unsubscribe from the listener.
   */
  static listenForNotificationTaps(
    onDeviceRegistration: (data: DeviceRegistrationDataInterface) => void
  ): () => void {
    const subscription = addNotificationResponseReceivedListener((response: NotificationResponse) => {
      const data = response?.notification?.request?.content?.data;

      if (this.isDeviceRegistrationScenario(data)) {
        onDeviceRegistration(this.createDeviceRegistrationPayloadFromExpo(response));
      }
    });

    return () => subscription.remove();
  }

  /**
   * Listens for incoming in-app messages when the app is in the foreground.
   *
   * @param router - The router instance to navigate on message receipt.
   * @returns A function to unsubscribe from in-app message listener.
   */
  static listenForInAppMessages(callback: (data: PushAuthenticationDataInterface) => void): () => void {
    return onMessage(messagingInstance, (message: FirebaseMessagingTypes.RemoteMessage) => {
      /*
       * Device registration notifications are informational only. They carry no
       * pushId, so they must be displayed directly instead of being routed to
       * the push authentication flow.
       */
      if (message.data?.notificationScenario === PushNotificationScenario.DEVICE_REGISTRATION) {
        this.displayNotification(message);
        return;
      }

      const pushData: PushAuthenticationDataInterface | null = this.createPushDataPayload(message);
      if (pushData) {
        callback(pushData);
      }
    });
  }

  /**
   * Listens for notification opens when the app is in the background.
   *
   * @param callback - The callback to execute on notification open.
   * @param onDeviceRegistration - The callback to execute when a device registration notification is opened.
   * @returns A function to unsubscribe from notification open listener.
   */
  static listenForNotificationOpenWhenAppInBackground(
    callback: (data: PushAuthenticationDataInterface) => void,
    onDeviceRegistration?: (data: DeviceRegistrationDataInterface) => void
  ): () => void {
    return onNotificationOpenedApp(messagingInstance, (message: FirebaseMessagingTypes.RemoteMessage) => {
      if (this.isDeviceRegistrationScenario(message.data)) {
        onDeviceRegistration?.(this.createDeviceRegistrationPayload(message));
        return;
      }

      const pushData: PushAuthenticationDataInterface | null = this.createPushDataPayload(message);
      if (pushData) {
        callback(pushData);
      }
    });
  }

  /**
   * Sets up a listener for when the app is closed.
   *
   * @param callback - The callback to execute on notification open.
   * @param onDeviceRegistration - The callback to execute when a device registration notification is opened.
   */
  static listenForNotificationOpenWhenAppIsClosedExpo(
    callback: (data: PushAuthenticationDataInterface) => void,
    onDeviceRegistration?: (data: DeviceRegistrationDataInterface) => void
  ): void {
    const response: NotificationResponse | null = getLastNotificationResponse();
    if (response) {
      if (this.isDeviceRegistrationScenario(response.notification?.request?.content?.data)) {
        onDeviceRegistration?.(this.createDeviceRegistrationPayloadFromExpo(response));
        return;
      }

      const pushData: PushAuthenticationDataInterface | null = this.createPushDataPayloadFromExpo(response);
      if (pushData) {
        callback(pushData);
      }
    }
  }

  /**
   * Sets up a listener for when the app is closed using FCM.
   *
   * @param callback - The callback to execute on notification open.
   * @param onDeviceRegistration - The callback to execute when a device registration notification is opened.
   */
  static listenForNotificationWhenAppIsClosedFCM(
    callback: (data: PushAuthenticationDataInterface) => void,
    onDeviceRegistration?: (data: DeviceRegistrationDataInterface) => void
  ): void {
    getInitialNotification(messagingInstance)
      .then((message: FirebaseMessagingTypes.RemoteMessage | null) => {
        if (message) {
          if (this.isDeviceRegistrationScenario(message.data)) {
            onDeviceRegistration?.(this.createDeviceRegistrationPayload(message));
            return;
          }

          const pushData: PushAuthenticationDataInterface | null = this.createPushDataPayload(message);
          if (pushData) {
            callback(pushData);
          }
        }
      });
  }

  /**
   * Clears the stored notification response data.
   * 
   * This can be used to prevent processing the same notification multiple times.
   */
  static clearNotificationData(): void {
    clearLastNotificationResponse();
  }
}

export default MessagingService;
