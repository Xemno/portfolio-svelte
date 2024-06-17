import * as THREE from 'three';
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"
import type IRenderable from './IRenderable';
import { type Color } from '$lib/utils/colors';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';



let conf = {
	xyCoef: 50,
	zCoef: 10,
};


interface Item {
	idx: number,
	geometry: TextGeometry,
	particles: THREE.BufferGeometry,
	points: Array<THREE.Vector3>
};
type GeometryItems = Array<Item>;


// Options
const particleCount = 5000;

const particleSize = .3;

const defaultAnimationSpeed = 1;
const morphAnimationSpeed = 18;
const color = '#F12F0F';

const typeface = '/src/lib/graphics/fonts/optimer_bold.typeface.json';


export class TextCloud implements IRenderable {

	private fontLoader = new FontLoader();

	private triggers: HTMLCollectionOf<HTMLSpanElement>;


	private texts: GeometryItems = [
		{ idx: 0, geometry: new TextGeometry('HELLO'), particles: new THREE.BufferGeometry(), points: [] }
	];

	private particles = new THREE.BufferGeometry();
	private pMaterial = new THREE.PointsMaterial({
		size: particleSize, vertexColors: true
	});

	private particleSystem!: THREE.Points;

	// Animate
	private normalSpeed: number = (defaultAnimationSpeed / 100);
	private fullSpeed: number = (morphAnimationSpeed / 100);

	private animationVars = {
		speed: this.normalSpeed,
		color: color,
		rotation: -45
	}

	constructor(scene: THREE.Scene) {

		this.triggers = document.getElementsByTagName('span');

		let mainTitleText: (HTMLElement | null) = document.getElementById("main-title");
		if (mainTitleText != null) {
			let { top, bottom } = mainTitleText.getBoundingClientRect();

			console.log('mainTitleText: ', mainTitleText);
			console.log('top: ', top, ' bottom: ', bottom);

		}

		

		this.fontLoader.load(typeface, (font) => {
			Array.from(this.triggers).forEach((trigger: HTMLSpanElement, idx) => {

				// TODO: only load what we need

				if (trigger.textContent == null) {
					console.log('returned on trigger.textContent: ', trigger.textContent);
					return;
				}


				// console.log('idx: ', idx, ' trigger.textContent: ', trigger.textContent);


				this.texts.push({
					idx: idx,
					geometry: new TextGeometry(trigger.textContent, {
						font: font,
						size: window.innerWidth * 0.003,
						height: 1,
						curveSegments: 10,
					}),
					particles: new THREE.BufferGeometry(),
					points: randomPointsInBufferGeometry(this.texts[idx].geometry, particleCount)
				});

				this.texts[idx].geometry.center;
				this.texts[idx].particles.setFromPoints(this.texts[idx].points);

				this.enableTrigger(trigger, idx);
				// console.log('success on: ', trigger.textContent);

			});
			
			// console.log('this.texts: ', this.texts);
				
			this.particleSystem = new THREE.Points(
				this.texts.at(2)?.particles,
				this.pMaterial
			);

			// console.log('particleSystem: ', this.particleSystem);

			this.particleSystem.position.x = -52;
			this.particleSystem.position.y = 15;

			scene.add(this.particleSystem);
		});


	}


	public update(deltaTime: number, mouseScreenPos: THREE.Vector2 | void): void {
		throw new Error('Method not implemented.');

	}

	private enableTrigger(trigger: HTMLSpanElement, idx: number) {


		trigger.setAttribute('data-disabled', 'false');

		// trigger.addEventListener('click', () => {
		// 	morphTo(this.texts[idx].particles, trigger.dataset.color);
		// })

		// if (idx == 0) {
		// 	morphTo(this.texts[idx].particles, trigger.dataset.color);
		// }
	}

	// private morphTo(newParticles, color = '#FFFFFF') {

	// 	TweenMax.to(animationVars, .1, {
	// 		ease: Power4.easeIn,
	// 		speed: fullSpeed,
	// 		onComplete: slowDown
	// 	});

	// 	TweenMax.to(animationVars, 2, {
	// 		ease: Linear.easeNone,
	// 		color: color
	// 	});


	// 	// particleSystem.material.color.setHex(color);

	// 	for (var i = 0; i < particles.vertices.length; i++) {
	// 		TweenMax.to(particles.vertices[i], 2, {
	// 			ease: Elastic.easeOut.config(0.1, .3),
	// 			x: newParticles.vertices[i].x,
	// 			y: newParticles.vertices[i].y,
	// 			z: newParticles.vertices[i].z
	// 		})
	// 	}

