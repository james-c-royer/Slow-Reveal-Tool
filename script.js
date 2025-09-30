document.addEventListener("DOMContentLoaded", () => {
  const numInputsField = document.getElementById("numInputs");
  const generateBtn = document.getElementById("generateBtn");
  const fileInputsContainer = document.getElementById("fileInputs");
  const generateHTMLContainer = document.getElementById("generateHTML");
  let saveButtonExists = false;


  let num = 0;

  generateBtn.addEventListener("click", () => {
    num = parseInt(numInputsField.value, 10);

    fileInputsContainer.innerHTML = "";

    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }


    for (let i = 1; i <= num; i++) {
      // Create a wrapper div
      const wrapperDiv = document.createElement("div");

      // Create the input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.id = `image${i}`;

      // Create the label
      const label = document.createElement("label");
      label.setAttribute("for", input.id);
      label.textContent = `Select image ${i}: `;

      // Append label and input to the wrapper div
      wrapperDiv.appendChild(label);
      wrapperDiv.appendChild(input);

      // Append wrapper div to the container
      fileInputsContainer.appendChild(wrapperDiv);
      fileInputsContainer.appendChild(document.createElement("br"));
    }

    // Add a submit button to store images and go directly to gallery
    if (!saveButtonExists) {
      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Save and Go to Gallery";
      submitBtn.type = "button";
      submitBtn.addEventListener("click", saveImagesAndRedirect);
      generateHTMLContainer.appendChild(submitBtn);
      saveButtonExists = true;
    }
  });

  function saveImagesAndRedirect() {
    const inputs = fileInputsContainer.querySelectorAll("input[type=file]");
    const images = [];

    let filesRead = 0;

    inputs.forEach((input, index) => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          images[index] = e.target.result;
          filesRead++;
          if (filesRead === inputs.length) {
            // Redirect directly to the gallery page
            // window.location.href = "gallery-slideshow/index.html";
            generateHTML(JSON.stringify(images))


          }
        };
        reader.readAsDataURL(file);
      } else {
        images[index] = null;
        filesRead++;
      }
    });
  }


  function generateHTML(imagesJSON) {
    let htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Slow Reveal Graph</title>
      <script>
      const images = ${imagesJSON};

      document.addEventListener("DOMContentLoaded", () => {
      const slideshow = document.getElementById("slideshow");
      const pauseTimeInput = document.getElementById("pauseTime");
      const startBtn = document.getElementById("startBtn");
      const pauseBtn = document.getElementById("pauseBtn");
      const manualControls = document.getElementById("manualControls");


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

        const buttons = manualControls.querySelectorAll(".page-button");
        buttons.forEach((btn) => {
          btn.classList.toggle("active", parseInt(btn.dataset.index) === index);
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
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "<";
      prevBtn.classList.add('page-button');
      prevBtn.addEventListener("click", prevImage);
      manualControls.appendChild(prevBtn);

      // Build manual control buttons
      images.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.textContent = i + 1;
        btn.dataset.index = i;
        btn.classList.add('page-button');
        btn.addEventListener("click", () => goToImage(i));
        manualControls.appendChild(btn);
      });

      const nextBtn = document.createElement("button");
      nextBtn.textContent = ">";
      nextBtn.classList.add('page-button');
      nextBtn.addEventListener("click", nextImage);
      manualControls.appendChild(nextBtn);
    });

  </script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  <style>
    html,
    body {
      height: 100%;
      width: 100%;
    }

    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      text-align: center;
    }

    .container {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    .col-12 {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    #manualControls {
      display: flex;
      justify-content: center;
      flex-direction: row;
      gap: .5em;
      min-width: 100px;
    }

    #slideshow-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    #slideshow {
      width: 100%;
      height: 600px;
      border: 1px solid #ccc;
      position: relative;
      overflow: hidden;
      margin-bottom: 20px;
    }

    #slideshow img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      transition: opacity 2s ease-in-out;
    }

    #slideshow img.active {
      opacity: 1;
    }

    .slideshow-controls {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
    }

    .page-button {
      all: unset;
      color: blue;
      cursor: pointer;
    }

    .page-button.active {
      color: black;
      text-decoration: none;
      font-weight: bold;
      cursor: default;
      /* optional, for emphasis */
    }


    button {
      padding: 6px 14px;
      font-size: 14px;
      cursor: pointer;
    }

    input[type=number] {
      width: 60px;
      text-align: center;
      font-size: 14px;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="col-12">
      <div class="row" id="h1-row">
        <h1>Slow Reveal Graph</h1>
      </div>

      <!-- Slideshow Image -->
      <div class="row" id="slideshow-row">
        <div id="slideshow"></div>
      </div>

      <div class="row" id="manCon-row">
        <!-- Manual Controls Left of Image -->
        <div id="manualControls"></div>
      </div>

      <div class="row">
        <!-- Slideshow Controls Below Image -->
        <div class="slideshow-controls">
          <button id="startBtn">Start Slideshow</button>
          <label for="pauseTime">Pause (s): </label>
          <input type="number" id="pauseTime" min="1" value="3">
          <button id="pauseBtn" disabled>Pause</button>
        </div>
      </div>
    </div>

  </div>

</body>

</html>`

    const blob = new Blob([htmlContent], { type: "html" });
    const url = URL.createObjectURL(blob);

    let fileName = prompt("Enter a name for your file: ");

    while (!fileName) {
      fileName = prompt("Error: you did not provide a name for your slow reveal file. What would you like to name it? ")
    }

    // Reg expression to remove the special chars not supported in files
    fileName = fileName.replace(/[.\/\\:*?"<>|]/g, "");

    // make it an html file
    fileName += ".html";

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // filename
    a.click();

    URL.revokeObjectURL(url);
  }
});
