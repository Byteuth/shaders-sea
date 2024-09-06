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
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

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
	uColorMultiplier: 6.5
};

// Create a reset function
function resetWaterMaterial() {
	waterMaterial.uniforms.uTime.value = defaultValues.uTime;
	waterMaterial.uniforms.uBigWavesElevation.value = defaultValues.uBigWavesElevation;
	waterMaterial.uniforms.uBigWavesFrequency.value.copy(defaultValues.uBigWavesFrequency);
	waterMaterial.uniforms.uBigWavesSpeed.value = defaultValues.uBigWavesSpeed;
	waterMaterial.uniforms.uSmallWavesElevation.value = defaultValues.uSmallWavesElevation;
	waterMaterial.uniforms.uSmallWavesFrequency.value = defaultValues.uSmallWavesFrequency;
	waterMaterial.uniforms.uSmallWavesSpeed.value = defaultValues.uSmallWavesSpeed;
	waterMaterial.uniforms.uSmallWavesIterations.value = defaultValues.uSmallWavesIterations;
	waterMaterial.uniforms.uDepthColor.value.copy(defaultValues.uDepthColor);
	waterMaterial.uniforms.uSurfaceColor.value.copy(defaultValues.uSurfaceColor);
	waterMaterial.uniforms.uColorOffset.value = defaultValues.uColorOffset;
	waterMaterial.uniforms.uColorMultiplier.value = defaultValues.uColorMultiplier;
}

// Add reset button to GUI
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
	.step(0.001)
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
