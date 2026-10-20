export type SearchOverlayPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: "above" | "below";
};

export type SearchOverlayRect = Pick<DOMRect, "top" | "left" | "bottom" | "width">;

export type SearchVisualViewport = {
  offsetLeft: number;
  offsetTop: number;
  width: number;
  height: number;
};

const VIEWPORT_MARGIN = 12;
const OVERLAY_GAP = 8;
const MAX_OVERLAY_HEIGHT = 360;
const PREFERRED_BELOW_SPACE = 200;

export function calculateSearchOverlayPosition(
  rect: SearchOverlayRect,
  viewport: SearchVisualViewport,
): SearchOverlayPosition {
  const viewportLeft = viewport.offsetLeft;
  const viewportTop = viewport.offsetTop;
  const maxRight = viewportLeft + viewport.width - VIEWPORT_MARGIN;
  const width = Math.min(rect.width, Math.max(0, viewport.width - VIEWPORT_MARGIN * 2));
  const left = Math.max(viewportLeft + VIEWPORT_MARGIN, Math.min(rect.left, maxRight - width));
  const belowSpace = Math.max(
    0,
    viewportTop + viewport.height - VIEWPORT_MARGIN - (rect.bottom + OVERLAY_GAP),
  );
  const aboveSpace = Math.max(0, rect.top - viewportTop - VIEWPORT_MARGIN - OVERLAY_GAP);
  const opensAbove = belowSpace < PREFERRED_BELOW_SPACE && aboveSpace > belowSpace;
  const availableSpace = opensAbove ? aboveSpace : belowSpace;

  return {
    top: opensAbove ? rect.top - OVERLAY_GAP : rect.bottom + OVERLAY_GAP,
    left,
    width,
    // Never force an 80px popup into a viewport with less room: on mobile,
    // the visual viewport can shrink dramatically when the keyboard opens.
    maxHeight: Math.min(MAX_OVERLAY_HEIGHT, availableSpace),
    placement: opensAbove ? "above" : "below",
  };
}
