import * as THREE from 'three';
import type IRenderable from './IRenderable';
import { NAMED_COLORS, type Color } from '$lib/utils/colors';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { randomPointsInBufferGeometry } from '../utils/VectorUtils';
import type { NavItem } from '$lib/types';
import * as TWEEN from '@tweenjs/tween.js';

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import type { EasingFunction } from 'svelte/transition';


interface IVertices {
	[index: string]: {
		x: number;
		y: number;
		z: number;
	};
}

interface Item {
	idx: number,
	geometry: TextGeometry,
	particles: THREE.BufferGeometry,
	points: Array<THREE.Vector3>;
};
type GeometryItems = Array<Item>;

// Options
const particleCount = 10000;
const typeface = '/src/lib/graphics/fonts/optimer_bold.typeface.json';


export class TextCloud implements IRenderable {

	private clock = new THREE.Clock();

	private lookAt?: THREE.Vector3;

	private fontLoader = new FontLoader();
	private ready: boolean = false;


	private particleSystem!: THREE.InstancedMesh;
	// Instanced geometry
	private particleGeometry: THREE.BufferGeometry = new THREE.CircleGeometry(0.15, 64, 64);

	// Each entry is a text cloud of positions - used to set currParticles' position attribute
	private particlesPositions: Array<Array<THREE.Vector3>> = new Array<Array<THREE.Vector3>>();
	private currParticlesPos: Array<THREE.Vector3> | null = null;

	// private particleMaterial = new THREE.MeshNormalMaterial({ transparent: true });
	private material = new THREE.MeshStandardMaterial({
		color: 0xffaf00,
		alphaHash: true,
		opacity: 0.7
	});

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

	private resolution: THREE.Vector2;
	// private particleGeometry: THREE.BufferGeometry = new THREE.TorusGeometry(0.1, 0.05, 16, 50);

	private currNav: NavItem = { idx: 0, id: '' }; // index into particlesGeometries array

	// private tween!: TWEEN.Tween<THREE.TypedArray>;;
	// private activeTweens: Array<TWEEN.Tween<Array<THREE.Vector3>>> = new Array();

	constructor(scene: THREE.Scene, navItems: Array<NavItem>, initParams: NavItem, resolution?: THREE.Vector2, pos?: THREE.Vector3, lookAt?: THREE.Vector3) {
		// TODO: wip - properly position this element based on div/h1 element
		// let mainTitleText: (HTMLElement | null) = document.getElementById("main-title");
		// if (mainTitleText != null) {
		// 	let { top, bottom } = mainTitleText.getBoundingClientRect();
		// 	console.log('mainTitleText: ', mainTitleText);
		// 	console.log('top: ', top, ' bottom: ', bottom);
		// }
		this.resolution = new THREE.Vector2(resolution?.x, resolution?.y);

		// load font and execute onLoad callback
		this.fontLoader.load(typeface, (font) => {

			navItems.forEach((navItem) => {
				console.log('TextCloud navItems: ', navItem);

				if (navItem == null) {
					console.log('returned on navItem: ', navItem);
					return;
				}

				this.particlesPositions.push(this.createParticleText(font, navItem.id, navItem.idx));
			});

			console.log(this.particlesPositions);

			this.initParticleSystem(font, initParams);

			if (lookAt != null) {
				this.particleSystem.lookAt(lookAt);
				this.lookAt = lookAt;
			}

			scene.add(this.particleSystem);

			// play initial animation
			this.startEntryAnimation(initParams);

			this.ready = true;
		});
	}

	private createParticleText(font: Font, text: string, idx: number): Array<THREE.Vector3> {
		const geometry = new TextGeometry(text, {
			font: font,
			size: window.innerWidth * 0.003, // TODO: window.innerWidth different for mobile and window
			height: 1,
			curveSegments: 10,
		});
		geometry.center();

		const textMesh = new THREE.Mesh(geometry);
		const sampler = new MeshSurfaceSampler(textMesh)
			.setWeightAttribute('color')
			.build();

		const particles: Array<THREE.Vector3> = new Array<THREE.Vector3>();
		for (let i = 0; i < particleCount; ++i) {
			const position = new THREE.Vector3;
			sampler.sample(position);
			particles.push(position);
		}

		return particles; //randomPointsInBufferGeometry(geometry, particleCount); // Coordinates of each particle
	}

