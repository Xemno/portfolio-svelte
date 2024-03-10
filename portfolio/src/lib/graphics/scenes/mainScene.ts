import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"


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

type Pair = [number, number];

class SimplexPlane {
	private plane: THREE.Mesh;
	private simplexNoise: SimplexNoise;
	private geometry: THREE.PlaneGeometry;
	private material: THREE.MeshLambertMaterial;

	constructor(width?: number, height?: number, widthSegments?: number, heightSegments?: number) {
		this.geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
		this.simplexNoise = new SimplexNoise();
		this.material = new THREE.MeshLambertMaterial({ color: 0xf0f0f0, side: THREE.DoubleSide });
		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.plane.rotation.x = -Math.PI / 2 - 0.2;
		this.plane.position.y = -25;
	}

	public update(delta: number, mouseScreenPos: THREE.Vector2) {
		let pArray = this.plane.geometry.attributes.position.array;
		const time = Date.now() * 0.0002;
		for (let i = 0; i < pArray.length; i += 3) {
			pArray[i + 2] = this.simplexNoise.noise4d(pArray[i] / conf.xyCoef, pArray[i + 1] / conf.xyCoef, time, mouseScreenPos.x + mouseScreenPos.y) * conf.zCoef;
		}
		this.plane.geometry.attributes.position.needsUpdate = true;
		// plane.geometry.computeBoundingSphere();
	}

	public getPlane(): THREE.Mesh {
		return this.plane;
	}
}

export default class MainScene {
	private camera: THREE.PerspectiveCamera;
	private scene: THREE.Scene;
	private renderer: THREE.WebGLRenderer;
	private clock: THREE.Clock;

	private controls: OrbitControls;
	private simplexPlane!: SimplexPlane;

	private mouseScreenPos = new THREE.Vector2();
	private mouseWorldPosition = new THREE.Vector3();
	private mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
	private raycaster = new THREE.Raycaster();

	private animFrameId: number = -1;
	private renderWidth: number = 0;
	private renderHeight: number = 0;
	private windowScreenWidth: number = 0;
	private windowScreenHeight: number = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(conf.fov, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = conf.cameraZ;
		this.camera.position.z = 60;
		// this.camera.rotation.x += Math.PI/3;

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvas });
		this.clock = new THREE.Clock();
		// this.controls = new OrbitControls(this.camera, canvas)
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);;
		
		this.initScene();
	}

	private initScene(): void {
		this.addResizeSupport();
		this.addMouseInputSupport();

		this.simplexPlane = new SimplexPlane(this.renderWidth, this.renderHeight, this.renderWidth / 2, this.renderHeight / 2);

		this.scene.fog = new THREE.FogExp2(0xfff00f, 0.005);

		this.scene.add(this.simplexPlane.getPlane());
	}

	public start(): void {
		this.update();
	}

	public stop(): void {
		cancelAnimationFrame(this.animFrameId);
	}

	private update(): void {
		this.animFrameId = requestAnimationFrame(this.update.bind(this));
		const delta = this.clock.getDelta();
		const time = this.clock.getElapsedTime() * 10;

		// console.log(delta);

		this.simplexPlane.update(delta, this.mouseScreenPos);

		this.controls.update(delta);

		this.render();
	}

	private render(): void {
		this.renderer.clear()
		this.renderer.render(this.scene, this.camera);
	}

	private addResizeSupport(): void {
		this.onWindowResize(this.camera, this.renderer); // initial call to set renderHeight and renderWidth
		window.addEventListener('resize', () => { this.onWindowResize(this.camera, this.renderer) }, false);
	}

	private onWindowResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
		this.windowScreenWidth = window.innerWidth;
		this.windowScreenHeight = window.innerHeight;

		if (renderer && camera) {
			console.log('width: ' + this.windowScreenWidth + ' height: ' + this.windowScreenHeight)

			renderer.setSize(this.windowScreenWidth, this.windowScreenHeight);
			camera.aspect = this.windowScreenWidth / this.windowScreenHeight;
			camera.updateProjectionMatrix();
			const wsize = this.getRendererSize(this.camera);
			this.renderWidth = wsize[0];
			this.renderHeight = wsize[1];
		}
		// this.camera.aspect = window.innerWidth / window.innerHeight;
		// this.camera.updateProjectionMatrix();  
		// this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

	private addMouseInputSupport(): void {
		document.addEventListener('mousemove', e => {
			const v = new THREE.Vector3(); // TODO:
			this.camera.getWorldDirection(v); // TODO:
			v.normalize(); // TODO:
			this.mousePlane.normal = v;
			this.mouseScreenPos.x = (e.clientX / this.windowScreenWidth) * 2 - 1;
			this.mouseScreenPos.y = - (e.clientY / this.windowScreenHeight) * 2 + 1;
			this.raycaster.setFromCamera(this.mouseScreenPos, this.camera);
			this.raycaster.ray.intersectPlane(this.mousePlane, this.mouseWorldPosition); // TODO:mouseWorldPosition
			// console.log( this.raycaster.ray ); 
			// console.log( this.mouseWorldPosition );			
		});
	}

	private getRendererSize(camera: THREE.PerspectiveCamera): Pair {
		const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
		const vFOV = cam.fov * Math.PI / 180;
		const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
		const width = height * cam.aspect;
		return [width, height];
	}
}