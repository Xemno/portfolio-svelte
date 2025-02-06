import * as THREE from 'three';
import type IRenderable from './IRenderable';
import { NAMED_COLORS, type Color } from '$lib/utils/colors';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { toWorldPosition } from '../utils/VectorUtils';
import type { NavItem } from '$lib/types';
import * as TWEEN from '@tweenjs/tween.js';

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import type { EasingFunction } from 'svelte/transition';
import { detectMobile } from '$lib/stores/navigation';


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

	private particleSystem: ParticleSystem;
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
		initParams: NavItem,
		isMobile: boolean,
		isPortrait: boolean,
		resolution?: THREE.Vector2,
		pos?: THREE.Vector3,
		lookAt?: THREE.Vector3
	) {
		this.renderer = renderer; // TODO: move out / remove dependency
		this.camera = camera; // TODO: move out / remove dependency
		this.isMobile = isMobile; // TODO: move out / remove dependency
		// this.isPortraitMode = isPortrait;

		this.particleSystem = new ParticleSystem();
		this.tweenMorphing = new TweenMorphing(this.particleSystem);

		// load font and execute onLoad callback
		this.fontLoader.load(this.isMobile ? typefaceMobile : typefaceRegular, (font) => {
			navItems.forEach((navItem) => {
				if (navItem == null) {
					return;
				}
				this.particleSystem.createParticles(font, navItem.id, navItem.idx);
			});

			this.particleSystem.createCurrParticles(font, initParams);
			let vWorldPos = this.getMainTitleTextPosition();
			if (vWorldPos != null) {
				this.particleSystem.setCurrParticlesPos(vWorldPos);
			}

			if (lookAt != null) {
				this.particleSystem.getParticleSystem().lookAt(lookAt);
				this.lookAt = lookAt;
			}

			scene.add(this.particleSystem.getParticleSystem());

			// play initial animation
			this.startEntryAnimation(initParams);
			this.onWindowResize(0, 0, isPortrait);

			this.font = font;
			this.ready = true;
		});
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

		// this.setMainTitleTextPosition(); // NOTE: updated onAfterUiUpdate

		this.tweenMorphing.transitionTo(item);
	}

	public onThemeChange(val: boolean) {
		this.particleSystem.onThemeChange(val);
	}

	public onWindowResize(width: number, height: number, isPortraitMode: boolean) {
		this.onOrientationChange(isPortraitMode);
		// Update the resolution uniform
		// this.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
	}

	public onAfterUiUpdate() {
		// this.setMainTitleTextPosition();
		let vWorldPos = this.getMainTitleTextPosition();
		if (vWorldPos != null) {
			this.particleSystem.setCurrParticlesPos(vWorldPos);
		}
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
		}
	}

	private getMainTitleTextPosition(): THREE.Vector3 | null {
		let mainTitleText: (HTMLElement | null) = document.getElementById("main-title");
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

		this.tweenMorphing.morphParticlesFromTo(sphereParticlesPos, toPositionVectors!, 2000, 0, TWEEN.Easing.Cubic.Out);
	}
}


class ParticleSystem {

	private particleSystem!: THREE.InstancedMesh;
	// Instanced geometry
	private particleGeometry: THREE.BufferGeometry = new THREE.CircleGeometry(0.15, 64, 64);

	// Each entry is a text cloud of positions - used to set currParticles' position attribute
	private readonly particlesPositions = new Array<Array<THREE.Vector3>>(); // static
	private currParticlesPos: Array<THREE.Vector3> | null = null; // dynamic

	// private animator : TweenMorphing;

	private material = new THREE.MeshStandardMaterial({
		color: 0xffaf00,
		alphaHash: true,
		opacity: 0.7
	});

	constructor() {
		// this.animator = new TweenMorphing(); // TODO: dependency, add here or in TRextCloud ? better to pass as parameter to constructor here
	}

	public createParticles(font: Font, text: string, idx: number) {
		this.particlesPositions.push(this.createParticleText(font, text, idx));
	}

