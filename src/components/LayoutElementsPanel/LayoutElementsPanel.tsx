import React from 'react';
import {
  EntityList,
  EntityListItem,
  DropdownList,
  DropdownListItem,
} from '@contentful/forma-36-react-components';
import { Asset, Draggable } from '../../types';

type LayoutElementsPanelProps = {
  elements: Draggable[];
  onSetPublish: (id: number, value: boolean) => void;
};

const LayoutElementsPanel = ({
  elements,
  onSetPublish,
}: LayoutElementsPanelProps) => {
  const assetList = elements.filter((element) => element.asset);

  console.log({ elements });

  // const handleSetPublishState = (index: number, value: boolean) => {
  //   console.log(
  //     `handleSetPublishState ${value ? 'published' : 'unpublished'}`,
  //   );
  // }

  return (
    <div style={{ width: '100%' }}>
      <EntityList>
        {assetList.map((element, index) => {
          const { asset } = element;
          const thumbnail =
            asset.type === 'image/jpeg' ? asset.element.url : '';

          return (
            <EntityListItem
              title={asset.title}
              description={`Filename: ${asset.filename}`}
              withThumbnail={asset.type === 'image/jpeg'}
              thumbnailUrl={thumbnail}
              status={element.published ? 'published' : 'draft'}
              dropdownListElements={
                <DropdownList>
                  <DropdownListItem isTitle>Actions</DropdownListItem>
                  <DropdownListItem
                    onClick={() => onSetPublish(index, !element.published)}
                  >
                    {element.published ? 'Unpublish' : 'Publish'}
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
