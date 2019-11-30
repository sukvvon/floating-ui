// @flow
import type { Placement } from '../enums';
import type { State, Modifier, Padding } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import addClientRectMargins from '../dom-utils/addClientRectMargins';
import getElementClientRect from '../dom-utils/getElementClientRect';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';

type Options = { element: HTMLElement };

export function arrow(state: State, options?: Options = {}) {
  let { element: arrowElement = '[data-popper-arrow]' } = options;

  // CSS Selector
  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return state;
    }
  }

  if (!state.elements.popper.contains(arrowElement)) {
    if (__DEV__) {
      console.error(
        'Popper: "arrow" modifier\'s `element` must be child of the popper element.'
      );
    }

    return state;
  }

  state.elements.arrow = arrowElement;

  const popperOffsets = state.modifiersData.popperOffsets;
  const basePlacement = getBasePlacement(state.placement);
  const isVertical = ['left', 'right'].includes(basePlacement);
  const axis = getMainAxisFromPlacement(basePlacement);
  const len = isVertical ? 'height' : 'width';
  const side = isVertical ? 'top' : 'left';

  const arrowElementRect = addClientRectMargins(
    getElementClientRect(arrowElement),
    arrowElement
  );

  const endDiff =
    state.measures.reference[len] +
    state.measures.reference[axis] -
    (state.modifiersData.popperOffsets[axis] + state.measures.popper[len]);

  const startDiff =
    state.modifiersData.popperOffsets[axis] - state.measures.reference[axis];

  const center =
    state.measures.popper[len] / 2 -
    arrowElementRect[len] / 2 +
    endDiff / 2 -
    startDiff / 2;

  // Flow: How to use computed property like {[axis]: center}?
  state.modifiersData.arrowOffsets = { x: 0, y: 0 };
  state.modifiersData.arrowOffsets[axis] = center;

  return state;
}

export default ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  requires: ['popperOffsets'],
  data: { index: 0 },
}: Modifier<Options>);