	public createCurrParticles(font: Font, initParams: NavItem) {
		this.currParticlesPos = this.createParticleText(font, initParams.id, initParams.idx); // NOTE: current particle position
		if (this.currParticlesPos == null) {
			// console.log('Error - currParticles is NULL');
		}

		// initialize particle system
		this.particleSystem = new THREE.InstancedMesh(this.particleGeometry, this.material, particleCount);
		this.particleSystem.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
		this.updateInstanceMatrix();
	}

	public setCurrParticlesPos(pos: THREE.Vector3) {
		console.log('TextCloud - setMainTitleTextPosition called');

		let vWorldPos = pos;
		if (vWorldPos == null) return;
		if (this.particleSystem == null) return;
		if (vWorldPos != this.particleSystem.position) {
			this.particleSystem.position.set(vWorldPos.x, vWorldPos.y, vWorldPos.z);
		}
	}

	// public update(deltaTime: number, mouseScreenPos: THREE.Vector2 | void) {

	// }

	public onThemeChange(val: boolean): void {
		if (val) {
			// dark mode
			this.material.color = new THREE.Color(NAMED_COLORS.yellowsea);
			this.material.opacity = 0.7;
			this.material.alphaHash = true;
		} else {
			// white mode
			this.material.color = new THREE.Color(NAMED_COLORS.dimgray);
			this.material.opacity = 0.8;
			this.material.alphaHash = true;
		}
	}

	// public onWindowResize(width: number, height: number, isPortraitMode: boolean): void {
	// 	throw new Error('Method not implemented.');
	// }

	public getParticlesAtPos(idx: number) {
		return this.particlesPositions.at(idx);
	}

	public getNumParticles() {
		return this.particlesPositions.length;
	}

	public getCurrParticles(): Array<THREE.Vector3> {
		if (this.currParticlesPos == null) return new Array<THREE.Vector3>();
		return this.currParticlesPos;
	}

	public getCurrParticlesAtPos(idx: number): THREE.Vector3 {
		if (this.currParticlesPos == null) return new THREE.Vector3();
		return this.currParticlesPos[idx];
	}

	public setCurrParticles(particlesPos: Array<THREE.Vector3>) {
		this.currParticlesPos = particlesPos;
	}

	public setMatrixAt(i: number, matrix: THREE.Matrix4) {
		this.particleSystem.setMatrixAt(i, matrix);
		this.particleSystem.instanceMatrix.needsUpdate = true;
	}

	public getParticleSystem() {
		return this.particleSystem;
	}

	private createParticleText(font: Font, text: string, idx: number): Array<THREE.Vector3> {

		let isPortraitMode = screen.availHeight > screen.availWidth ? true : false;
		let isMobile = detectMobile();
		let size = isMobile ? window.innerWidth * 0.0075 : window.innerWidth * 0.005;

		const maxSize = isMobile ? (isPortraitMode ? 4 : 6) : 8;
		size = Math.min(size, maxSize);

		const geometry = new TextGeometry(text, {
			font: font,
			size: size, // TODO: window.innerWidth different for mobile and window
			height: 1,
			curveSegments: 10
		});
		geometry.center();

		const textMesh = new THREE.Mesh(geometry);
		const sampler = new MeshSurfaceSampler(textMesh).setWeightAttribute('color').build();

		const particles: Array<THREE.Vector3> = new Array<THREE.Vector3>();
		for (let i = 0; i < particleCount; ++i) {
			const position = new THREE.Vector3();
			sampler.sample(position);
			particles.push(position);
		}

		// cleanup
		geometry.dispose();
		textMesh.clear();

		return particles;
	}

	private updateInstanceMatrix() {
		let dummy = new THREE.Object3D();

		this.currParticlesPos!.forEach((pos, idx) => {
			dummy.position.set(pos.x, pos.y, pos.z);
			dummy.updateMatrix();

			this.particleSystem.setMatrixAt(idx, dummy.matrix);
		});

		this.particleSystem.instanceMatrix.needsUpdate = true;
	}
}

class TweenMorphing {
	private readonly particleSystem: ParticleSystem;

