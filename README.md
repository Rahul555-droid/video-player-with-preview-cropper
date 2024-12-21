
# Video Cropper Application  

https://video-player-with-preview-cropper.vercel.app/

This project is a web-based video cropper application built entirely without external libraries. The application allows users to:
- Play, pause, and control playback of a video.
- Adjust playback speed and volume.
- Crop the video using an overlay cropper with various aspect ratios.
- Preview the cropped video in real-time.
- Record metadata such as cropper coordinates, playback rate, and volume.
- Upload custom video files or use a default static video.
- Generate and download metadata as a JSON file.

## Features

### 1. Video Player
- **Static Media Content**: Displays a static media file (`superman_720p.mp4`) as the default video.
- **Custom Video Upload**: Users can upload their own video files for cropping.
- **Playback Controls**:
  - Play/Pause
  - Seek
  - Volume control
  - Playback speed adjustment (0.5x, 1x, 1.5x, 2x)

### 2. Cropper Overlay
- **Aspect Ratios**: Supports multiple aspect ratios:
  - 9:18, 9:16, 4:3, 3:4, 1:1, 4:5
- **Dynamic Resizing and Positioning**: Cropper is movable and resizable within the video player dimensions.
- **Real-Time Preview**: Displays a live preview of the cropped segment that matches the selected aspect ratio.

### 3. Metadata Recording
- Records cropper coordinates, playback rate, volume, and video timestamp at regular intervals.
- Allows users to download the recorded metadata as a JSON file for further use.

### 4. User Interface
- Built entirely with **Tailwind CSS**.
- Custom-built buttons, dropdowns, and modals for a pixel-perfect UI.
- Matches design specifications as outlined in the requirements.

## Requirements

### Initial Requirements Implemented
- Video playback controls with a static 16:9 media file.
- Dynamic cropper overlay with multiple aspect ratios.
- Real-time cropping preview.
- Metadata recording and JSON download functionality.

### Bonus Requirements (Not Fully Implemented)
- **Recorded Session Playback**: A tab to replay recorded sessions based on JSON metadata (currently not functional).

## Installation and Usage

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the application in your browser at:
   ```
   http://localhost:3000
   ```

## Code Overview

### Key Components

#### `hooks/useVideoState.js`
Manages video playback state, including play/pause, volume, playback speed, and progress tracking.

- **Functions**:
  - `togglePlay`: Toggles play/pause state of the video.
  - `handleVolumeChange`: Adjusts video volume.
  - `handlePlaybackRateChange`: Changes playback speed.
  - `handleTimeUpdate`: Updates progress as the video plays.
  - `handleSeekChange`: Allows seeking to a specific timestamp.

#### `hooks/useCropper.js`
Handles the cropper overlay's position, dimensions, and movement.

#### `hooks/useCanvasPreview.js`
Synchronizes the cropper overlay with a real-time canvas preview.

#### `components/VideoControls.js`
Renders playback controls, including play/pause, volume slider, playback speed dropdown, and aspect ratio selector.

#### `components/CropOverlay.js`
Displays and manages the cropper overlay on the video.

#### `VideoPlayer.js`
The main component that integrates the video player, cropper overlay, and controls.

### Metadata Recording
- Uses `metadataRef` to store cropper coordinates, playback speed, and volume.
- Metadata is updated in real-time and downloaded as a JSON file.

### File Upload
- Users can upload custom videos using the "Upload" button.
- Uploaded videos are previewed dynamically, and the cropper resets to default settings.

## Customization

- Modify the default video file by replacing `/superman_720p.mp4`.
- Add new aspect ratios in the `useCropper` hook.
- Adjust the debounce delay for metadata recording in `recordMetadata` (default: 100ms).
  
## Technologies Used
- **Framework**: React
- **CSS**: Tailwind CSS
- **Build Tool**: Vite

## Future Enhancements
- Implement the "Recorded Session Playback" feature.
- Add test cases for core functionalities using a testing framework like Vitest.

