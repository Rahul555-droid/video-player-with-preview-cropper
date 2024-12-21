import { useState, useCallback, useEffect } from 'react'
import {
  ASPECT_RATIOS,
  defaultCropperState,
  DEFAULT_ASPECT_RATIO
} from 'VideoPlayer/constant'

export const useCropper = (containerRef, videoRef, startCropper) => {
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO)
  const [cropper, setCropper] = useState(defaultCropperState)

  const updateCropperDimensions = useCallback(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video || !startCropper) return

    const containerHeight = container.clientHeight
    const containerWidth = container.clientWidth
    const cropperHeight = Math.max(containerHeight, video.clientHeight)
    const cropperWidth = cropperHeight * ASPECT_RATIOS[aspectRatio]
    console.log('updated cropper dimensions')

    setCropper((prev) => ({
      ...prev,
      width: cropperWidth,
      height: cropperHeight,
      x: (containerWidth - cropperWidth) / 2, // otherwise it goes beyond the current area.
      y: 0
    }))
  }, [aspectRatio, startCropper])

  useEffect(() => {
    if (startCropper) {
      updateCropperDimensions()
    }
  }, [aspectRatio, startCropper])

  const handleMouseDown = useCallback((e, type) => {
    e.preventDefault()
    setCropper((prev) => ({ ...prev, [type]: true }))
  }, [])

  const handleMouseMove = useCallback(
    (e) => {
      if (!cropper.dragging) return

      const container = containerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - container.left
      const newX = Math.max(
        0,
        Math.min(
          mouseX - cropper.width / 2,
          containerRef.current.clientWidth - cropper.width
        )
      )

      setCropper((prev) => ({
        ...prev,
        x: newX,
        y: 0
      }))
    },
    [cropper.dragging, cropper.width, containerRef]
  )

  const handleMouseUp = useCallback(() => {
    setCropper((prev) => ({ ...prev, dragging: false, resizing: false }))
  }, [])

  return {
    cropper,
    aspectRatio,
    setAspectRatio,
    updateCropperDimensions,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  }
}
