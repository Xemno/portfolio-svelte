import * as THREE from 'three';
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"
import type IRenderable from './IRenderable';
import { type Color } from '$lib/utils/colors';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { randomPointsInBufferGeometry } from '../utils/VectorUtils';



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

	private lookAt?: THREE.Vector3;



	private particleTexts: Array<THREE.BufferGeometry> = new Array<THREE.BufferGeometry>();



	// private particles = new THREE.BufferGeometry();
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

	constructor(scene: THREE.Scene, texts: Array<string>, pos?: THREE.Vector3, lookAt?: THREE.Vector3) {

		this.triggers = document.getElementsByTagName('span');

		let mainTitleText: (HTMLElement | null) = document.getElementById("main-title");
		if (mainTitleText != null) {
			let { top, bottom } = mainTitleText.getBoundingClientRect();

			console.log('mainTitleText: ', mainTitleText);
			console.log('top: ', top, ' bottom: ', bottom);

		}


		this.fontLoader.load(typeface, (font) => {

			texts.forEach((textContent) => {


				console.log('textContent: ', textContent);


				if (textContent == null) {
					console.log('returned on trigger.textContent: ', textContent);
					return;
				}

				let geometry = new TextGeometry(textContent, {
					font: font,
					size: window.innerWidth * 0.003,
					height: 1,
					curveSegments: 10,
				});
				geometry.center;

				let points = randomPointsInBufferGeometry(geometry, particleCount);
				let particles = new THREE.BufferGeometry().setFromPoints(points);

				this.particleTexts.push(particles);
			});


			// console.log('this.texts: ', this.texts);

			// Init points particle system
			this.particleSystem = new THREE.Points(
				this.particleTexts.at(0),
				this.pMaterial
			);

			if (lookAt != null) {
				this.particleSystem.lookAt(lookAt);
				this.lookAt = lookAt;
			}


			// console.log('particleSystem: ', this.particleSystem);
			// TODO: set position
			this.particleSystem.position.x = -52;
			this.particleSystem.position.y = 15;

			scene.add(this.particleSystem);
		});


	}


	public update(deltaTime: number, mouseScreenPos: THREE.Vector2 | void): void {
		if (this.lookAt != null) {
			this.particleSystem.lookAt(this.lookAt);
		}
	}

	public transitionToNext() {
			// this.particleSystem.geometry = this.particleTexts.at(0); // TODO: set geometry

	}

	public transitionTo(idx: number) {

	}

	private initParticles() {

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



