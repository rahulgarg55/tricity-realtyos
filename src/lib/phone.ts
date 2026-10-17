/**
 * Utility functions for validating and normalizing Indian phone numbers,
 * specifically optimized for Tricity real estate leads (Chandigarh, Mohali, Zirakpur, Panchkula).
 */

export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return "";
  
  // Remove all non-digit characters except leading plus
  let cleaned = rawPhone.trim().replace(/[^\d+]/g, "");

  // If starts with 0091, replace with +91
  if (cleaned.startsWith("0091")) {
    cleaned = "+91" + cleaned.slice(4);
  }

  // If starts with 0 and followed by 10 digits
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = "+91" + cleaned.slice(1);
  }

  // If 10 digits without country code, add +91
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return "+91" + cleaned;
  }

  // If 12 digits starting with 91
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return "+" + cleaned;
  }

  // If already starts with +91 and 10 digits follow
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return cleaned;
  }

  return cleaned;
}

export function isValidIndianMobile(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return /^\+91[6-9]\d{9}$/.test(normalized);
}

export function formatIndianPhoneDisplay(normalizedPhone: string): string {
  if (/^\+91(\d{5})(\d{5})$/.test(normalizedPhone)) {
    return normalizedPhone.replace(/^\+91(\d{5})(\d{5})$/, "+91 $1 $2");
  }
  return normalizedPhone;
}
