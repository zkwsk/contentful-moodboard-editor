import constrainMaxWidth from './constrainMaxWidth';

describe('Test constrain max width', () => {
  it('Will constrain large element', () => {
    const mockLargeElement = { height: 1000, width: 1200, constraint: 500 };

    const outputElement = constrainMaxWidth(mockLargeElement);

    expect(outputElement.maxHeight).toBeLessThan(500);
    expect(outputElement.maxWidth).toBe(500);
  });

  it('Will not constrain small element', () => {
    const mockSmallElement = { height: 300, width: 450, constraint: 500 };

    const outputElement = constrainMaxWidth(mockSmallElement);

    expect(outputElement.maxHeight).toBe(300);
    expect(outputElement.maxWidth).toBe(450);
  });
});
