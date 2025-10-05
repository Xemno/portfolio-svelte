import type IRenderable from '../renderables/IRenderable';
import type { NavItem } from '$lib/types';

import * as THREE from 'three';
import { NAMED_COLORS } from '$lib/utils/colors';
import { SimplexPlane } from '../renderables/SimplexPlane';
import TextCloud from '../renderables/TextCloud';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

let conf = {
	fov: 75,
	cameraZ: 75,
	lightIntensity: 500.0,
	ambientColor: 0x000000,
	Color: 0x0e09dc,
	light1Color: 0xa5f411,
	light2Color: 0xfce1e1,
	light3Color: 0x18c02c,
	light4Color: 0xee3bcf
};

type Pair = [number, number];

export default class MainScene {
	private camera: THREE.PerspectiveCamera;
	private scene!: THREE.Scene;
	private renderer: THREE.WebGLRenderer;
	private clock: THREE.Clock;
	private simplexPlane!: SimplexPlane;
	private textCloud!: TextCloud;
	private normalizedMouseScreenPos = new THREE.Vector2();
	private normalizedTouchScreenPos = new THREE.Vector2();
	private mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
	private animFrameId: number = -1;
	private renderWidth: number = 0;
	private renderHeight: number = 0;
	private windowScreenWidth: number = 0;
	private windowScreenHeight: number = 0;
	private composer!: EffectComposer;
	private directionalLight!: THREE.DirectionalLight;
	private isMobile: boolean;
	private isPortraitMode!: boolean;
	private renderables: Array<IRenderable> = new Array<IRenderable>();

