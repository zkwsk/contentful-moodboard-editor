import { Draggable, Layout } from '../../../types';

const mergeState = (persistedState: Layout, localState?: Layout) => {
  if (!localState) {
    // We're creating a new record
    return persistedState;
  }

  // const assetIds = persistedState.elements.map(({ asset }) => asset.id);

  // // Filter existing state so only records that match ids on asset state are
  // // included. This is done to take account for assets being deleted.
  // const filteredExistingElements = localState.elements.filter(({ asset }) =>
  //   assetIds.includes(asset.id),
  // );

  // const localStateIds = filteredExistingElements.map(
  //   ({ asset }) => asset.id,
  // );

  // const newElements = persistedState.elements.filter(
  //   ({ asset }) => !localStateIds.includes(asset.id),
  // );

  // return {
  //   ...localState,
  //   elements: [...filteredExistingElements, ...newElements],
  // } as Layout;

  // Custom filter function to compare by asset ID
  const getAssetId = ({ asset }: Draggable) => !!asset.id;

  const assetIds = persistedState.elements.map(({ asset }) => asset.id);

  // const filtederedState = localState.elements.filter(({ asset }) =>
  //   assetIds.includes(asset.id),
  // );

  // const findById = (id: string) => {
  //   return ({asset} : Draggable) => { return asset.id === id; }

  const mergedElements = assetIds.map((id) => {
    const stateElement = localState.elements.find(
      ({ asset }) => asset.id === id,
    );
    const assetElement = persistedState.elements.find(
      ({ asset }) => asset.id === id,
    );
    if (stateElement && assetElement) {
      return {
        ...stateElement,
        originalHeight: assetElement?.originalHeight,
        originalWidth: assetElement?.originalWidth,
        asset: assetElement?.asset,
      };
    }
    if (!stateElement && assetElement) {
      return assetElement;
    }
    throw new Error('Invalid merge');
  });

  return { ...localState, elements: mergedElements };
};

export default mergeState;
