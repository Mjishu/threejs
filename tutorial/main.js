import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
if (!WebGL.isWebGL2Available()) {
    WebGL.getWebGL2ErrorMessage()
    document.getElementById("container").appendChild(warning)
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//*   Box
// const Boxgeometry = new THREE.BoxGeometry(1, 1, 1);
// const Boxmaterial = new THREE.MeshBasicMaterial({ color: 0x60ffcc });
// const cube = new THREE.Mesh(Boxgeometry, Boxmaterial);
// scene.add(cube);
// camera.position.z = 5;

// * Line
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffccf0 });
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(lineGeometry, lineMaterial)
scene.add(line);

renderer.render(scene, camera)

const title = document.querySelector(".title");
title.innerText = "THis is three js"
document.body.appendChild(title)

// function animate() {
//     requestAnimationFrame(animate)
//     renderer.render(scene, camera);
// }
// renderer.setAnimationLoop(animate);
