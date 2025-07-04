var c = document.getElementById("myCanvas");
c.setAttribute('style', 'display: none');
var ctx = c.getContext("2d");

document.addEventListener('DOMContentLoaded', () => {
    MyMap();
  });

const height = document.getElementById("height");
const width = document.getElementById("width");
const myButton = document.getElementById("Creer");
const myButtonDownload = document.getElementById("Telecharger");

function MyMap() {
    if (width.value.trim() === "" || height.value.trim() === "") {
      alert("Erreur : veuillez compléter toutes les cases.");  
      return;
    }
    if (width.value <= 0 || height.value <= 0) {
      alert("Erreur : veuillez saisir des dimensions strictement positives.");  
      return;
    }
    if (width.value > 5000) {
      alert("Erreur : veuillez saisir une longueur inférieure ou égale à 5000.");  
      return;
    }
    if (height.value > 5000) {
      alert("Erreur : veuillez saisir une hauteur inférieure ou égale à 5000.");  
      return;
    }
    
    c.width  = width.value;
    c.height = height.value;

    let rouge = 0;
    let bleu = 0;

    for (let y = 0; y < height.value; y++) {
      for (let x = 0; x < width.value; x++) {
        const grey  = Math.floor(Math.random() * 256);
        const alpha = Math.random();
        ctx.fillStyle = `rgba(${grey}, ${grey}, ${grey}, ${alpha})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }


    c.style.display = "block";

    document.getElementById("rougeCount").textContent = rouge;
    document.getElementById("bleuCount").textContent  = bleu;
}

myButton.addEventListener("click", () => {
  MyMap();
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


