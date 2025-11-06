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

import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { logout } from 'react-native-app-auth';
import RNSecureStorage from 'rn-secure-storage';
import { config } from '../config';
import { UserContext } from '../contexts/UserContext';
import { Buffer } from 'buffer';

export const DashboardScreen = () => {
  const { setIsLoggedIn } = useContext(UserContext);
  const [authResponse, setAuthResponse] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showTokens, setShowTokens] = useState(false);

  useEffect(() => {
    RNSecureStorage.getItem('authorizeResponse').then((res: any) => {
      if (res) {
        const response = JSON.parse(res);
        setAuthResponse(response);
        
        // Decode the ID token to get user info
        if (response?.idToken) {
          const base64Url = response.idToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          // Decode base64 without atob (not available in React Native)
          const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
          setUserInfo(JSON.parse(jsonPayload));
        }
      }
    }).catch((err: any) => {
      console.log('Error getting auth response:', err);
    });
  }, []);

  const signOut = async () => {
    if (!authResponse?.idToken) {
      setIsLoggedIn(false);
      return;
    }

    try {
      await logout(config, {
        idToken: authResponse?.idToken,
        postLogoutRedirectUrl: config.postLogoutRedirectUrl,
      });

      await RNSecureStorage.removeItem('authorizeResponse');
      setIsLoggedIn(false);
    } catch (err) {
      console.log(err);
    }
  };

  const formatToken = (token: string) => {
    if (!token) return '';
    return `${token.substring(0, 20)}...${token.substring(token.length - 20)}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Text style={styles.badgeText}>Authenticated</Text>
        </View>
        <Text style={styles.greeting}>Welcome Back</Text>
        <Text style={styles.subtitle}>Asgardeo Identity Platform</Text>
      </View>

      <View style={styles.content}>
        {/* User Info Card */}
        {userInfo && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>User Profile</Text>
            </View>
            <View style={styles.cardContent}>
              {userInfo.sub && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>User ID</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>
                    {userInfo.sub}
                  </Text>
                </View>
              )}
              {userInfo.email && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoValue}>{userInfo.email}</Text>
                </View>
              )}
              {userInfo.name && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Display Name</Text>
                  <Text style={styles.infoValue}>{userInfo.name}</Text>
                </View>
              )}
              {userInfo.org_name && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Organization</Text>
                  <Text style={styles.infoValue}>{userInfo.org_name}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Session Info Card */}
        {authResponse && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Session Information</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Token Type</Text>
                <Text style={styles.infoValue}>{authResponse.tokenType}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Session Expires</Text>
                <Text style={styles.infoValue}>
                  {new Date(authResponse.accessTokenExpirationDate).toLocaleString()}
                </Text>
              </View>
              
              {authResponse.scopes && authResponse.scopes.length > 0 && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Granted Scopes</Text>
                  <Text style={styles.infoValue}>
                    {authResponse.scopes.join(', ') || 'openid, profile'}
                  </Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Access Token</Text>
                <Text style={styles.tokenValue} numberOfLines={2}>
                  {formatToken(authResponse.accessToken)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Advanced Token Details - Collapsible */}
        {authResponse && (
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.cardHeader}
              onPress={() => setShowTokens(!showTokens)}
            >
              <Text style={styles.cardTitle}>Advanced Details</Text>
              <Text style={styles.toggleText}>
                {showTokens ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
            
            {showTokens && (
              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Refresh Token</Text>
                  <Text style={styles.tokenValue} numberOfLines={2}>
                    {formatToken(authResponse.refreshToken)}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ID Token (JWT)</Text>
                  <Text style={styles.tokenValue} numberOfLines={3}>
                    {authResponse.idToken.substring(0, 60)}...
                  </Text>
                </View>
                
                {authResponse.authorizeAdditionalParameters?.session_state && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Session State</Text>
                    <Text style={styles.tokenValue} numberOfLines={2}>
                      {formatToken(authResponse.authorizeAdditionalParameters.session_state)}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>Powered by Asgardeo</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#FF7300',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  toggleText: {
    fontSize: 14,
    color: '#FF7300',
    fontWeight: '600',
  },
  cardContent: {
    padding: 20,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  tokenValue: {
    fontSize: 12,
    color: '#4B5563',
    fontFamily: 'monospace',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  signOutButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
