import * as THREE from "three";
import { ArcballControls } from "three/examples/jsm/controls/ArcballControls.js";
import vertexShader from "./vert.glsl";
import fragmentShader from "./frag.glsl";
import { load3dTexture } from "./util";

const NX = 512, NY = 512, NZ = 234;

async function main() {
  const progressFill = document.getElementById("progress-fill")!;
  const loading = document.getElementById("loading")!;

  const data = await load3dTexture(NX * NY, NZ, (loaded, total) => {
    progressFill.style.width = `${(loaded / total) * 100}%`;
  });

  loading.remove();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x333333);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(600, 450, 700);
  camera.lookAt(0, 0, 0);

  const controls = new ArcballControls(camera, renderer.domElement, scene);
  controls.setGizmosVisible(true);

  const volTex = new THREE.Data3DTexture(data, NX, NY, NZ);
  volTex.format = THREE.RGBAFormat;
  volTex.type = THREE.UnsignedByteType;
  volTex.minFilter = THREE.LinearFilter;
  volTex.magFilter = THREE.LinearFilter;
  volTex.needsUpdate = true;

  function makeMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: { image3d: { value: volTex }, displacement: { value: new THREE.Vector3() } },
      vertexShader, fragmentShader, glslVersion: THREE.GLSL3, side: THREE.DoubleSide,
    });
  }

  // Axial K: horizontal plane (XZ), samples (s, t, k/(NZ-1)), mesh moves along Y
  const geoK = new THREE.BufferGeometry();
  geoK.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    -NX/2, 0, -NY/2,   NX/2, 0, -NY/2,   NX/2, 0, NY/2,   -NX/2, 0, NY/2,
  ]), 3));
  geoK.setAttribute("uv3", new THREE.BufferAttribute(new Float32Array([
    0, 0, 0,   1, 0, 0,   1, 1, 0,   0, 1, 0,
  ]), 3));
  geoK.setIndex([0, 1, 2,  0, 2, 3]);
  const matK = makeMaterial();
  const meshK = new THREE.Mesh(geoK, matK);
  scene.add(meshK);

  // Coronal J: vertical plane (XY), samples (s, j/(NY-1), r), mesh moves along Z
  const geoJ = new THREE.BufferGeometry();
  geoJ.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    -NX/2, -NZ/2, 0,   NX/2, -NZ/2, 0,   NX/2, NZ/2, 0,   -NX/2, NZ/2, 0,
  ]), 3));
  geoJ.setAttribute("uv3", new THREE.BufferAttribute(new Float32Array([
    0, 0, 0,   1, 0, 0,   1, 0, 1,   0, 0, 1,
  ]), 3));
  geoJ.setIndex([0, 1, 2,  0, 2, 3]);
  const matJ = makeMaterial();
  const meshJ = new THREE.Mesh(geoJ, matJ);
  scene.add(meshJ);

  // Sagittal I: vertical plane (YZ), samples (i/(NX-1), t, r), mesh moves along X
  const geoI = new THREE.BufferGeometry();
  geoI.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    0, -NZ/2, -NY/2,   0, -NZ/2, NY/2,   0, NZ/2, NY/2,   0, NZ/2, -NY/2,
  ]), 3));
  geoI.setAttribute("uv3", new THREE.BufferAttribute(new Float32Array([
    0, 0, 0,   0, 1, 0,   0, 1, 1,   0, 0, 1,
  ]), 3));
  geoI.setIndex([0, 1, 2,  0, 2, 3]);
  const matI = makeMaterial();
  const meshI = new THREE.Mesh(geoI, matI);
  scene.add(meshI);

  renderer.setAnimationLoop(() => renderer.render(scene, camera));

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  function setK(k: number) {
    const t = k / (NZ - 1);
    matK.uniforms.displacement.value.set(0, 0, t);
    meshK.position.y = (t - 0.5) * NZ;
  }
  function setJ(j: number) {
    const t = j / (NY - 1);
    matJ.uniforms.displacement.value.set(0, t, 0);
    meshJ.position.z = (0.5 - t) * NY;
  }
  function setI(i: number) {
    const t = i / (NX - 1);
    matI.uniforms.displacement.value.set(t, 0, 0);
    meshI.position.x = (t - 0.5) * NX;
  }

  const sliderK = document.getElementById("slider-k") as HTMLInputElement;
  const sliderJ = document.getElementById("slider-j") as HTMLInputElement;
  const sliderI = document.getElementById("slider-i") as HTMLInputElement;

  sliderK.addEventListener("input", (e) => setK(Number((e.target as HTMLInputElement).value)));
  sliderJ.addEventListener("input", (e) => setJ(Number((e.target as HTMLInputElement).value)));
  sliderI.addEventListener("input", (e) => setI(Number((e.target as HTMLInputElement).value)));

  setK(Number(sliderK.value));
  setJ(Number(sliderJ.value));
  setI(Number(sliderI.value));
}

main();
