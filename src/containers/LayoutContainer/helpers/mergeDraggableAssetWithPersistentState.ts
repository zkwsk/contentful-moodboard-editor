import { Draggable } from '../../../types';

type mergeDraggableAssetWithPersistentStateProps = {
  persisted: Draggable[];
  assetState: Draggable[];
};

const mergeDraggableAssetWithPersistentState = ({
  persisted,
  assetState,
}: mergeDraggableAssetWithPersistentStateProps) => {
  const assetStateIds = assetState.map(({ asset }) => asset.id);

  return assetStateIds.map((id) => {
    const assetElement = assetState.find(({ asset }) => asset.id === id);
    const persistedElement = persisted.find(({ asset }) => asset.id === id);
    if (assetElement && persistedElement) {
      return {
        ...persistedElement,
        originalHeight: assetElement?.originalHeight,
        originalWidth: assetElement?.originalWidth,
        asset: assetElement?.asset,
      };
    }
    if (assetElement && !persistedElement) {
      return assetElement;
    }
    throw new Error('Invalid merge');
  });
};

export default mergeDraggableAssetWithPersistentState;
