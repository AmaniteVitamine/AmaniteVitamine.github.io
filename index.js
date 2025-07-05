var c = document.getElementById("myCanvas");
c.setAttribute('style', 'display: none');
var ctx = c.getContext("2d");

const height = document.getElementById("height");
const width = document.getElementById("width");
const tp = document.getElementById("tp");
const myButton = document.getElementById("Creer");
const myButtonDownload = document.getElementById("Telecharger");




document.addEventListener('DOMContentLoaded', () => {
    if (!TestValues(width.value,height.value)) {
    return;
  };
  const mapDatas = generateMapData(width.value, height.value, tp.value);
  drawMap(c, ctx, mapDatas);
});


myButton.addEventListener("click", () => {
  if (!TestValues(width.value,height.value)) {
    return;
  };
  const mapDatas = generateMapData(width.value, height.value, tp.value);
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



function TestValues(width, height) {
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
    return true;
}

function generateMapData(width, height, tpixel) {
  Math.seedrandom('2');
  const mapData = [];
  for (let y = 0; y <= height; y++) {
    for (let x = 0; x <= width; x++) {
      const grey = Math.floor(Math.random() * 256);
      const alpha = Math.random()*0.5 + 0.5;
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



