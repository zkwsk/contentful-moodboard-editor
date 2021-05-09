import {
  CheckboxField,
  Form,
  FieldGroup,
  TextField,
} from '@contentful/forma-36-react-components';
import React from 'react';

import { LayoutPanelProps } from '../../types';

const LayoutSettingsPanel = ({ newRecord }: LayoutPanelProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Form
        style={{ marginTop: 'var(--spacing-2xl)', maxWidth: '30em' }}
        onSubmit={() => console.log('submit')}
        spacing="default"
      >
        <FieldGroup>
          <TextField
            required
            name="layoutTitle"
            id="layoutTitle"
            labelText="Layout title"
            value=""
            textInputProps={{ placeholder: 'Mobile or Desktop' }}
          />
          <CheckboxField
            name="disabled"
            id="disabled"
            labelText="Enable layout"
            helpText="Allows you to disable the current layout without deleting."
            checked={true}
          />
          <TextField
            required
            name="aspectRatio"
            id="aspectRatio"
            labelText="Aspect ratio"
            textInputProps={{ placeholder: '3:4' }}
            helpText="The size of the moodboard is dynamic to the page width. By entering an aspect ratio you define how tall the moodboard will be."
          />
          <TextField
            name="maxWidth"
            id="maxWidth"
            labelText="Max width"
            textInputProps={{ placeholder: '880px' }}
            helpText="The maximum screen width in pixels this layout will be effective at. If you do not supply a max width the layout will stay in effect at the widest possible width of the site. If another layout with a narrower width is present, that layout will take precedense at narrower widths."
          />
        </FieldGroup>
      </Form>
    </div>
  );
};

export default LayoutSettingsPanel;
