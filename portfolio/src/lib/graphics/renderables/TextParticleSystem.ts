import { detectMobile } from '$lib/stores/navigation';
import type { NavItem } from '$lib/types';
import { NAMED_COLORS } from '$lib/utils/colors';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

export class TextParticleSystem {

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
		this.currParticlesPos = this.createTextParticlesPos(font, initParams);

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

	public forEachCurrParticle(fn: (vec: THREE.Vector3, idx: number) => void) {
		if (this.currParticlesPos == null) throw new Error('forEachCurrParticle::currParticlesPos must not be null');
		this.currParticlesPos.forEach((vec: THREE.Vector3, idx) => fn(vec, idx));
	}

	public setCurrParticles(particlesPos: Array<THREE.Vector3>) {
		if (particlesPos == null) throw new Error('setCurrParticles::particlesPos must not be null');
		this.currParticlesPos = particlesPos;
	}

	public getCurrParticles() {
		return this.currParticlesPos;
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

		const geometry = new TextGeometry(text.name, {
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
