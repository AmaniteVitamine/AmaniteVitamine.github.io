var c = document.getElementById("myCanvas");
c.setAttribute('style', 'display: none');
var ctx = c.getContext("2d");

const height = document.getElementById("height");
const width = document.getElementById("width");
const tp = document.getElementById("tp");
const seed2 = document.getElementById("seed");
const sommets = document.getElementById("som");
const fonds = document.getElementById("fon");

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
  const mapDatas =  generateTopAndBotData(width.value, height.value, sommets.value, fonds.value, rngGlobal);

  drawMap(c, ctx, mapDatas, tp.value, height.value, width.value);
});


myButton.addEventListener("click", () => {
  if (!TestValues(width.value,height.value,seed2.value,sommets.value, fonds.value)) {
    return;
  };
  if (seed2.value !== lastSeed) {
    lastSeed   = seed2.value;
    rngGlobal  = RandomWithSeed(seed2.value);
  }
  const mapDatas =  generateTopAndBotData(width.value, height.value, sommets.value, fonds.value, rngGlobal);
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


function TestValues(width, height, seed, nbtop, nbbot) {
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
    if (Number(width) * Number(height) < Number(nbtop) + Number(nbbot)) {
      alert("Erreur : le nombre de sommets et de fonds doit être inférieur ou égal au nombre total de pixels.");
      return false;
    }
    return true;
}


function generateMapData(width, height, rng) {
  const mapData = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      /*const r = Math.floor(rng() * 256);
      const g = Math.floor(rng() * 256);
      const b = Math.floor(rng() * 256);
      mapData.push({x, y, r, g, b});*/
      const val = 255;
      mapData.push({x, y, r : val, g : val, b : val});
    }
  }
  return mapData;
}

function generateTopAndBotData(width, height, nbtop, nbbot, rng) {
  const mapInfos = [];
  const used = new Set();

  while (mapInfos.length < nbtop) {
    const x = Math.floor(rng() * width);
    const y = Math.floor(rng() * height);
    const key = `${x},${y}`;

    if (!used.has(key)) {
      used.add(key);
      mapInfos.push({x, y, r : 0, g : 0, b : 0});
    }
  }

  while (mapInfos.length < Number(nbtop) + Number(nbbot)) {
    const x = Math.floor(rng() * width);
    const y = Math.floor(rng() * height);
    const key = `${x},${y}`;

    if (!used.has(key)) {
      used.add(key);
      mapInfos.push({x, y, r : 255, g : 255, b : 255});
    } 
  }

  const mapStats = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = `${x}, ${y}`;

      let extremum1 = {d : Infinity, h : null};
      let extremum2 = {d : Infinity, h : null};

      for (let i = 0; i < Number(nbtop) + Number(nbbot); i++) {
        let distance = Math.sqrt((x - mapInfos[i].x)*(x - mapInfos[i].x) + (y - mapInfos[i].y)*(y - mapInfos[i].y));
        if (distance < extremum1.d) {
          extremum1.d = distance;
          if (mapInfos[i].r == 255) {
            extremum1.h = 0;
          }
          else {
            extremum1.h = 1;
          }
        }
        else if (distance < extremum2.d) {
          extremum2.d = distance;
          if (mapInfos[i].r == 255) {
            extremum2.h = 0;
          }
          else {
            extremum2.h = 1;
          }
        }
      }

      let hauteur = (extremum2.d * extremum1.h / (extremum1.d + extremum2.d) + extremum1.d * extremum2.h / (extremum1.d + extremum2.d)) * 255;

      if (!used.has(key)) {
        used.add(key);
        mapStats.push({x, y, r : hauteur, g : hauteur, b : hauteur});
      }
    }
  }

  mapInfos.push(...mapStats);

  return mapInfos;
}

/*function generateBotData(width, height, nbbot, rng) {
  const mapFonds = [];
  const used = new Set();

  while (mapFonds.length < nbbot) {
    const x = Math.floor(rng() * width);
    const y = Math.floor(rng() * height);
    const key = `${x},${y}`;

    if (!used.has(key)) {
      used.add(key);
      mapFonds.push({ x, y, r: 255, g: 255, b: 255 });
    }
  }
  return mapFonds;
}*/


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

