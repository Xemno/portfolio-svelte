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
		if (!this.ready) return;
		let vWorldPos = this.getMainTitleTextPosition();
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

		this.tweenMorphing.morphFromTo(sphereParticlesPos, toPositionVectors!, 2000, 0, TWEEN.Easing.Cubic.Out);
	}
}

class TextParticleSystem { // TODO: TextParticleSystem

	private numParticles = 5000;

	private instancedMeshParticles!: THREE.InstancedMesh;
	// Instanced geometry
	private particleGeometry: THREE.BufferGeometry = new THREE.CircleGeometry(0.15, 64, 64);

	// Each entry is a text cloud of positions - used to set currParticles' position attribute
	private readonly particlesPositions = new Array<Array<THREE.Vector3>>(); // static
	private currParticlesPos: Array<THREE.Vector3> | null = null; // dynamic

	private material = new THREE.MeshStandardMaterial({
		color: 0xffaf00,
		alphaHash: true,
		opacity: 0.7
	});

	public getParticleSystem() {
		return this.instancedMeshParticles;
	}

	public getNumParticles(): number {
		return this.numParticles;
	}

	public setNumParticles(numParticles: number) {
		this.numParticles = numParticles;
	}

	public createParticles(font: Font, navItems: Array<NavItem>) {
		navItems.forEach((navItem) => this.particlesPositions.push(this.createTextParticlesPos(font, navItem)));
	}

	public createCurrParticles(font: Font, initParams: NavItem) {
		this.currParticlesPos = this.createTextParticlesPos(font, initParams); // NOTE: current particle position
		if (this.currParticlesPos == null) {
			// console.log('Error - currParticles is NULL');
		}

		// initialize particle system
		this.instancedMeshParticles = new THREE.InstancedMesh(this.particleGeometry, this.material, this.numParticles);
		this.instancedMeshParticles.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
		this.particleGeometry.dispose();
		// this.updateInstanceMatrix();
	}

	public setCurrParticlesPos(vWorldPos: THREE.Vector3 | null) {
		if (vWorldPos == null) return;
		if (this.instancedMeshParticles == null) return;
		if (vWorldPos != this.instancedMeshParticles.position) {
			this.instancedMeshParticles.position.set(vWorldPos.x, vWorldPos.y, vWorldPos.z);
		}
	}

	public getParticlesAtPos(idx: number) {
		return this.particlesPositions.at(idx);
	}

	public forEachCurrParticle(fn: (vec: THREE.Vector3, idx: number) => void,) {
		if (this.currParticlesPos == null) throw new Error('forEachCurrParticle::currParticlesPos must not be null')
		this.currParticlesPos.forEach((vec: THREE.Vector3, idx) => fn(vec, idx));
	}

	public setCurrParticles(particlesPos: Array<THREE.Vector3>) {
		if (particlesPos == null) throw new Error('setCurrParticles::particlesPos must not be null')
		this.currParticlesPos = particlesPos;
	}

	public setMatrixAt(i: number, matrix: THREE.Matrix4) {
		this.instancedMeshParticles.setMatrixAt(i, matrix);
		this.instancedMeshParticles.instanceMatrix.needsUpdate = true;
	}

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

	private createTextParticlesPos(font: Font, text: NavItem): Array<THREE.Vector3> {

		let isPortraitMode = screen.availHeight > screen.availWidth ? true : false;
		let isMobile = detectMobile();
		let size = isMobile ? window.innerWidth * 0.0075 : window.innerWidth * 0.005;

		const maxSize = isMobile ? (isPortraitMode ? 4 : 6) : 8;
		size = Math.min(size, maxSize);

		const geometry = new TextGeometry(text.id, {
			font: font,
			size: size, // TODO: window.innerWidth different for mobile and window
			height: 1,
			curveSegments: 10
		});
		geometry.center();

		const textMesh = new THREE.Mesh(geometry);
		const sampler = new MeshSurfaceSampler(textMesh).setWeightAttribute('color').build();

		const particlePositions = new Array<THREE.Vector3>();
		for (let i = 0; i < this.numParticles; ++i) {
			const position = new THREE.Vector3();
			sampler.sample(position);
			particlePositions.push(position);
		}

		// cleanup
		geometry.dispose();
		textMesh.clear();

		return particlePositions;
	}

