import syncronizedState from './syncronizedState';

describe('Syncronize state', () => {
  it('Can syncronize two lists simple', () => {
    const imagesList = [
      {id: 1},
      {id: 2},
      {id: 3}
    ];

    const localState = [
      {id: 1},
      {id: 2}
    ]

    // @ts-ignore
    const newList = syncronizedState(imagesList, localState);

    expect(newList).toEqual([
      {id: 1},
      {id: 2},
      {id: 3},
    ]);
  });

  it('Can syncronize two lists', () => {
    const imagesList = [
      {id: 1},
      {id: 2},
      {id: 4},
      {id: 5},
      {id: 7}
    ];

    const localState = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6}
    ]

    // @ts-ignore
    const newList = syncronizedState(imagesList, localState);

    expect(newList).toEqual([
      {id: 1},
      {id: 2},
      {id: 4},
      {id: 5},
      {id: 7}
    ]);
  });

  it('Can syncronize two lists (server empty)', () => {
    const imagesList = [];

    const localState = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6}
    ]

    // @ts-ignore
    const newList = syncronizedState(imagesList, localState);

    expect(newList).toEqual([]);
  });

  it('Can syncronize two lists', () => {
    const imagesList = [
      {id: 1},
      {id: 2},
      {id: 4},
      {id: 5},
      {id: 7},
      {id: 10},
      {id: 11},
      {id: 12},
      {id: 13},
      {id: 14}
    ];

    const localState = [
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 6},
      {id: 7},
      {id: 8},
      {id: 10, important: "don't delete"},
      {id: 14},
    ]

    // @ts-ignore
    const newList = syncronizedState(imagesList, localState);

    expect(newList).toEqual(expect.arrayContaining([
      {id: 1},
      {id: 2},
      {id: 4},
      {id: 5},
      {id: 7},
      {id: 10, important: "don't delete"},
      {id: 11},
      {id: 12},
      {id: 13},
      {id: 14}
    ]));
  });
});
