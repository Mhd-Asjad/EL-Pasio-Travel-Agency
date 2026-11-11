import type { CSSProperties, ReactElement } from "react";

export type CircularGalleryItem = {
  image: string;
  text?: string;
  description?: string;
  alt?: string;
};

export type CircularGalleryProps = {
  items?: CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  fontUrl?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  itemSize?: number;
  itemAspect?: number;
  gap?: number;
  wave?: number;
  fadeEdges?: number;
  shadow?: number;
  grayscale?: boolean;
  showTitles?: boolean;
  snap?: boolean;
  autoScroll?: number;
  openOnClick?: boolean;
  intro?: boolean;
  onItemClick?: (item: CircularGalleryItem, index: number) => void;
  onActiveChange?: (index: number) => void;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
};

declare function CircularGallery(props: CircularGalleryProps): ReactElement;
export default CircularGallery;
