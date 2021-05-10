export type LayoutPanelProps = {
  newRecord: boolean;
}

export type Layout = {
  settings: LayoutSettings;
  maxWidth: number;
  elements: Draggable[];
};

export type LayoutSettings = {
  id: string;
  title: string;
  disabled: boolean;
  aspectRatio: number;
}

export type Draggable = {
  published: boolean;
  height: number;
  width: number;
  originalHeight: number;
  originalWidth: number;
  top: number;
  left: number;
  element: Asset | Text;
};

export type Text = {
  innerText: string;
  element: "h1" | "h2" | "h3" | "h4" | "p"
}

export type Asset = {
  id: string;
  filename: string;
  title: string;
  type: 'image/jpeg' | 'video/mp4';
  width: number;
  height: number;
  element: Image | Video;
};

export type Image = {
  url: string;
  alt?: string;
  description?: string;
};

export type Video = {
  url: string;
  autoplay?: boolean;
  loop?: boolean;
  poster?: string;
};
