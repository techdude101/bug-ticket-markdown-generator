import { replaceText, replaceTextAt } from '../../src/utils/helpers';

describe('Helper functions', () => {
  it.each`
    text | matcher | replacementtext | expected
    ${'Testing <code>'} | ${'<code>'} | ${'123'} | ${'Testing 123'}
    ${''} | ${''} | ${''} | ${null}
    ${'Test'} | ${''} | ${'123'} | ${null}
    ${'Testing <code>'} | ${'<code>'} | ${''} | ${'Testing <code>'}
    ${''} | ${'<code>'} | ${'123'} | ${null}
    `('Replace $text where placeholder = $matcher with $replacementtext',
  ({
    text, matcher, replacementtext, expected,
  }) => {
    const result = replaceText(text, matcher, replacementtext);
    expect(result).toBe(expected);
  });

  it.each`
    text | matcher | position | replacementtext | expected
    ${'Testing <code>'} | ${'<code>'} | ${0} | ${'123'} | ${'Testing 123'}
    ${'ABC <code> <code>'} | ${'<code>'} | ${3} | ${'123'} | ${'ABC 123 <code>'}
    ${'ABC <code> <code>'} | ${'<code>'} | ${9} | ${'123'} | ${'ABC <code> 123'}
    ${'ABC <code> <code>'} | ${'<code>'} | ${-1} | ${'123'} | ${null}
    ${'ABC <code> <code>'} | ${'<code>'} | ${20} | ${'123'} | ${null}
    ${'ABC <code> <code>'} | ${'<code>'} | ${'3'} | ${'123'} | ${null}
    `('Replace $text where placeholder = $matcher at $position with $replacementtext',
  ({
    text, matcher, position, replacementtext, expected,
  }) => {
    const result = replaceTextAt(text, matcher, replacementtext, position);
    expect(result).toBe(expected);
  });
});
