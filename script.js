let imgBox = document.getElementById("imgBox");
let qrImg = document.getElementById("qrImg");
let qrText = document.getElementById("qrText");
let downloadBtn = document.getElementById("downloadBtn");

function generateQRCode() {
  if (qrText.value.length > 0) {
    qrImg.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
      encodeURIComponent(qrText.value);

    imgBox.classList.add("show-img");

    qrImg.onload = function () {
      downloadBtn.disabled = false;
    };
  } else {
    qrText.classList.add("error");
    downloadBtn.disabled = true;

    setTimeout(() => {
      qrText.classList.remove("error");
    }, 1000);
  }
}

// FIXED Download Logic (No New Tab Issue)
downloadBtn.addEventListener("click", async function () {
  if (!qrImg.src) return;

  try {
    const response = await fetch(qrImg.src);
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "qr-code.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    alert("Download failed. Please try again.");
  }
});
