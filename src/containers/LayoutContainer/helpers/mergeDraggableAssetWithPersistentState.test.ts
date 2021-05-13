import { Asset, Draggable } from '../../../types';
import mergeDraggableAssetWithPersistentState from './mergeDraggableAssetWithPersistentState';

describe('Test merging state', () => {
  const mockedAssets = [
    {
      id: 'id-1',
      filename: 'filename-id-1.jpg',
      title: 'File 1',
      type: 'image/jpeg',
      width: 100,
      height: 100,
      element: {
        url: 'http://fake-url.com/filename-id-1.jpg',
        description: 'abc',
      },
    },
    {
      id: 'id-2',
      filename: 'filename-id-2.jpg',
      title: 'File 2',
      type: 'image/jpeg',
      width: 130,
      height: 130,
      element: {
        url: 'http://fake-url.com/filename-id-2.jpg',
        description: 'abc',
      },
    },
    {
      id: 'id-3',
      filename: 'filename-id-3.jpg',
      title: 'File 3',
      type: 'image/jpeg',
      width: 200,
      height: 200,
      element: {
        url: 'http://fake-url.com/filename-id-3.jpg',
        description: 'abc',
      },
    },
  ] as Asset[];

  const mockedElements = [
    {
      published: true,
      height: 100,
      width: 100,
      originalHeight: 100,
      originalWidth: 100,
      position: {
        x: 0,
        y: 0,
      },
      asset: mockedAssets[0],
    },
    {
      published: true,
      height: 150,
      width: 120,
      originalHeight: 150,
      originalWidth: 120,
      position: {
        x: 0,
        y: 0,
      },
      asset: mockedAssets[1],
    },
    {
      published: true,
      height: 150,
      width: 120,
      originalHeight: 150,
      originalWidth: 120,
      position: {
        x: 39,
        y: 12,
      },
      asset: mockedAssets[2],
    },
  ] as Draggable[];

  it('Persisted list has elements and asset does not', () => {
    const output = mergeDraggableAssetWithPersistentState({
      persisted: mockedElements,
      assetState: [],
    });

    expect(output).toEqual([]);
  });

  it('Asset list has elements and persisted does not', () => {
    const output = mergeDraggableAssetWithPersistentState({
      persisted: [],
      assetState: mockedElements,
    });

    expect(output).toEqual(mockedElements);
  });

  it('Test with same elements in persisted and asset', () => {
    const output = mergeDraggableAssetWithPersistentState({
      persisted: mockedElements,
      assetState: mockedElements,
    });

    expect(output).toEqual(mockedElements);
  });

  it('Elements are the same, but existing state has an updated property', () => {
    const assetState = mockedElements;

    let modifiedElement = { ...mockedElements[0] };

    modifiedElement.height = 10;

    let modifiedList = [...mockedElements];
    modifiedList[0] = modifiedElement;

    const output = mergeDraggableAssetWithPersistentState({
      persisted: modifiedList,
      assetState,
    });

    expect(output).not.toEqual(mockedElements);
    expect(output[0].height).toBe(10);
  });

  it('Number of elements in state should always match assets', () => {
    const assetState = mockedElements;

    const modifiedElementList = [...mockedElements];

    modifiedElementList.pop();

    const output = mergeDraggableAssetWithPersistentState({
      persisted: modifiedElementList,
      assetState,
    });

    expect(output).toEqual(assetState);
  });
});
