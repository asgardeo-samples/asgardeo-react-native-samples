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

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { authorize } from 'react-native-app-auth';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import { config } from '../config';
import { UserContext } from '../contexts/UserContext';

export const HomeScreen = () => {
  const { setIsLoggedIn } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting authentication...');
      console.log('📝 Config:', config);
      
      const result = await authorize(config);
      
      console.log('✅ Authentication successful!');
      console.log('📦 Full Response:', JSON.stringify(result, null, 2));
      console.log('🔑 Access Token:', result.accessToken);
      console.log('🆔 ID Token:', result.idToken);
      console.log('🔄 Refresh Token:', result.refreshToken);
      console.log('📅 Token Expiry:', result.accessTokenExpirationDate);
      console.log('🔐 Scopes:', result.scopes);

      await RNSecureStorage.setItem('authorizeResponse', JSON.stringify(result), {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
      console.log('💾 Tokens stored securely!');
      setIsLoggedIn(true);
    } catch (error: any) {
      // Handle user cancellation gracefully
      if (error.message === 'User cancelled flow') {
        console.log('ℹ️ User cancelled authentication');
        // Don't show error for user cancellation, just reset state
      } else {
        console.error('❌ Authentication failed:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image 
          source={require('../../images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Secure Authentication</Text>
        <Text style={styles.subtitle}>
          Sign in with Asgardeo to access your account
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          onPress={signIn} 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? '⏳ Authenticating...' : '🔐 Sign In with Asgardeo'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.securityBadge}>
          <Text style={styles.securityText}>🔒 Secured by Asgardeo</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  button: {
    backgroundColor: '#FF7300',
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#FF7300',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#FFB366',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  securityBadge: {
    marginTop: 20,
    alignItems: 'center',
  },
  securityText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
