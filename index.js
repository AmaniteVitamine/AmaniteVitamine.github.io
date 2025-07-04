var c = document.getElementById("myCanvas");
c.setAttribute('style', 'display: none');
var ctx = c.getContext("2d");

document.addEventListener('DOMContentLoaded', () => {
    DrawMap();
  });

const height = document.getElementById("height");
const width = document.getElementById("width");
const myButton = document.getElementById("Creer");
const myButtonDownload = document.getElementById("Telecharger");

function TestValues(width, height) {
  if (width.trim() === "" || height.trim() === "") {
      alert("Erreur : veuillez compléter toutes les cases.");  
      return;
    }
    if (width <= 0 || height <= 0) {
      alert("Erreur : veuillez saisir des dimensions strictement positives.");  
      return;
    }
    if (width > 5000) {
      alert("Erreur : veuillez saisir une longueur inférieure ou égale à 5000.");  
      return;
    }
    if (height > 5000) {
      alert("Erreur : veuillez saisir une hauteur inférieure ou égale à 5000.");  
      return;
    }
}

function DrawMap() {
    c.width  = width.value*5;
    c.height = height.value*5;

    let rouge = 0;
    let bleu = 0;

    for (let y = 0; y < height.value*5; y = y + 5) {
      for (let x = 0; x < width.value*5; x = x + 5) {
        const grey  = Math.floor(Math.random() * 256);
        const alpha = Math.random();
        ctx.fillStyle = `rgba(${grey}, ${grey}, ${grey}, ${alpha})`;
        ctx.fillRect(x, y, 5, 5);
      }
    }


    c.style.display = "block";

    document.getElementById("rougeCount").textContent = rouge;
    document.getElementById("bleuCount").textContent  = bleu;
}

myButton.addEventListener("click", () => {
  TestValues(width.value,height.value);
  DrawMap();
});

myButtonDownload.addEventListener("click", () => {
  const dataURL = c.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "MyMap.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});


