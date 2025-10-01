// ==UserScript==
// @name         Instagram Video Controls
// @version      1.0.1
// @description  Add custom video controls to Instagram videos and reels
// @icon         https://github.com/ttoan12/instagram-video-controls/raw/refs/heads/main/instagram-video-controls.png

// @author       Toan Tran
// @namespace    https://github.com/ttoan12
// @homepageURL  https://github.com/ttoan12/instagram-video-controls
// @supportURL   https://github.com/ttoan12/instagram-video-controls/issues
// @updateURL    https://github.com/ttoan12/instagram-video-controls/raw/refs/heads/main/instagram-video-controls.user.js
// @downloadURL  https://github.com/ttoan12/instagram-video-controls/raw/refs/heads/main/instagram-video-controls.user.js

// @grant        none

// @match        https://www.instagram.com/*
// ==/UserScript==

(function () {
  "use strict";

  // Styles for the custom controls
  const styles = `
        .custom-video-controls {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease, bottom 0.3s ease;
            pointer-events: none;
        }

        .custom-video-controls.show {
            opacity: 1;
            pointer-events: all;
        }

        .custom-video-controls.story-video {
            opacity: 1;
            pointer-events: all;
        }

        .custom-video-controls.reel-video {
        }

        .video-progress-container {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .video-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045);
            border-radius: 2px;
            position: relative;
            width: 0%;
            transition: width 0.1s linear;
        }

        .video-progress-container:hover {
            height: 6px;
        }

        .video-controls-bottom {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .video-control-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease;
        }

        .video-control-btn:hover {
            transform: scale(1.1);
        }

        .video-control-btn svg {
            width: 20px;
            height: 20px;
            fill: white;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
        }

        .video-time {
            color: white;
            font-size: 13px;
            font-weight: 500;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin-left: auto;
        }

        .volume-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .volume-slider {
            width: 0;
            opacity: 0;
            transition: width 0.3s ease, opacity 0.3s ease;
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            outline: none;
        }

        .volume-container:hover .volume-slider {
            width: 60px;
            opacity: 1;
        }

        .volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            border: none;
        }

        .video-container-wrapper {
            position: relative;
        }

        .original-feed-video-controls {
            bottom: unset !important;
            top: 0 !important;
        }

        .original-story-video-controls {
            padding-bottom: 75px !important;
        }

        .original-reel-video-controls {
            padding-bottom: 60px !important;
        }
    `;

  // Add styles to the page
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // SVG Icons
  const icons = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
    volume:
      '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
    volumeMute:
      '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
    fullscreen:
      '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
    exitFullscreen:
      '<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>',
  };

  // Check if we're in a story
  function isStoryVideo() {
    return window.location.pathname.includes("/stories/") && !window.location.pathname.includes("/stories/direct/");
  }

  // Check if we're in a direct story
  function isDirectStoryVideo() {
    return window.location.pathname.includes("/stories/direct/");
  }

  // Check if we're in a reel
  function isReelVideo() {
    return window.location.pathname.includes("/reels/");
  }

  // Find and move feed video controls
  function findAndMoveFeedVideoControls(video) {
    if (isStoryVideo() || isReelVideo() || isDirectStoryVideo()) return;

    // Look for Instagram's control elements
    const possibleElements = video.parentElement.querySelectorAll(
      "div[data-instancekey] > div > div:not([role='presentation'])"
    );

    for (const element of possibleElements) {
      if (element && !element.classList.contains("original-feed-video-controls")) {
        element.classList.add("original-feed-video-controls");
      }
    }
  }

  // Find and move story video controls
  function findAndMoveStoryVideoControls() {
    if (!isStoryVideo()) return;

    // Look for Instagram's control elements
    const possibleElements = document.body.querySelectorAll(
      "div" +
        ":has(> div:first-child > div:first-child > div:first-child > textarea[placeholder$='...'])" +
        ":has(> div:first-child > div:nth-child(2) > span > div[data-visualcompletion] > div[role='button'])"
    );

    for (const element of possibleElements) {
      if (element && !element.classList.contains("original-story-video-controls")) {
        element.classList.add("original-story-video-controls");
      }
    }
  }

  // Find and move direct story video controls
  function findAndMoveDirectStoryVideoControls() {
    if (!isDirectStoryVideo()) return;

    // Look for Instagram's control elements
    const possibleElements = document.body.querySelectorAll(
      "div:has(> div > div > div > span > div[data-visualcompletion] > div[role='button'])"
    );

    for (const element of possibleElements) {
      if (element && !element.classList.contains("original-story-video-controls")) {
        element.classList.add("original-story-video-controls");
      }
    }
  }

  // Find and move reel video controls
  function findAndMoveReelVideoControls(video) {
    if (!isReelVideo()) return;

    // Look for Instagram's control elements
    const possibleElements = video.parentElement.querySelectorAll(
      "div[data-instancekey] > div > div > div[role='presentation'] > div"
    );

    for (const element of possibleElements) {
      if (element && !element.classList.contains("original-reel-video-controls")) {
        element.classList.add("original-reel-video-controls");
      }
    }
  }

  // Create control elements
  function createControls(video, container) {
    const controls = document.createElement("div");
    controls.className = "custom-video-controls";

    // Progress bar
    const progressContainer = document.createElement("div");
    progressContainer.className = "video-progress-container";
    const progressBar = document.createElement("div");
    progressBar.className = "video-progress-bar";
    progressContainer.appendChild(progressBar);

    // Bottom controls
    const bottomControls = document.createElement("div");
    bottomControls.className = "video-controls-bottom";

    // Play/Pause button
    const playBtn = document.createElement("button");
    playBtn.className = "video-control-btn play-btn";
    playBtn.innerHTML = video.paused ? icons.play : icons.pause;

    // Volume container
    const volumeContainer = document.createElement("div");
    volumeContainer.className = "volume-container";

    const volumeBtn = document.createElement("button");
    volumeBtn.className = "video-control-btn volume-btn";
    volumeBtn.innerHTML = video.muted || video.volume === 0 ? icons.volumeMute : icons.volume;

    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.className = "volume-slider";
    volumeSlider.min = "0";
    volumeSlider.max = "100";
    volumeSlider.value = video.muted ? "0" : Math.round(video.volume * 100);

    volumeContainer.appendChild(volumeBtn);
    volumeContainer.appendChild(volumeSlider);

    // Time display
    const timeDisplay = document.createElement("div");
    timeDisplay.className = "video-time";
    timeDisplay.textContent = "0:00 / 0:00";

    // Fullscreen button
    const fullscreenBtn = document.createElement("button");
    fullscreenBtn.className = "video-control-btn fullscreen-btn";
    fullscreenBtn.innerHTML = icons.fullscreen;

    // Append all controls
    bottomControls.appendChild(playBtn);
    bottomControls.appendChild(volumeContainer);
    bottomControls.appendChild(timeDisplay);
    bottomControls.appendChild(fullscreenBtn);

    controls.appendChild(progressContainer);
    controls.appendChild(bottomControls);

    container.appendChild(controls);

    // Event handlers
    let hideTimeout;

    function showControls(value = true) {
      if (value) {
        controls.classList.add("show");
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => controls.classList.remove("show"), 3000);
      } else {
        controls.classList.remove("show");
        clearTimeout(hideTimeout);
      }
    }

    function formatTime(seconds) {
      if (isNaN(seconds)) return "0:00";
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    function checkStoryOrReelStatus() {
      if (isStoryVideo()) {
        controls.classList.add("story-video");
      } else if (isReelVideo()) {
        controls.classList.add("reel-video");
      } else {
        controls.classList.remove("story-video");
        controls.classList.remove("reel-video");
      }
    }

    // Controls events
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        playBtn.innerHTML = icons.pause;
      } else {
        video.pause();
        playBtn.innerHTML = icons.play;
      }
      showControls();
    });

    progressContainer.addEventListener("click", (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      video.currentTime = percentage * video.duration;
      showControls();
    });

    volumeSlider.addEventListener("input", (e) => {
      video.volume = e.target.value / 100;
      video.muted = false; // Unmute when adjusting volume
      if (video.volume === 0) {
        volumeBtn.innerHTML = icons.volumeMute;
      } else {
        volumeBtn.innerHTML = icons.volume;
      }
    });

    volumeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (video.muted || video.volume === 0) {
        video.muted = false;
        // Restore to previous volume or default to 100%
        const targetVolume = video.volume === 0 ? 1 : video.volume;
        video.volume = targetVolume;
        volumeSlider.value = targetVolume * 100;
        volumeBtn.innerHTML = icons.volume;
      } else {
        video.muted = true;
        volumeSlider.value = 0;
        volumeBtn.innerHTML = icons.volumeMute;
      }
      showControls();
    });

    fullscreenBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const container = video.closest(".video-container-wrapper") || video.parentElement;

      if (!document.fullscreenElement) {
        container
          .requestFullscreen()
          .then(() => {
            fullscreenBtn.innerHTML = icons.exitFullscreen;
          })
          .catch((err) => {
            console.log("Fullscreen error:", err);
          });
      } else {
        document.exitFullscreen().then(() => {
          fullscreenBtn.innerHTML = icons.fullscreen;
        });
      }
      showControls();
    });

    // Video events
    video.addEventListener("play", () => {
      playBtn.innerHTML = icons.pause;
    });

    video.addEventListener("pause", () => {
      playBtn.innerHTML = icons.play;
    });

    video.addEventListener("timeupdate", () => {
      const progress = (video.currentTime / video.duration) * 100;
      progressBar.style.width = progress + "%";
      timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });

    video.addEventListener("volumechange", () => {
      if (video.muted) {
        volumeSlider.value = 0;
        volumeBtn.innerHTML = icons.volumeMute;
      } else {
        volumeSlider.value = Math.round(video.volume * 100);
        volumeBtn.innerHTML = video.volume === 0 ? icons.volumeMute : icons.volume;
      }
    });

    // On hover events
    controls.addEventListener("mouseenter", () => showControls());
    controls.addEventListener("mousemove", () => showControls());
    container.addEventListener("mouseenter", () => showControls());
    container.addEventListener("mousemove", () => showControls());
    container.addEventListener("mouseleave", () => showControls(false));

    // Check immediately and periodically for story or reel changes
    checkStoryOrReelStatus();
    setInterval(checkStoryOrReelStatus, 1000);

    return controls;
  }

  // Process videos
  function processVideo(video) {
    if (video.dataset.hasCustomControls) return;

    video.dataset.hasCustomControls = "true";

    // Find the parent container
    const container = video.parentElement;
    if (!container.classList.contains("video-container-wrapper")) {
      container.style.position = "relative";
      container.classList.add("video-container-wrapper");
    }

    // Try to move controls immediately and after a delay
    const findAndMoveControls = () => {
      findAndMoveFeedVideoControls(video);
      findAndMoveReelVideoControls(video);
      findAndMoveStoryVideoControls();
      findAndMoveDirectStoryVideoControls();
    };
    findAndMoveControls();
    setTimeout(findAndMoveControls, 500);

    // Create and add custom controls
    createControls(video, container);
  }

  // Observer to detect new videos
  const observer = new MutationObserver(() => {
    const videos = document.querySelectorAll("video");
    videos.forEach(processVideo);
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Process existing videos
  setTimeout(() => {
    const videos = document.querySelectorAll("video");
    videos.forEach(processVideo);
  }, 1000);

  // Handle URL changes for stories and reels
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      // Recheck all videos when URL changes
      setTimeout(() => {
        const videos = document.querySelectorAll("video");
        videos.forEach((video) => {
          const controls = video.parentElement.querySelector(".custom-video-controls");
          if (controls) {
            if (isStoryVideo()) {
              controls.classList.add("story-video");
            } else if (isReelVideo()) {
              controls.classList.add("reel-video");
            } else {
              controls.classList.remove("story-video");
              controls.classList.remove("reel-video");
            }
          }
        });
      }, 500);
    }
  }).observe(document, { subtree: true, childList: true });
})();
