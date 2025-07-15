import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';


window.threeRenderer = null;

function init3D() {
    const heau = document.getElementById("heau");
    const container = document.getElementById('threeContainer');
    const slider    = document.getElementById("slider");
    const opDisplay = document.getElementById("op");

    const opacityInitial = parseFloat(slider.value);

    container.innerHTML = '';

    const heights = window.mapStats; 
    const width   = window.mapWidth;
    const height  = window.mapHeight;
    

    const scene = new THREE.Scene();
    window.scene = scene;
    
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
  const maxH   = Math.max(...heights);
  const minH   = Math.min(...heights);

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
    opacity: slider.value,
    transparent: true,
    side: THREE.DoubleSide
  });

  const ligne = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0x222222 })
  );
  const mesheau = new THREE.Mesh(geoeau, mateau);

  mesheau.position.y = heau.value;
  scene.add(mesh, ligne, mesheau);


  opDisplay.textContent = opacityInitial.toFixed(2);

  slider.addEventListener('input', () => {
    const v = parseFloat(slider.value);
    opDisplay.textContent = v.toFixed(2);
    mesheau.material.opacity = v;
  });


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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("Creer").addEventListener("click", init3D);
  document.getElementById("Telecharger").addEventListener("click", downloadGLTF);
  init3D();
});

