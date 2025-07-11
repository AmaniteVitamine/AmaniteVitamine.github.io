import * as THREE from 'three';

function init3D() {

    const heights = window.mapStats; 
    const width   = window.mapWidth;
    const height  = window.mapHeight;
    console.log(heights);
    

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(100, 70, 100);
    camera.lookAt(width / 2, 0, height / 2);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x20232a, 1);
    document.body.appendChild(renderer.domElement);

  const geo = new THREE.PlaneGeometry(
    width,
    height,
    width - 1,
    height - 1
  );
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const plusgrand = 40;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heights[i] * plusgrand);
  }
  
  const mat = new THREE.MeshBasicMaterial({
    color: 0x88cc88,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geo, mat);

  const ligne = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0x222222 })
  );

  scene.add(mesh, ligne);


  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.002; 
    ligne.rotation.y += 0.002;
    renderer.render(scene, camera);
  }
  animate();
}



document.addEventListener('click', init3D);



