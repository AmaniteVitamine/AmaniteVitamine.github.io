


var c = document.getElementById("myCanvas");
c.setAttribute('style', 'display: none');
var ctx = c.getContext("2d");

const height = document.getElementById("height");
const width = document.getElementById("width");
const tp = 5;
const seed2 = document.getElementById("seed");
const sommets = document.getElementById("som");
const fonds = document.getElementById("fon");
const sliderPower  = document.getElementById('p');
const powerDisplay = document.getElementById('power');
const hmax = document.getElementById("hmax");
const pmax = document.getElementById("pmax");

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
  rngGlobal  = RandomWithSeed(seed2.value);

  const mapDatas =  generateMap(width.value, height.value, sommets.value, fonds.value, rngGlobal, hmax.value, pmax.value, sliderPower.value);

  get_map_altitude(mapDatas, width.value, height.value)

  sliderPower.addEventListener('input', () => {
    const v = parseFloat(sliderPower.value);
    powerDisplay.textContent = v.toFixed(2);

  const w    = parseInt(width.value, 10);
  const h    = parseInt(height.value,10);
  const seed = parseInt(seed2.value, 10);
  const nbTop  = parseInt(sommets.value,10);
  const nbBot  = parseInt(fonds.value,10);
  const hmax2 = parseFloat(hmax.value);
  const pmax2 = parseFloat(pmax.value);
  const power = parseFloat(sliderPower.value);

  rngGlobal = RandomWithSeed(seed);
  const mapData = generateMap(w, h, nbTop, nbBot, rngGlobal,hmax2, pmax2, power);
  const map = get_map_altitude(mapData, w, h);
  window.mapStats = map;
  init3D();
  });
  sliderPower.dispatchEvent(new Event('input'));

});


myButton.addEventListener("click", () => {
  if (!TestValues(width.value,height.value,seed2.value,sommets.value, fonds.value, p.value, tp.value)) {
    return;
  };
  rngGlobal  = RandomWithSeed(seed2.value);

  const mapDatas =  generateMap(width.value, height.value, sommets.value, fonds.value, rngGlobal, hmax.value, pmax.value, sliderPower.value);
  get_map_altitude(mapDatas, width.value, height.value)
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

function generateMap(width, height, nbtop, nbbot, rng, hmax, pmax, puissance) {
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
      const profondeur = pmax - rng() * (pmax - (2/3)*pmax);
      mapInfos.push({x, y, h : profondeur});
    } 
  }

  const mapStats = [];
  const power = puissance; 
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
      const hauteurtot = num/den + Math.pow(-1, Math.floor(rng()*1000)) * (rng() % (0.005 * hmax));
      mapStats.push({h : hauteurtot});
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