	private updateInstanceMatrix() {
		let dummy = new THREE.Object3D();

		this.currParticlesPos!.forEach((pos, idx) => {
			dummy.position.set(pos.x, pos.y, pos.z);
			dummy.updateMatrix();

			this.instancedMeshParticles.setMatrixAt(idx, dummy.matrix);
		});

		this.instancedMeshParticles.instanceMatrix.needsUpdate = true;
	}
}

class TweenMorphing {
	private readonly particleSystem: TextParticleSystem;

	constructor(particleSystem: TextParticleSystem) {
		this.particleSystem = particleSystem;
	}

	public update() {
		const result = TWEEN.update();
	}

	public morphTo(navItem: NavItem) {
		// TODO: check navItem is in range and plausible
		const toPositionArray: Array<THREE.Vector3> = this.particleSystem.getParticlesAtPos(navItem.idx)!;
		this.morphCurrParticlesTo(toPositionArray, 1000, 0, TWEEN.Easing.Quartic.Out);
	}

	public morphFromTo(fromPosArray: Array<THREE.Vector3>, toPosArray: Array<THREE.Vector3>, time: number, delay: number, easing: EasingFunction): void {
		if (fromPosArray == null) throw new Error('morphFromTo::fromPosArray must not be null')
		if (toPosArray == null) throw new Error('morphFromTo::toPosArray must not be null')
		this.particleSystem.setCurrParticles(fromPosArray);
		this.morphCurrParticlesTo(toPosArray, time, delay, easing);
	}

	private morphCurrParticlesTo(toPosArray: Array<THREE.Vector3>, time: number, delay: number, easing: EasingFunction): void {
		TWEEN.removeAll();

		this.particleSystem.forEachCurrParticle((currParticlePos: THREE.Vector3, idx: number) => {
			let toPos: THREE.Vector3 = toPosArray[idx];

			const tween = new TWEEN.Tween(currParticlePos)
				.to(toPos, time)
				.delay(delay)
				.easing(easing)
				.onUpdate((pos) => {
					let matrix: THREE.Matrix4 = new THREE.Matrix4();
					matrix.makeTranslation(new THREE.Vector3(pos.x, pos.y, pos.z));

					this.particleSystem.setMatrixAt(idx, matrix);
					// this.particleSystem.instanceMatrix.needsUpdate = true;
				});
			tween.start();
		})
	}
	// private getParticlePositions(item: NavItem): Array<THREE.Vector3> | null {
	// 	let pos: Array<THREE.Vector3> | undefined = this.particleSystem.getParticlesAtPos(item.idx);
	// 	if (pos == null || pos == undefined) {
	// 		return null;
	// 	}
	// 	return pos;
	// }


	// private moveParticles(deltaPos: THREE.Vector3, particlesPosArray: Array<THREE.Vector3> | undefined) {
	// 	if (particlesPosArray == undefined) return;
	// 	for (let i = 0; i < particlesPosArray.length; ++i) {
	// 		particlesPosArray[i] = new THREE.Vector3().subVectors(particlesPosArray[i], deltaPos);
	// 	}
	// }

	// private moveAllCurrParticles(deltaPos: THREE.Vector3) {
	// 	for (let i = 0; i < this.particleSystem.getNumParticleTexts(); ++i) {
	// 		this.moveParticles(deltaPos, this.particleSystem.getParticlesAtPos(i)); // TODO: make an iterable over particlesystem with function delegation
	// 		// TODO: make an iterable over particlesystem with function delegation
	// 		// TODO: make an iterable over particlesystem with function delegation
	// 	}
	// }

	// private moveCurrParticles(deltaPos: THREE.Vector3) {
	// 	if (this.particleSystem.getCurrParticles() == null) {
	// 		// console.log('Error in moveTo, currParticlesPos == null.');
	// 		return;
	// 	}

	// 	const shuffle = (array: Array<THREE.Vector3>) => {
	// 		array.sort(() => Math.random() - 0.5);
	// 	};

	// 	const toPositionVectors: Array<THREE.Vector3> = new Array<THREE.Vector3>(particleCount);

	// 	for (let i = 0; i < particleCount; ++i) {
	// 		const newPos = new THREE.Vector3();
	// 		const currPos: THREE.Vector3 = this.particleSystem.getCurrParticlesAtPos(i);

	// 		newPos.subVectors(currPos, deltaPos);
	// 		toPositionVectors[i] = newPos;
	// 	}
	// 	shuffle(toPositionVectors);

	// 	this.morphParticlesTo(toPositionVectors, 1000, 100, TWEEN.Easing.Quartic.Out);
	// 	this.moveAllCurrParticles(deltaPos);
	// }
}