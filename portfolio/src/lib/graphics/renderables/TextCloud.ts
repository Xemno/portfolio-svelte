import * as THREE from 'three';
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import type IRenderable from './IRenderable';
import { type Color } from '$lib/utils/colors';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { gsap, TweenMax, Elastic } from 'gsap';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { randomPointsInBufferGeometry } from '../utils/VectorUtils';
import { page } from '$app/stores';
import type { NavItem } from '$lib/types';

import * as TWEEN from '@tweenjs/tween.js';


let conf = {
	xyCoef: 50,
	zCoef: 10,
};

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

// description to buffergeometry
// type id2BufferGeometry = [string, THREE.BufferGeometry];

// description key (navigation string) to buffergeometry vertices
type Idx2PosAttr = [id: number, data: THREE.BufferAttribute];


// Options
const particleCount = 5000;

const particleSize = .3;

const defaultAnimationSpeed = 1;
const morphAnimationSpeed = 18;
const color = '#F12F0F';

const typeface = '/src/lib/graphics/fonts/optimer_bold.typeface.json';


export class TextCloud implements IRenderable {

	private fontLoader = new FontLoader();

	private ready: boolean = false;


	private lookAt?: THREE.Vector3;

	private particleSystem!: THREE.InstancedMesh;

	private particlesGeometries: Array<Idx2PosAttr> = new Array<Idx2PosAttr>(); // NOTE: static, used only for locations
	private currParticlesPositions: THREE.BufferAttribute | null = null; // NOTE: dynamic

	// Instanced geometry
	private particleGeometry: THREE.BufferGeometry = new THREE.SphereGeometry(0.2);
	// private particleGeometry: THREE.BufferGeometry = new THREE.TorusGeometry(0.1, 0.05, 16, 50);
	private particleMaterial = new THREE.MeshNormalMaterial({ transparent: true });


	private currNav: NavItem = { idx: 0, id: '' }; // index into particlesGeometries array


	// private tween!: TWEEN.Tween<THREE.TypedArray>;;
	private activeTweens: Array<TWEEN.Tween<Array<THREE.Vector3>>> = new Array();

	// private particles = new THREE.BufferGeometry();
	private pMaterial = new THREE.PointsMaterial({
		size: particleSize,
		vertexColors: true,
	});

	// Animate
	private normalSpeed: number = (defaultAnimationSpeed / 100);
	private fullSpeed: number = (morphAnimationSpeed / 100);

	private animationVars = {
		speed: this.normalSpeed,
		color: color,
		rotation: -45
	};

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

