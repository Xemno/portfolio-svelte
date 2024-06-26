import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { NAMED_COLORS } from '$lib/utils/colors';
import { SimplexPlane } from "../renderables/SimplexPlane";
import { TextCloud } from '../renderables/TextCloud';
import type IRenderable from '../renderables/IRenderable';
import type { NavItem } from '$lib/types';
import { items as navItems } from '@data/navbar';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';



let conf = {
	fov: 75,
	cameraZ: 75,
	lightIntensity: 500.0,
	ambientColor: 0x000000,
	Color: 0x0E09DC,
	light1Color: 0xa5f411,
	light2Color: 0xfCE1E1,
	light3Color: 0x18C02C,
	light4Color: 0xee3bcf,
};

type Pair = [number, number];

export default class MainScene {
	private camera: THREE.PerspectiveCamera;
	private scene!: THREE.Scene;
	private renderer: THREE.WebGLRenderer;
	private clock: THREE.Clock;

	private controls: OrbitControls;
	private simplexPlane!: SimplexPlane;
	private textCloud!: TextCloud;

	private mouseScreenPos = new THREE.Vector2();
	private mouseWorldPosition = new THREE.Vector3();
	private mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
	private raycaster = new THREE.Raycaster();

	private animFrameId: number = -1;
	private renderWidth: number = 0;
	private renderHeight: number = 0;
	private windowScreenWidth: number = 0;
	private windowScreenHeight: number = 0;

	private composer!: EffectComposer;
	private afterimagePass!: AfterimagePass;

	private renderables: Array<IRenderable> = new Array<IRenderable>();

	constructor(canvas: HTMLCanvasElement, initialText: NavItem) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(conf.fov, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = conf.cameraZ;
		// this.camera.position.z = 100;
		// this.camera.rotation.x += Math.PI/3;

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvas });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		// this.renderer.toneMapping = THREE.ReinhardToneMapping;
		// this.renderer.setPixelRatio(window.devicePixelRatio);



		this.clock = new THREE.Clock();
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		// TODO: https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom_selective.html
		// TODO: selective bloom only on the particles
		const params = {
			threshold: 0,
			strength: 1,
			radius: 0.5,
			exposure: 1
		};

		// NOTE: Bloom Pass
		let renderScene = new RenderPass(this.scene, this.camera);
		// const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
		// bloomPass.threshold = params.threshold;
		// bloomPass.strength = params.strength;
		// bloomPass.radius = params.radius;

		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(renderScene);
		this.composer.setSize(window.innerWidth, window.innerHeight);
		// this.composer.addPass(bloomPass); // NOTE: uncomment to add

		// NOTE: After Image Pass
		this.afterimagePass = new AfterimagePass(0.8);
		this.composer.addPass(this.afterimagePass);
		const outputPass = new OutputPass();
		this.composer.addPass(outputPass);


		this.initScene(initialText);
	}

	private initScene(initialText: NavItem) {
		this.addResizeSupport();
		this.addMouseInputSupport();

		this.scene.fog = new THREE.FogExp2(0xfff00f, 0.004); // TODO: fog color

		this.simplexPlane = new SimplexPlane(this.renderWidth * 2, this.renderHeight * 2, this.renderWidth / 2, this.renderHeight / 2);
		this.scene.add(this.simplexPlane.getPlane());

		// initialies TextCloud
		let texts: Array<NavItem> = new Array<NavItem>();
		texts.push({ idx: 0, id: 'Qais El Okaili' }); // first item
		Array.from(navItems).forEach(function (item, idx) {
			texts.push({ idx: idx + 1, id: item.title });
		});
		texts.push({ idx: 7, id: 'Search' }); // last item
		this.textCloud = new TextCloud(this.scene, texts, initialText);


		// init renderables to update
		this.renderables.push(this.textCloud);
		this.renderables.push(this.simplexPlane);
	}

	public themeCallback(val: boolean) {
		console.log("themeCallback: " + val);
		if (val) {
			// dark mode
			this.renderer.setClearColor(NAMED_COLORS.black, 1);

			this.scene.fog!.color = new THREE.Color(NAMED_COLORS.diserria);
			this.simplexPlane.setEmissive(NAMED_COLORS.black);

		} else {
			// white mode
			this.renderer.setClearColor(NAMED_COLORS.white, 1);

			this.scene.fog!.color = new THREE.Color(NAMED_COLORS.locust); // 0xffc857 0xa3b18a
			this.simplexPlane.setEmissive(NAMED_COLORS.westar); //  0xf7ede2 0xf2e9e4 0xd6ccc2  0xd5bdaf
		}
	}

	public onNavigationChange(item: NavItem) {
		// console.log('::: ', item);
		this.textCloud.onNavigationChange(item);
	}

	public start(): void {
		this.update(0);
	}

	public stop(): void {
		cancelAnimationFrame(this.animFrameId);
	}

	private update(time: number): void {
		this.animFrameId = requestAnimationFrame(this.update.bind(this));
		const delta = this.clock.getDelta();
		const time2 = this.clock.getElapsedTime() * 10;
		// console.log('time: ', time, '  - ', time2);


		this.renderables.forEach((item) => {
			item.update(delta, this.mouseScreenPos);
		});

		this.controls.update(delta);

		this.render();
		this.composer.render();
	}

	private render(): void {
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
	}

	private addResizeSupport(): void {
		this.onWindowResize(this.camera, this.renderer); // initial call to set renderHeight and renderWidth
		window.addEventListener('resize', () => { this.onWindowResize(this.camera, this.renderer); }, false);
	}

	private onWindowResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
		this.windowScreenWidth = window.innerWidth;
		this.windowScreenHeight = window.innerHeight;

		if (renderer && camera) {
			console.log('width: ' + this.windowScreenWidth + ' height: ' + this.windowScreenHeight);

			renderer.setSize(this.windowScreenWidth, this.windowScreenHeight);
			this.composer.setSize(this.windowScreenWidth, this.windowScreenHeight);
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