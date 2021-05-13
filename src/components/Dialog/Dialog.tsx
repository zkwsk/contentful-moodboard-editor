import React from 'react';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import LayoutContainer from '../../containers/LayoutContainer';

interface DialogProps {
  sdk: DialogExtensionSDK;
}

const Dialog = ({ sdk }: DialogProps) => {
  return <LayoutContainer sdk={sdk} />;
};

export default Dialog;
