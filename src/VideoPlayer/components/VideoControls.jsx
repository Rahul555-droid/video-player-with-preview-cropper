import { memo } from 'react'
import { ASPECT_RATIOS } from 'VideoPlayer/constant'
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa'
import Dropdown from 'components/DropDown'

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')

  return `${hours}:${minutes}:${secs}`
}

const VideoControls = ({
  progress,
  togglePlay,
  isPlaying,
  volume,
  handleVolumeChange,
  playbackRate,
  handlePlaybackRateChange,
  aspectRatio,
  handleAspectRatioChange,
  handleSeekChange,
  handleSeekMouseDown,
  handleSeekMouseUp,
  duration,
  currentTime
}) => {
  return (
    <div className="mt-2">
      {/* Progress Bar Section */}
      <div className="w-full flex items-center justify-start gap-1">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-600"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <FaPause color="white" size={22} />
          ) : (
            <FaPlay color="white" size={22} />
          )}
        </button>

        <div className="w-full flex flex-col items-center">
          <div className="w-full h-2 rounded-full bg-secondary relative">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={currentTime}
              onChange={handleSeekChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              className="absolute top-0 w-full opacity-0 h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="font-semibold text-[12px] text-[#FFFFFF80] flex justify-start gap-1 w-full mt-2">
          <span className=" text-white">{formatTime(currentTime)}</span>
          <span> | </span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <FaVolumeUp color="white" size={22} />
          <div className="w-32 h-2 rounded-full bg-secondary relative">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${volume * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute top-0 w-full opacity-0 h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center mt-2 justify-start gap-2 text-white">
        <Dropdown
          label="Playback speed"
          options={['0.5x', '1x', '1.5x', '2x']}
          value={`${playbackRate}x`}
          onChange={(value) =>
            handlePlaybackRateChange({ target: { value: parseFloat(value) } })
          }
        />

        {/* Aspect Ratio Control */}
        <Dropdown
          label="Cropper Aspect Ratio"
          options={Object.keys(ASPECT_RATIOS)}
          value={aspectRatio}
          onChange={(value) => handleAspectRatioChange({ target: { value } })}
        />
      </div>
    </div>
  )
}

export default memo(VideoControls)
