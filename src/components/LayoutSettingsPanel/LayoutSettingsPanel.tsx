import React, { useEffect, useState } from 'react';
import { paramCase } from "param-case";
import {
  CheckboxField,
  Form,
  FieldGroup,
  TextField,
} from '@contentful/forma-36-react-components';
import isEqual from "lodash-es/isEqual";

import { usePrevious } from "../../utilities/usePrevious";


import { LayoutSettings } from '../../types';

type LayoutSettingsPanelProps = {
  settings: LayoutSettings;
  layoutIds: string[];
  onUpdate: (props: LayoutSettings) => void;
};

const LayoutSettingsPanel = ({
  settings,
  layoutIds,
  onUpdate,
}: LayoutSettingsPanelProps) => {
  const { title, enabled, aspectRatio, maxWidth, isValid } = settings;
  const [ validation, setValidation ] = useState({
    title: '',
    aspectRatio: ''
  })
  const [state, setState] = useState(settings);
  const prevState = usePrevious(state);
  const prevValidation = usePrevious(validation);

  const isTitleValid = (input: string) => {
    const titleRegex = /^[\w ]*[^\W_][\w ]*$/i;
    return titleRegex.test(input)
  }

  const isIdDuplicated = (id: string) => {
    return layoutIds.includes(id);
  }

  const generateId = (input: string) => {
    return paramCase(input.trim());
  }

  const isAspectValid = (input: string) => {
    const list = input.split(":");
    if (list.length !== 2) {
      return false;
    }
    if (isNaN(parseInt(list[0], 10)) || isNaN(parseInt(list[1], 10))) {
      return false;
    }
    return true;
  }



  // Check if component is valid
  useEffect(() => {
        if (isEqual(state, prevState)) {
          return;
        }

    const hasValidationErrors = () => {
      return Object.values(validation).some((element) => !!element);
    };


    hasValidationErrors() && state.isValid
      ? setState({ ...state, isValid: false })
      : setState({ ...state, isValid: true });
  }, [validation, prevState, state])


  // Validate title and layoutId
  useEffect(() => {
    if (isEqual(validation, prevValidation)) {
      return;
    }
    if (!(state.title)) {
      setValidation({
        ...validation,
        title:
          'You need to fill out a title',
      });
      return;
    }

    if (!isTitleValid(state.title)) {
      setValidation({
        ...validation,
        title: 'Invalid title. Use alphanumeric characters, 0-9 and _ only.',
      });
      return;
    }

    if (isIdDuplicated(state.layoutId)) {
      setValidation({
        ...validation,
        title: 'There is already a layout with the same title',
      });
      return;
    }


    setValidation({...validation, title: ''})
  }, [state.title, state.layoutId, isIdDuplicated])

  // Validate aspect ratio
  useEffect(() => {
    if (isEqual(validation, prevValidation)) {
      return;
    }
    if (isAspectValid(state.aspectRatio)) {
      setValidation({ ...validation, aspectRatio: '' });
    } else {
      const newValidationState = {
        ...validation,
        aspectRatio: `You need to suply two numbers in the format "width:height". For example "4:5".`,
      };
      if (!isEqual(prevValidation, newValidationState)) {
        setValidation(newValidationState);
      }
    }
  }, [state.aspectRatio, prevValidation, validation])

  // Update parent when state is valid
  useEffect(() => {
    if (state.isValid && !isEqual(settings, state)) {
      onUpdate(state);
    }
  }, [state, onUpdate])

  // Populate settings from parent to internal state
  useEffect(() => {
    setState({...settings});
  }, [settings]);

  // const handleBlur = ()   => {
  //   if (state.isValid) {
  //     onUpdate(state);
  //   }
  // };

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
            value={state.title}
            textInputProps={{ placeholder: 'Mobile or Desktop' }}
            onChange={(event) => {
              const value = event.target.value.trim();
              const layoutId = generateId(value);
              setState({ ...state, title: value, layoutId });

              // if (isTitleValid(value)) {
              //   const layoutId = generateId(value);
                
              //   if (isIdDuplicated(layoutId)) {
              //     setValidation({...validation, title: 'There is already a layout with the same title'});
              //   } else {
              //     setValidation({...validation, title: ''})
              //     setState({ ...state, title: value, layoutId });
              //   }
              // } else {
              //   setValidation({...validation, title: 'Invalid title. Use alphanumeric characters, 0-9 and _ only.'})
              // }
              
            }}
            // onBlur={handleBlur}
            validationMessage={validation.title}
          />
          <CheckboxField
            name="enabled"
            id="enabled"
            labelText="Enable layout"
            helpText="Allows you to disable the current layout without deleting."
            checked={state.enabled}
            onChange={(event) => {
              // Since checkboxes don't have a onBlur we update state directly
              // on the parent component which will in turn push the updated
              // state back to this component.
              onUpdate({ ...state, enabled: event.currentTarget.checked });
            }}
          />
          <TextField
            required
            name="aspectRatio"
            id="aspectRatio"
            labelText="Aspect ratio"
            textInputProps={{ placeholder: '3:4' }}
            value={state.aspectRatio}
            helpText="The size of the moodboard is dynamic to the page width. By entering an aspect ratio you define how tall the moodboard will be."
            validationMessage={validation.aspectRatio}
            onChange={(event) => {
              setState({...state, aspectRatio: event.currentTarget.value});
            }}
            // onBlur={()=> handleBlur}
          />
          <TextField
            name="maxWidth"
            id="maxWidth"
            labelText="Max width"
            textInputProps={{ placeholder: '880px' }}
            value={maxWidth ? `${maxWidth}px` : ''}
            helpText="The maximum screen width in pixels this layout will be effective at. If you do not supply a max width the layout will stay in effect at the widest possible width of the site. If another layout with a narrower width is present, that layout will take precedense at narrower widths."
          />
        </FieldGroup>
      </Form>
    </div>
  );
};

export default LayoutSettingsPanel;
