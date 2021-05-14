import React from 'react';
import { Draggable } from '../../types';

export const LayoutCanvasElement = ({ element }: { element: Draggable }) => {
  const { asset } = element;
  const { type } = asset;

  const Image = (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${asset.element.url})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
      }}
    />
  );

  const Video = (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <video autoPlay muted loop width={element.width} height={element.height}>
        <source src={element.asset.element.url} type="video/mp4"></source>
      </video>
    </div>
  );

  if (type === 'video/mp4') {
    return Video;
  }

  if (type === 'image/jpeg' || 'image/png' || 'image/gif') {
    return Image;
  }
  return null;
};
