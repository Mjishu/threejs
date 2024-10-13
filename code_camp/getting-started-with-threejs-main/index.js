import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// Materials

const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({
    color: 0xffccff,
    flatShading: true
})
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh)

// Wires

const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
const wireMesh = new THREE.Mesh(geo, wireMat)
wireMesh.scale.setScalar(1.001)
mesh.add(wireMesh)

// Light

const hemiLight = new THREE.HemisphereLight(0x00ccff, 0xff0088);
scene.add(hemiLight)

function animate(t = 0) {
    requestAnimationFrame(animate)
    mesh.rotation.x = t * 0.0001
    mesh.rotation.y = t * 0.000001
    renderer.render(scene, camera)
    controls.update();
}
animate()