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

import { useLocalSearchParams } from "expo-router";
import { FunctionComponent, ReactElement, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import DeviceRegistrationNotification from "../src/components/push-auth/DeviceRegistrationNotification";
import { ThemeConfigs } from "../src/models/ui";
import MessagingService from "../src/utils/MessagingService";
import Theme from "../src/utils/Theme";

const theme: ThemeConfigs = Theme.getInstance().getConfigs();

/**
 * Device Registration Notification Screen.
 *
 * Displays the details of a "new device registered" push notification when
 * the user taps on it.
 *
 * @returns Device registration notification screen component.
 */
const DeviceRegistrationScreen: FunctionComponent = (): ReactElement => {
  const params = useLocalSearchParams<{
    title?: string;
    body?: string;
    username?: string;
    tenantDomain?: string;
    organizationName?: string;
    ipAddress?: string;
    deviceName?: string;
    deviceModel?: string;
    registrationTime?: string;
    sentTime?: string;
  }>();
  const insets: EdgeInsets = useSafeAreaInsets();

  /**
   * Clear the stored notification response when the screen is unmounted to
   * prevent processing the same notification multiple times.
   */
  useEffect(() => {
    return () => {
      MessagingService.clearNotificationData();
    };
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={[styles.scrollContainer, { marginTop: insets.top, marginBottom: insets.bottom }]}>
        <ScrollView
          contentContainerStyle={[styles.contentContainer]}
        >
          <DeviceRegistrationNotification
            title={params.title ?? 'New Device Registered'}
            body={params.body ?? 'A new device was registered to your account.'}
            username={params.username}
            tenantDomain={params.tenantDomain}
            organizationName={params.organizationName}
            ipAddress={params.ipAddress}
            deviceName={params.deviceName}
            deviceModel={params.deviceModel}
            registrationTime={params.registrationTime}
            sentTime={Number(params.sentTime) || Date.now()}
          />
        </ScrollView>
      </View>
    </View>
  );
}

/**
 * Styles for the device registration notification screen.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.screen.background
  },
  scrollContainer: {
    flex: 1
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  }
});

export default DeviceRegistrationScreen;
