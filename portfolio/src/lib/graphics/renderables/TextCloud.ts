import * as THREE from 'three';
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import type IRenderable from './IRenderable';
import { type Color } from '$lib/utils/colors';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { gsap, TweenMax, Elastic } from 'gsap';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { randomPointsInBufferGeometry } from '../utils/VectorUtils';
import { page } from '$app/stores';
import type { NavItem } from '$lib/types';



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
interface Str2BufferGeometry {
	[key: string]: THREE.BufferGeometry;
}


// Options
const particleCount = 5000;

const particleSize = .3;

const defaultAnimationSpeed = 1;
const morphAnimationSpeed = 18;
const color = '#F12F0F';

const typeface = '/src/lib/graphics/fonts/optimer_bold.typeface.json';


export class TextCloud implements IRenderable {

	private fontLoader = new FontLoader();


	private lookAt?: THREE.Vector3;

	private particleSystem!: THREE.Points;

	private particlesGeometries: Array<Str2BufferGeometry> = new Array<Str2BufferGeometry>(); // NOTE: static, used only for locations
	private currParticlesGeometry: THREE.BufferGeometry | null = new THREE.BufferGeometry(); // NOTE: dynamic

	private currNav: NavItem = { idx: 0, id: '' }; // index into particlesGeometries array


	// private particles = new THREE.BufferGeometry();
	private pMaterial = new THREE.PointsMaterial({
		size: particleSize, vertexColors: true
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
					console.log('returned on trigger.textContent: ', navItem);
					return;
				}

				let geometry = new TextGeometry(navItem.id, {
					font: font,
					size: window.innerWidth * 0.003,
					height: 1,
					curveSegments: 10,
				});
				geometry.center;


				let points = randomPointsInBufferGeometry(geometry, particleCount);
				let particles = new THREE.BufferGeometry().setFromPoints(points);


				// set up particlesGeometries
				let entry: Str2BufferGeometry = {};
				entry[navItem.id] = particles;
				this.particlesGeometries.push(entry);
			});


			// TODO: move everything below to init function onFinish() or afterInit()

			// Init points particle system
			this.currParticlesGeometry = this.getBufferGeometry(initParams);
			if (this.currParticlesGeometry == null) {
				this.currNav = { idx: 0, id: initParams.id };

				this.currParticlesGeometry = this.particlesGeometries.at(this.currNav.idx)![this.currNav.id];
			}
			// initialize particle system
			this.particleSystem = new THREE.Points(
				this.currParticlesGeometry,
				this.pMaterial
			);

			if (lookAt != null) {
				this.particleSystem.lookAt(lookAt);
				this.lookAt = lookAt;
			}


			// TODO: initialize position
			this.particleSystem.position.x = -20;
			this.particleSystem.position.y = 40;

			scene.add(this.particleSystem);
		});
	}


	public update(deltaTime: number, mouseScreenPos: THREE.Vector2 | void): void {
		if (this.lookAt != null) {
			this.particleSystem.lookAt(this.lookAt);
		}
	}

	public onNavigationChange(item: NavItem) {
		console.log('::::', item);


		this.transitionTo(item);
	}

	public transitionTo(item: NavItem) {

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
		let result: THREE.BufferGeometry | null = null;

		this.particlesGeometries.forEach((entry) => {
			if (entry[item.id] != null) {
				result = entry[item.id];
			}
		});

		return result;
	}

	// private getCurrentGeometry(): THREE.BufferGeometry | null {
	// 	console.log("current: ", this.currParticlesIdx, ' ', this.currStrId);

	// 	return this.particlesGeometries.at(this.currParticlesIdx)![this.currStrId];
	// }

	private morphTo(item: NavItem) {
		let geometryTo: THREE.BufferGeometry | null = this.getBufferGeometry(item);
		if (geometryTo == null) {
			console.log('Error in morpTo, geometryTo == null.');
			return;
		}
		if (this.currParticlesGeometry == null) {
			console.log('Error in morpTo, currParticlesGeometry == null.');
			return;
		}
		let currPosArray = this.currParticlesGeometry.attributes.position.array;
		let newPosArray = geometryTo.attributes.position.array;

		// for (var i = 0; i < currPosArray.length; i++) {
		// 	currPosArray[i] = newPosArray[i];
		// }

		// this.currParticlesGeometry.attributes.position.needsUpdate = true;

		gsap.to(currPosArray, {
			endArray: newPosArray,
			duration: 2,
			ease: "elastic(0.1, .3)",
			onUpdate: () => {
				this.currParticlesGeometry.attributes.position.needsUpdate = true;
			}
		});



	}


}



