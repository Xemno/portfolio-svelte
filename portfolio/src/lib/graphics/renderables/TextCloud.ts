import * as THREE from 'three';
import type IRenderable from './IRenderable';
import { type Color } from '$lib/utils/colors';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { toWorldPosition } from '../utils/VectorUtils';
import type { NavItem } from '$lib/types';
import * as TWEEN from '@tweenjs/tween.js';

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { interpolate, lerp } from '../utils/MathUtils';
import { easing } from '../utils/Easing';
import { TextParticleSystem } from './TextParticleSystem';
import { TweenMorphing } from './TweenMorphing';


interface IVertices {
	[index: string]: {
		x: number;
		y: number;
		z: number;
	};
}

interface Item {
	idx: number;
	geometry: TextGeometry;
	particles: THREE.BufferGeometry;
	points: Array<THREE.Vector3>;
}
type GeometryItems = Array<Item>;

// Options
// TODO: move into data/app.ts file
const particleCount = 5000;
const typefaceRegular = '/src/lib/graphics/fonts/optimer_bold.typeface.json';
const typefaceMobile = '/src/lib/graphics/fonts/optimer_regular.typeface.json';

export default class TextCloud implements IRenderable {
	// private clock = new THREE.Clock();

	private lookAt?: THREE.Vector3;

	private fontLoader = new FontLoader();
	private font!: Font;
	private ready: boolean = false;

	private isMobile: boolean = false;
	private isPortraitMode: boolean = false;

	private particleSystem: TextParticleSystem;
	private tweenMorphing: TweenMorphing;

	// private particleMaterial = new THREE.MeshNormalMaterial({ transparent: true });
	private material = new THREE.MeshStandardMaterial({
		color: 0xffaf00,
		alphaHash: true,
		opacity: 0.7
	});

	private renderer: THREE.WebGLRenderer;
	private camera: THREE.PerspectiveCamera;

	// Define the shader uniforms
	// private uniforms = {
	// 	u_time: {
	// 		type: "f",
	// 		value: 0.0
	// 	},
	// 	u_resolution: {
	// 		type: "v2",
	// 		value: new THREE.Vector2(window.innerWidth, window.innerHeight)
	// 			.multiplyScalar(window.devicePixelRatio)
	// 	},
	// 	u_mouse: {
	// 		type: "v2",
	// 		value: new THREE.Vector2(0.7 * window.innerWidth, window.innerHeight)
	// 			.multiplyScalar(window.devicePixelRatio)
	// 	}
	// };

	constructor(
		renderer: THREE.WebGLRenderer,
		camera: THREE.PerspectiveCamera,
		scene: THREE.Scene,
		navItems: Array<NavItem>,
		// initParams: NavItem,
		isMobile: boolean,
		isPortrait: boolean,
		resolution?: THREE.Vector2,
		pos?: THREE.Vector3,
		lookAt?: THREE.Vector3
	) {
		let initParams: NavItem = navItems.at(0)!;

		this.renderer = renderer; // TODO: move out / remove dependency
		this.camera = camera; // TODO: move out / remove dependency
		this.isMobile = isMobile; // TODO: move out / remove dependency
		// this.isPortraitMode = isPortrait;

		this.particleSystem = new TextParticleSystem();
		this.particleSystem.setNumParticles(particleCount);
		this.tweenMorphing = new TweenMorphing(this.particleSystem);

		// load font and execute onLoad callback
		this.fontLoader.load(this.isMobile ? typefaceMobile : typefaceRegular, (font) => {
			this.particleSystem.createParticles(font, navItems);
			this.particleSystem.createCurrParticles(font, initParams);
			let vWorldPos = this.getMainTitleTextPosition();
			if (vWorldPos != null) {
				this.particleSystem.setCurrParticlesPos(vWorldPos);
			}

			// if (lookAt != null) {
			// 	this.particleSystem.getParticleSystem().lookAt(lookAt);
			// 	this.lookAt = lookAt;
			// }

			scene.add(this.particleSystem.getParticleSystem()); // TODO: move out

			// play initial animation
			this.startEntryAnimation(initParams);
			this.onWindowResize(0, 0, isPortrait);

			this.font = font;
			this.ready = true;
		});
	}

