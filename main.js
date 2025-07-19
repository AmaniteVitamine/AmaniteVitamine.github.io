import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';


window.threeRenderer = null;

function display_map(heights, settings_map, settings, container) {
    const heau = settings.heau;
    const sliderOpWater = settings.sliderOpWater;
    const lignestoggle = settings.lignestoggle;

    const width = settings_map.width;
    const height = settings_map.height;

    container.innerHTML = '';

    window.threeRenderer = new THREE.WebGLRenderer({ antialias: true });
    window.threeRenderer.setSize(container.clientWidth, container.clientHeight);
    window.threeRenderer.setClearColor(0x20232a, 0);
    window.threeRenderer.shadowMap.enabled = true;
    container.appendChild(window.threeRenderer.domElement);

    const scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(-width, height * 3, width);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048);
    directionalLight.shadow.camera.left   = -width;
    directionalLight.shadow.camera.right  =  width;
    directionalLight.shadow.camera.top    =  height * 2;
    directionalLight.shadow.camera.bottom = -height * 2;
    directionalLight.shadow.bias = -0.0001;
    scene.add(directionalLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(width, height * 0.5, width);
    camera.lookAt(width / 2, 0, height / 2);

    const geo = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
    geo.rotateX(-Math.PI / 2);

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
        } else {
            const u = (t - snowLevel) / (1 - snowLevel);
            color.lerpColors(colorMid, colorHigh, u);
        }
        colors.push(color.r, color.g, color.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    directionalLight.target = mesh;
    scene.add(directionalLight.target);

    const geoeau = new THREE.PlaneGeometry(width, height, 1, 1);
geoeau.rotateX(-Math.PI / 2);
const mateau = new THREE.MeshStandardMaterial({
    color:       0x4060d0,
    transparent: true,
    opacity:     sliderOpWater,
    side:        THREE.DoubleSide,
    depthWrite:  false,
});
mateau.polygonOffset        = true;
mateau.polygonOffsetFactor  = -1;
mateau.polygonOffsetUnits   = 1;
const mesheau = new THREE.Mesh(geoeau, mateau);
mesheau.position.set(0, heau, 0);
mesheau.receiveShadow = false;
mesheau.castShadow    = false;
mesheau.renderOrder   = 1;
scene.add(mesheau);

    const ligne = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0x222222 })
    );
    ligne.visible = lignestoggle.checked;
    lignestoggle.addEventListener('change', () => {
        ligne.visible = lignestoggle.checked;
    });
    scene.add(ligne);

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
    result => {
      const blob = options.binary
        ? new Blob([result], { type: 'application/octet-stream' })
        : new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = options.binary ? 'MyMap3D.glb' : 'MyMap3D.gltf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    options
  );
}

function get_map_settings() {
  return {
    height:    Number(document.getElementById("height").value),
    width:     Number(document.getElementById("width").value),
    nbtop:     Number(document.getElementById("som").value),
    nbbot:     Number(document.getElementById("fon").value),
    seed:      Number(document.getElementById("seed").value),
    hmax:      Number(document.getElementById("hmax").value),
    pmax:      Number(document.getElementById("pmax").value),
    puissance: Number(document.getElementById("p").value)
  };
}

function get_view_settings() {
  return {
    heau:          Number(document.getElementById("heau").value),
    sliderOpWater: Number(document.getElementById("sliderOpWater").value),
    lignestoggle:  document.getElementById('lignestoggle')
  };
}

function generate_map(settings) {
  const mapInfos = [], used = new Set();
  let rng = RandomWithSeed(settings.seed);

  while (mapInfos.length < settings.nbtop) {
    const x = Math.floor(rng() * settings.width);
    const y = Math.floor(rng() * settings.height);
    const k = `${x},${y}`;
    if (!used.has(k)) {
      used.add(k);
      mapInfos.push({
        x, y,
        h: settings.hmax - rng() * (settings.hmax * (1/3))
      });
    }
  }
  while (mapInfos.length < settings.nbtop + settings.nbbot) {
    const x = Math.floor(rng() * settings.width);
    const y = Math.floor(rng() * settings.height);
    const k = `${x},${y}`;
    if (!used.has(k)) {
      used.add(k);
      mapInfos.push({
        x, y,
        h: settings.pmax - rng() * (settings.pmax * (1/3))
      });
    }
  }

  const stats = [], nozero = 1e-3, p = settings.puissance;
  for (let y = 0; y < settings.height; y++) {
    for (let x = 0; x < settings.width; x++) {
      let num = 0, den = 0;
      for (const s of mapInfos) {
        const d = Math.hypot(x - s.x, y - s.y);
        const w = 1 / Math.pow(d + nozero, p);
        num += s.h * w;
        den += w;
      }
      stats.push({ h: num / den });
    }
  }

  return stats.map(o => o.h);
}

function generate_and_display() {
  const sm = get_map_settings();
  const sv = get_view_settings();
  const container = document.getElementById('threeContainer');
  const map = generate_map(sm);
  window.map = map;
  display_map(map, sm, sv, container);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("Creer").addEventListener("click", generate_and_display);
  document.getElementById("Telecharger").addEventListener("click", downloadGLTF);
});
