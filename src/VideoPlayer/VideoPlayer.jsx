// VideoPlayer.js
import { useRef, useEffect } from 'react'
import { useVideoState } from './hooks/useVideoState'
import { useCropper } from './hooks/useCropper'
import { useCanvasPreview } from './hooks/useCanvasPreview'
import VideoControls from './components/VideoControls'
import CropOverlay from './components/CropOverlay'

const VideoPlayer = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  const {
    isPlaying,
    volume,
    playbackRate,
    progress,
    togglePlay,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleTimeUpdate,
    handleSeekChange,
    handleSeekMouseDown,
    handleSeekMouseUp
  } = useVideoState(videoRef)

  const {
    cropper,
    aspectRatio,
    setAspectRatio,
    updateCropperDimensions,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useCropper(containerRef, videoRef)

  useCanvasPreview(canvasRef, videoRef, containerRef, cropper)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('loadedmetadata', updateCropperDimensions)
      return () =>
        video.removeEventListener('loadedmetadata', updateCropperDimensions)
    }
  }, [updateCropperDimensions])

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

            <CropOverlay cropper={cropper} onMouseDown={handleMouseDown} />
          </div>
          <VideoControls
            progress={progress}
            togglePlay={togglePlay}
            isPlaying={isPlaying}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
            playbackRate={playbackRate}
            handlePlaybackRateChange={handlePlaybackRateChange}
            aspectRatio={aspectRatio}
            handleAspectRatioChange={(e) => setAspectRatio(e.target.value)}
            handleSeekChange={handleSeekChange}
            handleSeekMouseDown={handleSeekMouseDown}
            handleSeekMouseUp={handleSeekMouseUp}
            duration={videoRef.current?.duration || 0}
            currentTime={videoRef.current?.currentTime || 0}
          />
        </div>

        <div className="border rounded-lg flex items-center justify-center bg-[#45474E] border-[#45474E]">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full"
            style={{ width: cropper.width, height: cropper.height }}
          />
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
