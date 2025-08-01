import type { NavItem } from '$lib/types';
import * as TWEEN from '@tweenjs/tween.js';
import type { EasingFunction } from 'svelte/transition';
import * as THREE from 'three';
import type { TextParticleSystem } from './TextParticleSystem';

export class TweenMorphing {
	private readonly particleSystem: TextParticleSystem;

	constructor(particleSystem: TextParticleSystem) {
		this.particleSystem = particleSystem;
	}

	public update() {
		const result = TWEEN.update();

		if (this.isReady()) {
			if (this.particleSystem.getCurrParticles() == null) return;

			let currParticleArray = new Array<THREE.Vector3>();

			this.particleSystem.getCurrParticles()!.forEach(
				element => currParticleArray.push(Object.assign({}, element))
			);

			const shuffle = (array: Array<THREE.Vector3>) => {
				array.sort(() => Math.random() - 0.5);
			};

			shuffle(currParticleArray);

			let currPartA2 = new Array<THREE.Vector3>();
			this.particleSystem.getCurrParticles()!.forEach(
				element => currPartA2.push(Object.assign({}, element))
			);
			currPartA2.forEach((element, i) => {
				// const x = Math.sin((Math.random() - 0.5)) * 50;
				// const y = Math.cos((Math.random() - 0.5)) * 40;
				const x = (Math.random() - 0.5) * 50;
				const y = (Math.random() - 0.5) * 40;
				currPartA2[i] = new THREE.Vector3(element.x + x, element.y + y, element.z);
			});
			shuffle(currPartA2);


			this.particleSystem.forEachCurrParticle((currParticlePos: THREE.Vector3, idx: number) => {
				let toPos: THREE.Vector3 = currParticleArray[idx];
				let toPos2: THREE.Vector3 = currPartA2[idx];

				const tween1 = new TWEEN.Tween(currParticlePos)
					.to(toPos, 2500)
					.delay(1000)
					.easing(TWEEN.Easing.Linear.InOut)
					.onUpdate((pos, elapsed) => {
						// const vec = new THREE.Vector3(
						// 	interpolate(currParticlePos.x, toPos.x, easing.cubic(elapsed)),
						// 	interpolate(currParticlePos.y, toPos.y, easing.inOutQuad(elapsed)),
						// 	interpolate(currParticlePos.z, toPos.z, easing.quadratic(elapsed)),
						// );
						// let matrix: THREE.Matrix4 = new THREE.Matrix4();
						// matrix.makeTranslation(new THREE.Vector3(vec.x, vec.y, vec.z));

						let matrix: THREE.Matrix4 = new THREE.Matrix4();
						matrix.makeTranslation(new THREE.Vector3(pos.x, pos.y, pos.z));

						this.particleSystem.setMatrixAt(idx, matrix);
						// this.particleSystem.instanceMatrix.needsUpdate = true;
					});
				tween1.start();

				// const tween2 = new TWEEN.Tween(toPos2)
				// 	.to(toPos, 2500)
				// 	.delay(1000 + (Math.random() * 1000))
				// 	.easing(TWEEN.Easing.Cubic.InOut)
				// 	.onUpdate((pos) => {
				// 		// const vec = new THREE.Vector3(
				// 		// 	interpolate(toPos.x, toPos2.x, easing.linear(pos.x)),
				// 		// 	interpolate(toPos.y, toPos2.y, easing.linear(pos.y)),
				// 		// 	interpolate(toPos.z, toPos2.z, easing.linear(pos.z))
				// 		// 	);
				// 		// let matrix: THREE.Matrix4 = new THREE.Matrix4();
				// 		// matrix.makeTranslation(new THREE.Vector3(vec.x, vec.y, vec.z));
				// 		let matrix: THREE.Matrix4 = new THREE.Matrix4();
				// 		matrix.makeTranslation(new THREE.Vector3(pos.x, pos.y, pos.z));
				// 		this.particleSystem.setMatrixAt(idx, matrix);
				// 		// this.particleSystem.instanceMatrix.needsUpdate = true;
				// 	});
				// tween1.chain(tween2).start();
			});
		}
	}

	public isReady(): boolean {
		return TWEEN.getAll().length == 0;
	}

	public morphTo(navItem: NavItem) {
		// TODO: check navItem is in range and plausible
		const toPositionArray: Array<THREE.Vector3> = this.particleSystem.getParticlesAtPos(navItem.idx)!;
		this.morphCurrParticlesTo(toPositionArray, 1000, 0, TWEEN.Easing.Quartic.Out);
	}

	public morphFromTo(fromPosArray: Array<THREE.Vector3>, toPosArray: Array<THREE.Vector3>, time: number, delay: number, easing: EasingFunction): void {
		if (fromPosArray == null) throw new Error('morphFromTo::fromPosArray must not be null');
		if (toPosArray == null) throw new Error('morphFromTo::toPosArray must not be null');
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

					this.particleSystem.setMatrixAt(idx, matrix); // TODO: test this.instancedMeshParticles.position.set(vWorldPos.x, vWorldPos.y, vWorldPos.z);

					// this.particleSystem.instanceMatrix.needsUpdate = true;
				});
			tween.start();
		});
	}
}
