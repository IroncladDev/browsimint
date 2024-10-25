/**
 * Represents a position with top and left coordinates
 */
export interface Position {
  top: number;
  left: number;
}

/**
 * Represents dimensions with width and height
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Represents a position with an additional placement property
 */
export interface PopoverPosition extends Position {
  placement: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Represents the available space around a target element
 */
export interface AvailableSpace {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Calculates the available space around a target element
 */
function calculateAvailableSpace(
  targetRect: DOMRect,
  padding: number = 20
): AvailableSpace {
  return {
    top: targetRect.top - padding,
    right: window.innerWidth - targetRect.right - padding,
    bottom: window.innerHeight - targetRect.bottom - padding,
    left: targetRect.left - padding,
  };
}

/**
 * Checks if a position overlaps with the target rectangle
 */
function doesOverlapWithTarget(
  position: Position,
  popoverDimensions: Dimensions,
  targetRect: DOMRect
): boolean {
  const popoverRect = {
    left: position.left,
    right: position.left + popoverDimensions.width,
    top: position.top,
    bottom: position.top + popoverDimensions.height
  };

  return !(
    popoverRect.right < targetRect.left ||
    popoverRect.left > targetRect.right ||
    popoverRect.bottom < targetRect.top ||
    popoverRect.top > targetRect.bottom
  );
}

/**
 * Checks if there is enough space for the popover in a given placement
 */
function hasEnoughSpace(
  placement: 'top' | 'right' | 'bottom' | 'left',
  space: AvailableSpace,
  dimensions: Dimensions,
  targetRect: DOMRect,
  padding: number
): boolean {
  switch (placement) {
    case 'top':
      return space.top >= dimensions.height + padding &&
             space.left + targetRect.width >= dimensions.width / 2 &&
             space.right + targetRect.width >= dimensions.width / 2;
    case 'right':
      return space.right >= dimensions.width + padding &&
             space.top + targetRect.height >= dimensions.height / 2 &&
             space.bottom + targetRect.height >= dimensions.height / 2;
    case 'bottom':
      return space.bottom >= dimensions.height + padding &&
             space.left + targetRect.width >= dimensions.width / 2 &&
             space.right + targetRect.width >= dimensions.width / 2;
    case 'left':
      return space.left >= dimensions.width + padding &&
             space.top + targetRect.height >= dimensions.height / 2 &&
             space.bottom + targetRect.height >= dimensions.height / 2;
  }
}

/**
 * Adjusts the position to stay within viewport bounds
 */
function adjustForViewportBounds(
  position: PopoverPosition,
  dimensions: Dimensions,
  padding: number
): PopoverPosition {
  // Adjust horizontal position
  const minLeft = padding;
  const maxLeft = window.innerWidth - dimensions.width - padding;
  position.left = Math.max(minLeft, Math.min(position.left, maxLeft));

  // Adjust vertical position
  const minTop = padding;
  const maxTop = window.innerHeight - dimensions.height - padding;
  position.top = Math.max(minTop, Math.min(position.top, maxTop));

  return position;
}

/**
 * Calculates the coordinates for a given placement
 */
function calculateCoordinates(
  targetRect: DOMRect,
  popoverDimensions: Dimensions,
  placement: 'top' | 'right' | 'bottom' | 'left',
  padding: number
): PopoverPosition {
  let top: number;
  let left: number;

  switch (placement) {
    case 'top':
      top = targetRect.top - popoverDimensions.height - padding;
      left = targetRect.left + (targetRect.width - popoverDimensions.width) / 2;
      break;
    case 'right':
      top = targetRect.top + (targetRect.height - popoverDimensions.height) / 2;
      left = targetRect.right + padding;
      break;
    case 'bottom':
      top = targetRect.bottom + padding;
      left = targetRect.left + (targetRect.width - popoverDimensions.width) / 2;
      break;
    case 'left':
      top = targetRect.top + (targetRect.height - popoverDimensions.height) / 2;
      left = targetRect.left - popoverDimensions.width - padding;
      break;
  }

  return adjustForViewportBounds(
    { top, left, placement },
    popoverDimensions,
    padding
  );
}

/**
 * Adjusts position to minimize overlap with target
 */
function adjustPositionToMinimizeOverlap(
  position: PopoverPosition,
  popoverDimensions: Dimensions,
  targetRect: DOMRect,
  padding: number
): PopoverPosition {
  const { placement } = position;
  let { top, left } = position;

  switch (placement) {
    case 'top':
    case 'bottom':
      if (left + popoverDimensions.width > targetRect.left && left < targetRect.right) {
        if (targetRect.left > window.innerWidth / 2) {
          left = targetRect.left - popoverDimensions.width - padding;
        } else {
          left = targetRect.right + padding;
        }
      }
      break;
    case 'left':
    case 'right':
      if (top + popoverDimensions.height > targetRect.top && top < targetRect.bottom) {
        if (targetRect.top > window.innerHeight / 2) {
          top = targetRect.top - popoverDimensions.height - padding;
        } else {
          top = targetRect.bottom + padding;
        }
      }
      break;
  }

  return adjustForViewportBounds(
    { top, left, placement },
    popoverDimensions,
    padding
  );
}

/**
 * Calculates the optimal position for a popover relative to a target element
 * @param targetRect - The target element's rectangle
 * @param popoverDimensions - The popover's dimensions
 * @param padding - The padding to maintain from edges (default: 20)
 * @returns The optimal position for the popover
 */
export function calculateOptimalPopoverPosition(
  targetRect: DOMRect,
  popoverDimensions: Dimensions,
  padding: number = 20
): PopoverPosition {
  const availableSpace = calculateAvailableSpace(targetRect, padding);
  const preferredOrder: Array<'top' | 'right' | 'bottom' | 'left'> = [
    'bottom',
    'right',
    'top',
    'left',
  ];

  // Try each position until we find one that doesn't overlap
  for (const placement of preferredOrder) {
    if (hasEnoughSpace(placement, availableSpace, popoverDimensions, targetRect, padding)) {
      const position = calculateCoordinates(
        targetRect,
        popoverDimensions,
        placement,
        padding
      );
      
      if (!doesOverlapWithTarget(position, popoverDimensions, targetRect)) {
        return position;
      }
    }
  }
  
  // If all positions overlap, use the first available position with maximum distance
  const fallbackPosition = calculateCoordinates(
    targetRect,
    popoverDimensions,
    preferredOrder[0],
    padding
  );
  
  return adjustPositionToMinimizeOverlap(
    fallbackPosition,
    popoverDimensions,
    targetRect,
    padding
  );
}
