import findListDifference from './findListDifference';

describe('Find List Difference', () => {
  it('Can diff two simple lists', () => {
    const listA = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6}
    ];

    const listB = [
      {id: 1},
      {id: 2},
      {id: 3},
    ]

    const newList = findListDifference(listA, listB, "id");

    expect(newList).toEqual([
      {id: 4},
      {id: 5},
      {id: 6}
    ]);
  });

  it('Can diff two lists', () => {
    const listA = [
      {id: 1},
      {id: 2},
      {id: 4},
      {id: 5},
      {id: 7}
    ];

    const listB = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6}
    ]

    const newList = findListDifference(listA, listB, "id");

    expect(newList).toEqual([
      {id: 7}
    ]);
  });

  it('Can populate empty list lists', () => {
    const listA = [
      {id: 1},
      {id: 2},
      {id: 3},
    ];

    const listB = [

    ]

    const newList = findListDifference(listA, listB, "id");

    expect(newList).toEqual([
      {id: 1},
      {id: 2},
      {id: 3},
    ]);
  });

    it('Can compare to identical lists', () => {
    const listA = [
      {id: 1},
      {id: 2},
      {id: 3},
    ];

    const listB = [
      {id: 1},
      {id: 2},
      {id: 3},
    ]

    const newList = findListDifference(listA, listB, "id");

    expect(newList).toEqual([]);
  });
});
