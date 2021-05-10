import React from 'react';
import {
  EntityList,
  EntityListItem,
  DropdownList,
  DropdownListItem,
} from '@contentful/forma-36-react-components';
import { Draggable } from '../../types';

type LayoutElementsPanelProps = {
  elements: Draggable[];
};

const LayoutElementsPanel = ({ elements }: LayoutElementsPanelProps) => {
  return (
    <div style={{ width: '100%' }}>
      <EntityList>
        <EntityListItem
          title="My image"
          description="Some description"
          thumbnailUrl="https://via.placeholder.com/400x400"
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
      </EntityList>
    </div>
  );
};

export default LayoutElementsPanel;