	constructor(canvas: HTMLCanvasElement, navItemArray: Array<NavItem>, isMobile: boolean) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			conf.fov,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.z = conf.cameraZ;
		this.isMobile = isMobile;

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvas });
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.clock = new THREE.Clock();
		const params = {
			threshold: 10,
			strength: 0.05,
			radius: 0.01,
			exposure: 1
		};

		let renderpass = new RenderPass(this.scene, this.camera);
		renderpass.clearAlpha = 0;

		const bloomPass = new UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			1.5,
			0.4,
			0.85
		);
		bloomPass.threshold = params.threshold;
		bloomPass.strength = params.strength;
		bloomPass.radius = params.radius;

		const taaRenderPass = new TAARenderPass(this.scene, this.camera);
		const outputPass = new OutputPass();

		this.composer = new EffectComposer(this.renderer);
		this.composer.setSize(window.innerWidth, window.innerHeight);
		this.composer.addPass(renderpass);
		this.composer.addPass(taaRenderPass);
		this.composer.addPass(bloomPass);
		this.composer.addPass(outputPass);

		this.initScene(navItemArray);
	}

	public onThemeChange(val: boolean) {
		if (val) {
			// dark mode
			this.renderer.toneMapping = THREE.CineonToneMapping;
			this.renderer.toneMappingExposure = 0.75;
			this.renderer.setClearColor(NAMED_COLORS.black, 1);

			this.scene.fog = new THREE.FogExp2(NAMED_COLORS.diserria, 0.004);
			this.directionalLight.intensity = 300;
		} else {
			// white mode
			this.renderer.toneMapping = THREE.LinearToneMapping;
			this.renderer.toneMappingExposure = 0.75;
			this.renderer.setClearColor(NAMED_COLORS.white, 1);

			this.scene.fog = new THREE.FogExp2(NAMED_COLORS.tan, 0.006);
			this.directionalLight.intensity = 10;
		}

		this.renderables.forEach((item) => {
			item.onThemeChange(val);
		});
	}

	public onNavigationChange(item: NavItem) {
		console.log('onNavigationChange: ', item.name);
		
		this.textCloud.onNavigationChange(item);
	}

	public start(): void {
		this.update();
	}

	public stop(): void {
		cancelAnimationFrame(this.animFrameId);
		this.scene.clear();
		this.renderer.renderLists.dispose();
		this.renderer.dispose();
	}

	public onAfterUiUpdate() {
		this.textCloud.onAfterUiUpdate();
	}

	private update(): void {
		this.animFrameId = requestAnimationFrame(this.update.bind(this));
		const delta = this.clock.getDelta();
		const time = this.clock.getElapsedTime();

		this.renderables.forEach((item) => {
			item.update(delta, this.normalizedMouseScreenPos);
		});

		this.render();
		this.composer.render();
	}

	private render(): void {
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
	}

	private addResizeSupport(): void {
		this.onWindowResize(this.camera, this.renderer); // initial call to set renderHeight and renderWidth
		window.addEventListener(
			'resize',
			() => {
				this.onWindowResize(this.camera, this.renderer);
			},
			false
		);
	}

	private initScene(navItemArray: Array<NavItem>) {
		this.addResizeSupport();
		this.addMouseInputSupport();

		this.simplexPlane = new SimplexPlane(
			this.renderWidth * 2,
			this.renderHeight * 2,
			this.renderWidth / 2,
			this.renderHeight / 2
		);
		this.scene.add(this.simplexPlane.getMesh());

		this.textCloud = new TextCloud(
			this.renderer,
			this.camera,
			this.scene,
			navItemArray,
			this.isMobile,
			this.isPortraitMode,
			new THREE.Vector2(this.renderer.domElement.width, this.renderer.domElement.height)
		);

		const lightTargetObj = new THREE.Object3D();
		lightTargetObj.position.y = 150; // set above TextCloud
		this.scene.add(lightTargetObj);
		const lightMesh = new THREE.Mesh(
			new THREE.SphereGeometry(1, 8, 8),
			new THREE.MeshBasicMaterial({ color: 0xffffff })
		);
		this.directionalLight = new THREE.DirectionalLight(THREE.Color.NAMES.wheat, 300);
		this.directionalLight.target = lightTargetObj;

		lightMesh.add(this.directionalLight);
		lightMesh.position.y = 22;
		lightMesh.position.z = 50;
		this.scene.add(lightMesh);

		// init renderables to update
		this.renderables.push(this.textCloud);
		this.renderables.push(this.simplexPlane);
	}

	private onWindowResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
		this.windowScreenWidth = window.innerWidth;
		this.windowScreenHeight = window.innerHeight;

		this.isPortraitMode = screen.availHeight > screen.availWidth ? true : false;
		if (renderer && camera) {
			renderer.setSize(this.windowScreenWidth, this.windowScreenHeight);
			this.composer.setSize(this.windowScreenWidth, this.windowScreenHeight);

			camera.aspect = this.windowScreenWidth / this.windowScreenHeight;
			camera.updateProjectionMatrix();
			const wsize = this.getRendererSize(this.camera);

			this.renderWidth = wsize[0];
			this.renderHeight = wsize[1];
			this.renderables.forEach((item) => {
				item.onWindowResize(this.renderWidth, this.renderHeight, this.isPortraitMode);
			});
		}
	}

	private addMouseInputSupport(): void {
		document.addEventListener('mousemove', (event) => {
			this.normalizedMouseScreenPos.x = (event.clientX / this.windowScreenWidth) * 2 - 1;
			this.normalizedMouseScreenPos.y = -(event.clientY / this.windowScreenHeight) * 2 + 1;

			this.textCloud.onMouseMove(event);
		});

		document.addEventListener('touchmove', (event) => {
			this.normalizedTouchScreenPos.x =
				(event.changedTouches[0].clientX / this.windowScreenWidth) * 2 - 1;
			this.normalizedTouchScreenPos.y =
				-(event.changedTouches[0].clientY / this.windowScreenHeight) * 2 + 1;

			this.textCloud.onTouchMove(event);
		});
	}

	private getRendererSize(camera: THREE.PerspectiveCamera): Pair {
		const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
		const vFOV = (cam.fov * Math.PI) / 180;
		const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
		const width = height * cam.aspect;
		return [width, height];
	}
}
