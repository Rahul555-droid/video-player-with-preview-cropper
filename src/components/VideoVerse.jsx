import { useEffect, useRef, useState } from 'react'

// Build incrementally:

// Implement video playback with basic controls.
// Add the cropper layer with movable and resizable functionality.
// Sync the cropper to the canvas for real-time preview.
// Capture and serialize metadata.

//use canvas or web workers or pure js for faster stuff

const aspectRatios = {
  "1:1": 1,
  "4:3": 4 / 3,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
};

const VideoPlayer = () => {
  const videoRef = useRef(null) // Ref to access the video element
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false) // Playback state
  const [volume, setVolume] = useState(0) // Volume state
  const [playbackRate, setPlaybackRate] = useState(1) // Playback rate state
  const [progress, setProgress] = useState(0) // Progress state (in percentage)
  const [cropper, setCropper] = useState({
    x: 50,
    y: 50,
    width: 100,
    height: 180,
    dragging: false,
    resizing: false
  })
  const [aspectRatio, setAspectRatio] = useState("16:9");


  const handleAspectRatioChange = (e) => {
    const selectedRatio = e.target.value;
    setAspectRatio(selectedRatio);

    const video = videoRef.current;
    const container = containerRef.current;
    if (video && container) {
      const containerWidth = container.offsetWidth;
      const height = containerWidth / aspectRatios[selectedRatio];
      video.style.height = `${height}px`;
    }
  };

  // Toggle Play/Pause
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

  // Change Volume
  const handleVolumeChange = (e) => {
    const video = videoRef.current
    const newVolume = parseFloat(e.target.value)
    if (video) {
      video.volume = newVolume
    }
    setVolume(newVolume)
  }

  // Change Playback Speed
  const handlePlaybackRateChange = (e) => {
    const video = videoRef.current
    const newRate = parseFloat(e.target.value)
    if (video) {
      video.playbackRate = newRate
    }
    setPlaybackRate(newRate)
  }

  // Update Progress
  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video) {
      const percentage = (video.currentTime / video.duration) * 100
      setProgress(percentage)
    }
  }

  // Handle Video End
  const handleVideoEnd = () => {
    const video = videoRef.current
    if (video) {
      video.currentTime = 0 // Restart the video
      video.play() // Auto-play after looping
    }
  }

  const handleMouseDown = (e, type) => {
    e.preventDefault()
    setCropper({ ...cropper, [type]: true })
  }

  const handleMouseMove = (e) => {
    if (!cropper.dragging && !cropper.resizing) return

    const container = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - container.left
    const mouseY = e.clientY - container.top

    if (cropper.dragging) {
      const newX = Math.min(
        Math.max(0, mouseX - cropper.width / 2),
        container.width - cropper.width
      )
      const newY = Math.min(
        Math.max(0, mouseY - cropper.height / 2),
        container.height - cropper.height
      )
      setCropper({ ...cropper, x: newX, y: newY })
    }

    if (cropper.resizing) {
      const newWidth = Math.min(
        Math.max(50, mouseX - cropper.x),
        container.width - cropper.x
      )
      const newHeight =
        cropper.aspectRatio === '1:1'
          ? newWidth
          : cropper.aspectRatio === '4:3'
            ? (newWidth / 4) * 3
            : cropper.aspectRatio === '9:16'
              ? (newWidth / 9) * 16
              : newWidth // Add other ratios as needed
      setCropper({ ...cropper, width: newWidth, height: newHeight })
    }
  }

  const handleMouseUp = () => {
    setCropper({ ...cropper, dragging: false, resizing: false })
  }

  const updateCanvasPreview = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')

    if (canvas && video) {
      canvas.width = cropper.width
      canvas.height = cropper.height

      ctx.drawImage(
        video,
        cropper.x,
        cropper.y,
        cropper.width,
        cropper.height,
        0,
        0,
        canvas.width,
        canvas.height
      )
    }
  }

  useEffect(() => {
    const interval = setInterval(updateCanvasPreview, 50)
    return () => clearInterval(interval)
  }, [cropper])

  return (
    <div className="mt-10 p-5 flex mr-4">
      {/* Video Element */}

      <div
        className="relative w-1/2"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <video
          ref={videoRef}
          className="w-full h-[80vh] rounded-lg border border-gray-300"
          controls={false} // Custom controls
          onTimeUpdate={handleTimeUpdate} // Track progress
          onEnded={handleVideoEnd} // Handle looping
          autoPlay
          muted
        >
          <source
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" // Sample video
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="relative w-full h-2 bg-gray-200 rounded-full">
            <div
              className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={togglePlay}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="volume" className="text-sm font-medium">
              Volume:
            </label>
            <input
              id="volume"
              type="range"
              className="w-32"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="speed" className="text-sm font-medium">
              Speed:
            </label>
            <select
              id="speed"
              className="p-2 border rounded-lg"
              value={playbackRate}
              onChange={handlePlaybackRateChange}
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>


          <div className="flex items-center gap-2">
          <label htmlFor="aspectRatio" className="text-sm font-medium">
            Aspect Ratio:
          </label>
          <select
            id="aspectRatio"
            value={aspectRatio}
            onChange={handleAspectRatioChange}
            className="p-2 border rounded-lg"
          >
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="4:3">4:3</option>
            <option value="1:1">1:1</option>
          </select>
        </div>
        </div>

        {/* Cropper */}
        <div
          className="absolute border-2 border-blue-500 bg-transparent"
          style={{
            left: cropper.x,
            top: cropper.y,
            width: cropper.width,
            height: cropper.height,
            cursor: cropper.dragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'dragging')}
        >
          {/* Resizer */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize"
            onMouseDown={(e) => handleMouseDown(e, 'resizing')}
          ></div>
        </div>
      </div>

      <div className="w-1/2 flex flex-col items-center">
        <h3 className="mb-4">Dynamic Preview</h3>
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded-lg"
        ></canvas>
      </div>
    </div>
  )
}

export default VideoPlayer
