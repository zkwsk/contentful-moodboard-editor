import objectIsEmpty from './objectIsEmpty';

describe('Object is empty', () => {
  test('With empty object', () => {
    const obj = {};
    expect(objectIsEmpty(obj)).toBe(true);
  });
  test('With non-empty object', () => {
    const obj = { foo: 'bar' };
    expect(objectIsEmpty(obj)).toBe(false);
  });
});
