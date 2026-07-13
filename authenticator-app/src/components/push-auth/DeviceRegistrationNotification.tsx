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

import { DeviceRegistrationDataInterface } from "../../models/push-notification";
import { FunctionComponent, ReactElement } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Router, useRouter } from "expo-router";
import { ThemeConfigs } from "../../models/ui";
import formatDateTime from "../../utils/formatDateTime";
import getTimeFromNow from "../../utils/getTimeFromNow";
import getUsername from "../../utils/getUsername";
import Theme from "../../utils/Theme";

const theme: ThemeConfigs = Theme.getInstance().getConfigs();

/**
 * Device Registration Notification Component.
 *
 * Displays the details of a "new device registered" push notification.
 *
 * @param props - The component props.
 * @returns Device registration notification details component.
 */
const DeviceRegistrationNotification: FunctionComponent<DeviceRegistrationDataInterface> = ({
  title,
  body,
  username,
  tenantDomain,
  organizationName,
  ipAddress,
  deviceName,
  deviceModel,
  registrationTime,
  sentTime
}): ReactElement => {
  const router: Router = useRouter();

  const hasDeviceDetails: boolean = !!(deviceName || deviceModel || registrationTime);
  const organization: string | undefined = organizationName ?? tenantDomain;

  /**
   * Dismisses the notification details screen.
   */
  const handleDismiss = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <Text style={styles.title}>{title || 'New Device Registered'}</Text>
        <Text style={styles.subtitle}>
          A new device was registered to your account
        </Text>
        {!!sentTime && <Text style={styles.timeText}>Received {getTimeFromNow(sentTime)}</Text>}
      </View>
      {hasDeviceDetails && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Details</Text>
          {!!deviceName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Device:</Text>
              <Text style={styles.infoValue}>{deviceName}</Text>
            </View>
          )}
          {!!deviceModel && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Model:</Text>
              <Text style={styles.infoValue}>{deviceModel}</Text>
            </View>
          )}
          {!!registrationTime && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Registered at:</Text>
              <Text style={styles.infoValue}>{formatDateTime(registrationTime)}</Text>
            </View>
          )}
        </View>
      )}
      {!!(organization || username || ipAddress) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          {!!organization && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Organization:</Text>
              <Text style={styles.infoValue}>{organization}</Text>
            </View>
          )}
          {!!username && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Username:</Text>
              <Text style={styles.infoValue}>{getUsername(username)}</Text>
            </View>
          )}
          {!!ipAddress && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>IP Address:</Text>
              <Text style={styles.infoValue}>{ipAddress}</Text>
            </View>
          )}
        </View>
      )}
      <View style={[styles.section, styles.securitySection]}>
        <View style={styles.securityMsg}>
          <Text style={styles.securityText}>
            If you do not recognize this device, remove it from your account immediately and
            reset your password.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={handleDismiss}
      >
        <Text style={styles.dismissButtonText}>Got it</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card.background,
    borderColor: theme.colors.card.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 16,
    alignSelf: 'stretch'
  },
  header: {
    gap: 2,
    paddingBottom: 12,
    borderBottomColor: theme.colors.card.border,
    borderBottomWidth: 1
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.typography.primary
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.typography.secondary
  },
  timeText: {
    fontSize: 12,
    fontWeight: '400',
    color: theme.colors.typography.secondary
  },
  section: {
    gap: 4
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.typography.primary,
    marginBottom: 8
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.typography.secondary
  },
  infoValue: {
    flexShrink: 1,
    fontSize: 13,
    color: theme.colors.typography.primary,
    textAlign: 'right'
  },
  bodyText: {
    fontSize: 14,
    color: theme.colors.typography.primary
  },
  securitySection: {
    paddingTop: 12,
    borderTopColor: theme.colors.card.border,
    borderTopWidth: 1
  },
  securityMsg: {
    padding: 8,
    backgroundColor: theme.colors.alert.warning.background,
    borderWidth: 1,
    borderColor: theme.colors.alert.warning.text,
    borderRadius: 8
  },
  securityText: {
    fontSize: 13,
    color: theme.colors.alert.warning.text,
    textAlign: 'center'
  },
  dismissButton: {
    backgroundColor: theme.colors.button.primary.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  dismissButtonText: {
    color: theme.colors.button.primary.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  }
})

export default DeviceRegistrationNotification;
