export const ASPECT_RATIOS = {
  '9:18': 9 / 18,
  '9:16': 9 / 16,
  '4:3': 4 / 3,
  '3:4': 3 / 4,
  '1:1': 1,
  '4:5': 4 / 5
}

export const FPS = 30
export const DEFAULT_ASPECT_RATIO = '9:16'
export const defaultCropperState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  dragging: false,
  resizing: false
}

export const tabs = [
  { label: 'Preview Session', value: 'preview' },
  { label: 'Generate Session', value: 'generate' }
]
