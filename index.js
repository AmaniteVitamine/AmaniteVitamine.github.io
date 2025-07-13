


var c = document.getElementById("myCanvas");
c.setAttribute('style', 'display: none');
var ctx = c.getContext("2d");

const height = document.getElementById("height");
const width = document.getElementById("width");
const tp = document.getElementById("tp");
const seed2 = document.getElementById("seed");
const sommets = document.getElementById("som");
const fonds = document.getElementById("fon");
const p = document.getElementById("p");
const hmax = document.getElementById("hmax");

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
  /*if (seed2.value !== lastSeed) {
    lastSeed   = seed2.value;
    rngGlobal  = RandomWithSeed(seed2.value);
  }*/
  
  rngGlobal  = RandomWithSeed(seed2.value);

  const mapDatas =  generateMap(width.value, height.value, sommets.value, fonds.value, rngGlobal, hmax.value);

  get_map_altitude(mapDatas, width.value, height.value)
});


myButton.addEventListener("click", () => {
  if (!TestValues(width.value,height.value,seed2.value,sommets.value, fonds.value, p.value, tp.value)) {
    return;
  };
  /*if (seed2.value !== lastSeed) {
    lastSeed   = seed2.value;
    rngGlobal  = RandomWithSeed(seed2.value);
  }*/
  rngGlobal  = RandomWithSeed(seed2.value);

  const mapDatas =  generateMap(width.value, height.value, sommets.value, fonds.value, rngGlobal, hmax.value);
  get_map_altitude(mapDatas, width.value, height.value)
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


function TestValues(width, height, seed, nbtop, nbbot, power, tpixel) {
    if (width.trim() === "" || height.trim() === "" || power.trim() === "" || nbbot.trim() === "" || nbtop.trim() === "" || seed.trim() === "" || tpixel.trim() === "") {
      alert("Erreur : veuillez compléter toutes les cases.");  
      return false;
    }


    if (width % 1 !== 0) {
      alert("Erreur : veuillez saisir un nombre entier pour votre longueur.");  
      return false;
    }
    if (height % 1 !== 0) {
      alert("Erreur : veuillez saisir un nombre entier pour votre hauteur.");  
      return false;
    }
    if (seed % 1 !== 0) {
      alert("Erreur : veuillez saisir un nombre entier pour votre seed.")
      return false;
    }
    if (nbtop % 1 !== 0) {
      alert("Erreur : veuillez saisir un nombre entier pour votre nombre de sommets.");  
      return false;
    }
    if (nbbot % 1 !== 0) {
      alert("Erreur : veuillez saisir un nombre entier pour votre nombre de fonds.");  
      return false;
    }
    if (tpixel % 1 !== 0) {
      alert("Erreur : veuillez saisir un nombre entier pour votre taille de pixel.")
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
    if (power > 10 || power < 0.1) {
      alert("Erreur : veuillez saisir une puissance de pente comprise entre 0.1 et 10.");  
      return false;
    }
    if (nbtop > 500) {
      alert("Erreur : veuillez saisir un nombre de sommets inférieur à 500.");  
      return false;
    }
    if (nbbot > 500) {
      alert("Erreur : veuillez saisir un nombre de fonds inférieur à 500.");  
      return false;
    }
    if (nbtop <= 0) {
      alert("Erreur : veuillez saisir un nombre de sommets strictement positif.");  
      return false;
    }
    if (nbbot <= 0) {
      alert("Erreur : veuillez saisir un nombre de fonds strictement positif.");  
      return false;
    }

    if (Number(width) * Number(height) < Number(nbtop) + Number(nbbot)) {
      alert("Erreur : le nombre de sommets et de fonds doit être inférieur ou égal au nombre total de pixels.");
      return false;
    }
    
    return true;
}

function generateMap(width, height, nbtop, nbbot, rng, hmax) {
  const mapInfos = [];
  const used = new Set();

  while (mapInfos.length < nbtop) {
    const x = Math.floor(rng() * width);
    const y = Math.floor(rng() * height);
    const key = `${x},${y}`;

    if (!used.has(key)) {
      used.add(key);
      const hauteur = hmax - rng() * (hmax - (2/3)*hmax);
      mapInfos.push({x, y, h : hauteur});
    }
  }

  while (mapInfos.length < Number(nbtop) + Number(nbbot)) {
    const x = Math.floor(rng() * width);
    const y = Math.floor(rng() * height);
    const key = `${x},${y}`;

    if (!used.has(key)) {
      used.add(key);
      mapInfos.push({x, y, h : 0});
    } 
  }

  const mapStats = [];
  const power = p.value; 
  const nozero   = 1e-3;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

      let num = 0, den = 0;
      for (const s of mapInfos) {
        const distance = Math.sqrt((x - s.x)*(x - s.x) + (y - s.y)*(y - s.y));
        const poids = 1/Math.pow(distance + nozero, power);
        num += s.h * poids;
        den += poids;
      }
      const hauteur = num/den;
      mapStats.push({h : hauteur});
    }
  }
  window.mapWidth = width;
  window.mapHeight = height;
  return mapStats;
  
}


function get_map_altitude(mapData, width, lenght) {
  tabAltitudes = [];
  for (let i = 0; i < width * lenght; i++) {
    tabAltitudes.push(mapData[i].h)
  }
  window.mapStats = tabAltitudes;
  return tabAltitudes;
} 