	constructor(particleSystem: ParticleSystem) {
		this.particleSystem = particleSystem;
	}

	public transitionTo(item: NavItem) {
		this.morphTo(item);
	}

	public update() {
		const result = TWEEN.update();
	}

	private getParticlePositions(item: NavItem): Array<THREE.Vector3> | null {
		let pos: Array<THREE.Vector3> | undefined = this.particleSystem.getParticlesAtPos(item.idx);
		if (pos == null) {
			return null;
		}
		return pos;
	}

	private morphTo(navItem: NavItem) {
		const toPositionVectors: Array<THREE.Vector3> | null = this.getParticlePositions(navItem);
		this.morphParticlesTo(toPositionVectors!, 1000, 0, TWEEN.Easing.Quartic.Out);
	}

	private moveParticles(deltaPos: THREE.Vector3, particlesPosArray: Array<THREE.Vector3> | undefined) {
		if (particlesPosArray == undefined) return;
		for (let i = 0; i < particlesPosArray.length; ++i) {
			particlesPosArray[i] = new THREE.Vector3().subVectors(particlesPosArray[i], deltaPos);
		}
	}

	private moveAllCurrParticles(deltaPos: THREE.Vector3) {
		for (let i = 0; i < this.particleSystem.getNumParticles(); ++i) {
			this.moveParticles(deltaPos, this.particleSystem.getParticlesAtPos(i)); // TODO: make an iterable over particlesystem with function delegation
			// TODO: make an iterable over particlesystem with function delegation
			// TODO: make an iterable over particlesystem with function delegation
		}
	}

	private moveCurrParticles(deltaPos: THREE.Vector3) {
		if (this.particleSystem.getCurrParticles() == null) {
			// console.log('Error in moveTo, currParticlesPos == null.');
			return;
		}

		const shuffle = (array: Array<THREE.Vector3>) => {
			array.sort(() => Math.random() - 0.5);
		};

		const toPositionVectors: Array<THREE.Vector3> = new Array<THREE.Vector3>(particleCount);

		for (let i = 0; i < particleCount; ++i) {
			const newPos = new THREE.Vector3();
			const currPos: THREE.Vector3 = this.particleSystem.getCurrParticlesAtPos(i);

			newPos.subVectors(currPos, deltaPos);
			toPositionVectors[i] = newPos;
		}
		shuffle(toPositionVectors);

		this.morphParticlesTo(toPositionVectors, 1000, 100, TWEEN.Easing.Quartic.Out);
		this.moveAllCurrParticles(deltaPos);
	}

	public morphParticlesFromTo(fromPosArray: Array<THREE.Vector3>, toPosArray: Array<THREE.Vector3>, time: number, delay: number, easing: EasingFunction): void {
		this.particleSystem.setCurrParticles(fromPosArray);
		this.morphParticlesTo(toPosArray!, time, delay, easing);
	}

	private morphParticlesTo(toPosArray: Array<THREE.Vector3>, time: number, delay: number, easing: EasingFunction): void {
		if (toPosArray == null) {
			// console.log('Error in morphParticles, toPosArray == null.');
			return;
		}
		if (this.particleSystem.getCurrParticles() == null) {
			// console.log('Error in morphParticles, currParticlesPos == null.');
			return;
		}

		TWEEN.removeAll();

		for (let i = 0; i < particleCount; ++i) {
			let currPos: THREE.Vector3 = this.particleSystem.getCurrParticlesAtPos(i);
			let toPos: THREE.Vector3 = toPosArray[i];

			const tween = new TWEEN.Tween(currPos)
				.to(toPos, time)
				.delay(delay)
				.easing(easing)
				.onUpdate((pos) => {
					let matrix: THREE.Matrix4 = new THREE.Matrix4();
					matrix.makeTranslation(new THREE.Vector3(pos.x, pos.y, pos.z));

					this.particleSystem.setMatrixAt(i, matrix);
					// this.particleSystem.instanceMatrix.needsUpdate = true;
				});
			tween.start();
		}
	}
}