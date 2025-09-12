document.addEventListener("DOMContentLoaded", () => {
  const numInputsField = document.getElementById("numInputs");
  const generateBtn = document.getElementById("generateBtn");
  const fileInputsContainer = document.getElementById("fileInputs");

  let num = 0;

  generateBtn.addEventListener("click", () => {
    num = parseInt(numInputsField.value, 10);

    fileInputsContainer.innerHTML = "";

    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }
    else if (num > 10 ){
      alert("Please select fewer than 10 images.")
      return;
    }

    for (let i = 1; i <= num; i++) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.id = `image${i}`;

      const label = document.createElement("label");
      label.setAttribute("for", input.id);
      label.textContent = `Select image ${i}: `;

      fileInputsContainer.appendChild(label);
      fileInputsContainer.appendChild(input);
      fileInputsContainer.appendChild(document.createElement("br"));
    }

    // Add a submit button to store images and go directly to gallery
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Save and Go to Gallery";
    submitBtn.type = "button";
    submitBtn.addEventListener("click", saveImagesAndRedirect);
    fileInputsContainer.appendChild(submitBtn);
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
            localStorage.setItem("uploadedImages", JSON.stringify(images));
            // Redirect directly to the gallery page
            window.location.href = "gallery-slideshow/index.html";
          }
        };
        reader.readAsDataURL(file);
      } else {
        images[index] = null;
        filesRead++;
      }
    });
  }
});
