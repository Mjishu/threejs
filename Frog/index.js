import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";

const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);



//camera
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.x = 5;

const scene = new THREE.Scene();

//postProcess
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 2.0, 0.0, 0.005);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

//styles
const body = 0x1cee88

//materials
//body
const bodyGeo = new THREE.BoxGeometry(2, 1, 1.5);
const bodyMat = new THREE.MeshStandardMaterial({ color: body, flatShading: true, emissive: body });
const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
bodyMesh.rotation.set(0, 0, 0);
scene.add(bodyMesh)

//head
const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const headMat = new THREE.MeshStandardMaterial({ color: body, flatShading: true })
const headMesh = new THREE.Mesh(headGeo, headMat);
headMesh.position.y = 0.7;
headMesh.position.x = 1;
bodyMesh.add(headMesh);

function createEyes(eyePos) {
    const eyeGeo = new THREE.BoxGeometry(0.1, 0.15, 0.15);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xefefef, flatShading: true });
    const eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
    eyeMesh.position.set(eyePos.x, eyePos.y, eyePos.z);

    const pupilGeo = new THREE.BoxGeometry(0.1, 0.075, 0.075);
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x000000, flatShading: true });
    const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
    pupilMesh.position.x = 0.002
    eyeMesh.add(pupilMesh);
    headMesh.add(eyeMesh)
}
createEyes({ x: 0.25, y: 0.15, z: 0.15 });
createEyes({ x: 0.25, y: 0.15, z: -0.15 });

const mouthGeo = new THREE.BoxGeometry(0.05, 0.2, 0.2);
const mouthMat = new THREE.MeshStandardMaterial({ color: 0xff2200 });
const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
mouthMesh.position.set(0.25, -0.10, 0);
headMesh.add(mouthMesh)

function createLegs(legPos, legSize) {
    const legGeo = new THREE.BoxGeometry(legSize.x, legSize.y, legSize.z);
    const legMat = new THREE.MeshStandardMaterial({ color: body, flatShading: true });
    const legMesh = new THREE.Mesh(legGeo, legMat);
    legMesh.position.set(legPos.x, legPos.y, legPos.z);
    bodyMesh.add(legMesh)
}

//front Legs
createLegs({ x: .5, y: -0.5, z: .8 }, { x: 0.5, y: 0.4, z: 0.5 });
createLegs({ x: .5, y: -0.5, z: -.8 }, { x: 0.5, y: 0.4, z: 0.5 });
//back legs
createLegs({ x: -0.75, y: -0.3, z: .6 }, { x: 1, y: 0.75, z: 0.75 });
createLegs({ x: -0.75, y: -0.3, z: -.6 }, { x: 1, y: 0.75, z: 0.75 });

//light
const ambientLight = new THREE.AmbientLight(0xefefef, 0.75);
scene.add(ambientLight);

const bodyLight = new THREE.PointLight(body, 0.5);
bodyMesh.add(bodyLight);

//jumping
let isJumping = false;
let velocity = 0;
let gravity = -0.05;
let jumpStrength = 0.5;

function jumpFunction(e) {
    if (e.code === "Space" && !isJumping) {
        isJumping = true;
        velocity = jumpStrength
    }
}

window.addEventListener("keydown", jumpFunction);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    composer.render(scene, camera);
    if (isJumping) {
        bodyMesh.position.y += velocity;
        velocity += gravity;

        if (bodyMesh.position.y <= 0) {
            bodyMesh.position.y = 0;
            isJumping = false;
            velocity = 0;
        }
    }
}

animate();

function handleWindowResise() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResise, false);

