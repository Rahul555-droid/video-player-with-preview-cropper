import { useEffect, useRef, useState } from 'react'

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

  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    const handleVideoMetadataLoaded = () => {
      console.log('called videometa')
      if (container && video) {
        const containerHeight = container.clientHeight
        const containerWidth = container.clientWidth
        const videoHeight = video.clientHeight
        const videoWidth = video.clientWidth

        const cropperHeight = Math.max(containerHeight, videoHeight)
        const cropperWidth = cropperHeight * aspectRatios[aspectRatio]

        setCropper((prev) => ({
          ...prev,
          width: cropperWidth,
          height: cropperHeight,
          x: (containerWidth - cropperWidth) / 2,
          y: 0
        }))
      }
    }

    handleVideoMetadataLoaded()

    if (video) {
      video.addEventListener('loadedmetadata', handleVideoMetadataLoaded)
    }

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', handleVideoMetadataLoaded)
      }
    }
  }, [aspectRatio])

  const handleAspectRatioChange = (e) => {
    setAspectRatio(e.target.value)
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
        containerRef.current.clientWidth - cropper.width
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
    const container = containerRef.current

    if (!canvas || !video || !container) return

    const ctx = canvas.getContext('2d')

    // Get the dimensions of the container
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    // Get the intrinsic dimensions of the video
    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight

    // Calculate scaling and positioning
    const videoAspect = videoWidth / videoHeight
    const containerAspect = containerWidth / containerHeight

    let renderWidth, renderHeight, offsetX, offsetY

    if (videoAspect > containerAspect) {
      // Video is wider than the container
      renderWidth = containerWidth
      renderHeight = containerWidth / videoAspect
      offsetX = 0
      offsetY = (containerHeight - renderHeight) / 2
    } else {
      // Video is taller than the container
      renderHeight = containerHeight
      renderWidth = containerHeight * videoAspect
      offsetX = (containerWidth - renderWidth) / 2
      offsetY = 0
    }

    // Adjust the cropper coordinates to match the video scale
    const scaleX = videoWidth / renderWidth
    const scaleY = videoHeight / renderHeight

    const scaledX = (cropper.x - offsetX) * scaleX
    const scaledY = (cropper.y - offsetY) * scaleY
    const scaledWidth = cropper.width * scaleX
    const scaledHeight = cropper.height * scaleY

    // Update canvas dimensions
    canvas.width = cropper.width
    canvas.height = cropper.height

    // Draw the video on the canvas with the scaled crop area
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
  }

  useEffect(() => {
    const interval = setInterval(updateCanvasPreview, 1000 / 30) // 30 FPS
    return () => clearInterval(interval)
  }, [cropper])

  return (
    <div className="h-screen p-4 bg-[#37393F]">
      <div
        className="grid grid-cols-2 gap-4"
        style={{ height: 'calc(100vh - 160px)' }}
      >
        <div className="relative w-full h-full overflow-hidden border rounded-lg border-[#45474E]">
          <div
            ref={containerRef}
            className="relative max-h-fit w-full"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <video
              ref={videoRef}
              className="h-full w-full object-contain rounded-lg"
              onTimeUpdate={handleTimeUpdate}
              autoPlay
              muted
              loop
            >
              <source
                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                type="video/webm"
              />
            </video>

            <div
              className="absolute border-dashed border-white cursor-move"
              style={{
                left: cropper.x,
                top: cropper.y,
                width: cropper.width,
                height: cropper.height
              }}
              onMouseDown={(e) => handleMouseDown(e, 'dragging')}
            >
              {/* Vertical dashed lines */}
              <div className="absolute top-0 left-0 h-full border-l border-white"></div>
              <div className="absolute top-0 left-1/3 h-full border-l border-dashed border-white"></div>
              <div className="absolute top-0 left-2/3 h-full border-l border-dashed border-white"></div>
              <div className="absolute top-0 right-0 h-full border-l border-white"></div>

              {/* Horizontal dashed lines */}
              <div className="absolute left-0 top-1/3 w-full border-t border-dashed border-white"></div>
              <div className="absolute left-0 top-2/3 w-full border-t border-dashed border-white"></div>
            </div>
          </div>
        </div>

        <div
          className="border rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#45474E', borderColor: '#45474E' }}
        >
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full"
            style={{ width: cropper.width, height: cropper.height }}
          />
        </div>
      </div>

      {controlsRender(
        progress,
        togglePlay,
        isPlaying,
        volume,
        handleVolumeChange,
        playbackRate,
        handlePlaybackRateChange,
        aspectRatio,
        handleAspectRatioChange
      )}
    </div>
  )
}

function controlsRender(
  progress,
  togglePlay,
  isPlaying,
  volume,
  handleVolumeChange,
  playbackRate,
  handlePlaybackRateChange,
  aspectRatio,
  handleAspectRatioChange
) {
  return (
    <div className="mt-4 space-y-4">
      <div
        className="w-full h-2 rounded-full"
        style={{ backgroundColor: '#45474E' }}
      >
        <div
          className="h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${progress}%`, backgroundColor: '#ffffff' }}
        />
      </div>

      <div className="flex gap-6 justify-between items-center text-white">
        <button
          className="px-6 py-3 rounded-lg"
          onClick={togglePlay}
          style={{ backgroundColor: '#45474E' }}
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
            style={{ backgroundColor: '#45474E', color: 'white' }}
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
            style={{ backgroundColor: '#45474E', color: 'white' }}
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
  )
}

export default VideoPlayer
