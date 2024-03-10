import {
	BoxGeometry,
	DirectionalLight,
	HemisphereLight,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	Scene,
	Vector3,
	WebGLRenderer,
	MeshPhongMaterial,
	PlaneGeometry,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


let renderer: WebGLRenderer;

const scene = new Scene();

const camera = new PerspectiveCamera(50, 3 / 2, 0.1, 1000);
// const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000); // TODO: why window not found initially??

const materialPlane = new MeshPhongMaterial({
	color: 0xff90aa,
	transparent: true
});
const geometryPlane = new PlaneGeometry(10, 10);
const plane = new Mesh(geometryPlane, materialPlane);
plane.position.set(0, 0, -1)

const geometry = new BoxGeometry();

const material = new MeshStandardMaterial({
	color: 0x00ff00,
	metalness: 0.13
});

const material2 = new MeshPhongMaterial({ color: 0xffff00, transparent: true });

const cube = new Mesh(geometry, material);
cube.position.set(-2, 0, 0);

const cube2 = new Mesh(geometry, material2);
cube2.position.set(2, 0, 0);

camera.position.z = 5;
scene.add(cube);
scene.add(cube2);
scene.add(plane);

const directionalLight = new DirectionalLight(0xff90aa);
directionalLight.position.set(-10, 10, -10).normalize();
scene.add(directionalLight);

const hemisphereLight = new HemisphereLight(0xffffff, 0x444444);
hemisphereLight.position.set(1, 1, 1);
scene.add(hemisphereLight);



function resizeCanvasToDisplaySize() {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	if (canvas.width !== width || canvas.height !== height) {
		// you must pass false here or three.js sadly fights the browser
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		// set render target sizes here
	}
}

function animate(time: DOMHighResTimeStamp) {
	time *= 0.001;  // seconds

	resizeCanvasToDisplaySize();

	cube.rotation.x = time * 0.1;
	cube.rotation.y = time * 0.5;
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

// const resize = () => {
// 	renderer.setSize(window.innerWidth, window.innerHeight);
// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();
// };


export const createScene = (el: HTMLCanvasElement) => {
	renderer = new WebGLRenderer({ antialias: true, canvas: el });
	const controls = new OrbitControls(camera, renderer.domElement);
	// camera.position.set( 0, 5, 0 );
	controls.update();

	animate(0);
};

// window.addEventListener('resize', resize);