document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const themeToggle = document.getElementById('themeToggle');
  const detectionToggle = document.getElementById('detection-toggle');
  const webcam = document.getElementById('webcam');
  const cameraPlaceholder = document.getElementById('camera-placeholder');
  const statusIndicator = document.getElementById('status-indicator');
  const drowsinessStatus = document.getElementById('drowsinessStatus');
  const yawningStatus = document.getElementById('yawningStatus');
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.getElementById('error-message');

  // State
  let isRunning = false;
  let detectionInterval = null;

  // Theme handling
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Webcam setup
  async function setupWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      webcam.srcObject = stream;
      webcam.style.display = 'block';
      cameraPlaceholder.style.display = 'none';
      return true;
    } catch (error) {
      console.error('Error accessing webcam:', error);
      showError('Could not access the camera. Please check permissions.');
      return false;
    }
  }

  // Stop webcam
  function stopWebcam() {
    if (webcam.srcObject) {
      const tracks = webcam.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      webcam.srcObject = null;
      webcam.style.display = 'none';
      cameraPlaceholder.style.display = 'flex';
    }
  }

  // Update status
  function updateStatus(type, isAlert) {
    const statusElement = type === 'drowsiness' ? drowsinessStatus : yawningStatus;
    statusElement.textContent = isAlert ? 'Alert!' : 'Normal';
    statusElement.className = `status-badge ${isAlert ? 'alert' : 'normal'}`;

    if (isAlert) {
      playAlertSound();
      showNotification(type);
    }
  }

  // Simulate detection
  function simulateDetection() {
    const drowsy = Math.random() < 0.1; // 10% chance of drowsiness
    const yawning = Math.random() < 0.15; // 15% chance of yawning

    updateStatus('drowsiness', drowsy);
    updateStatus('yawning', yawning);

    // Update main status indicator
    if (drowsy || yawning) {
      const status = drowsy ? 'drowsy' : 'yawning';
      updateMainStatus(status);
    } else {
      updateMainStatus('alert');
    }
  }

  // Update main status indicator
  function updateMainStatus(status) {
    const statusMap = {
      idle: {
        icon: '<i class="fas fa-coffee"></i>',
        title: 'System Idle',
        description: 'Start the detection to monitor drowsiness.'
      },
      alert: {
        icon: '<i class="fas fa-check-circle"></i>',
        title: 'You\'re Alert',
        description: 'No signs of drowsiness detected.'
      },
      drowsy: {
        icon: '<i class="fas fa-exclamation-triangle"></i>',
        title: 'Drowsiness Detected!',
        description: 'You appear to be drowsy. Consider taking a break.'
      },
      yawning: {
        icon: '<i class="fas fa-coffee"></i>',
        title: 'Yawning Detected!',
        description: 'You\'re yawning frequently. This could be a sign of fatigue.'
      }
    };

    statusIndicator.className = `status ${status}`;
    const { icon, title, description } = statusMap[status];
    
    statusIndicator.querySelector('.status-icon').innerHTML = icon;
    statusIndicator.querySelector('.status-text h3').textContent = title;
    statusIndicator.querySelector('.status-text p').textContent = description;
  }

  // Play alert sound
  function playAlertSound() {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }

  // Show notification
  function showNotification(type) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Driver Alert', {
        body: type === 'drowsiness' ? 'Drowsiness detected! Take a break.' : 'Frequent yawning detected! Stay alert.',
        icon: '/path/to/icon.png'
      });
    }
  }

  // Show error message
  function showError(message) {
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
    setTimeout(() => {
      errorContainer.classList.add('hidden');
    }, 5000);
  }

  // Request notification permission
  if ('Notification' in window) {
    Notification.requestPermission();
  }

  // Toggle detection
  detectionToggle.addEventListener('click', async () => {
    if (!isRunning) {
      const webcamStarted = await setupWebcam();
      if (webcamStarted) {
        isRunning = true;
        detectionToggle.classList.remove('start-btn');
        detectionToggle.classList.add('stop-btn');
        detectionToggle.innerHTML = '<i class="fas fa-power-off"></i><span>Stop Detection</span>';
        detectionInterval = setInterval(simulateDetection, 3000);
      }
    } else {
      isRunning = false;
      stopWebcam();
      detectionToggle.classList.remove('stop-btn');
      detectionToggle.classList.add('start-btn');
      detectionToggle.innerHTML = '<i class="fas fa-power-off"></i><span>Start Detection</span>';
      
      if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
      }
      
      updateMainStatus('idle');
      updateStatus('drowsiness', false);
      updateStatus('yawning', false);
    }
  });
});
