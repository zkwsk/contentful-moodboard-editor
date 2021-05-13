import { Asset, Draggable, Layout, LayoutSettings } from '../../../types';
import mergeState from './mergeState';

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

  const mockedLayoutsSettings = {
    layoutId: 'abc',
    title: 'abc',
    enabled: true,
    aspectRatio: '1:1',
    maxWidth: 800,
    isValid: true,
    snap: {
      x: 10,
      y: 10,
    },
  } as LayoutSettings;

  const mockedLayouts = {
    settings: mockedLayoutsSettings,
    elements: mockedElements,
  } as Layout;

  it('Test initial state', () => {
    const existingState = {
      settings: mockedLayoutsSettings,
      elements: [],
    } as Layout;

    const output = mergeState(mockedLayouts, existingState);

    expect(output).toEqual(mockedLayouts);
  });

  it('Test with same elements in assets and state', () => {
    const output = mergeState(mockedLayouts, mockedLayouts);

    console.log(output.elements);
    console.log(mockedLayouts.elements);

    expect(output).toEqual(mockedLayouts);
  });

  it('Elements are the same, but existing state has an updated property', () => {
    const assetState = mockedLayouts;

    const modifiedElement = { ...mockedLayouts.elements[0] };

    modifiedElement.height = 10;

    const existingState = {
      ...mockedLayouts,
      elements: [...mockedLayouts.elements],
    };

    existingState.elements[0] = modifiedElement;
    const output = mergeState(assetState, existingState);

    expect(output.elements).not.toEqual(assetState.elements);
    expect(output.elements[0].height).toBe(10);
  });

  it('Number of elements in state should always match assets', () => {
    const assetState = mockedLayouts;

    const modifiedElementList = [...mockedLayouts.elements];

    modifiedElementList.pop();

    const existingState = {
      ...mockedLayouts,
      elements: modifiedElementList,
    };

    const output = mergeState(assetState, existingState);

    console.log(output);

    expect(output).toEqual(assetState);
  });
});
