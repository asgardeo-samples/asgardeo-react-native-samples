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

import { PushAuthenticationDataInterface } from '../models/push-notification';
import { 
  NotificationResponse, 
  getDevicePushTokenAsync, 
  requestPermissionsAsync, 
  DevicePushToken, 
  addNotificationReceivedListener, 
  EventSubscription, 
  Notification, 
  addNotificationResponseReceivedListener, 
  getLastNotificationResponse,
  clearLastNotificationResponse
} from "expo-notifications";

/**
 * Class containing messaging service utility methods.
 */
class MessagingService {
  /**
   * Requests user permissions to display offline notifications.
   */
  static async requestUserPermission(): Promise<void> {
    await requestPermissionsAsync();
  }

  /**
   * Generates a new FCM token for the device.
   *
   * @returns The FCM token for the device.
   */
  static async generateFCMToken(): Promise<string> {
    const token: DevicePushToken =  await getDevicePushTokenAsync();

    return token.data;
  }

  /**
   * Creates a push authentication data payload from the notification response.
   *
   * @param message - The notification response from Expo.
   * @returns The push authentication data payload or null if the response is invalid.
   */
  static createPushDataPayload(
    message: Notification
  ): PushAuthenticationDataInterface | null {
    if (!message?.request?.content?.data?.pushId) {
      return null;
    }

    return {
      username: message.request.content.data.username as string,
      tenantDomain: message.request.content.data.tenantDomain as string,
      organizationId: message.request.content.data.organizationId as string,
      organizationName: message.request.content.data.organizationName as string,
      userStoreDomain: message.request.content.data.userStoreDomain as string,
      deviceId: message.request.content.data.deviceId as string,
      applicationName: message.request.content.data.applicationName as string,
      notificationScenario: message.request.content.data.notificationScenario as string,
      pushId: message.request.content.data.pushId as string,
      challenge: message.request.content.data.challenge as string,
      numberChallenge: message.request.content.data.numberChallenge as string,
      ipAddress: message.request.content.data.ipAddress as string,
      deviceOS: message.request.content.data.deviceOS as string,
      browser: message.request.content.data.browser as string,
      sentTime: message.date as number
    };
  }

  /**
   * Listens for incoming in-app messages when the app is in the foreground.
   *
   * @param router - The router instance to navigate on message receipt.
   * @returns A function to unsubscribe from in-app message listener.
   */
  static listenForInAppMessages(callback: (data: PushAuthenticationDataInterface) => void): EventSubscription {
    return addNotificationReceivedListener((message: Notification) => {
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
   * @returns A function to unsubscribe from notification open listener.
   */
  static listenForNotificationOpenWhenAppInBackground(
    callback: (data: PushAuthenticationDataInterface) => void
  ): EventSubscription {
    return addNotificationResponseReceivedListener((message: NotificationResponse) => {
      const pushData: PushAuthenticationDataInterface | null = this.createPushDataPayload(message.notification);
      if (pushData) {
        callback(pushData);
      }
    });
  }

  /**
   * Listens for notification opens when the app is closed.
   * 
   * @param callback - The callback to execute on notification open.
   */
  static listenForNotificationOpenWhenAppIsClosed(
    callback: (data: PushAuthenticationDataInterface) => void
  ): void {
    const response: NotificationResponse | null = getLastNotificationResponse();
    if (response) {
      const pushData: PushAuthenticationDataInterface | null = this.createPushDataPayload(response.notification);
      if (pushData) {
        clearLastNotificationResponse();
        callback(pushData);
      }
    }
  }

  /**
   * Removes a notification listener subscription.
   *
   * @param subscription - The event subscription to remove.
   */
  static removeNotificationListeners(subscription: EventSubscription): void {
    subscription.remove();
  }
}

export default MessagingService;
