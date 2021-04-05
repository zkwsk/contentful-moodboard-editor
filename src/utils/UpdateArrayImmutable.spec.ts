import updateArrayImmutable from './UpdateArrayImmutable';

describe('Update Array Immutable', () => {
  it('Can update element', () => {
    const list = ['a', 'b', 'c']

    const newList = updateArrayImmutable(list, 1, 'z');

    expect(newList).toEqual(['a', 'z', 'c']);
  });
});
