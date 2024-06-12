// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import {
  paddingTop,
  paddingVert,
  paddingH,
  scrollGap,
  displayWidth,
  displayHeight,
  mapFromLineView,
  measureChar,
  prepareMeasureForLine,
  measureCharPrepared,
  nodeAndOffsetInLineMap,
  clearLineMeasurementCacheFor,
  clearLineMeasurementCache,
  clearCaches,
  intoCoordSystem,
  fromCoordSystem,
  charCoords,
  cursorCoords,
  estimateCoords,
  coordsChar,
  wrappedLineExtentChar,
  textHeight,
  charWidth,
  getDimensions,
  compensateForHScroll,
  estimateHeight,
  estimateLineHeights,
  posFromMouse,
  findViewIndex
} from "./position_measurement";

import { widgetHeight, eventInWidget } from "./widgets";

export {
  paddingTop,
  paddingVert,
  paddingH,
  scrollGap,
  displayWidth,
  displayHeight,
  mapFromLineView,
  measureChar,
  prepareMeasureForLine,
  measureCharPrepared,
  nodeAndOffsetInLineMap,
  clearLineMeasurementCacheFor,
  clearLineMeasurementCache,
  clearCaches,
  intoCoordSystem,
  fromCoordSystem,
  charCoords,
  cursorCoords,
  estimateCoords,
  coordsChar,
  wrappedLineExtentChar,
  textHeight,
  charWidth,
  getDimensions,
  compensateForHScroll,
  estimateHeight,
  estimateLineHeights,
  posFromMouse,
  findViewIndex,
  widgetHeight,
  eventInWidget
};