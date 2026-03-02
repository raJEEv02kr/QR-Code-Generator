let imgBox = document.getElementById("imgBox");
let qrImg = document.getElementById("qrImg");
let qrText = document.getElementById("qrText");
let downloadBtn = document.getElementById("downloadBtn"); // NEW

function generateQRCode() {
  if (qrText.value.length > 0) {
    qrImg.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
      encodeURIComponent(qrText.value); // safer encoding

    imgBox.classList.add("show-img");

    // Enable download button after QR loads
    qrImg.onload = function () {
      downloadBtn.disabled = false;
    };
  } else {
    qrText.classList.add("error");
    downloadBtn.disabled = true; // keep disabled if invalid
    setTimeout(() => {
      qrText.classList.remove("error");
    }, 1000);
  }
}

// Download QR Functionality
downloadBtn.addEventListener("click", function () {
  if (!qrImg.src) return;

  const link = document.createElement("a");
  link.href = qrImg.src;
  link.download = "qr-code.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
