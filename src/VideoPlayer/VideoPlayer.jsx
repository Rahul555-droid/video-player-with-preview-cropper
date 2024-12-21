// VideoPlayer.js
import { useRef, useEffect, useState } from 'react'
import { useVideoState } from './hooks/useVideoState'
import { useCropper } from './hooks/useCropper'
import { useCanvasPreview } from './hooks/useCanvasPreview'
import VideoControls from './components/VideoControls'
import CropOverlay from './components/CropOverlay'
import Tabs from 'components/Tabs'
import PlaceHolder from 'components/PlaceHolder'
import { tabs } from './constant'
import ButtonGrid from 'components/ButtonGrid'
import debounce from 'lodash/debounce'
import { downloadJSON } from 'util'

const VideoPlayer = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [startCropper, setStartCropper] = useState(false)
  const [uploadedVideo, setUploadedVideo] = useState('/superman_720p.mp4')
  const metadataRef = useRef([]) // not showing meta data on ui so can use ref I guess

  const {
    isPlaying,
    volume,
    playbackRate,
    progress,
    setProgress,
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
  } = useCropper(containerRef, videoRef, startCropper)

  useCanvasPreview(canvasRef, videoRef, containerRef, cropper, startCropper)

  const recordMetadata = debounce(() => {
    const video = videoRef.current
    if (video && cropper && !cropper.dragging) {
      metadataRef.current.push({
        timeStamp: video.currentTime,
        coordinates: [cropper.x, cropper.y, cropper.width, cropper.height],
        volume,
        playbackRate
      })
      console.log({ metadataRef: metadataRef.current })
    }
  }, 100) // Adjust debounce delay as needed

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const videoURL = URL.createObjectURL(file)
      setUploadedVideo(videoURL)
      setStartCropper(false) // Reset cropper when a new video is uploaded
      metadataRef.current = [] // Clear previous metadata
      const video = videoRef.current
      if (video) {
        video.src = videoURL // Update the source
        video.load() // Reload the video with the new source
        setProgress(0)
        togglePlay()
      }
    }
  }

  const handleButtonClick = (action) => {
    if (action === 'startCropper') {
      setStartCropper(true)
      console.log('Cropper started')
    } else if (action === 'removeCropper') {
      setStartCropper(false)
      console.log('Cropper removed')
    } else if (action === 'generatePreview') {
      downloadJSON(metadataRef.current, 'generated-preview.json')
      console.log('Preview generated')
    } else if (action === 'upload') {
      document.getElementById('video-upload-input').click()
    }
  }

  useEffect(() => {
    if (cropper && isPlaying && startCropper && !cropper.dragging) {
      recordMetadata()
    }
  }, [cropper, startCropper, isPlaying, volume, playbackRate])

  //can be useful if we try to crop on mount . adjusts the cropper height on mount once video is loaded
  // useEffect(() => {
  //   const video = videoRef.current
  //   if (video) {
  //     video.addEventListener('loadedmetadata', updateCropperDimensions)
  //     return () =>
  //       video.removeEventListener('loadedmetadata', updateCropperDimensions)
  //   }
  // }, [updateCropperDimensions])

  return (
    <div className="h-screen p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-bold text-lg">Cropper</span>
        <Tabs tabs={tabs} onTabChange={() => {}} />
        <div />
      </div>
      <div
        style={{ height: 'calc(100vh - 140px)' }}
        className="grid grid-cols-2 gap-4 h-full bg-primary"
      >
        <div className="relative w-full h-full overflow-hidden  rounded-lg">
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
              loop
            >
              <source src={uploadedVideo} type="video/webm" />
            </video>

            {startCropper && (
              <CropOverlay cropper={cropper} onMouseDown={handleMouseDown} />
            )}
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

        {startCropper ? (
          <div className=" rounded-lg flex items-start justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full rounded-lg"
              style={{ width: cropper.width, height: cropper.height }}
            />
          </div>
        ) : (
          <PlaceHolder />
        )}
      </div>

      <ButtonGrid
        buttons={[
          { label: 'Start Cropper', action: 'startCropper' },
          { label: 'Remove Cropper', action: 'removeCropper' },
          { label: 'Generate Preview', action: 'generatePreview' }
        ]}
        rightButtons={[{ label: 'Upload your own', action: 'upload' }]}
        onAction={handleButtonClick}
      />

      <input
        type="file"
        id="video-upload-input"
        accept="video/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default VideoPlayer
