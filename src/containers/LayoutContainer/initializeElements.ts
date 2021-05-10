import { Asset, Draggable } from '../../types';

type initializeElementsProps = {
  assets: Asset[];
};

const initializeElements = ({ assets }: initializeElementsProps) => {
  return assets.map(
    (asset) =>
      ({
        height: asset.height,
        width: asset.width,
        originalHeight: asset.height,
        originalWidth: asset.width,
        top: 0,
        left: 0,
        element: asset,
      } as Draggable),
  );
};

export default initializeElements;
