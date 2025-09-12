document.addEventListener("DOMContentLoaded", () => {
  const slideshow = document.getElementById("slideshow");
  const pauseTimeInput = document.getElementById("pauseTime");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const manualControls = document.getElementById("manualControls");

  const images = JSON.parse(localStorage.getItem("uploadedImages")) || [];
  let currentIndex = 0;
  let intervalId = null;
  let isPaused = true;
  let slideshowStarted = false;

  // Load images
  images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    if (i === 0) img.classList.add("active");
    slideshow.appendChild(img);
  });

  const imgElements = slideshow.querySelectorAll("img");

  function showImage(index) {
    imgElements.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });
  }

  function stopSlideshow() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    slideshowStarted = false;
    startBtn.textContent = "Start Slideshow";
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause";
    pauseTimeInput.disabled = false; // enable input when slideshow stops
  }

  function startSlideshow(fromBeginning = false) {
    if (intervalId) clearInterval(intervalId);

    const pauseTime = parseInt(pauseTimeInput.value, 10) * 1000;
    if (isNaN(pauseTime) || pauseTime <= 0) {
      alert("Please enter a valid pause time (seconds).");
      return;
    }

    if (fromBeginning) {
      currentIndex = 0;
      showImage(currentIndex);
      stopSlideshow();
      return;
    }

    isPaused = false;
    pauseBtn.disabled = false;
    pauseBtn.textContent = "Pause";
    pauseTimeInput.disabled = true; // disable while running

    showImage(currentIndex);

    intervalId = setInterval(() => {
      if (!isPaused) {
        if (currentIndex < images.length - 1) {
          currentIndex++;
          showImage(currentIndex);
        } else {
          stopSlideshow();
        }
      }
    }, pauseTime + 2000);

    slideshowStarted = true;
    startBtn.textContent = "Start from Beginning";
  }

  function togglePause() {
    if (isPaused) {
      isPaused = false;
      pauseBtn.textContent = "Pause";
    } else {
      isPaused = true;
      pauseBtn.textContent = "Resume";
    }
  }

  // Manual controls: select image, but do not enable Pause/Resume
  function goToImage(index) {
    if (intervalId) clearInterval(intervalId);
    slideshowStarted = false;
    currentIndex = index;
    showImage(currentIndex);
    isPaused = true;
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause";
    startBtn.textContent = "Start Slideshow";
    pauseTimeInput.disabled = false; // enable input
  }

  function nextImage() {
    if (intervalId) clearInterval(intervalId);
    slideshowStarted = false;

    if (currentIndex >= images.length - 1) {
      alert("You are currently on the last image!");
      return;
    }

    currentIndex++;
    showImage(currentIndex);
    isPaused = true;
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause";
    startBtn.textContent = "Start Slideshow";
    pauseTimeInput.disabled = false; // enable input
  }

  function prevImage() {
    if (intervalId) clearInterval(intervalId);
    slideshowStarted = false;

    if (currentIndex <= 0) {
      alert("You are currently on the first image!");
      return;
    }

    currentIndex--;
    showImage(currentIndex);
    isPaused = true;
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause";
    startBtn.textContent = "Start Slideshow";
    pauseTimeInput.disabled = false; // enable input
  }

  // Event listeners
  startBtn.addEventListener("click", () => {
    if (slideshowStarted) {
      startSlideshow(true); // restart from beginning
    } else {
      startSlideshow();
    }
  });

  pauseBtn.addEventListener("click", togglePause);

  // Build manual control buttons
  images.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.textContent = `Load Image ${i + 1}`;
    btn.addEventListener("click", () => goToImage(i));
    manualControls.appendChild(btn);
  });

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous Image";
  prevBtn.addEventListener("click", prevImage);
  manualControls.appendChild(prevBtn);

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next Image";
  nextBtn.addEventListener("click", nextImage);
  manualControls.appendChild(nextBtn);
});

