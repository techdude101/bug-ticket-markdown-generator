const PRINTABLE_CHARACTERS = '[\\s\\w\\d:"!£$%^&*()_+-=#~\\xC0\\-\\xff]+';
const ALPHA_NUMERIC_WHITESPACE = '[\\s\\w\\d:\\xC0-\\xff]+';
const ALPHA_WHITESPACE = '[\\s\\w\\xC0-\\xff]+';
const DIGITS_AND_COMMA = '[\\d,]+';

export default {
  PRINTABLE_CHARACTERS,
  ALPHA_NUMERIC_WHITESPACE,
  ALPHA_WHITESPACE,
  DIGITS_AND_COMMA,
};
