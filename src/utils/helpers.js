export const replaceText = (text, matcher, replacementText) => {
  if (!matcher) return null;
  if (!replacementText) return text;
  if (!text) return null;
  return text.replace(matcher, replacementText);
};

export const replaceTextAt = (text, matcher, replacementText, startPosition = 0) => {
  if (startPosition < 0) return null;
  if (startPosition > text.length) return null;
  if (typeof startPosition !== 'number') return null;
  if (startPosition === 0) return text.replace(matcher, replacementText);
  const firstPart = text.substring(0, startPosition);
  let secondPart = text.substring(startPosition, text.length);
  secondPart = replaceText(secondPart, matcher, replacementText);
  return firstPart + secondPart;
};

/**
 *
 * @param {String} text
 * @param {Number} maxLength
 * @returns Boolean
 */
export const isTextValid = (text, maxLength = 50) => {
  if (!text && text.length === 0) return true;
  if (text && text.length < 1) return false;
  const trimmedValue = text.trim();
  const textLength = trimmedValue.length;
  if (textLength < 1) return false;
  if (textLength > maxLength) return false;
  return true;
};

export const getBrowserVersion = () => {
  const browser = navigator.userAgent;
  if (browser.includes('Edg')) return 'Edge';
  if (browser.includes('Firefox')) return 'Firefox';
  if (browser.includes('Trident')) return 'IE';
  if (browser.includes('Chrome')) return 'Chrome';
  return null;
};

export const isBrowserMicrosoftEdge = () => {
  const browser = getBrowserVersion();
  if (!browser) return null;
  return browser.includes('Edg');
};

export const getTemplateFromLocalStorage = () => {
  if (localStorage.template) return JSON.parse(localStorage.getItem('template'));
  return null;
};
