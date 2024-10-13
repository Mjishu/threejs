import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// THREE.ColorManagement.enabled = true;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180
scene.add(earthGroup)

new OrbitControls(camera, renderer.domElement)

const loader = new THREE.TextureLoader();
const detail = 12;
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
})
// material.map.colorSpace = THREE.SRGBColorSpace;
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
})
const lightsMesh = new THREE.Mesh(geometry, lightsMaterial);
earthGroup.add(lightsMesh);

const fresnelMat = getFresnelMat();
const fresnelMesh = new THREE.Mesh(geometry, fresnelMat)
fresnelMesh.scale.setScalar(1.005)
earthGroup.add(fresnelMesh)

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthhiresclouds1k.jpg"),
  blending: THREE.AdditiveBlending,
})
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat)
cloudsMesh.scale.setScalar(1.003)
earthGroup.add(cloudsMesh)

const stars = getStarfield({ numStars: 4000 });
scene.add(stars);


// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
// scene.add(hemiLight)
const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, -.05, 1.5)
scene.add(sunLight)

function animate() {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.01;
  fresnelMesh.rotation.y += 0.002;
  renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);