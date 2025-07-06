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
  const mapDatas = generateMapData(width.value, height.value, tp.value, rngGlobal);
  drawMap(c, ctx, mapDatas);
});


myButton.addEventListener("click", () => {
  if (!TestValues(width.value,height.value,seed2.value)) {
    return;
  };
  if (seed2.value !== lastSeed) {
    lastSeed   = seed2.value;
    rngGlobal  = RandomWithSeed(seed2.value);
  }
  const mapDatas = generateMapData(width.value, height.value, tp.value, rngGlobal);
  drawMap(c, ctx, mapDatas);
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

function generateMapData(width, height, tpixel, rng) {
  const mapData = [];
  for (let y = 0; y <= height; y++) {
    for (let x = 0; x <= width; x++) {
      const grey = Math.floor(rng() * 256);
      const alpha = rng()*0.5 + 0.5;
      mapData.push({x : x * tpixel, y : y * tpixel, size : tpixel, grey, alpha});
    }
  }
  return mapData;
}

function drawMap(canvas, ctx, mapData) {
  canvas.width = mapData[mapData.length - 1].x;
  canvas.height = mapData[mapData.length - 1].y;
  mapData.forEach(cell => {
    const {x, y, size, grey, alpha} = cell;
    ctx.fillStyle = `rgba(${grey}, ${grey}, ${grey}, ${alpha})`;
    ctx.fillRect(x, y, size, size);
  });
  canvas.style.display = "block";
}


