import {
	BoxGeometry,
	DirectionalLight,
	HemisphereLight,
	PointLight,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	Scene,
	Fog,
	WebGLRenderer,
	Color,
	Object3D,
	type Object3DEventMap,
	Vector2,
	Plane,
	Vector3,
	Raycaster,
	PlaneGeometry,
	MeshLambertMaterial,
	MathUtils,
	Camera,
	DoubleSide,
	MeshPhongMaterial,
	AmbientLight,
	Clock,
	LoadingManager,
	PolarGridHelper,
	GridHelper,
	SphereGeometry,
	FogExp2,
	TextureLoader,
	RepeatWrapping,
	SRGBColorSpace,
	MeshBasicMaterial,
	PMREMGenerator,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"
import Stats from 'three/examples/jsm/libs/stats.module';


import { Sky } from 'three/examples/jsm/objects/Sky';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'


let clock: Clock;


let conf = {
	fov: 75,
	cameraZ: 75,
	xyCoef: 50,
	zCoef: 10,
	lightIntensity: 500.0,
	ambientColor: 0x000000,
	Color: 0x0E09DC,
	light1Color: 0xa5f411,
	light2Color: 0xfCE1E1,
	light3Color: 0x18C02C,
	light4Color: 0xee3bcf,
};

let renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, cameraCtrl;
let width: number, height: number, cx, cy, wWidth: number, wHeight: number;
const TMath = Math;

let plane: Mesh;
const simplexNoise = new SimplexNoise();

// const texture = new TextureLoader().load( 'water.jpg' );
// texture.wrapS = texture.wrapT = RepeatWrapping;
// texture.repeat.set( 2, 2 );
// texture.colorSpace = SRGBColorSpace;


let light: AmbientLight;
let light1: PointLight;
let light2: PointLight;
let light3: PointLight;
let light4: PointLight;

const geometry = new SphereGeometry(0.25);
const material = new MeshStandardMaterial({
	color: 0xfa9f00,
	metalness: 0.13
});
const sphere = new Mesh(geometry, material);
const sphere1 = new Mesh(geometry, material);
const sphere2 = new Mesh(geometry, material);
const sphere3 = new Mesh(geometry, material);
const sphere4 = new Mesh(geometry, material);


const mouse = new Vector2();
const mousePlane = new Plane(new Vector3(0, 0, 1), 0);
const mousePosition = new Vector3();
const raycaster = new Raycaster();

let noiseInput: HTMLInputElement | null;
let heightInput: HTMLInputElement | null;
let loadingScreen: HTMLInputElement | null;

let controls: OrbitControls;
let stats: Stats;

export const createScene = (el: HTMLCanvasElement) => {
	init(el);
	render();
}

function init(el: HTMLCanvasElement) {
	// renderer = new WebGLRenderer({ canvas: document.getElementById("canvas1"), antialias: true, alpha: true });
	renderer = new WebGLRenderer({ antialias: true, alpha: true, canvas: el });

	camera = new PerspectiveCamera(conf.fov);
	camera.position.z = conf.cameraZ;
	// camera.rotation.x += Math.PI/3;
	controls = new OrbitControls(camera, renderer.domElement);

	clock = new Clock();



	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);

	noiseInput = (<HTMLInputElement>document.getElementById('noiseInput'));
	heightInput = (<HTMLInputElement>document.getElementById('heightInput'));

	document.addEventListener('mousemove', e => {
		const v = new Vector3();
		camera.getWorldDirection(v);
		v.normalize();
		mousePlane.normal = v;
		mouse.x = (e.clientX / width) * 2 - 1;
		mouse.y = - (e.clientY / height) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		raycaster.ray.intersectPlane(mousePlane, mousePosition);
	});

	stats = new Stats();
	// document.body.appendChild( stats.dom );

	initScene();
	initGui();
	initLights();
	render();
}

function initGui() {
	// noiseInput.value = 101 - conf.xyCoef;
	// heightInput.value = conf.zCoef * 100 / 25;

	// noiseInput?.addEventListener('input', e => {
	// 	conf.xyCoef = 101 - noiseInput.value;
	// });
	// heightInput?.addEventListener('input', e => {
	// 	conf.zCoef = heightInput.value * 25 / 100;
	// });

	// document.getElementById('trigger').addEventListener('click', e => {
	// 	updateLightsColors();
	// });
}

let sky: Sky;
let sun: Vector3;
const parameters = {
	elevation: 0,
	azimuth: 150
};

function initScene() {
	scene = new Scene();

	scene.fog = new FogExp2(0xfff00f, 0.005);

	const pmremGenerator = new PMREMGenerator(renderer);

	sky = new Sky();
	sky.scale.setScalar(10000); // NOTE: box of the sky, could animate for dark/light theme
	scene.add(sky);

	sun = new Vector3();
	const phi = MathUtils.degToRad(90 - parameters.elevation);
	const theta = MathUtils.degToRad(parameters.azimuth);
	sun.setFromSphericalCoords(1, phi, theta);
	sky.material.uniforms['sunPosition'].value.copy(sun);


	const gui = new GUI
	const folderSky = gui.addFolder('Sky');
	folderSky.add(parameters, 'elevation', -10, 90, 0.1).onChange(updateSun);
	folderSky.add(parameters, 'azimuth', - 180, 180, 0.1).onChange(updateSun);
	folderSky.open();


	let mat = new MeshLambertMaterial({ color: 0xf0f0f0, side: DoubleSide });
	// let mat = new MeshBasicMaterial( { color: 0x0044ff, map: texture } );

	// let mat = new MeshPhongMaterial({ color: 0xfff00f });
	// let mat = new MeshStandardMaterial({ color: 0x808080, roughness: 0.5, metalness: 0.1 });
	let geo = new PlaneGeometry(wWidth, wHeight, wWidth / 2, wHeight / 2);
	plane = new Mesh(geo, mat);
	scene.add(plane);

	// NOTE: final preset --- 
	// plane.rotation.x = -Math.PI / 2 - 0.2;
	// plane.position.y = -25;
	// camera.position.z = 60;
	// NOTE: final preset --- ^


	plane.rotation.x = -Math.PI / 2;

	camera.position.z = 80;
	camera.position.y = 25;
	camera.rotation.x -= Math.PI / 10;
	const gridHelper = new GridHelper(300, 300);
	scene.add(gridHelper);
}

