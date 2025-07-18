import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';


window.threeRenderer = null;

function display_map(heights, settings_map, settings, container) {
    const heau = settings.heau;
    const sliderOpWater = settings.sliderOpWater ;
    const opDisplay = settings.opDisplay;
    const lignestoggle = settings.lignestoggle;
    // lignestoggle.checked = true;

    const width = settings_map.width;
    const height = settings_map.height;

    const opacityInitial = parseFloat(sliderOpWater);

    container.innerHTML = '';

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    const scene = new THREE.Scene();
    scene.add( directionalLight );
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const maxDim = Math.max(width, height);
    camera.position.set(maxDim, maxDim * 0.5, maxDim);
    camera.lookAt(width/2, 0, height/2);


    window.threeRenderer = new THREE.WebGLRenderer;
    window.threeRenderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

     window.threeRenderer.setClearColor(0x20232a, 0);
    container.appendChild(window.threeRenderer.domElement);

  const geo = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
  const geoeau = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
  geo.rotateX(-Math.PI / 2);
  geoeau.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const colors = [];
  const color  = new THREE.Color();

  let maxH = -Infinity, minH = Infinity;
for (let h of heights) {
    if (h > maxH) maxH = h;
    if (h < minH) minH = h;
}

  const snowLevel = 0.7;

  const colorLow  = new THREE.Color(0x88cc88);
  const colorMid  = new THREE.Color(0xaaa588);
  const colorHigh = new THREE.Color(0xffffff);

  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heights[i]);
    const t = (heights[i] - minH) / (maxH - minH);
      if (t < snowLevel) {
    const u = t / snowLevel;
    color.lerpColors(colorLow, colorMid, u);
  }
  else {
    const u = (t - snowLevel) / (1 - snowLevel);
    color.lerpColors(colorMid, colorHigh, u);
  }

  colors.push(color.r, color.g, color.b);
}


  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geo, mat);

  const mateau = new THREE.MeshBasicMaterial({
    color: 0x280ED3,
    opacity: sliderOpWater,
    transparent: true,
    side: THREE.DoubleSide
  });

  const ligne = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0x222222 })
  );
  const mesheau = new THREE.Mesh(geoeau, mateau);

  mesheau.position.y = heau;

  ligne.visible = lignestoggle.checked;

  scene.add(mesh, ligne, mesheau);

  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.003; 
    ligne.rotation.y += 0.003;
    mesheau.rotation.y += 0.003;
    window.threeRenderer.render(scene, camera);
  }
  animate();

}


function downloadGLTF() {
  const exporter = new GLTFExporter();
  const options = { binary: true };

  exporter.parse(
    window.scene,
    function (result) {
      let blob;
      let filename;
      if (options.binary) {
        blob = new Blob([result], { type: 'application/octet-stream' });
        filename = 'MyMap3D.glb';
      } else {
        const output = JSON.stringify(result, null, 2);
        blob = new Blob([output], { type: 'application/json' });
        filename = 'MyMap3D.gltf';
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    options
  );
}

function get_map_settings() {
    const height = Number(document.getElementById("height").value);
    const width =        Number(document.getElementById("width").value);
    const nbtop =        Number(document.getElementById("som").value);
    const nbbot =        Number(document.getElementById("fon").value);
    const seed =         Number(document.getElementById("seed").value);
    const hmax =         Number(document.getElementById("hmax").value);
    const pmax =         Number(document.getElementById("pmax").value);
    const puissance =    Number(document.getElementById('p').value);
    const sliderPower  = Number(document.getElementById('p').value);
    const tp = 5;

    return {
        height:       height,
        width:        width,
        nbtop:        nbtop,
        nbbot:        nbbot,
        seed:         seed,
        hmax:         hmax,
        pmax:         pmax,
        puissance:    puissance,
        sliderPower: sliderPower 
    }
}

function get_view_settings() {
    const heau =            Number( document.getElementById("heau").value);
    const sliderOpWater =   Number( document.getElementById("sliderOpWater").value);
    // DEBUG ME
    // const lignestoggle =    document.getElementById('lignestoggle').value == '' 
    const lignestoggle = false;

    return {
        heau          :  heau         ,
        sliderOpWater :  sliderOpWater,
        lignestoggle  :  lignestoggle 
    }
}

function generate_map(settings) {
    const mapInfos = [];
    const used = new Set();

    let rng = RandomWithSeed(settings.seed);

    while (mapInfos.length < settings.nbtop) {
        const x = Math.floor(rng() * settings.width);
        const y = Math.floor(rng() * settings.height);
        const key = `${x},${y}`;

        if (!used.has(key)) {
            used.add(key);
            const hauteur = settings.hmax - rng() * (settings.hmax - (2/3)*settings.hmax);
            mapInfos.push({x, y, h : hauteur});
        }
    }

    while (mapInfos.length < Number(settings.nbtop) + Number(settings.nbbot)) {
        const x = Math.floor(rng() * settings.width);
        const y = Math.floor(rng() * settings.height);
        const key = `${x},${y}`;

        if (!used.has(key)) {
            used.add(key);
            const profondeur = settings.pmax - rng() * (settings.pmax - (2/3)*settings.pmax);
            mapInfos.push({x, y, h : profondeur});
        } 
    }

    const mapStats = [];
    const power = settings.puissance; 
    const nozero   = 1e-3;


    for (let y = 0; y < settings.height; y++) {
        for (let x = 0; x < settings.width; x++) {

            let num = 0, den = 0;
            for (const s of mapInfos) {
                const distance = Math.sqrt((x - s.x)*(x - s.x) + (y - s.y)*(y - s.y));
                const poids = 1/Math.pow(distance + nozero, power);
                num += s.h * poids;
                den += poids;
            }
            const hauteurtot = num/den + Math.pow(-1, Math.floor(rng()*1000)) * (rng() % (0.005 * settings.hmax));
            // don't use get_map_altitude just build the altitude only array here
            mapStats.push({h : hauteurtot});
        }
    }
    // FIXME - don't modify window from wihtin a function
    window.mapWidth = width;
    window.mapHeight = height;

    return get_map_altitude(mapStats, settings.width, settings.height);
}

function display() {
    let settings_map = get_map_settings();
    let settings_view = get_view_settings();
    const container = document.getElementById('threeContainer');
    display_map(window.map, settings_map, settings_view, container);
}
function generate_and_display() {
    let settings_map = get_map_settings();
    let settings_view = get_view_settings();
    let map = generate_map(settings_map);
    window.map = map;
    const container = document.getElementById('threeContainer');
    display_map(window.map, settings_map, settings_view, container);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("Creer").addEventListener("click", generate_and_display);
  document.getElementById("Telecharger").addEventListener("click", downloadGLTF);

});

