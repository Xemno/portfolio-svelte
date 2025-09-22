import type { NavItem } from '$lib/types';
import type { EasingFunction } from 'svelte/transition';
import type { TextParticleSystem } from './TextParticleSystem';
import * as THREE from 'three';
// import * as TWEEN from '@tweenjs/tween.js';
import * as TWEEN from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';

export class TweenMorphing {
	private readonly particleSystem: TextParticleSystem;

	constructor(particleSystem: TextParticleSystem) {
		this.particleSystem = particleSystem;
	}

	public update() {
		const result = TWEEN.update();
	}

	public isReady(): boolean {
		return TWEEN.getAll().length == 0;
	}

	public morphTo(navItem: NavItem) {
		const toPositionArray: Array<THREE.Vector3> = this.particleSystem.getParticlesAtPos(
			navItem.idx
		)!;
		this.morphCurrParticlesTo(toPositionArray, 1000, 0, TWEEN.Easing.Quartic.Out);
	}

	public morphFromToCubic(
		fromPosArray: Array<THREE.Vector3>,
		toPosArray: Array<THREE.Vector3>,
		time: number,
		delay: number,
	): void {
		this.morphFromTo(fromPosArray, toPosArray, time, delay, TWEEN.Easing.Cubic.Out);
	}

	public morphFromTo(
		fromPosArray: Array<THREE.Vector3>,
		toPosArray: Array<THREE.Vector3>,
		time: number,
		delay: number,
		easing: EasingFunction
	): void {
		if (fromPosArray == null) throw new Error('morphFromTo::fromPosArray must not be null');
		if (toPosArray == null) throw new Error('morphFromTo::toPosArray must not be null');
		this.particleSystem.setCurrParticles(fromPosArray);
		this.morphCurrParticlesTo(toPosArray, time, delay, easing);
	}


	private morphCurrParticlesTo(
		toPosArray: Array<THREE.Vector3>,
		time: number,
		delay: number,
		easing: EasingFunction
	): void {
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