	private initParticleSystem(font: Font, initParams: NavItem) {
		console.log('initParams: ', initParams);

		this.currParticlesPos = this.createParticleText(font, initParams.id, initParams.idx);
		if (this.currParticlesPos == null) {
			console.log('Error - currParticles is NULL');
		}

		// initialize particle system
		this.particleSystem = new THREE.InstancedMesh(this.particleGeometry, this.material, particleCount);
		this.particleSystem.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
		this.updateInstanceMatrix();

		// TODO: initialize position
		this.particleSystem.position.x = 0;
		this.particleSystem.position.y = 25;
		this.particleSystem.position.z = 30;
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

	public update(deltaTime: number, mouseScreenPos: THREE.Vector2 | void): void {
		if (this.lookAt != null) {
			this.particleSystem.lookAt(this.lookAt);
		}

		const result = TWEEN.update();
		// this.tween.update(deltaTime);

		// this.uniforms.u_time.value = this.clock.getElapsedTime();
	}

	public onNavigationChange(item: NavItem) {
		if (!this.ready) return;

		this.transitionTo(item);
	}

	public onThemeChange(val: boolean) { // TODO: rename to onThemeChange
		console.log("themeCallback: " + val);
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

	public onWindowResize() {
		// Update the resolution uniform
		// this.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
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


	public transitionTo(item: NavItem) {
		this.morphTo(item);
		this.currNav = item;
	}

	public getPosition(): THREE.Vector3 {
		return this.particleSystem.position;
	}

	public getParticleSystem() {
		return this.particleSystem;
	}

	private getParticlePositions(item: NavItem): Array<THREE.Vector3> | null {

		let pos: Array<THREE.Vector3> | undefined = this.particlesPositions.at(item.idx);
		if (pos == null) {
			console.log('getBufferGeometry: NULL', ' for ', item);
			console.log('geom: : ', this.particlesPositions);

			return null;
		}
		console.log('getBufferGeometry: ', item);

		return pos;
	}

	private startEntryAnimation(navItem: NavItem) {
		// if Home nav
		const sphereGeom = new THREE.SphereGeometry(16, 16, 16);
		const sphere = new THREE.Mesh(sphereGeom);
		sphere.position.x = 100;
		sphere.position.setY(-100);

		const sphereSampler = new MeshSurfaceSampler(sphere)
			.setWeightAttribute('color')
			.build();

		let sphereParticlesPos: Array<THREE.Vector3> = new Array<THREE.Vector3>();
		for (let i = 0; i < particleCount; ++i) {
			const position = new THREE.Vector3();
			sphereSampler.sample(position);
			sphereParticlesPos.push(position);
		}

		const toPositionVectors: Array<THREE.Vector3> | null = this.getParticlePositions(navItem);

		this.morphParticlesFromTo(sphereParticlesPos, toPositionVectors!, 2000, TWEEN.Easing.Cubic.Out);
	}

	private morphTo(navItem: NavItem) {
		const toPositionVectors: Array<THREE.Vector3> | null = this.getParticlePositions(navItem);
		this.morphParticlesTo(toPositionVectors!, 1000, TWEEN.Easing.Quartic.Out);
	}

	private morphParticlesFromTo(fromPosArray: Array<THREE.Vector3>, toPosArray: Array<THREE.Vector3>, time: number, easing: EasingFunction): void {
		this.currParticlesPos = fromPosArray;
		this.morphParticlesTo(toPosArray!, time, easing);
	}

	private morphParticlesTo(toPosArray: Array<THREE.Vector3>, time: number, easing: EasingFunction): void {
		if (toPosArray == null) {
			console.log('Error in morphParticles, toPosArray == null.');
			return;
		}
		if (this.currParticlesPos == null) {
			console.log('Error in morphParticles, currParticlesPos == null.');
			return;
		}

		TWEEN.removeAll();

		for (let i = 0; i < particleCount; ++i) {
			let currPos: THREE.Vector3 = this.currParticlesPos[i];
			let toPos: THREE.Vector3 = toPosArray[i];

			const tween = new TWEEN.Tween(currPos)
				.to(toPos, time)
				.easing(easing)
				.onUpdate((pos) => {
					let matrix: THREE.Matrix4 = new THREE.Matrix4();
					matrix.makeTranslation(new THREE.Vector3(pos.x, pos.y, pos.z));

					this.particleSystem.setMatrixAt(i, matrix);
					this.particleSystem.instanceMatrix.needsUpdate = true;
				});
			tween.start();
		}
	}

}



