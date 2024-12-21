import { memo } from 'react'

const CropOverlay = memo(({ cropper, onMouseDown }) => {
  return (
    <div
      className="absolute border-dashed border-white cursor-move bg-white bg-opacity-35"
      style={{
        left: cropper.x,
        top: cropper.y,
        width: cropper.width,
        height: cropper.height
      }}
      onMouseDown={(e) => onMouseDown(e, 'dragging')}
    >
      <div className="absolute top-0 left-0 h-full border-l border-white" />
      <div className="absolute top-0 left-1/3 h-full border-l border-dashed border-white" />
      <div className="absolute top-0 left-2/3 h-full border-l border-dashed border-white" />
      <div className="absolute top-0 right-0 h-full border-l border-white" />
      <div className="absolute left-0 top-1/3 w-full border-t border-dashed border-white" />
      <div className="absolute left-0 top-2/3 w-full border-t border-dashed border-white" />
    </div>
  )
})

export default CropOverlay;
