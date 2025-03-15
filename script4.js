document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const themeToggle = document.getElementById("themeToggle");
    const detectionToggle = document.getElementById("detection-toggle");
    const webcam = document.getElementById("webcam");
    const cameraPlaceholder = document.getElementById("camera-placeholder");
    const statusIndicator = document.getElementById("status-indicator");
    const drowsinessStatus = document.getElementById("drowsinessStatus");
    const yawningStatus = document.getElementById("yawningStatus");
    const errorContainer = document.getElementById("error-container")
    const errorMessage = document.getElementById("error-message")
    
    // State
    let isRunning = false;
    let detectionInterval = null;
    let currentTheme = localStorage.getItem("theme") || "light";
  
    // Apply saved theme
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
    }
  
    // Theme Toggle
    themeToggle.addEventListener("click", () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", currentTheme);
        document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", currentTheme);
    });

    // Setup webcam
    async function setupWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            webcam.srcObject = stream;
            webcam.style.display = "block";
            cameraPlaceholder.style.display = "none";
            return true;
        } catch (error) {
            console.error("Error accessing webcam:", error);
            return false;
        }
    }

    function stopWebcam() {
        if (webcam.srcObject) {
            const tracks = webcam.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            webcam.srcObject = null;
            webcam.style.display = "none";
            cameraPlaceholder.style.display = "flex";
        }
    }

    // Update status indicator
    function updateStatus(status) {
        // Remove all status classes
        statusIndicator.classList.remove("idle", "alert", "drowsy", "yawning")
    
        // Add the new status class
        statusIndicator.classList.add(status)
    
        // Update the icon and text based on status
        let icon, title, description
    
        switch (status) {
          case "drowsy":
            icon = '<i class="fas fa-exclamation-triangle"></i>'
            title = "Drowsiness Detected!"
            description = "You appear to be drowsy. Consider taking a break."
            // Play alert sound
            playAlertSound()
            break
          case "yawning":
            icon = '<i class="fas fa-coffee"></i>'
            title = "Yawning Detected!"
            description = "You're yawning frequently. This could be a sign of fatigue."
            // Play alert sound
            playAlertSound()
            break
          case "alert":
            icon = '<i class="fas fa-check-circle"></i>'
            title = "You're Alert"
            description = "No signs of drowsiness detected."
            break
          default: // idle
            icon = '<i class="fas fa-coffee"></i>'
            title = "System Idle"
            description = "Start the detection to monitor drowsiness."
        }
    
        statusIndicator.querySelector(".status-icon").innerHTML = icon
        statusIndicator.querySelector(".status-text h3").textContent = title
        statusIndicator.querySelector(".status-text p").textContent = description
      }

      // Simulate drowsiness detection
    function simulateDetection() {
        // This is a simplified simulation for demonstration purposes
        // In a real implementation, this would be replaced with actual computer vision algorithms
    
        // Generate a random number to determine the status
        const random = Math.random()
    
        if (random < 0.1) {
          // 10% chance of drowsiness
          updateStatus("drowsy")
        } else if (random < 0.2) {
          // 10% chance of yawning
          updateStatus("yawning")
        } else {
          // 80% chance of being alert
          updateStatus("alert")
        }
      }
    
      // Play alert sound
      function playAlertSound() {
        const audio = new Audio("alert.mp3")
        audio.play().catch((error) => {
          console.error("Error playing sound:", error)
          // Silently fail if sound can't be played (e.g., user hasn't interacted with the page yet)
        })
      }
    
      // Show error message
      function showError(message) {
        errorMessage.textContent = message
        errorContainer.classList.remove("hidden")
    
        // Hide the error after 5 seconds
        setTimeout(() => {
          errorContainer.classList.add("hidden")
        }, 5000)
      }


    function updateStatus() {
        const isDrowsy = Math.random() > 0.7;
        const isYawning = Math.random() > 0.8;

        drowsinessStatus.textContent = isDrowsy ? "Alert!" : "Normal";
        drowsinessStatus.className = `status-badge ${isDrowsy ? "alert" : ""}`;

        yawningStatus.textContent = isYawning ? "Alert!" : "Normal";
        yawningStatus.className = `status-badge ${isYawning ? "alert" : ""}`;
    }

    detectionToggle.addEventListener("click", async () => {
        isRunning = !isRunning;
        
        if (isRunning) {
            const webcamStarted = await setupWebcam();
            if (webcamStarted) {
                detectionToggle.innerHTML = '<i class="fas fa-power-off"></i><span>Stop Detection</span>';
                detectionToggle.classList.add("stop-btn");
                detectionInterval = setInterval(updateStatus, 3000);
            }
        } else {
            stopWebcam();
            detectionToggle.innerHTML = '<i class="fas fa-power-off"></i><span>Start Detection</span>';
            detectionToggle.classList.remove("stop-btn");
            clearInterval(detectionInterval);
            drowsinessStatus.textContent = "Normal";
            yawningStatus.textContent = "Normal";
        }
    });

    updateStatus();
});