	public getMesh(): THREE.Mesh {
		return this.particleSystem.getParticleSystem();
	}

	public cleanup(): void {

	}

	public update(deltaTime: number, mouseScreenPos: THREE.Vector2 | void): void {
		if (this.lookAt != null) {
			this.particleSystem.getParticleSystem().lookAt(this.lookAt);
		}

		this.tweenMorphing.update();
		// this.tween.update(deltaTime);

		// this.uniforms.u_time.value = this.clock.getElapsedTime();
	}

	public onNavigationChange(item: NavItem) {
		if (!this.ready) return;
		// console.log('Text Cloud: scene onNavChange', item);
		this.tweenMorphing.morphTo(item);
	}

	public onThemeChange(val: boolean) {
		// if (!this.ready) return;
		this.particleSystem.onThemeChange(val);
	}

	public onWindowResize(width: number, height: number, isPortraitMode: boolean) {
		this.onOrientationChange(isPortraitMode);
	}

	public onAfterUiUpdate() {
		// console.log('TextCloud - onAfterUiUpdate: ');
		if (!this.ready) return;
		let vWorldPos = this.getMainTitleTextPosition();
		console.log('onAfterUiUpdate - vWorldPos: ', vWorldPos);

		this.particleSystem.setCurrParticlesPos(vWorldPos);
	}

	// Updates the uniforms when the mouse moves
	public onMouseMove(event: MouseEvent) {
		// Update the mouse uniform
		// this.uniforms.u_mouse.value.set(event.pageX, window.innerHeight - event.pageY).multiplyScalar(window.devicePixelRatio);
	}

	// Updates the uniforms when the touch moves
	public onTouchMove(event: TouchEvent) {
		// Update the mouse uniform
		// this.uniforms.u_mouse.value.set(event.touches[0].pageX, window.innerHeight - event.touches[0].pageY).multiplyScalar(window.devicePixelRatio);
	}

	private onOrientationChange(isPortraitMode: boolean) {
		if (this.isPortraitMode != isPortraitMode) {
			this.isPortraitMode = isPortraitMode;

			if (!this.ready) return;
			let vWorldPos = this.getMainTitleTextPosition();
			this.particleSystem.setCurrParticlesPos(vWorldPos);
		}
	}

	private getMainTitleTextPosition(): THREE.Vector3 | null {
		let mainTitleText: (HTMLElement | null) = document.getElementById("main-title");
		console.log('mainTitleText: ', mainTitleText);

		if (mainTitleText != null) {
			let { top, bottom, left, right } = mainTitleText.getBoundingClientRect();
			const midX = left + (right - left) / 2;
			const midY = top + (bottom - top) / 2;
			const midPoint = new THREE.Vector2(midX, midY);
			return toWorldPosition(midPoint, this.camera, this.renderer);
		}
		return null;
	}

	private startEntryAnimation(navItem: NavItem) {
		// if Home nav
		const sphereGeom = new THREE.SphereGeometry(16, 16, 16);
		const sphere = new THREE.Mesh(sphereGeom);
		const sphereSampler = new MeshSurfaceSampler(sphere).setWeightAttribute('color').build();

		let sphereParticlesPos: Array<THREE.Vector3> = new Array<THREE.Vector3>();
		for (let i = 0; i < particleCount; ++i) {
			const position = new THREE.Vector3();
			sphereSampler.sample(position);
			sphereParticlesPos.push(position);
		}

		// cleanup
		sphereGeom.dispose();
		sphere.clear();

		const toPositionVectors = this.particleSystem.getParticlesAtPos(navItem.idx);

		this.tweenMorphing.morphFromTo(sphereParticlesPos, toPositionVectors!, 2000, 0, TWEEN.Easing.Cubic.Out);
	}
}

