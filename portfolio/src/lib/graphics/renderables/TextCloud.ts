import * as THREE from 'three';
import type IRenderable from './IRenderable';
import { type Color } from '$lib/utils/colors';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { randomPointsInBufferGeometry } from '../utils/VectorUtils';
import type { NavItem } from '$lib/types';
import * as TWEEN from '@tweenjs/tween.js';

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
const particleCount = 5000;
const typeface = '/src/lib/graphics/fonts/optimer_bold.typeface.json';


export class TextCloud implements IRenderable {
	private lookAt?: THREE.Vector3;

	private fontLoader = new FontLoader();
	private ready: boolean = false;


	private particleSystem!: THREE.InstancedMesh;
	// Instanced geometry
	private particleGeometry: THREE.BufferGeometry = new THREE.SphereGeometry(0.15);

	// Each entry is a text cloud of positions - used to set currParticles' position attribute
	private particlesPositions: Array<Array<THREE.Vector3>> = new Array<Array<THREE.Vector3>>();
	private currParticlesPos: Array<THREE.Vector3> | null = null;

	private particleMaterial = new THREE.MeshNormalMaterial({ transparent: true });
	// private particleGeometry: THREE.BufferGeometry = new THREE.TorusGeometry(0.1, 0.05, 16, 50);

	private currNav: NavItem = { idx: 0, id: '' }; // index into particlesGeometries array

	// private tween!: TWEEN.Tween<THREE.TypedArray>;;
	// private activeTweens: Array<TWEEN.Tween<Array<THREE.Vector3>>> = new Array();

	constructor(scene: THREE.Scene, navItems: Array<NavItem>, initParams: NavItem, pos?: THREE.Vector3, lookAt?: THREE.Vector3) {
		// TODO: wip - properly position this element based on div/h1 element
		// let mainTitleText: (HTMLElement | null) = document.getElementById("main-title");
		// if (mainTitleText != null) {
		// 	let { top, bottom } = mainTitleText.getBoundingClientRect();
		// 	console.log('mainTitleText: ', mainTitleText);
		// 	console.log('top: ', top, ' bottom: ', bottom);
		// }

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

			this.ready = true;
		});
	}

	private createParticleText(font: Font, text: string, idx: number): Array<THREE.Vector3> {
		let geometry = new TextGeometry(text, {
			font: font,
			size: window.innerWidth * 0.003,
			height: 1,
			curveSegments: 10,
		});
		geometry.center();

		return randomPointsInBufferGeometry(geometry, particleCount); // Coordinates of each particle
	}

	private initParticleSystem(font: Font, initParams: NavItem) {
		console.log('initParams: ', initParams);

		this.currParticlesPos = this.createParticleText(font, initParams.id, initParams.idx);
		if (this.currParticlesPos == null) {
			console.log('Error - currParticles is NULL');
		}

		// initialize particle system
		this.particleSystem = new THREE.InstancedMesh(this.particleGeometry, this.particleMaterial, particleCount);
		this.particleSystem.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
		this.updateInstanceMatrix();

		// TODO: initialize position
		this.particleSystem.position.x = 0;
		this.particleSystem.position.y = 0;
		this.particleSystem.position.z = 50;
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
	}

	public onNavigationChange(item: NavItem) {
		if (!this.ready) return;

		this.transitionTo(item);
	}

	public transitionTo(item: NavItem) {
		this.morphTo(item);
		this.currNav = item;
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

	private morphTo(item: NavItem) {
		const toPositionVectora: Array<THREE.Vector3> | null = this.getParticlePositions(item);

		if (toPositionVectora == null) {
			console.log('Error in morpTo, toPositionVectora == null.');
			return;
		}
		if (this.currParticlesPos == null) {
			console.log('Error in morphTo, currParticlesPos == null.');
			return;
		}

		// TWEEN.getAll().forEach((tween) => {
		// 	tween.stop();
		// });
		TWEEN.removeAll();

		for (let i = 0; i < particleCount; ++i) {
			let currPos: THREE.Vector3 = this.currParticlesPos[i];
			let toPos: THREE.Vector3 = toPositionVectora[i];

			const tween = new TWEEN.Tween(currPos)
				.to(toPos, 1000)
				.easing(TWEEN.Easing.Quartic.Out)
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



