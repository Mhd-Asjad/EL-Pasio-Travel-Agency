import type { CSSProperties, MouseEvent, ReactElement } from "react";

export type MasonryItem = {
  id: string | number;
  img: string;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
  alt?: string;
  url?: string;
  span?: number;
};

export type MasonryProps = {
  items?: MasonryItem[];
  columns?: "auto" | number;
  columnWidth?: number;
  gap?: number;
  radius?: number;
  animateFrom?:
    | "bottom"
    | "top"
    | "left"
    | "right"
    | "center"
    | "random"
    | "none";
  stagger?: number;
  duration?: number;
  bounce?: number;
  blurToFocus?: boolean;
  revealOnScroll?: boolean;
  hoverEffect?: "zoom" | "lift" | "tilt" | "none";
  focusOnHover?: boolean;
  captions?: "hover" | "always" | "none";
  parallax?: number;
  lightbox?: boolean;
  draggable?: boolean;
  onItemClick?: (
    item: MasonryItem,
    index: number,
    event: MouseEvent,
  ) => void;
  onReorder?: (items: MasonryItem[]) => void;
  className?: string;
  style?: CSSProperties;
};

declare function Masonry(props: MasonryProps): ReactElement;
export default Masonry;
