import { useState, useCallback } from 'react'

export const useVideoState = (videoRef) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [progress, setProgress] = useState(0)

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  const handleVolumeChange = useCallback(
    (e) => {
      const newVolume = parseFloat(e.target.value)
      if (videoRef.current) {
        videoRef.current.volume = newVolume
      }
      setVolume(newVolume)
    },
    []
  )

  const handlePlaybackRateChange = useCallback(
    (e) => {
      const newRate = parseFloat(e.target.value)
      if (videoRef.current) {
        videoRef.current.playbackRate = newRate
      }
      setPlaybackRate(newRate)
    },
    []
  )

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const percentage =
        (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(percentage)
    }
  }, [])

  const handleSeekChange = useCallback(
    (e) => {
      const newTime = parseFloat(e.target.value);
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }
      setProgress((newTime / videoRef.current.duration) * 100);
    },
    [videoRef]
  );

  const handleSeekMouseDown = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [videoRef]);

  const handleSeekMouseUp = useCallback(() => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play();
    }
  }, [videoRef, isPlaying]);




  return {
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
  }
}
