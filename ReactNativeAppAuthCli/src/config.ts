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

import { ASGARDEO_ISSUER, ASGARDEO_CLIENT_ID, ASGARDEO_REDIRECT_URL, ASGARDEO_POST_LOGOUT_REDIRECT_URL } from '@env';

export const config = {
  issuer: ASGARDEO_ISSUER,
  clientId: ASGARDEO_CLIENT_ID,
  redirectUrl: ASGARDEO_REDIRECT_URL,
  scopes: ['openid', 'profile'],
  postLogoutRedirectUrl: ASGARDEO_POST_LOGOUT_REDIRECT_URL,
};
