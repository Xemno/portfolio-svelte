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
type Idx2BufferGeometry = [id: number, data: THREE.BufferGeometry];


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

	private particleSystem!: THREE.Points;

	private particlesGeometries: Array<Idx2BufferGeometry> = new Array<Idx2BufferGeometry>(); // NOTE: static, used only for locations
	private currParticlesGeometry: THREE.BufferGeometry | null = null; // NOTE: dynamic

	private currNav: NavItem = { idx: 0, id: '' }; // index into particlesGeometries array


	// private tween!: TWEEN.Tween<THREE.TypedArray>;;
	private activeTweens: Array<TWEEN.Tween<THREE.TypedArray>> = new Array();

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


			this.initParticleSystem(initParams);


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

		let points = randomPointsInBufferGeometry(geometry, particleCount);
		let particles = new THREE.BufferGeometry().setFromPoints(points);


		// set up particlesGeometries
		let entry: Idx2BufferGeometry = [idx, particles];
		// entry[navItem.id] = particles;
		this.particlesGeometries.push(entry);
	}

	private initParticleSystem(initParams: NavItem) {
		// TODO: move everything below to init function onFinish() or afterInit()
		console.log('initParams: ', initParams);

		// Init points particle system
		this.currParticlesGeometry = this.getBufferGeometry(initParams);
		if (this.currParticlesGeometry == null) {
			console.log('currParticlesGeometry is NULL');

			this.currNav = { idx: 0, id: initParams.id };

			this.currParticlesGeometry = this.particlesGeometries.at(this.currNav.idx)![1];
		}
		// initialize particle system
		this.particleSystem = new THREE.Points(
			this.currParticlesGeometry,
			this.pMaterial
		);

		// TODO: initialize position
		this.particleSystem.position.x = -20;
		this.particleSystem.position.y = 5;
		this.particleSystem.position.z = 50;

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

	private getBufferGeometry(item: NavItem): THREE.BufferGeometry | null {
		// let result: THREE.BufferGeometry | null = null;

		// this.particlesGeometries.forEach((entry) => {
		// 	if (entry[item.id] != null) {
		// 		result = entry[item.id];
		// 	}
		// });

		// return this.particlesGeometries[item.idx][item.id];
		let elem: Idx2BufferGeometry | undefined = this.particlesGeometries.at(item.idx);
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
		const geometryTo: THREE.BufferGeometry | null = this.getBufferGeometry(item);
		if (geometryTo == null) {
			console.log('Error in morpTo, geometryTo == null.');
			return;
		}
		if (this.currParticlesGeometry == null) {
			console.log('Error in morpTo, currParticlesGeometry == null.');
			return;
		}

		// let currPositionsAttribute: THREE.BufferAttribute = <THREE.BufferAttribute>this.currParticlesGeometry.attributes.position;
		let currPositionsAttribute: THREE.BufferAttribute = <THREE.BufferAttribute>this.particleSystem.geometry.attributes.position;
		//currPositionsAttribute.setUsage(THREE.DynamicDrawUsage);

		let currPosArray = currPositionsAttribute.array;
		const newPosArray = geometryTo.attributes.position.array;


		this.activeTweens.forEach((item, idx) => {
			item.stop();
			// console.log("removing: ", idx, ' ', item.getId());
			// if (idx > -1) {
			// 	this.activeTweens.splice(idx, 1);
			// }		
		});
		this.activeTweens = new Array();


		let tween = new TWEEN.Tween(currPosArray)
			.to(newPosArray, 1000)
			.easing(TWEEN.Easing.Quartic.Out)
			.onUpdate(() => {
				this.currParticlesGeometry!.attributes.position.needsUpdate = true;
			})
			.onComplete(() => {
				let idx = this.activeTweens.indexOf(tween, 0);
				console.log("onComplete: ", idx, ' ', tween.getId());
				if (idx > -1) {
					this.activeTweens.splice(idx, 1);
				}
			});

		tween.start();

		this.activeTweens.push(tween);

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



