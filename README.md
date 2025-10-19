# Instagram Video Controls

A userscript that adds custom video controls to Instagram videos and reels, providing enhanced playback functionality with a modern, Instagram-themed interface.

## Features

### 🎮 Video Controls
- **Play/Pause**: Toggle video playback with a single click
- **Progress Bar**: Click to seek to any position in the video
- **Volume Control**: Adjust volume with a slider (appears on hover)
- **Mute/Unmute**: Quick mute toggle with visual feedback
- **Time Display**: Shows current time and total duration
- **Fullscreen**: Enter/exit fullscreen mode

### 🎨 Visual Design
- **Instagram-themed**: Gradient progress bar matching Instagram's brand colors
- **Smooth Animations**: Fade in/out controls with smooth transitions
- **Responsive**: Adapts to different video sizes and contexts
- **Non-intrusive**: Controls appear on hover and auto-hide after 3 seconds

### 📱 Context Awareness
- **Stories**: Optimized controls for Instagram Stories
- **Reels**: Enhanced controls for Instagram Reels
- **Regular Videos**: Full control set for standard Instagram videos
- **Auto-detection**: Automatically detects video context and adjusts accordingly

## Installation

### Prerequisites
- A userscript manager such as:
  - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
  - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)
  - [Greasemonkey](https://www.greasespot.net/) (Firefox)

### Quick Install
[![Install with Tampermonkey](https://img.shields.io/badge/Install%20with-Tampermonkey-blue?style=for-the-badge&logo=tampermonkey)](https://github.com/ttoan12/instagram-video-controls/raw/refs/heads/main/instagram-video-controls.user.js)

### Manual Installation Steps
1. Install a userscript manager in your browser
2. Click on the userscript manager extension icon
3. Select "Create a new script" or "Add new script"
4. Copy the entire contents of `instagram-video-controls.user.js`
5. Paste the code into the script editor
6. Save the script (Ctrl+S or Cmd+S)
7. Visit Instagram and enjoy enhanced video controls!

### Direct Install Link
You can also install directly by clicking this link: [Install Script](https://github.com/ttoan12/instagram-video-controls/raw/refs/heads/main/instagram-video-controls.user.js)

## Usage

### Basic Controls
- **Hover** over any Instagram video to reveal the custom controls
- **Click** the play/pause button to control playback
- **Click** anywhere on the progress bar to seek to that position
- **Hover** over the volume button to reveal the volume slider
- **Click** the fullscreen button to enter/exit fullscreen mode

### Volume Control
- Hover over the volume icon to reveal the volume slider
- Drag the slider to adjust volume (0-100%)
- Click the volume icon to quickly mute/unmute

### Time Display
- Shows current playback time and total duration
- Format: `current:total` (e.g., `1:23 / 3:45`)

## Compatibility

- **Browsers**: Chrome, Firefox, Safari, Edge
- **Instagram Pages**: 
  - ✅ Main feed videos
  - ✅ Instagram Stories
  - ✅ Instagram Reels
  - ✅ Profile videos
  - ✅ Explore page videos

## Technical Details

### Script Information
- **Name**: Instagram Video Controls
- **Version**: 1.0
- **Author**: Toan Tran
- **Namespace**: Violentmonkey Scripts
- **Match**: `https://www.instagram.com/*`

### Features Implemented
- **MutationObserver**: Automatically detects new videos as you scroll
- **Event Handling**: Comprehensive video event listeners
- **CSS Styling**: Custom styles that don't interfere with Instagram's design
- **URL Monitoring**: Detects navigation changes for proper context switching
- **Control Repositioning**: Moves original Instagram controls to prevent conflicts

### Browser Permissions
- **Grant**: None (no special permissions required)
- **Access**: Only runs on Instagram.com

## Changelog

### v1.0.1
- Fixed memory leaks and unbounded intervals
- Improved state management and cleanup
- Added error handling and better error messages

### v1.0.2
- Context caching for better performance
- Observer debouncing with requestAnimationFrame
- CSS minification and layout optimizations
- Global status interval for all videos

### v1.0.3
- Improve detection for stories

## Troubleshooting

### Controls Not Appearing
1. Ensure the userscript is enabled in your userscript manager
2. Refresh the Instagram page
3. Check that you're on `https://www.instagram.com`
4. Try disabling other Instagram-related userscripts temporarily

### Controls Not Working
1. Check browser console for any error messages
2. Ensure JavaScript is enabled in your browser
3. Try refreshing the page
4. Disable ad blockers that might interfere with the script

### Volume Control Issues
1. Make sure your browser allows autoplay with sound
2. Check that your system volume is not muted
3. Try clicking the volume button to unmute

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## License

This project is licensed under the MIT License. Please respect Instagram's terms of service when using this script.

## Disclaimer

This userscript is not affiliated with or endorsed by Instagram/Meta. Use at your own discretion and in accordance with Instagram's terms of service.

---

**Note**: This script enhances your Instagram experience by adding video controls. It does not collect any personal data or interfere with Instagram's core functionality.
