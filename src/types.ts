export interface LayoutSettings {
  title: string;
  disabled: boolean;
  aspectRatio: number;
  maxWidth: number;
  elements: []
}

export interface LayoutPanelProps {
  newRecord: boolean;
}

export interface LayoutState {

}

export type Image = {
  id: string;
  type: string;
  title: string;
  url: string;
  width: number;
  height: number;
};