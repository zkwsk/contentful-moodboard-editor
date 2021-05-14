export type FieldData =
  {
    [key: string]: Layout;
  }
;

export type Layout = {
  settings: LayoutSettings;
  elements: Draggable[];
};

export type LayoutSettings = {
  layoutId: string;
  title: string;
  enabled: boolean;
  aspectRatio: string;
  maxWidth: number;
  isValid: {
    settings: boolean;
    elements: boolean;
    canvas: boolean;
  };
  snap?: {
    x?: number;
    y?: number;
  };
};

export type Draggable = {
  published: boolean;
  height: number;
  width: number;
  originalHeight: number;
  originalWidth: number;
  position: {
    x: number;
    y: number;
  };
  asset: Asset;
  textElement?: Text;
};

export type Text = {
  innerText: string;
  type: 'text';
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
};

export type Asset = {
  id: string;
  filename: string;
  title: string;
  type: 'image/jpeg' | 'image/png' | 'video/mp4';
  width: number;
  height: number;
  element: Image | Video;
};

type ImageOrVideoPartial = {
  url: string;
  description?: string;
};

export type Image = {
  alt?: string;
} & ImageOrVideoPartial;

export type Video = {
  autoplay?: boolean;
  loop?: boolean;
  poster?: string;
} & ImageOrVideoPartial;

export interface DialogInvocationParams {
  currentLayoutId?: string;
  layoutIds: string[];
  entryField: FieldData;
  assets: Asset[];
}
