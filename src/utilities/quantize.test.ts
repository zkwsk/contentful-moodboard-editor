import quantize from './quantize';

describe('Quantize values', () => {
  test('Quantize 1 by 0', () => {
    expect(quantize(1, 0)).toBe(1);
  });
  test('Quantize 1 by 0', () => {
    expect(quantize(1.1, 0)).toBe(1.1);
  });
  test('Quantize 0 by 10', () => {
    expect(quantize(0, 10)).toBe(0);
  });
  test('Quantize 5 by 10', () => {
    expect(quantize(4.5, 10)).toBe(0);
  });
  test('Quantize 6 by 10', () => {
    expect(quantize(6, 10)).toBe(10);
  });
  test('Quantize 60 by 10', () => {
    expect(quantize(60, 10)).toBe(60);
  });
  test('Quantize 64 by 10', () => {
    expect(quantize(64, 10)).toBe(60);
  });
  test('Quantize 19 by 36', () => {
    expect(quantize(19, 36)).toBe(36);
  });
  test('Quantize 12 by 19.8', () => {
    expect(quantize(12, 19.8)).toBe(19.8);
  });
  test('Quantize 9.9 by 19.8', () => {
    expect(quantize(9.9, 19.8)).toBe(19.8);
  });
  test('Quantize 9.8 by 19.8', () => {
    expect(quantize(9.8, 19.8)).toBe(0);
  });
});
