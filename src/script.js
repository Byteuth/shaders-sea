import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {
	depthColor: "#2274a0",
	surfaceColor: "#82a7c0",
	backgroundColor: "#2274a0",
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(debugObject.backgroundColor);
gui.addColor(scene, "background").onChange(() => {
	scene.background.value.set(debugObject.backgroundColor);
});

const textureLoader = new THREE.TextureLoader();

const woodColorTexture = textureLoader.load(
	"/worn_planks_1k/textures/worn_planks_diff_1k.jpg"
);
const woodNormalTexture = textureLoader.load(
	"/worn_planks_1k/textures/worn_planks_nor_gl_1k.jpg"
);
const woodRoughnessAOMetalnessTexture = textureLoader.load(
	"/worn_planks_1k/textures/worn_planks_arm_1k.jpg"
);
/**
 * Water
 */

// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);
const borderGeometry = new THREE.BoxGeometry(6.25, 0.2, 0.2);
const borderMaterial = new THREE.MeshBasicMaterial({
	map: woodColorTexture,
	normalMap: woodNormalTexture,
	roughnessMap: woodRoughnessAOMetalnessTexture,
	aoMap: woodRoughnessAOMetalnessTexture,
	aoMapIntensity: 1,
	// color: 'red',
});
const border1 = new THREE.Mesh(borderGeometry, borderMaterial);
const border2 = new THREE.Mesh(borderGeometry, borderMaterial);
const border3 = new THREE.Mesh(borderGeometry, borderMaterial);
const border4 = new THREE.Mesh(borderGeometry, borderMaterial);

border1.position.set(0.125, 0, -3.1);
border2.position.set(-0.125, 0, 3.1);
border3.position.set(3.1, 0, 0.125);
border3.rotation.y = Math.PI / 2;
border4.position.set(-3.1, 0, -0.125);
border4.rotation.y = Math.PI / 2;

const borderGroup = new THREE.Group();
borderGroup.add(border1, border2, border3, border4);
scene.add(borderGroup);
borderGroup.position.set(0, -0.1, 0);

// Material
const waterMaterial = new THREE.ShaderMaterial({
	wireframe: false,
	vertexShader: waterVertexShader,
	fragmentShader: waterFragmentShader,
	uniforms: {
		uTime: {
			value: 0,
		},
		uBigWavesElevation: {
			value: 0.121,
		},
		uBigWavesFrequency: {
			value: new THREE.Vector2(5, 2.5),
		},
		uBigWavesSpeed: {
			value: 0.6,
		},
		uSmallWavesElevation: {
			value: 0.04,
		},
		uSmallWavesFrequency: {
			value: 7.5,
		},
		uSmallWavesSpeed: {
			value: 1.0,
		},
		uSmallWavesIterations: {
			value: 9,
		},
		uDepthColor: {
			value: new THREE.Color(debugObject.depthColor),
		},
		uSurfaceColor: {
			value: new THREE.Color(debugObject.surfaceColor),
		},
		uColorOffset: {
			value: 0.15,
		},
		uColorMultiplier: {
			value: 6.5,
		},
	},
});

// Store the initial/default values
const defaultValues = {
	uTime: 0,
	uBigWavesElevation: 0.121,
	uBigWavesFrequency: new THREE.Vector2(5, 2.5),
	uBigWavesSpeed: 0.6,
	uSmallWavesElevation: 0.04,
	uSmallWavesFrequency: 7.5,
	uSmallWavesSpeed: 1.0,
	uSmallWavesIterations: 9,
	uDepthColor: new THREE.Color(debugObject.depthColor),
	uSurfaceColor: new THREE.Color(debugObject.surfaceColor),
	uColorOffset: 0.15,
	uColorMultiplier: 6.5,
};

function resetWaterMaterial() {
	waterMaterial.uniforms.uTime.value = defaultValues.uTime;
	waterMaterial.uniforms.uBigWavesElevation.value =
		defaultValues.uBigWavesElevation;
	waterMaterial.uniforms.uBigWavesFrequency.value.copy(
		defaultValues.uBigWavesFrequency
	);
	waterMaterial.uniforms.uBigWavesSpeed.value = defaultValues.uBigWavesSpeed;
	waterMaterial.uniforms.uSmallWavesElevation.value =
		defaultValues.uSmallWavesElevation;
	waterMaterial.uniforms.uSmallWavesFrequency.value =
		defaultValues.uSmallWavesFrequency;
	waterMaterial.uniforms.uSmallWavesSpeed.value =
		defaultValues.uSmallWavesSpeed;
	waterMaterial.uniforms.uSmallWavesIterations.value =
		defaultValues.uSmallWavesIterations;
	waterMaterial.uniforms.uDepthColor.value.copy(defaultValues.uDepthColor);
	waterMaterial.uniforms.uSurfaceColor.value.copy(defaultValues.uSurfaceColor);
	waterMaterial.uniforms.uColorOffset.value = defaultValues.uColorOffset;
	waterMaterial.uniforms.uColorMultiplier.value =
		defaultValues.uColorMultiplier;
}

gui.add({ reset: resetWaterMaterial }, "reset").name("Reset");
gui.add(waterMaterial, "wireframe").name("wireframe");
gui
	.add(waterMaterial.uniforms.uBigWavesElevation, "value")
	.min(0)
	.max(0.2)
	.step(0.001)
	.name("uBigWavesElevation");

gui
	.add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
	.min(0)
	.max(100)
	.step(0.1)
	.name("uBigWavesFrequencyX");
gui
	.add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
	.min(0)
	.max(100)
	.step(0.1)
	.name("uBigWavesFrequencyZ");
gui
	.add(waterMaterial.uniforms.uBigWavesSpeed, "value")
	.min(0)
	.max(5)
	.step(0.001)
	.name("uBigWavesSpeed");

gui
	.add(waterMaterial.uniforms.uColorOffset, "value")
	.min(0)
	.max(1)
	.step(0.001)
	.name("uColorOffset");
gui
	.add(waterMaterial.uniforms.uColorMultiplier, "value")
	.min(0)
	.max(10)
	.step(0.001)
	.name("uColorMultiplier");
gui
	.add(waterMaterial.uniforms.uSmallWavesElevation, "value")
	.min(0)
	.max(0.5)
	.step(0.001)
	.name("uSmallWavesElevation");
gui
	.add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
	.min(0)
	.max(10)
	.step(0.001)
	.name("uSmallWavesFrequency");
gui
	.add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
	.min(0)
	.max(4)
	.step(0.001)
	.name("uSmallWavesSpeed");
gui
	.add(waterMaterial.uniforms.uSmallWavesIterations, "value")
	.min(0)
	.max(10)
	.step(1)
	.name("uSmallWavesIterations");

gui.addColor(debugObject, "depthColor").onChange(() => {
	waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
});
gui.addColor(debugObject, "surfaceColor").onChange(() => {
	waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});
console.log(waterVertexShader);
// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
water.scale.set(3, 3, 3);
scene.add(water);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	waterMaterial.uniforms.uTime.value = elapsedTime;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
