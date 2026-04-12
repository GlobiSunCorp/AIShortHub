const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email = '') {
  return emailPattern.test(email.trim());
}

export function isValidUrl(url = '') {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function minLength(value = '', min = 1) {
  return value.trim().length >= min;
}
