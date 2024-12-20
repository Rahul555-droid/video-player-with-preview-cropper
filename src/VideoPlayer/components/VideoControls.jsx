import { memo } from 'react'
import { ASPECT_RATIOS } from 'VideoPlayer/constant'

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${secs}`
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
    <div className="mt-4 space-y-4">
      <div className="flex flex-col items-center">
        <div className="w-full h-2 rounded-full bg-[#45474E] relative">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
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

        <div className="flex justify-between w-full text-xs text-gray-400 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex gap-6 justify-between items-center text-white">
        <button
          className="px-6 py-3 rounded-lg bg-[#45474E]"
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
            className="p-2 border rounded-lg bg-[#45474E] text-white"
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
            className="p-2 border rounded-lg bg-[#45474E] text-white"
          >
            {Object.keys(ASPECT_RATIOS).map((ratio) => (
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

export default memo(VideoControls)
