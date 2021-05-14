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
import s from '../../utilities/stringify';


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
  const [ validation, setValidation ] = useState({
    title: '',
    aspectRatio: ''
  })
  const [state, setState] = useState(settings);
  const prevValidation = usePrevious(validation);

  const isTitleValid = (input: string) => {
    const titleRegex = /^[\w ]*[^\W_][\w ]*$/gm;
    return titleRegex.test(input)
  }

  const isIdDuplicated = (id: string) => {
    return layoutIds.includes(id) && id !== settings.layoutId;
  };

  const generateId = (input: string) => {
    return paramCase(input.trim());
  }

  const isAspectValid = (input: string) => {
    const regex = /^\d*:\d*$/i;
    return regex.test(input);
  }



  // Check if component is valid
  useEffect(() => {
    if (isEqual(validation, prevValidation)) {
      return;
    }

    const hasValidationErrors = () => {
      return Object.values(validation).some((element) => !!element);
    };

    hasValidationErrors() && state.isValid.settings
      ? setState({ ...state, isValid: { ...state.isValid, settings: false } })
      : setState({ ...state, isValid: { ...state.isValid, settings: true } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validation])


  // Validate title and layoutId
  useEffect(() => {
    if (!state.title) {
      setValidation({
        ...validation,
        title: 'You need to fill out a title',
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
    setValidation({ ...validation, title: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.title, state.layoutId]);

  // Validate aspect ratio
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.aspectRatio])



  // Populate settings from parent to internal state
  useEffect(() => {
    if (!isEqual(settings, state)) {
      setState({ ...settings });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const persistState = () => {
    if (!isEqual(settings, state)) {
      onUpdate(state);
    }
  };

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
              //     setValidation({
              //       ...validation,
              //       title: 'There is already a layout with the same title',
              //     });
              //   } else {
              //     setValidation({ ...validation, title: '' });
              //     setState({ ...state, title: value, layoutId });
              //   }
              // } else {
              //   setValidation({
              //     ...validation,
              //     title:
              //       'Invalid title. Use alphanumeric characters, 0-9 and _ only.',
              //   });
              // }
            }}
            onBlur={persistState}
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
              setState({ ...state, aspectRatio: event.currentTarget.value });
            }}
            onBlur={persistState}
          />
          <TextField
            name="maxWidth"
            id="maxWidth"
            labelText="Max width"
            // textInputProps={{ placeholder: '880px' }}
            value={s(state.maxWidth)}
            onChange={(event) => {
              setState({
                ...state,
                maxWidth: parseInt(event.currentTarget.value, 10) || 2000,
              });
            }}
            onBlur={persistState}
            helpText="The maximum screen width in pixels this layout will be effective at. If you do not supply a max width the layout will stay in effect at the widest possible width of the site. If another layout with a narrower width is present, that layout will take precedense at narrower widths."
          />
          <TextField
            name="snapX"
            id="snapX"
            labelText="Snap value X-axis"
            // textInputProps={{ placeholder: '880px' }}
            value={state.snap?.x ? s(state.snap.x) : ''}
            onChange={(event) => {
              setState({
                ...state,
                snap: {
                  ...state.snap,
                  x: parseInt(event.currentTarget.value, 10),
                },
              });
            }}
            onBlur={persistState}
            helpText="The number of pixels resizing and dragging should snap to on the x axis."
          />
          <TextField
            name="snapY"
            id="snapY"
            labelText="Snap value Y-axis"
            // textInputProps={{ placeholder: '880px' }}
            value={state.snap?.y ? s(state.snap.y) : ''}
            onChange={(event) => {
              setState({
                ...state,
                snap: {
                  ...state.snap,
                  y: parseInt(event.currentTarget.value, 10),
                },
              });
            }}
            onBlur={persistState}
            helpText="The number of pixels resizing and dragging should snap to on the y axis."
          />
        </FieldGroup>
      </Form>
    </div>
  );
};

export default LayoutSettingsPanel;
