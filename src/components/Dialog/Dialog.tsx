import React, { useState } from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK, ParametersAPI } from '@contentful/app-sdk';
import CreateLayout from '../CreateLayout';
import EditLayout from '../EditLayout';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

type ParameterInvocationWithId = {
  invocation: {
    id: string;
  }
} & ParametersAPI;

const Dialog = ({sdk}: DialogProps) => {

  // @ts-ignore
  const layoutId = sdk.parameters?.invocation?.hasOwnProperty("id") && sdk.parameters.invocation.id as ParameterInvocationWithId;



  return layoutId ? <EditLayout /> : <CreateLayout/>
};

export default Dialog;
