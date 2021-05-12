import React from 'react';
import {
  EntityList,
  EntityListItem,
  DropdownList,
  DropdownListItem,
} from '@contentful/forma-36-react-components';
import { Asset } from '../../types';

type LayoutElementsPanelProps = {
  elements: Asset[];
};

const LayoutElementsPanel = ({ elements }: LayoutElementsPanelProps) => {
  console.log({ elements });

  return (
    <div style={{ width: '100%' }}>
      <EntityList>
        {elements.map((asset) => {
          
          const thumbnail = asset.type === 'image/jpeg' ? asset.element.url : '';

          return (
            <EntityListItem
              title={asset.title}
              description={`Filename: ${asset.filename}`}
              withThumbnail={asset.type === 'image/jpeg'}
              thumbnailUrl={thumbnail}
              status="published"
              dropdownListElements={
                <DropdownList>
                  <DropdownListItem isTitle>Actions</DropdownListItem>
                  <DropdownListItem>Edit</DropdownListItem>
                  <DropdownListItem>Download</DropdownListItem>
                  <DropdownListItem>Remove</DropdownListItem>
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
