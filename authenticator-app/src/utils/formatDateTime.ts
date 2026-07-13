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

/**
 * Format a timestamp into a user friendly, localized date-time string
 * (e.g. "Jun 10, 2026, 2:45 PM").
 *
 * @param value - An ISO-8601 string or milliseconds since epoch.
 * @returns The formatted date-time string, or the original value if it cannot be parsed.
 */
const formatDateTime = (value: string | number): string => {
  // ISO-8601 timestamps from the server may carry more than 3 fractional second
  // digits (e.g. java.time.Instant), which some date parsers reject. Trim to milliseconds.
  const normalized: string | number = typeof value === 'string'
    ? value.replace(/\.(\d{3})\d+(?=Z|[+-])/, '.$1')
    : value;

  const date: Date = new Date(normalized);

  if (isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(undefined, {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export default formatDateTime;
