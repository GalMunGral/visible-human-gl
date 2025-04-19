import * as THREE from "three";
import vertexShader from "./vert.glsl";
import fragmentShader from "./frag.glsl";
import { load3dTexture } from "./util";

const sizeX = 512;
const sizeY = 512;
const sizeZ = 234;

async function main() {
  const scene = new THREE.Scene();

  const geometry = new THREE.BufferGeometry();
  // prettier-ignore
  const vertices = new Float32Array([
	-1.0, -1.0, 0.0, // v0
	 1.0, -1.0, 0.0, // v1
	 1.0,  1.0, 0.0, // v2
	 1.0,  1.0, 0.0, // v3
	-1.0,  1.0, 0.0, // v4
	-1.0, -1.0, 0.0, // v5
]);

  // prettier-ignore
  const texCoords = new Float32Array([
	0.0, 0.0, // v0
	1.0, 0.0, // v1
	1.0, 1.0, // v2
	1.0, 1.0, // v3
	0.0, 1.0, // v4
	0.0, 0.0, // v5
]);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute("texCoord", new THREE.BufferAttribute(texCoords, 2));

  const image3d = new THREE.Data3DTexture(
    await load3dTexture(sizeX * sizeY, sizeZ),
    sizeX,
    sizeY,
    sizeZ,
  );
  image3d.format = THREE.RGBAFormat;
  image3d.type = THREE.UnsignedByteType;
  image3d.minFilter = THREE.LinearMipMapLinearFilter;
  image3d.needsUpdate = true;

  let z = 0;
  let axis = 0;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      z: { value: z },
      axis: { value: axis },
      image3d: { value: image3d },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    glslVersion: THREE.GLSL3,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    100,
  );

  const axisInput = document.querySelector("#axis-select") as HTMLInputElement;
  const zInput = document.querySelector("#z-input") as HTMLInputElement;
  const zCanvas = document.querySelector("#z") as HTMLCanvasElement;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: zCanvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setAnimationLoop(() => {
    const z = Number(zInput.value);
    material.uniforms["z"].value = z;
    const axis = Number(axisInput.value);
    if (axis === 0) {
      renderer.setSize(sizeX, sizeY);
    } else if (axis === 1) {
      renderer.setSize(sizeX, sizeZ);
    } else if (axis === 2) {
      renderer.setSize(sizeY, sizeZ);
    }
    material.uniforms["z"].value = z;
    material.uniforms["axis"].value = axis;
    renderer.render(scene, camera);
  });
}

main();
