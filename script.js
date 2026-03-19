let imgBox = document.getElementById("imgBox");
let qrText = document.getElementById("qrText");
let downloadBtn = document.getElementById("downloadBtn");

let qrSize = document.getElementById("qrSize");
let sizeValue = document.getElementById("sizeValue");
let qrColor = document.getElementById("qrColor");
let qrBgColor = document.getElementById("qrBgColor");
let logoUpload = document.getElementById("logoUpload");

let historyList = document.getElementById("historyList");

let canvas = document.getElementById("qrCanvas");
let ctx = canvas.getContext("2d");

// Load QR history
let qrHistory = JSON.parse(localStorage.getItem("qrHistory")) || [];


// Show slider value
sizeValue.innerText = qrSize.value;

qrSize.addEventListener("input", () => {
  sizeValue.innerText = qrSize.value;
});


// Save history
function saveHistory(value) {

  if (!value) return;

  qrHistory.unshift(value);

  // Remove duplicates + keep last 10
  qrHistory = [...new Set(qrHistory)].slice(0,10);

  localStorage.setItem("qrHistory", JSON.stringify(qrHistory));

  renderHistory();
}


// Render history UI
function renderHistory(){

  historyList.innerHTML = "";

  qrHistory.forEach(item => {

    const li = document.createElement("li");

    li.textContent = item;

    li.style.cursor = "pointer";

    li.onclick = () => {
      qrText.value = item;
      generateQRCode();
    };

    historyList.appendChild(li);
  });

}


function generateQRCode() {

  if (qrText.value.length === 0) {

    qrText.classList.add("error");

    setTimeout(() => {
      qrText.classList.remove("error");
    }, 1000);

    return;
  }

  let size = qrSize.value;
  let color = qrColor.value.replace("#", "");
  let bgcolor = qrBgColor.value.replace("#", "");

  const qrURL =
    "https://api.qrserver.com/v1/create-qr-code/?" +
    "size=" + size + "x" + size +
    "&color=" + color +
    "&bgcolor=" + bgcolor +
    "&data=" + encodeURIComponent(qrText.value);

  const qrImage = new Image();
  qrImage.crossOrigin = "anonymous";
  qrImage.src = qrURL;

  qrImage.onload = function () {

    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(qrImage, 0, 0, size, size);

    const file = logoUpload.files[0];

    if (file) {

      const logo = new Image();
      logo.src = URL.createObjectURL(file);

      logo.onload = function () {

        const logoSize = size * 0.25;
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;

        ctx.drawImage(logo, x, y, logoSize, logoSize);

      };

    }

    imgBox.classList.add("show-img");
    downloadBtn.disabled = false;

    // Save QR to history
    saveHistory(qrText.value);

  };

}


// Download QR Code
downloadBtn.addEventListener("click", function () {

  const link = document.createElement("a");

  link.download = "qr-code.png";
  link.href = canvas.toDataURL("image/png");

  link.click();

});


// Load history when page loads
renderHistory();
