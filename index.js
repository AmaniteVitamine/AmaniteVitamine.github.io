var c = document.getElementById("myCanvas");
c.setAttribute('style', 'display: none');
var ctx = c.getContext("2d");

const height = document.getElementById("height");
const width = document.getElementById("width");
const tp = document.getElementById("tp");
const seed2 = document.getElementById("seed");

const myButton = document.getElementById("Creer");
const myButtonDownload = document.getElementById("Telecharger");


function RandomWithSeed(seedinput) {
  let state = seedinput % 2147483647;
  if (state <= 0) state += 2147483646;
  
  return function() {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

let rngGlobal = null;
let lastSeed   = null;

document.addEventListener('DOMContentLoaded', () => {
  if (seed2.value !== lastSeed) {
    lastSeed   = seed2.value;
    rngGlobal  = RandomWithSeed(seed2.value);
  }
  const mapDatas = generateMapData(width.value, height.value, rngGlobal);
  drawMap(c, ctx, mapDatas, tp.value, height.value, width.value);
});


myButton.addEventListener("click", () => {
  if (!TestValues(width.value,height.value,seed2.value)) {
    return;
  };
  if (seed2.value !== lastSeed) {
    lastSeed   = seed2.value;
    rngGlobal  = RandomWithSeed(seed2.value);
  }
  const mapDatas = generateMapData(width.value, height.value, rngGlobal);
  drawMap(c, ctx, mapDatas, tp.value, height.value, width.value);
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



function TestValues(width, height, seed) {
  if (width.trim() === "" || height.trim() === "") {
      alert("Erreur : veuillez compléter toutes les cases.");  
      return false;
    }
    if (width <= 0 || height <= 0) {
      alert("Erreur : veuillez saisir des dimensions strictement positives.");  
      return false;
    }
    if (width > 5000) {
      alert("Erreur : veuillez saisir une longueur inférieure ou égale à 5000.");  
      return false;
    }
    if (height > 5000) {
      alert("Erreur : veuillez saisir une hauteur inférieure ou égale à 5000.");  
      return false;
    }
    if (isNaN(seed)) {
      alert("Erreur : veuillez saisir un nombre pour votre seed.")
      return false;
    }
    if (seed % 1 !== 0) {
      alert("Erreur : veuillez saisir un nombre entier pour votre seed.")
      return false;
    }
    return true;
}

function generateMapData(width, height, rng) {
  const mapData = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = Math.floor(rng() * 256);
      const g = Math.floor(rng() * 256);
      const b = Math.floor(rng() * 256);
      mapData.push({x, y, r, g, b});
    }
  }
  return mapData;
}

function drawMap(canvas, ctx, mapData, tpixel, height, width) {
  canvas.width  = width * tpixel;
  canvas.height = height * tpixel;
  for (let i = 0; i < mapData.length; i++) {
    const cell = mapData[i];
    const x = cell.x * tpixel;
    const y = cell.y * tpixel;
    ctx.fillStyle = `rgb(${cell.r}, ${cell.g}, ${cell.b})`;
    ctx.fillRect(x, y, tpixel, tpixel);
  }
  canvas.style.display = 'block';
}




