import * as THREE from 'three';

function init3D() {


    const container = document.getElementById('threeContainer');

    container.innerHTML = '';

    const heights = window.mapStats; 
    const width   = window.mapWidth;
    const height  = window.mapHeight;
    console.log(heights);
    

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(100, 70, 100);
    camera.lookAt(width/2, 0, height/2);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( width*12, height*12 );
    renderer.setClearColor(0x20232a, 0);
    container.appendChild(renderer.domElement);

  const geo = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
  const geoeau = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
  geo.rotateX(-Math.PI / 2);
  geoeau.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const colors = [];
  const color  = new THREE.Color();
  const maxH   = Math.max(...heights);
  const minH   = Math.min(...heights);

  const plusgrand = 40;

  const snowLevel = 0.7;
  const colorLow  = new THREE.Color(0x88cc88);
  const colorMid  = new THREE.Color(0xaaa588);
  const colorHigh = new THREE.Color(0xffffff);

  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heights[i] * plusgrand);
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
    opacity: 0.6,
    transparent: true,
    side: THREE.DoubleSide
  });

  const ligne = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0x222222 })
  );
  const mesheau = new THREE.Mesh(geoeau, mateau);

  scene.add(mesh, ligne);

  mesheau.position.y = 15;
  scene.add(mesheau);


  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.003; 
    ligne.rotation.y += 0.003;
    mesheau.rotation.y += 0.003;
    renderer.render(scene, camera);
  }
  animate();

}


document.addEventListener('click', init3D);

window.addEventListener('load', init3D);



