import { useEffect, useRef, useState } from 'react'

// Build incrementally:

// Implement video playback with basic controls.
// Add the cropper layer with movable and resizable functionality.
// Sync the cropper to the canvas for real-time preview.
// Capture and serialize metadata.

//use canvas or web workers or pure js for faster stuff

const aspectRatios = {
  '9:18': 9 / 18,
  '9:16': 9 / 16,
  '4:3': 4 / 3,
  '3:4': 3 / 4,
  '1:1': 1,
  '4:5': 4 / 5
}

const VideoPlayer = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const previewContainerRef = useRef(null)

  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [progress, setProgress] = useState(0)
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [cropper, setCropper] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    dragging: false,
    resizing: false
  })

  // Initialize video and cropper dimensions
  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current

    if (video && container) {
      const updateDimensions = () => {
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        // Set video dimensions maintaining 16:9 aspect ratio
        const videoHeight = containerHeight
        const videoWidth = (videoHeight * 16) / 9

        setVideoDimensions({ width: videoWidth, height: videoHeight })

        // Initialize cropper
        const cropperHeight = containerHeight
        const cropperWidth = cropperHeight * aspectRatios[aspectRatio]

        setCropper((prev) => ({
          ...prev,
          width: cropperWidth,
          height: cropperHeight,
          x: (videoWidth - cropperWidth) / 2,
          y: 0
        }))
      }

      updateDimensions()
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }
  }, [aspectRatio])

  const handleAspectRatioChange = (e) => {
    const newRatio = e.target.value
    setAspectRatio(newRatio)

    const cropperHeight = videoDimensions.height
    const cropperWidth = cropperHeight * aspectRatios[newRatio]

    setCropper((prev) => ({
      ...prev,
      width: cropperWidth,
      height: cropperHeight,
      x: Math.min(prev.x, videoDimensions.width - cropperWidth),
      y: 0
    }))
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (video) {
      if (video.paused) {
        video.play()
        setIsPlaying(true)
      } else {
        video.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setVolume(newVolume)
  }

  const handlePlaybackRateChange = (e) => {
    const newRate = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate
    }
    setPlaybackRate(newRate)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percentage =
        (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(percentage)
    }
  }

  const handleMouseDown = (e, type) => {
    e.preventDefault()
    setCropper((prev) => ({ ...prev, [type]: true }))
  }

  const handleMouseMove = (e) => {
    if (!cropper.dragging) return

    const container = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - container.left

    // Only allow horizontal movement
    const newX = Math.max(
      0,
      Math.min(
        mouseX - cropper.width / 2,
        videoDimensions.width - cropper.width
      )
    )

    setCropper((prev) => ({
      ...prev,
      x: newX,
      y: 0 // Keep y position fixed at 0
    }))
  }

  const handleMouseUp = () => {
    setCropper((prev) => ({ ...prev, dragging: false, resizing: false }))
  }

  const updateCanvasPreview = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const previewContainer = previewContainerRef.current

    if (!canvas || !video || !previewContainer) return

    const ctx = canvas.getContext('2d')
    const maxPreviewHeight = previewContainer.clientHeight
    const maxPreviewWidth = previewContainer.clientWidth

    // Calculate preview dimensions while maintaining aspect ratio
    let previewWidth, previewHeight
    const cropAspectRatio = cropper.width / cropper.height

    if (cropAspectRatio > maxPreviewWidth / maxPreviewHeight) {
      previewWidth = maxPreviewWidth
      previewHeight = previewWidth / cropAspectRatio
    } else {
      previewHeight = maxPreviewHeight
      previewWidth = previewHeight * cropAspectRatio
    }

    canvas.width = previewWidth
    canvas.height = previewHeight

    ctx.drawImage(
      video,
      cropper.x,
      cropper.y,
      cropper.width,
      cropper.height,
      0,
      0,
      previewWidth,
      previewHeight
    )
  }

  useEffect(() => {
    const interval = setInterval(updateCanvasPreview, 1000 / 30) // 30 FPS
    return () => clearInterval(interval)
  }, [cropper])

  return (
    <div className="flex gap-4 h-[80vh] p-4">
      <div className="w-2/3 flex flex-col">
        <div
          ref={containerRef}
          className="relative flex-1"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <video
            ref={videoRef}
            className="h-full w-auto"
            style={{
              width: videoDimensions.width,
              height: videoDimensions.height
            }}
            onTimeUpdate={handleTimeUpdate}
            autoPlay
            muted
            loop
          >
            <source
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
              type="video/webm"
            />
          </video>

          <div
            className="absolute border-2 border-blue-500 bg-transparent cursor-move"
            style={{
              left: cropper.x,
              top: cropper.y,
              width: cropper.width,
              height: cropper.height
            }}
            onMouseDown={(e) => handleMouseDown(e, 'dragging')}
          />
        </div>

        <div className="mt-4 space-y-4">
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex gap-4 justify-between items-center">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={togglePlay}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <div className="flex items-center gap-2">
              <label>Volume:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-32"
              />
            </div>

            <div className="flex items-center gap-2">
              <label>Speed:</label>
              <select
                value={playbackRate}
                onChange={handlePlaybackRateChange}
                className="p-2 border rounded-lg"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label>Aspect Ratio:</label>
              <select
                value={aspectRatio}
                onChange={handleAspectRatioChange}
                className="p-2 border rounded-lg"
              >
                {Object.keys(aspectRatios).map((ratio) => (
                  <option key={ratio} value={ratio}>
                    {ratio}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/3 flex flex-col">
        <div
          ref={previewContainerRef}
          className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg"
        >
          <canvas ref={canvasRef} className="max-w-full max-h-full" />
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