				this.createParticles(font, navItem.id, navItem.idx);
			});

			console.log(this.particlesGeometries);


			this.initParticleSystem(font, initParams);


			if (lookAt != null) {
				this.particleSystem.lookAt(lookAt);
				this.lookAt = lookAt;
			}

			scene.add(this.particleSystem);

			this.ready = true;
		});
	}

	private createParticles(font: Font, text: string, idx: number) {
		let geometry = new TextGeometry(text, {
			font: font,
			size: window.innerWidth * 0.003,
			height: 1,
			curveSegments: 10,
		});
		geometry.center();

		// TODO: maybe different material for each
		// const material = new THREE.PointsMaterial({
		// 	color: 0xff0000,
		// 	size: 2
		// });

		let points = randomPointsInBufferGeometry(geometry, particleCount); // NOTE: Coordinates of each particle --> textureCoordinates
		let particlePos: THREE.BufferAttribute = <THREE.BufferAttribute>(new THREE.BufferGeometry().setFromPoints(points).attributes.position);


		// set up particlesGeometries
		let entry: Idx2PosAttr = [idx, particlePos];
		// entry[navItem.id] = particles;
		this.particlesGeometries.push(entry);
	}

	private initParticleSystem(font: Font, initParams: NavItem) {
		// TODO: move everything below to init function onFinish() or afterInit()
		console.log('initParams: ', initParams);


		let geometry = new TextGeometry(initParams.id, {
			font: font,
			size: window.innerWidth * 0.003,
			height: 1,
			curveSegments: 10,
		});
		geometry.center();
		let points = randomPointsInBufferGeometry(geometry, particleCount); // NOTE: Coordinates of each particle --> textureCoordinates
		let particlePos: THREE.BufferAttribute = <THREE.BufferAttribute>(new THREE.BufferGeometry().setFromPoints(points).attributes.position);


		// Init points particle system
		this.currParticlesPositions = particlePos;
		if (this.currParticlesPositions == null) {
			console.log('currParticlesGeometry is NULL');

			this.currNav = { idx: 0, id: initParams.id };

			this.currParticlesPositions = this.particlesGeometries.at(this.currNav.idx)![1];
		}

		// initialize particle system
		this.particleSystem = new THREE.InstancedMesh( // NOTE: with InstancedMesh we can also use 3D shapes as particles
			this.particleGeometry,
			this.particleMaterial,
			particleCount
		);
		this.particleSystem.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame

		// TODO: initialize position
		this.particleSystem.position.x = -20;
		this.particleSystem.position.y = 5;
		this.particleSystem.position.z = 50;

		this.updateParticlesMatrices();

	}

	private updateParticlesMatrices() {
		// this.currParticlesPositions!.array.forEach((p) => {

		// });

		let dummy = new THREE.Object3D();

		let idx = 0;
		for (let i = 0; i < this.currParticlesPositions!.array.length; i = i + 3) {
			const x = this.currParticlesPositions!.array[i];
			const y = this.currParticlesPositions!.array[i + 1];
			const z = this.currParticlesPositions!.array[i + 2];

			dummy.rotation.set(2 * Math.random(), 2 * Math.random(), 2 * Math.random());
			dummy.position.set(x, y, z);
			dummy.updateMatrix();

			this.particleSystem.setMatrixAt(idx, dummy.matrix);
			idx++;
		}
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
		console.log('::::', item);
		if (!this.ready) return;


		this.transitionTo(item);
	}

	public transitionTo(item: NavItem) {
		// console.log(this.particlesGeometries);


		this.morphTo(item);

		this.currNav = item;
	}


	// private setParticlesTextTo(id: string) {
	// 	const geometry: THREE.BufferGeometry | null = this.getBufferGeometry(id);
	// 	if (geometry != null) {
	// 		this.particleSystem.geometry = geometry;
	// 	}
	// }

	private getBufferGeometry(item: NavItem): THREE.BufferAttribute | null {
		// let result: THREE.BufferGeometry | null = null;

		// this.particlesGeometries.forEach((entry) => {
		// 	if (entry[item.id] != null) {
		// 		result = entry[item.id];
		// 	}
		// });

		// return this.particlesGeometries[item.idx][item.id];
		let elem: Idx2PosAttr | undefined = this.particlesGeometries.at(item.idx);
		if (elem == null) {
			console.log('getBufferGeometry: NULL', ' for ', item);
			console.log('geom: : ', this.particlesGeometries);

			return null;
		}
		console.log('getBufferGeometry: ', item);

		return elem[1];

		// return result;
	}


	private morphTo(item: NavItem) {
		const toPosAttr: THREE.BufferAttribute | null = this.getBufferGeometry(item);
		if (toPosAttr == null) {
			console.log('Error in morpTo, geometryTo == null.');
			return;
		}
		if (this.currParticlesPositions == null) {
			console.log('Error in morpTo, currParticlesGeometry == null.');
			return;
		}

		// let currPositionsAttribute: THREE.BufferAttribute = <THREE.BufferAttribute>this.currParticlesGeometry.attributes.position;
		// let currPositionsAttribute: THREE.BufferAttribute = <THREE.BufferAttribute>this.particleSystem.geometry.attributes.position;
		//currPositionsAttribute.setUsage(THREE.DynamicDrawUsage);

		// let currPosArray = currPositionsAttribute.array;

		let currPosArr: THREE.TypedArray = this.currParticlesPositions.array;

		const toPosArr: THREE.TypedArray = toPosAttr.array;

		TWEEN.removeAll(); // TODO: try this
		// this.activeTweens.forEach((item, idx) => {
		// 	item.stop();
		// 	// console.log("removing: ", idx, ' ', item.getId());
		// 	// if (idx > -1) {
		// 	// 	this.activeTweens.splice(idx, 1);
		// 	// }		
		// });
		// this.activeTweens = new Array();

		for (let i = 0; i < particleCount; ++i) {
			let currPos = [
				this.currParticlesPositions!.array[i * 3],
				this.currParticlesPositions!.array[i * 3 + 1],
				this.currParticlesPositions!.array[i * 3 + 2]
			];
			let toPos = [
				toPosAttr.array[i * 3],
				toPosAttr.array[i * 3 + 1],
				toPosAttr.array[i * 3 + 2]
			];


			let tween = new TWEEN.Tween(currPos)
				.to(toPos, 1000)
				.easing(TWEEN.Easing.Quartic.Out)
				.onUpdate((pos) => {

					this.currParticlesPositions!.array[i * 3] = pos[0];
					this.currParticlesPositions!.array[i * 3 + 1] = pos[1];
					this.currParticlesPositions!.array[i * 3 + 2] = pos[2];

					// let dummy = new THREE.Object3D();
					// dummy.rotation.set(2 * Math.random(), 2 * Math.random(), 2 * Math.random());
					// dummy.position.set(pos[0], pos[1], pos[2]);
					// dummy.updateMatrix();

					let matrix: THREE.Matrix4 = new THREE.Matrix4();
					matrix.makeTranslation(new THREE.Vector3(pos[0], pos[1], pos[2]));

					this.particleSystem.setMatrixAt(i, matrix);
					this.particleSystem.instanceMatrix.needsUpdate = true;
				}).start();
		}


		// let tween = new TWEEN.Tween(currPosArr)
		// 	.to(toPosArr, 1000)
		// 	.easing(TWEEN.Easing.Quartic.Out)
		// 	.onUpdate((obj) => {
		// 		// console.log(obj);

		// 		this.particleSystem.instanceMatrix.needsUpdate = true;
		// 	});
		// .onComplete(() => {
		// 	let idx = this.activeTweens.indexOf(tween, 0);
		// 	console.log("onComplete: ", idx, ' ', tween.getId());
		// 	if (idx > -1) {
		// 		this.activeTweens.splice(idx, 1);
		// 	}
		// });

		// tween.start();

		// this.activeTweens.push(tween);

		console.log('this.activeTweens size: ', this.activeTweens.length);





		// NOTE: GSAP way
		// gsap.to(currPosArray, {
		// 	endArray: newPosArray,
		// 	duration: 1,
		// 	ease: "elastic(0.1, .3)",
		// 	onUpdate: () => {
		// 		// NOTE: this is gsaps update that is called frequently
		// 		this.currParticlesGeometry.attributes.position.needsUpdate = true;
		// 		console.log('isUpdating');

		// 	},
		// 	onInterrupt: () => {
		// 		console.log('is interrupted.');

		// 	}
		// });
	}


}



