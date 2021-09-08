import React from 'react';
import {
  EntityList,
  EntityListItem,
  DropdownList,
  DropdownListItem,
} from '@contentful/forma-36-react-components';
import { Draggable, HandleAlignElementProps } from '../../types';

type LayoutElementsPanelProps = {
  elements: Draggable[];
  onSetPublish: (id: string, value: boolean) => void;
  onAlignElement: (options: HandleAlignElementProps) => void;
};

const LayoutElementsPanel = ({
  elements,
  onSetPublish,
  onAlignElement,
}: LayoutElementsPanelProps) => {
  const assetList = elements.filter((element) => element.asset);

  return (
    <div style={{ width: '100%' }}>
      <EntityList>
        {assetList.map((element, index) => {
          const { asset } = element;
          const thumbnail =
            asset.type === 'image/jpeg' ? asset.element.url : '';

          return (
            <EntityListItem
              key={asset.id}
              title={asset.title}
              description={`Filename: ${asset.filename}`}
              withThumbnail={asset.type === 'image/jpeg'}
              thumbnailUrl={thumbnail}
              status={element.published ? 'published' : 'draft'}
              dropdownListElements={
                <DropdownList>
                  <DropdownListItem isTitle>Actions</DropdownListItem>
                  <DropdownListItem
                    onClick={() => onSetPublish(asset.id, !element.published)}
                  >
                    {element.published ? 'Unpublish' : 'Publish'}
                  </DropdownListItem>
                  <DropdownListItem
                    onClick={() =>
                      onAlignElement({ id: asset.id, align: 'left' })
                    }
                  >
                    Left align element
                  </DropdownListItem>
                  <DropdownListItem
                    onClick={() =>
                      onAlignElement({ id: asset.id, align: 'center' })
                    }
                  >
                    Center element
                  </DropdownListItem>
                  <DropdownListItem
                    onClick={() =>
                      onAlignElement({ id: asset.id, align: 'right' })
                    }
                  >
                    Right align element
                  </DropdownListItem>
                  <DropdownListItem
                    onClick={() =>
                      onAlignElement({ id: asset.id, align: 'bottom' })
                    }
                  >
                    Bottom align element
                  </DropdownListItem>
                </DropdownList>
              }
            />
          );
        })}
      </EntityList>
    </div>
  );
};

export default LayoutElementsPanel;