function updateSun() {

	const phi = MathUtils.degToRad(90 - parameters.elevation);
	const theta = MathUtils.degToRad(parameters.azimuth);

	sun.setFromSphericalCoords(1, phi, theta);

	sky.material.uniforms['sunPosition'].value.copy(sun);
	// water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

	// if ( renderTarget !== undefined ) renderTarget.dispose();

	// sceneEnv.add( sky );
	// renderTarget = pmremGenerator.fromScene( sceneEnv );
	// scene.add( sky );

	// scene.environment = renderTarget.texture;

}

function render() {
	requestAnimationFrame(render);

	const delta = clock.getDelta();
	const time = clock.getElapsedTime() * 10;

	// texture.offset.x += delta* 0.05;


	renderPlane();
	renderLights();

	controls.update(delta);

	renderer.render(scene, camera);

	stats.update();

}

function initLights() {
	const r = 30;
	const y = 10;
	const lightDistance = 100;

	// scene.add(cube);

	// light = new AmbientLight(conf.ambientColor);
	// scene.add(light);
	let light0 = new PointLight(0xffff, 1000.0, 100);
	light0.position.set(0, 10, 10);
	scene.add(light0);

	sphere.position.set(0, 10, 10);
	scene.add(sphere);


	light1 = new PointLight(conf.light1Color, conf.lightIntensity, lightDistance);
	light1.position.set(0, 3, 50);
	scene.add(light1);
	sphere1.position.set(0, 3, 50);
	scene.add(sphere1);

	light2 = new PointLight(conf.light2Color, conf.lightIntensity, lightDistance);
	light2.position.set(-10, y, -r);
	scene.add(light2);
	sphere2.position.set(-10, y, -r);
	scene.add(sphere2);

	light3 = new PointLight(conf.light3Color, conf.lightIntensity, lightDistance);
	light3.position.set(r, y, 0);
	scene.add(light3);
	sphere3.position.set(r, y, 0);
	scene.add(sphere3);

	light4 = new PointLight(conf.light4Color, conf.lightIntensity, lightDistance);
	light4.position.set(-r, y, 0);
	scene.add(light4);
	sphere4.position.set(-r, y, 0);
	scene.add(sphere4);

}

function renderPlane() {
	let gArray = plane.geometry.attributes.position.array;
	const time = Date.now() * 0.0002;
	for (let i = 0; i < gArray.length; i += 3) {
		gArray[i + 2] = simplexNoise.noise4d(gArray[i] / conf.xyCoef, gArray[i + 1] / conf.xyCoef, time, mouse.x + mouse.y) * conf.zCoef;
	}
	plane.geometry.attributes.position.needsUpdate = true;
	// plane.geometry.computeBoundingSphere();
}

function updateLightsColors() {
	conf.light1Color = Math.random() * 0xffffff;
	conf.light2Color = Math.random() * 0xffffff;
	conf.light3Color = Math.random() * 0xffffff;
	conf.light4Color = Math.random() * 0xffffff;
	light1.color = new Color(conf.light1Color);
	light2.color = new Color(conf.light2Color);
	light3.color = new Color(conf.light3Color);
	light4.color = new Color(conf.light4Color);
	// console.log(conf);
}

function renderLights() {
	const time = Date.now() * 0.001;
	const d = 50;

	// NOTE: circular motion around y axis
	light1.position.x = Math.sin(time * 0.1) * d;
	light1.position.z = Math.cos(time * 0.2) * d;
	sphere1.position.x = Math.sin(time * 0.1) * d;
	sphere1.position.z = Math.cos(time * 0.2) * d;


	light2.position.x = Math.cos(time * 0.3) * d;
	light2.position.z = Math.sin(time * 0.4) * d;
	sphere2.position.x = Math.cos(time * 0.3) * d;
	sphere2.position.z = Math.sin(time * 0.4) * d;

	light3.position.x = Math.sin(time * 0.5) * d;
	light3.position.z = Math.sin(time * 0.6) * d;
	sphere3.position.x = Math.sin(time * 0.5) * d;
	sphere3.position.z = Math.sin(time * 0.6) * d;

	light4.position.x = Math.sin(time * 0.7) * d;
	light4.position.z = Math.cos(time * 0.8) * d;
	sphere4.position.x = Math.sin(time * 0.7) * d;
	sphere4.position.z = Math.cos(time * 0.8) * d;
}

function onWindowResize() {
	width = window.innerWidth; cx = width / 2;
	height = window.innerHeight; cy = height / 2;
	if (renderer && camera) {
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		const wsize = getRendererSize();
		wWidth = wsize[0];
		wHeight = wsize[1];
	}
}

function getRendererSize() {
	const cam = new PerspectiveCamera(camera.fov, camera.aspect);
	const vFOV = cam.fov * Math.PI / 180;
	const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
	const width = height * cam.aspect;
	return [width, height];
}
