// earth-simulation/main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#webglCanvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Load Textures
const loader = new THREE.TextureLoader();
const earthDayMap = loader.load('assets/textures/earth_day.jpg');
const earthNightMap = loader.load('assets/textures/earth_night.jpg');
const bumpMap = null;
const cloudMap = loader.load('assets/textures/earth_clouds.png');

// Earth Geometry
const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthDayMap,
  bumpMap: bumpMap,
  bumpScale: 0.05,
  specular: new THREE.Color('grey'),
  shininess: 5,
});

// Night texture as emissive map (fake city lights)
earthMaterial.emissiveMap = earthNightMap;
earthMaterial.emissive = new THREE.Color(0xffffff);
earthMaterial.emissiveIntensity = 0.5;

const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// Cloud Layer
const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
const cloudMaterial = new THREE.MeshLambertMaterial({
  map: cloudMap,
  transparent: true,
  opacity: 0.4,
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloudMesh);

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Animate
function animate() {
  requestAnimationFrame(animate);

  // Earth's rotation
  earthMesh.rotation.y += 0.001;
  cloudMesh.rotation.y += 0.0012;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
