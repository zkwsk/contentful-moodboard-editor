import { Draggable } from '../../../types';

type mergeDraggableElementsProps = {
  persisted: Draggable[];
  localState: Draggable[];
};

const mergeDraggableElements = ({
  persisted,
  localState,
}: mergeDraggableElementsProps) => {
  const persistedIds = persisted.map(({ asset }) => asset.id);

  return persistedIds.map((id) => {
    const localElement = localState.find(({ asset }) => asset.id === id);
    const persistedElement = persisted.find(({ asset }) => asset.id === id);
    if (localElement && persistedElement) {
      return {
        ...localElement,
        originalHeight: persistedElement?.originalHeight,
        originalWidth: persistedElement?.originalWidth,
        asset: persistedElement?.asset,
      };
    }
    if (!localElement && persistedElement) {
      return persistedElement;
    }
    throw new Error('Invalid merge');
  });
};

export default mergeDraggableElements;
