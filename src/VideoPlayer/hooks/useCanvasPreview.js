import { useCallback, useEffect } from 'react'
import Worker from '../canvasWorker?worker'; // Add "?worker" for Vite or use worker-loader in Webpack

export const useCanvasPreview = (
  canvasRef,
  videoRef,
  containerRef,
  cropper
) => {
  const updateCanvasPreview = useCallback(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const container = containerRef.current

    if (!canvas || !video || !container) return

    const ctx = canvas.getContext('2d')
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight

    const videoAspect = videoWidth / videoHeight
    const containerAspect = containerWidth / containerHeight

    let renderWidth, renderHeight, offsetX, offsetY

    if (videoAspect > containerAspect) {
      renderWidth = containerWidth
      renderHeight = containerWidth / videoAspect
      offsetX = 0
      offsetY = (containerHeight - renderHeight) / 2
    } else {
      renderHeight = containerHeight
      renderWidth = containerHeight * videoAspect
      offsetX = (containerWidth - renderWidth) / 2
      offsetY = 0
    }

    const scaleX = videoWidth / renderWidth
    const scaleY = videoHeight / renderHeight

    const scaledX = (cropper.x - offsetX) * scaleX
    const scaledY = (cropper.y - offsetY) * scaleY
    const scaledWidth = cropper.width * scaleX
    const scaledHeight = cropper.height * scaleY

    canvas.width = cropper.width
    canvas.height = cropper.height

    ctx.drawImage(
      video,
      scaledX,
      scaledY,
      scaledWidth,
      scaledHeight,
      0,
      0,
      cropper.width,
      cropper.height
    )
  }, [canvasRef, videoRef, containerRef, cropper])

  useEffect(() => {
    const worker = new Worker()

    worker.onmessage = () => {
      updateCanvasPreview()
    }

    worker.postMessage('start')

    return () => {
      worker.postMessage('stop')
      worker.terminate()
    }
  }, [updateCanvasPreview])

  return { updateCanvasPreview }
}