document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const themeToggle = document.getElementById("theme-toggle")
    const detectionToggle = document.getElementById("detection-toggle")
    const webcam = document.getElementById("webcam")
    const cameraPlaceholder = document.getElementById("camera-placeholder")
    const statusIndicator = document.getElementById("status-indicator")
    const errorContainer = document.getElementById("error-container")
    const errorMessage = document.getElementById("error-message")
  
    // State
    let isRunning = false
    let detectionInterval = null
    let currentTheme = localStorage.getItem("theme") || "light"
  
    // Apply saved theme
    if (currentTheme === "dark") {
      document.body.classList.add("dark-theme")
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    }
  
    // Theme Toggle
    themeToggle.addEventListener("click", () => {
      if (currentTheme === "light") {
        document.body.classList.add("dark-theme")
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
        currentTheme = "dark"
      } else {
        document.body.classList.remove("dark-theme")
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
        currentTheme = "light"
      }
      localStorage.setItem("theme", currentTheme)
    })
  
    // Setup webcam
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
        webcam.srcObject = stream
        webcam.style.display = "block"
        cameraPlaceholder.style.display = "none"
        return true
      } catch (error) {
        console.error("Error accessing webcam:", error)
        showError("Could not access the camera. Please check permissions.")
        return false
      }
    }
  
    // Stop webcam
    function stopWebcam() {
      if (webcam.srcObject) {
        const tracks = webcam.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
        webcam.srcObject = null
        webcam.style.display = "none"
        cameraPlaceholder.style.display = "flex"
      }
    }
  
    // Update status indicator
    function updateStatus(status) {
      // Remove all status classes
      statusIndicator.classList.remove("idle", "alert", "drowsy", "yawning")
  
      // Add the new status class
      statusIndicator.classList.add(status)
  
      // Update the icon and text based on status
      let icon, title, description
  
      switch (status) {
        case "drowsy":
          icon = '<i class="fas fa-exclamation-triangle"></i>'
          title = "Drowsiness Detected!"
          description = "You appear to be drowsy. Consider taking a break."
          // Play alert sound
          playAlertSound()
          break
        case "yawning":
          icon = '<i class="fas fa-coffee"></i>'
          title = "Yawning Detected!"
          description = "You're yawning frequently. This could be a sign of fatigue."
          // Play alert sound
          playAlertSound()
          break
        case "alert":
          icon = '<i class="fas fa-check-circle"></i>'
          title = "You're Alert"
          description = "No signs of drowsiness detected."
          break
        default: // idle
          icon = '<i class="fas fa-coffee"></i>'
          title = "System Idle"
          description = "Start the detection to monitor drowsiness."
      }
  
      statusIndicator.querySelector(".status-icon").innerHTML = icon
      statusIndicator.querySelector(".status-text h3").textContent = title
      statusIndicator.querySelector(".status-text p").textContent = description
    }
  
    // Simulate drowsiness detection
    function simulateDetection() {
      // This is a simplified simulation for demonstration purposes
      // In a real implementation, this would be replaced with actual computer vision algorithms
  
      // Generate a random number to determine the status
      const random = Math.random()
  
      if (random < 0.1) {
        // 10% chance of drowsiness
        updateStatus("drowsy")
      } else if (random < 0.2) {
        // 10% chance of yawning
        updateStatus("yawning")
      } else {
        // 80% chance of being alert
        updateStatus("alert")
      }
    }
  
    // Play alert sound
    function playAlertSound() {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3")
      audio.play().catch((error) => {
        console.error("Error playing sound:", error)
        // Silently fail if sound can't be played (e.g., user hasn't interacted with the page yet)
      })
    }
  
    // Show error message
    function showError(message) {
      errorMessage.textContent = message
      errorContainer.classList.remove("hidden")
  
      // Hide the error after 5 seconds
      setTimeout(() => {
        errorContainer.classList.add("hidden")
      }, 5000)
    }
  
    // Toggle detection
    detectionToggle.addEventListener("click", async () => {
      if (!isRunning) {
        // Start detection
        const webcamStarted = await setupWebcam()
  
        if (webcamStarted) {
          isRunning = true
          detectionToggle.classList.remove("start-btn")
          detectionToggle.classList.add("stop-btn")
          detectionToggle.innerHTML = '<i class="fas fa-power-off"></i><span>Stop Detection</span>'
  
          // Start simulated detection
          detectionInterval = setInterval(simulateDetection, 3000)
        }
      } else {
        // Stop detection
        isRunning = false
        stopWebcam()
        detectionToggle.classList.remove("stop-btn")
        detectionToggle.classList.add("start-btn")
        detectionToggle.innerHTML = '<i class="fas fa-power-off"></i><span>Start Detection</span>'
  
        // Stop simulated detection
        if (detectionInterval) {
          clearInterval(detectionInterval)
          detectionInterval = null
        }
  
        // Reset status to idle
        updateStatus("idle")
      }
    })
})