	// 	console.log(animationVars.rotation)

	// 	TweenMax.to(animationVars, 2, {
	// 		ease: Elastic.easeOut.config(0.1, .3),
	// 		rotation: animationVars.rotation == 45 ? -45 : 45,
	// 	})
	// }

	// private slowDown() {
	// 	TweenMax.to(animationVars, 0.3, {
	// 		ease:
	// 			Power2.easeOut, speed: normalSpeed, delay: 0.2
	// 	});
	// }

}




function randomPointsInBufferGeometry(geometry: THREE.BufferGeometry, n: number) {

	let i: number;
	let totalArea: number = 0;
	let vertices = geometry.attributes.position.array;
	let cumulativeAreas: Array<number> = [];
	let vA: THREE.Vector3, vB: THREE.Vector3, vC: THREE.Vector3;

	// precompute face areas
	vA = new THREE.Vector3();
	vB = new THREE.Vector3();
	vC = new THREE.Vector3();

	// geometry._areas = [];
	var il = vertices.length / 9;

	for (i = 0; i < il; i++) {

		vA.set(vertices[i * 9 + 0], vertices[i * 9 + 1], vertices[i * 9 + 2]);
		vB.set(vertices[i * 9 + 3], vertices[i * 9 + 4], vertices[i * 9 + 5]);
		vC.set(vertices[i * 9 + 6], vertices[i * 9 + 7], vertices[i * 9 + 8]);

		totalArea += triangleArea(vA, vB, vC);

		cumulativeAreas.push(totalArea);

	}

	// binary search cumulative areas array
	function binarySearchIndices(value: number) {

		function binarySearch(start: number, end: number) {

			// return closest larger index
			// if exact number is not found

			if (end < start)
				return start;

			var mid = start + Math.floor((end - start) / 2);

			if (cumulativeAreas[mid] > value) {

				return binarySearch(start, mid - 1);

			} else if (cumulativeAreas[mid] < value) {

				return binarySearch(mid + 1, end);

			} else {

				return mid;

			}

		}

		let result = binarySearch(0, cumulativeAreas.length - 1);
		return result;

	}

	// pick random face weighted by face area

	let r: number;
	let index: number;
	let result: Array<THREE.Vector3> = [];

	for (i = 0; i < n; i++) {

		r = Math.random() * totalArea;

		index = binarySearchIndices(r);

		// result[ i ] = GeometryUtils.randomPointInFace( faces[ index ], geometry, true );
		vA.set(vertices[index * 9 + 0], vertices[index * 9 + 1], vertices[index * 9 + 2]);
		vB.set(vertices[index * 9 + 3], vertices[index * 9 + 4], vertices[index * 9 + 5]);
		vC.set(vertices[index * 9 + 6], vertices[index * 9 + 7], vertices[index * 9 + 8]);
		result[i] = randomPointInTriangle(vA, vB, vC);

	}

	return result;

};

// Get random point in triangle (via barycentric coordinates)
// 	(uniform distribution)
// 	http://www.cgafaq.info/wiki/Random_Point_In_Triangle
function randomPointInTriangle(vectorA: THREE.Vector3, vectorB: THREE.Vector3, vectorC: THREE.Vector3) {

	let vector = new THREE.Vector3();
	let point = new THREE.Vector3();

	let a = Math.random();
	let b = Math.random();

	if ((a + b) > 1) {

		a = 1 - a;
		b = 1 - b;

	}

	let c = 1 - a - b;

	point.copy(vectorA);
	point.multiplyScalar(a);

	vector.copy(vectorB);
	vector.multiplyScalar(b);

	point.add(vector);

	vector.copy(vectorC);
	vector.multiplyScalar(c);

	point.add(vector);

	return point;

};

// Get triangle area (half of parallelogram)
// http://mathworld.wolfram.com/TriangleArea.html

function triangleArea(vectorA: THREE.Vector3, vectorB: THREE.Vector3, vectorC: THREE.Vector3) {

	let vector1 = new THREE.Vector3();
	let vector2 = new THREE.Vector3();


	vector1.subVectors(vectorB, vectorA);
	vector2.subVectors(vectorC, vectorA);
	vector1.cross(vector2);

	return 0.5 * vector1.length();


}